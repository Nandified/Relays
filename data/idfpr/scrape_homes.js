#!/usr/bin/env node
/**
 * Homes.com Agent Scraper
 * 
 * Scrapes agent brokerage, photo, and license from Homes.com
 * Usage: node scrape_homes.js <input_json> <output_json> [batch_label]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || 'test_batch_50.json';
const OUTPUT_FILE = process.argv[3] || 'test_batch_50_results.json';
const BATCH_LABEL = process.argv[4] || 'test';
const LOG_FILE = process.argv[5] || 'scrape_progress.log';

const DELAY_MS = 2000; // 2 seconds between requests to be polite

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${BATCH_LABEL}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.resolve(__dirname, LOG_FILE), line + '\n');
}

function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

async function scrapeAgent(page, agent) {
  const name = titleCase(
    [agent.first_name, agent.middle, agent.last_name].filter(Boolean).join(' ').replace(/\s+/g, ' ')
  );
  const city = titleCase(agent.city || 'Chicago');
  const searchQuery = `${name} ${city} IL real estate agent`;
  const homesUrl = `https://www.homes.com/real-estate-agents/${city.toLowerCase().replace(/\s+/g, '-')}-il/`;

  const result = {
    license_number: agent.license_number,
    agent_name: name,
    city: city,
    zip: agent.zip,
    employing_broker: null,
    photo_url: null,
    phone: null,
    email: null,
    website: null,
    linkedin_url: null,
    instagram_handle: null,
    homes_profile_url: null,
    match_confidence: null,
    source: 'homes.com',
    scraped_at: new Date().toISOString()
  };

  try {
    // Try direct name search on Homes.com
    const searchUrl = `https://www.homes.com/real-estate-agents/${city.toLowerCase().replace(/\s+/g, '-')}-il/?q=${encodeURIComponent(name)}`;
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Detect Akamai/edgesuite blocks early
    const title = await page.title().catch(() => '');
    const bodyText0 = await page.textContent('body').catch(() => '');
    if (/access denied/i.test(title) || /access denied/i.test(bodyText0) || /errors\.edgesuite\.net/i.test(bodyText0)) {
      throw new Error('BLOCKED_BY_HOMES_COM: Access Denied');
    }

    // Check for agent cards
    const cards = await page.$$('a[data-testid="agent-card-link"], .agent-card, [class*="AgentCard"], [class*="agent-card"]');
    
    if (cards.length === 0) {
      // Try alternate search pattern
      const altUrl = `https://www.homes.com/real-estate-agents/search/${encodeURIComponent(name + ' ' + city + ' IL')}/`;
      await page.goto(altUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);
    }

    // Try to find agent info from the page
    const pageText = await page.textContent('body').catch(() => '');
    
    // Look for brokerage names near agent name
    // Homes.com typically shows "Agent Name - Brokerage Name" or "Brokerage: Name"
    const brokeragePatterns = [
      /(?:brokerage|office|company|firm)[:\s]+([^\n<]{3,60})/i,
      /(?:with|at|of)\s+([A-Z][^\n<]{3,60}(?:realty|real estate|properties|homes|group|associates|realtors|RE\/MAX|coldwell|keller|century|compass|@properties|baird|berkshire))/i,
    ];

    // Try clicking on first matching agent card to get profile
    const agentLinks = await page.$$eval('a[href*="/real-estate-agents/"]', (links, targetName) => {
      return links
        .filter(a => {
          const text = (a.textContent || '').toLowerCase();
          const nameParts = targetName.toLowerCase().split(' ');
          // Match if at least first and last name appear
          return nameParts.length >= 2 && 
            text.includes(nameParts[0]) && 
            text.includes(nameParts[nameParts.length - 1]);
        })
        .map(a => ({
          href: a.href,
          text: a.textContent?.trim()?.substring(0, 100)
        }))
        .slice(0, 3);
    }, name).catch(() => []);

    if (agentLinks.length > 0) {
      // Visit the first matching profile
      const profileUrl = agentLinks[0].href;
      result.homes_profile_url = profileUrl;
      
      await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      const profileText = await page.textContent('body').catch(() => '');
      
      // Extract brokerage
      const brokerageMatch = profileText.match(/(?:Brokerage|Office|Company|Broker)[:\s]+([^\n]{3,80})/i) ||
        profileText.match(/(?:affiliated with|works at|member of)\s+([^\n]{3,80})/i);
      
      if (brokerageMatch) {
        result.employing_broker = brokerageMatch[1].trim().replace(/\s+/g, ' ');
        result.match_confidence = 'high';
      }

      // Look for brokerage in structured data or specific elements
      const brokerageEl = await page.$eval(
        '[class*="brokerage"], [class*="Brokerage"], [class*="office-name"], [data-testid*="brokerage"], [class*="company"]',
        el => el.textContent?.trim()
      ).catch(() => null);
      
      if (brokerageEl && !result.employing_broker) {
        result.employing_broker = brokerageEl;
        result.match_confidence = 'high';
      }

      // Extract photo
      const photoUrl = await page.$eval(
        'img[class*="agent"], img[class*="Agent"], img[class*="avatar"], img[class*="Avatar"], img[class*="photo"], img[class*="headshot"]',
        img => img.src
      ).catch(() => null);
      
      if (photoUrl && !photoUrl.includes('placeholder') && !photoUrl.includes('default')) {
        result.photo_url = photoUrl;
      }

      // Extract phone/email + social links (ONLY from what is visible on the loaded profile page)
      const linkInfo = await page.$$eval('a[href]', (as) => {
        const out = [];
        for (const a of as) {
          const href = a.getAttribute('href') || '';
          const text = (a.textContent || '').trim();
          if (!href) continue;
          out.push({ href, text });
        }
        return out;
      }).catch(() => []);

      // phone
      const tel = linkInfo.find(l => /^tel:/i.test(l.href));
      if (tel && !result.phone) {
        result.phone = tel.href.replace(/^tel:/i, '').trim();
      }
      // email
      const mail = linkInfo.find(l => /^mailto:/i.test(l.href));
      if (mail && !result.email) {
        const addr = mail.href.replace(/^mailto:/i, '').split('?')[0].trim();
        if (addr) result.email = addr;
      }
      // linkedin
      const linked = linkInfo.find(l => /linkedin\.com\//i.test(l.href));
      if (linked && !result.linkedin_url) {
        result.linkedin_url = linked.href;
      }
      // instagram (store handle when possible)
      const ig = linkInfo.find(l => /instagram\.com\//i.test(l.href));
      if (ig && !result.instagram_handle) {
        const m = ig.href.match(/instagram\.com\/(?:#!\/)?@?([^\/?#]+)/i);
        result.instagram_handle = m ? m[1] : ig.href;
      }
      // website (best effort: first external non-homes.com, non-social link)
      if (!result.website) {
        const candidates = linkInfo
          .map(l => l.href)
          .filter(h => /^https?:\/\//i.test(h))
          .filter(h => !/homes\.com\//i.test(h))
          .filter(h => !/facebook\.com\//i.test(h))
          .filter(h => !/instagram\.com\//i.test(h))
          .filter(h => !/linkedin\.com\//i.test(h))
          .filter(h => !/twitter\.com\//i.test(h) && !/x\.com\//i.test(h));
        if (candidates.length) result.website = candidates[0];
      }

      // Extract license if shown
      const licenseMatch = profileText.match(/(?:License|Lic)[:\s#]*(?:Illinois\s+)?(\d{9,12})/i);
      if (licenseMatch) {
        const foundLic = licenseMatch[1];
        if (foundLic === agent.license_number) {
          result.match_confidence = 'exact';
        }
      }

      // Extract phone number
      const phoneMatch = profileText.match(/(?:Phone|Cell|Mobile|Office|Tel|Call)[:\s]*([\(]?\d{3}[\)\-.\s]?\s*\d{3}[\-.\s]?\d{4})/i) ||
        profileText.match(/([\(]\d{3}[\)]\s*\d{3}[\-]\d{4})/);
      if (phoneMatch) {
        result.phone = phoneMatch[1].trim();
      }

      // Extract email
      const emailMatch = profileText.match(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
      if (emailMatch && !emailMatch[1].includes('homes.com') && !emailMatch[1].includes('example')) {
        result.email = emailMatch[1];
      }

      // Extract website (agent's own site, not homes.com)
      const websiteEl = await page.$eval(
        'a[href*="http"][class*="website"], a[href*="http"][class*="Website"], a[data-testid*="website"], a[title*="website"], a[aria-label*="website"]',
        el => el.href
      ).catch(() => null);
      if (websiteEl && !websiteEl.includes('homes.com') && !websiteEl.includes('facebook') && !websiteEl.includes('instagram')) {
        result.website = websiteEl;
      }

      // Extract social links from page
      const allLinks = await page.$$eval('a[href]', links => links.map(a => a.href)).catch(() => []);
      for (const link of allLinks) {
        if (!result.linkedin_url && link.includes('linkedin.com/in/')) {
          result.linkedin_url = link;
        }
        if (!result.instagram_handle && link.includes('instagram.com/')) {
          const igMatch = link.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
          if (igMatch && igMatch[1] !== 'p' && igMatch[1] !== 'explore') {
            result.instagram_handle = igMatch[1];
          }
        }
      }
    }

    // If we still don't have brokerage, try a broader page scan
    if (!result.employing_broker) {
      // Check for common brokerage names anywhere on page
      const knownBrokerages = [
        'RE/MAX', 'Coldwell Banker', 'Keller Williams', 'Century 21', 'Compass',
        '@properties', 'Baird & Warner', 'Berkshire Hathaway', 'eXp Realty',
        'HomeSmart', 'Redfin', 'Sotheby', 'Christie', 'Engel', 'Douglas Elliman',
        'Dream Town', 'Jameson Sotheby', 'Related Realty', 'Fulton Grace'
      ];
      
      const bodyText = await page.textContent('body').catch(() => '');
      for (const brok of knownBrokerages) {
        if (bodyText.includes(brok)) {
          // Find the full brokerage name around the match
          const idx = bodyText.indexOf(brok);
          const snippet = bodyText.substring(Math.max(0, idx), Math.min(bodyText.length, idx + 60));
          const fullName = snippet.split(/[\n\r\t|•·]/).shift()?.trim();
          if (fullName) {
            result.employing_broker = fullName;
            result.match_confidence = result.match_confidence || 'medium';
            break;
          }
        }
      }
    }

  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    if (msg.includes('BLOCKED_BY_HOMES_COM')) {
      log(`  ⛔ Blocked by Homes.com (Access Denied)`);
      result.match_confidence = 'blocked';
    } else {
      log(`  ERROR scraping ${name}: ${msg}`);
      result.match_confidence = 'error';
    }
  }

  return result;
}

async function main() {
  const inputPath = path.resolve(__dirname, INPUT_FILE);
  const outputPath = path.resolve(__dirname, OUTPUT_FILE);
  
  if (!fs.existsSync(inputPath)) {
    log(`ERROR: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const agents = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  log(`Starting scrape of ${agents.length} agents (batch: ${BATCH_LABEL})`);
  
  const results = [];
  
  // Load any existing results to allow resume
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      results.push(...existing);
      log(`Loaded ${existing.length} existing results, resuming...`);
    } catch (e) {}
  }

  // De-dupe input by license_number (input can contain duplicates)
  const uniqueAgents = [];
  const seenInput = new Set();
  for (const a of agents) {
    if (!a || !a.license_number) continue;
    if (seenInput.has(a.license_number)) continue;
    seenInput.add(a.license_number);
    uniqueAgents.push(a);
  }

  const doneIds = new Set(results.map(r => r.license_number));
  const remaining = uniqueAgents.filter(a => !doneIds.has(a.license_number));
  log(`${remaining.length} agents remaining to scrape`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  
  const startTime = Date.now();
  let successCount = 0;

  for (let i = 0; i < remaining.length; i++) {
    const agent = remaining[i];
    const name = titleCase(
      [agent.first_name, agent.middle, agent.last_name].filter(Boolean).join(' ').replace(/\s+/g, ' ')
    );
    
    log(`[${i + 1}/${remaining.length}] Scraping: ${name} (${agent.license_number})`);
    
    const result = await scrapeAgent(page, agent);
    results.push(result);
    
    if (result.employing_broker) {
      successCount++;
      log(`  ✅ Found: ${result.employing_broker} (confidence: ${result.match_confidence})`);
    } else {
      log(`  ❌ No brokerage found`);
    }

    // Save incrementally every 5 agents
    if ((i + 1) % 5 === 0 || i === remaining.length - 1) {
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      
      const elapsed = (Date.now() - startTime) / 1000;
      const avgPerAgent = elapsed / (i + 1);
      const eta = avgPerAgent * (remaining.length - i - 1);
      log(`  Saved ${results.length} results | ${avgPerAgent.toFixed(1)}s/agent | ETA: ${(eta / 60).toFixed(1)} min`);
    }

    // Polite delay
    if (i < remaining.length - 1) {
      await page.waitForTimeout(DELAY_MS);
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;
  
  log(`\n=== BATCH COMPLETE ===`);
  log(`Total agents: ${remaining.length}`);
  log(`Brokerage found: ${successCount} (${(successCount/remaining.length*100).toFixed(1)}%)`);
  log(`Total time: ${(totalTime / 60).toFixed(1)} min`);
  log(`Avg per agent: ${(totalTime / remaining.length).toFixed(1)}s`);
  log(`\n=== TIME ESTIMATES ===`);
  const avgSec = totalTime / remaining.length;
  log(`Chicago (15,297 agents): ~${(15297 * avgSec / 3600).toFixed(1)} hours with 1 worker`);
  log(`Chicago with 6 workers: ~${(15297 * avgSec / 3600 / 6).toFixed(1)} hours`);
  log(`Full IL (62,167 agents): ~${(62167 * avgSec / 3600).toFixed(1)} hours with 1 worker`);
  log(`Full IL with 8 workers: ~${(62167 * avgSec / 3600 / 8).toFixed(1)} hours`);
  
  await browser.close();
  
  // Final save
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  log(`Final results saved to ${outputPath}`);
}

main().catch(err => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
