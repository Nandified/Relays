#!/bin/bash
# Sync new targeted search matches into enrichment + deploy
# Run periodically while the targeted search is active

cd /Users/Clawdbot/clawd/Relays

RESULTS="data/outscraper/targeted_search_results.json"
ENRICHMENT="data/idfpr/idfpr_outscraper_enrichment.json"

if [ ! -f "$RESULTS" ]; then
    echo "No results file yet"
    exit 0
fi

# Count current matches in results vs enrichment
RESULT_COUNT=$(python3 -c "import json; print(len(json.load(open('$RESULTS'))))" 2>/dev/null)
ENRICHED_COUNT=$(python3 -c "
import json
with open('$ENRICHMENT') as f:
    d = json.load(f)
print(sum(1 for v in d['byLicenseNumber'].values() if v.get('googlePlaceId')))
" 2>/dev/null)

echo "Results file: $RESULT_COUNT matches"
echo "Enrichment file: $ENRICHED_COUNT with Google data"

NEW_TO_ADD=$((RESULT_COUNT - ENRICHED_COUNT + 527))  # 527 were from original bulk scrape

if [ "$NEW_TO_ADD" -lt 50 ]; then
    echo "Less than 50 new matches since last sync. Skipping."
    exit 0
fi

echo "Merging $NEW_TO_ADD new matches..."

python3 << 'PYEOF'
import json, time

with open('data/idfpr/idfpr_outscraper_enrichment.json') as f:
    enrichment = json.load(f)

with open('data/outscraper/targeted_search_results.json') as f:
    new_matches = json.load(f)

added = 0
for m in new_matches:
    lic = m['license_number']
    entry = enrichment['byLicenseNumber'].get(lic, {})
    if entry.get('googlePlaceId'):
        continue  # already has Google data
    if m.get('google_place_id'):
        entry['googlePlaceId'] = m['google_place_id']
    if m.get('google_rating'):
        entry['rating'] = m['google_rating']
    if m.get('google_reviews'):
        entry['reviewCount'] = m['google_reviews']
    if m.get('google_phone'):
        entry['phone'] = m['google_phone']
    if m.get('google_website'):
        entry['website'] = m['google_website']
    if m.get('google_photo'):
        entry['photoUrl'] = m['google_photo']
    if m.get('google_address'):
        entry['address'] = m['google_address']
    if m.get('google_name'):
        entry['googleName'] = m['google_name']
    entry.setdefault('officeName', '')
    entry.setdefault('email', '')
    enrichment['byLicenseNumber'][lic] = entry
    added += 1

matched_count = sum(1 for v in enrichment['byLicenseNumber'].values() if v.get('googlePlaceId'))
enrichment['matchedOutscraperPlaces'] = matched_count
enrichment['generatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S')

with open('data/idfpr/idfpr_outscraper_enrichment.json', 'w') as f:
    json.dump(enrichment, f, ensure_ascii=False)

print(f'Added {added} new matches. Total with Google: {matched_count}')
PYEOF

# Commit + push + deploy
git add data/idfpr/idfpr_outscraper_enrichment.json
git commit -m "data: auto-sync enrichment ($(python3 -c "import json; d=json.load(open('$ENRICHMENT')); print(d['matchedOutscraperPlaces'])" 2>/dev/null) Google matches)" 2>/dev/null

if [ $? -eq 0 ]; then
    git push origin main
    curl -s -X POST "https://api.vercel.com/v1/integrations/deploy/prj_U1W9oRdwtc1aHZ7tXl8lrsTlSGee/3u92MLxZkM" > /dev/null
    echo "Pushed + deployed ✅"
else
    echo "Nothing new to commit"
fi
