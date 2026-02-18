/* ── Extended Mock Data for Pricing, Testimonials, FAQ, Homeworke ── */

// ── Pricing Tiers ──

export interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number; // 0 = free
  annualPrice: number;
  features: PricingFeature[];
  cta: string;
  ctaVariant: "secondary" | "primary" | "primary" | "secondary";
  recommended?: boolean;
  badge?: string;
}

export const mockPricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Claim your page and start sharing",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: "Marketplace profile", included: true },
      { text: "Request-to-connect leads", included: true },
      { text: "1 curated group (1 share link)", included: true, highlight: true },
      { text: "Relays-branded share page", included: true },
      { text: "Basic analytics", included: true },
      { text: "Curated groups & multiple links", included: false },
      { text: "Remove Relays branding", included: false },
      { text: "Add-on seats (TC/Assistant)", included: false },
    ],
    cta: "Claim Free",
    ctaVariant: "secondary",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Solo agent — 3 curated groups + clean branding",
    monthlyPrice: 15,
    annualPrice: 10,
    features: [
      { text: "Everything in Free (plus)", included: true },
      { text: "3 curated groups (3 share links)", included: true, highlight: true },
      { text: "Minimal/no Relays branding", included: true, highlight: true },
      { text: "Provider options record (export)", included: true },
      { text: "14-day full access trial (no CC)", included: true },
      { text: "Add-on seats (TC/Assistant) — +$5/mo annual (+$7 monthly)", included: true },
    ],
    cta: "Start 14‑day trial",
    ctaVariant: "primary",
  },
  {
    id: "pro_plus",
    name: "Pro+",
    description: "Power user — 30 curated groups + verification",
    monthlyPrice: 20,
    annualPrice: 15,
    features: [
      { text: "Everything in Pro (plus)", included: true },
      { text: "30 curated groups / share links", included: true, highlight: true },
      { text: "Verification checkmark", included: true, highlight: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Add-on seats — +$6/mo annual (+$8 monthly)", included: true },
    ],
    cta: "Start 14‑day trial",
    ctaVariant: "primary",
    recommended: true,
    badge: "Most popular",
  },
  {
    id: "team",
    name: "Team",
    description: "Up to 10 seats + team controls",
    monthlyPrice: 99,
    annualPrice: 69,
    features: [
      { text: "Everything in Pro+ (plus)", included: true },
      { text: "Includes up to 10 seats", included: true, highlight: true },
      { text: "30 curated groups / share links per seat", included: true, highlight: true },
      { text: "Role-based access (Agent / TC / Assistant)", included: true },
      { text: "Shared templates", included: true },
      { text: "Add-on seats — +$7/mo annual (+$9 monthly)", included: true },
    ],
    cta: "Start 14‑day trial",
    ctaVariant: "primary",
  },
  {
    id: "office",
    name: "Office",
    description: "Up to 50 seats + office reporting",
    monthlyPrice: 299,
    annualPrice: 249,
    features: [
      { text: "Everything in Team (plus)", included: true },
      { text: "Includes up to 50 seats", included: true, highlight: true },
      { text: "30 curated groups / share links per seat", included: true, highlight: true },
      { text: "Office dashboards + governance", included: true },
      { text: "Audit exports", included: true },
      { text: "Add-on seats — +$5/mo annual (+$7 monthly)", included: true },
    ],
    cta: "Contact us",
    ctaVariant: "secondary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom rollout + procurement-friendly",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: "Everything in Office (plus)", included: true },
      { text: "SSO / SAML (optional)", included: true },
      { text: "Custom reporting & permissions", included: true },
      { text: "Dedicated onboarding", included: true },
      { text: "SLA + security review", included: true },
    ],
    cta: "Get a quote",
    ctaVariant: "secondary",
    badge: "Custom",
  },
];

// ── Testimonials ──

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarInitials: string;
  type: "agent" | "consumer";
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "I send every client a single Relays link. They see my curated lender, inspector, and attorney — no more juggling texts and emails. It's the referral operating system I've been waiting for.",
    name: "Lisa Hartwell",
    role: "Realtor, Hartwell Realty",
    avatarInitials: "LH",
    type: "agent",
  },
  {
    id: "t2",
    quote: "Before Relays, I'd get maybe 2-3 referrals a month from agents. Now I'm getting 10+. The warm intros through the platform mean clients already trust me before we even speak.",
    name: "Jordan Lee",
    role: "Mortgage Lender, Sunrise Mortgage",
    avatarInitials: "JL",
    type: "agent",
  },
  {
    id: "t3",
    quote: "The journey dashboard changed how I run my business. I can see where every client is in their process, what pros they need next, and nudge them at exactly the right time.",
    name: "Frank Johnson",
    role: "Realtor, Metro Properties",
    avatarInitials: "FJ",
    type: "agent",
  },
  {
    id: "t4",
    quote: "We were first-time buyers and had NO clue what we needed. Relays walked us through every step — find an inspector, get insurance, hire an attorney. We built our team in one afternoon.",
    name: "Jamie Rodriguez",
    role: "First-time Buyer, Oak Park",
    avatarInitials: "JR",
    type: "consumer",
  },
  {
    id: "t5",
    quote: "Selling our home was stressful enough. Having a clear team and checklist on Relays meant we never missed a deadline. Our attorney and realtor were literally on the same page.",
    name: "Sam Patel",
    role: "Home Seller, Lincoln Park",
    avatarInitials: "SP",
    type: "consumer",
  },
  {
    id: "t6",
    quote: "My agent sent me a link, and within 10 minutes I had a lender, inspector, and attorney lined up. I didn't even know I needed an attorney! Relays guided me through everything.",
    name: "Morgan Davis",
    role: "Buyer, Evanston",
    avatarInitials: "MD",
    type: "consumer",
  },
];

// ── FAQ Items ──

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "consumers" | "pros" | "brokerages" | "billing" | "technical";
}

export const mockFAQItems: FAQItem[] = [
  // Consumers
  {
    id: "faq_1",
    question: "Is Relays free for buyers and sellers?",
    answer: "Yes! Relays is completely free for consumers. You can browse the marketplace, build your team, and manage your entire home journey at no cost.",
    category: "consumers",
  },
  {
    id: "faq_2",
    question: "How do I find the right professionals for my home purchase?",
    answer: "You have three options: browse our verified marketplace, search for a specific pro you already know, or join via a referral link from your agent. Relays shows you ratings, reviews, and response times to help you decide.",
    category: "consumers",
  },
  {
    id: "faq_3",
    question: "What is a 'journey' on Relays?",
    answer: "A journey is your complete home buying or selling timeline. It tracks your stage (pre-approval through closing), your team of professionals, documents, and next steps — so nothing falls through the cracks.",
    category: "consumers",
  },
  {
    id: "faq_4",
    question: "Can I use Relays if I'm selling my home?",
    answer: "Absolutely. Relays works for both buyers and sellers. Sellers need attorneys, inspectors (for pre-listing inspections), and other professionals too. Your agent can set up a selling journey for you.",
    category: "consumers",
  },
  // Pros
  {
    id: "faq_5",
    question: "How do I list my business on Relays?",
    answer: "Sign up for a free account, select your service category, and complete your profile. If your business is already listed via Google Places, you can claim and link your existing profile with one click.",
    category: "pros",
  },
  {
    id: "faq_6",
    question: "What are 'curated groups' and 'share links'?",
    answer: "Curated groups are your hand-picked teams of professionals you trust. Create a share link for each group, and when clients click it, they see your recommended lender, inspector, attorney, and more — all in one place.",
    category: "pros",
  },
  {
    id: "faq_7",
    question: "How do referrals work on Relays?",
    answer: "When you add a pro to your curated group and share it with a client, that's a warm referral. The client sees your recommendation, can view the pro's profile, and connect directly. Both you and the pro get notified.",
    category: "pros",
  },
  {
    id: "faq_8",
    question: "Can I manage multiple clients and journeys?",
    answer: "Yes. Pro and Team plans include a journey dashboard where you can track all your active clients, their stages, team completeness, and upcoming actions in one view.",
    category: "pros",
  },
  // Brokerages
  {
    id: "faq_9",
    question: "What visibility do brokerages get?",
    answer: "Brokerage accounts include oversight dashboards showing referral routing, pipeline stages, partner quotas, and compliance reports. You can see who your agents are referring to without overriding their choices.",
    category: "brokerages",
  },
  {
    id: "faq_10",
    question: "Can we enforce partner requirements?",
    answer: "Yes. Brokerage plans include configurable policies for partner approvals, required verifications, and referral quotas. All agent activity is logged in the compliance audit trail.",
    category: "brokerages",
  },
  {
    id: "faq_11",
    question: "What happens when an agent leaves our brokerage?",
    answer: "Admins can reassign journey ownership and transfer client data to another agent. All transfers are logged with who, when, and why. Private personal workspace data stays with the agent.",
    category: "brokerages",
  },
  // Billing
  {
    id: "faq_12",
    question: "Can I switch plans at any time?",
    answer: "Yes. You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your billing cycle.",
    category: "billing",
  },
  {
    id: "faq_13",
    question: "Is there a free trial?",
    answer: "Yes. Pro and higher plans include a 14-day full access trial. No credit card required to start — explore the platform and decide when you’re ready.",
    category: "billing",
  },
  {
    id: "faq_14",
    question: "Do you offer annual billing?",
    answer: "Yes. Annual billing saves you 20% compared to monthly. All plans are available with both monthly and annual billing options.",
    category: "billing",
  },
  // Technical
  {
    id: "faq_15",
    question: "Is my data secure on Relays?",
    answer: "Absolutely. We use industry-standard encryption for all data in transit and at rest. Your client information is only visible to authorized team members, and all access is logged.",
    category: "technical",
  },
  {
    id: "faq_16",
    question: "Does Relays integrate with my CRM?",
    answer: "Brokerage plans include API access for integrations. We're building native integrations with popular real estate CRMs. Contact our team to discuss your specific needs.",
    category: "technical",
  },
  {
    id: "faq_17",
    question: "What browsers and devices are supported?",
    answer: "Relays works on all modern browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile. Our responsive design ensures a great experience on any screen size.",
    category: "technical",
  },
];

// ── Homeworke Mock Data ──

export interface HomeworkeRepairItem {
  id: string;
  title: string;
  description: string;
  category: "structural" | "electrical" | "plumbing" | "hvac" | "cosmetic" | "exterior" | "safety";
  priority: "critical" | "recommended" | "optional";
  estimatedCostLow: number;
  estimatedCostHigh: number;
  timelineEstimate: string;
}

export interface HomeworkeEstimate {
  id: string;
  propertyAddress: string;
  createdAt: string;
  items: HomeworkeRepairItem[];
  totalLow: number;
  totalHigh: number;
  status: "processing" | "ready" | "matched";
}

export const mockHomeworkeEstimate: HomeworkeEstimate = {
  id: "hw_est_1",
  propertyAddress: "824 Davis St, Evanston, IL 60201",
  createdAt: "2026-02-21T10:00:00Z",
  items: [
    {
      id: "hw_item_1",
      title: "HVAC System Replacement",
      description: "Furnace is 22 years old and showing signs of wear. Recommend replacing with high-efficiency unit before next winter.",
      category: "hvac",
      priority: "recommended",
      estimatedCostLow: 4500,
      estimatedCostHigh: 7200,
      timelineEstimate: "1-2 days",
    },
    {
      id: "hw_item_2",
      title: "Electrical Panel Upgrade",
      description: "Current 100-amp panel is at capacity. Upgrade to 200-amp recommended for modern appliances and EV charging.",
      category: "electrical",
      priority: "recommended",
      estimatedCostLow: 1800,
      estimatedCostHigh: 3000,
      timelineEstimate: "1 day",
    },
    {
      id: "hw_item_3",
      title: "Roof Flashing Repair",
      description: "Minor flashing damage around chimney. Should be addressed before spring rains to prevent water intrusion.",
      category: "exterior",
      priority: "critical",
      estimatedCostLow: 400,
      estimatedCostHigh: 800,
      timelineEstimate: "Half day",
    },
    {
      id: "hw_item_4",
      title: "Bathroom Remodel — Primary",
      description: "Outdated fixtures and tile. Full remodel would modernize the space and increase home value.",
      category: "cosmetic",
      priority: "optional",
      estimatedCostLow: 8000,
      estimatedCostHigh: 15000,
      timelineEstimate: "5-7 days",
    },
    {
      id: "hw_item_5",
      title: "Water Heater Replacement",
      description: "Tank shows rust spots at base. Proactive replacement recommended to avoid emergency failure.",
      category: "plumbing",
      priority: "recommended",
      estimatedCostLow: 1200,
      estimatedCostHigh: 2500,
      timelineEstimate: "Half day",
    },
    {
      id: "hw_item_6",
      title: "Smoke & CO Detector Update",
      description: "Several detectors past 10-year lifespan. Replace all units to meet current safety codes.",
      category: "safety",
      priority: "critical",
      estimatedCostLow: 150,
      estimatedCostHigh: 300,
      timelineEstimate: "1 hour",
    },
  ],
  totalLow: 16050,
  totalHigh: 28800,
  status: "ready",
};

// ── Post-Close Checklist ──

export interface PostCloseChecklistItem {
  id: string;
  title: string;
  description: string;
  category: "utilities" | "address" | "warranty" | "maintenance" | "homeworke";
  link?: string;
  linkLabel?: string;
  icon: string;
}

export const mockPostCloseChecklist: PostCloseChecklistItem[] = [
  {
    id: "pc_1",
    title: "Transfer Gas Service",
    description: "Contact your gas provider to transfer service to your name effective on your closing date.",
    category: "utilities",
    link: "https://www.nicor.com",
    linkLabel: "Nicor Gas →",
    icon: "🔥",
  },
  {
    id: "pc_2",
    title: "Transfer Electric Service",
    description: "Set up electricity in your name. Most providers allow online transfer.",
    category: "utilities",
    link: "https://www.comed.com",
    linkLabel: "ComEd →",
    icon: "⚡",
  },
  {
    id: "pc_3",
    title: "Set Up Water & Sewer",
    description: "Contact your municipality for water service transfer. Some require an in-person visit.",
    category: "utilities",
    icon: "💧",
  },
  {
    id: "pc_4",
    title: "Set Up Internet & Cable",
    description: "Compare providers in your area and schedule installation before move-in day.",
    category: "utilities",
    icon: "📡",
  },
  {
    id: "pc_5",
    title: "Forward Mail with USPS",
    description: "Submit a change of address with USPS to forward mail from your old address.",
    category: "address",
    link: "https://moversguide.usps.com",
    linkLabel: "USPS Change of Address →",
    icon: "📬",
  },
  {
    id: "pc_6",
    title: "Update Banks & Credit Cards",
    description: "Update your billing address with all banks, credit cards, and investment accounts.",
    category: "address",
    icon: "🏦",
  },
  {
    id: "pc_7",
    title: "Update Subscriptions & Memberships",
    description: "Update your address with streaming services, gym memberships, Amazon, and other subscriptions.",
    category: "address",
    icon: "📦",
  },
  {
    id: "pc_8",
    title: "Consider a Home Warranty",
    description: "A home warranty can cover unexpected repairs to major systems and appliances during your first year.",
    category: "warranty",
    icon: "🛡️",
  },
  {
    id: "pc_9",
    title: "Set Up Maintenance Schedule",
    description: "Create a seasonal maintenance calendar: HVAC filters, gutters, water heater flush, and more.",
    category: "maintenance",
    icon: "🔧",
  },
  {
    id: "pc_10",
    title: "Need Repairs or Renovations?",
    description: "Upload your inspection report and get instant estimates for any home project — powered by Homeworke.",
    category: "homeworke",
    icon: "🏗️",
  },
];

// ── Consumer Onboarding Options ──

export interface OnboardingGoal {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const consumerOnboardingGoals: OnboardingGoal[] = [
  { id: "buying", label: "Buying a Home", icon: "🏠", description: "Find your dream team for the buying journey" },
  { id: "selling", label: "Selling a Home", icon: "📤", description: "Build the right team to sell your property" },
  { id: "both", label: "Buying & Selling", icon: "🔄", description: "Managing both sides of the transaction" },
  { id: "exploring", label: "Just Exploring", icon: "👀", description: "See what Relays has to offer" },
];

export interface OnboardingServiceNeed {
  id: string;
  label: string;
  icon: string;
}

export const consumerServiceNeeds: OnboardingServiceNeed[] = [
  { id: "realtor", label: "Realtor / Agent", icon: "🏠" },
  { id: "lender", label: "Mortgage Lender", icon: "💰" },
  { id: "inspector", label: "Home Inspector", icon: "🔍" },
  { id: "attorney", label: "Real Estate Attorney", icon: "⚖️" },
  { id: "insurance", label: "Insurance Agent", icon: "🛡️" },
];
