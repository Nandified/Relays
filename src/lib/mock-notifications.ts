import { type Notification, type Conversation, type Message, type ConnectRequest } from "@/lib/types";

/* ── Mock Notifications ───────────────────────────────────────── */

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    userId: "user_demo",
    type: "booking_confirmed",
    title: "Inspection Confirmed",
    body: "Alex Martinez confirmed your home inspection for 742 Maple Ave on Feb 15 at 10:30 AM.",
    link: "/journey/journey_1",
    read: false,
    createdAt: hoursAgo(1),
    metadata: { journeyId: "journey_1", proId: "pro_1", bookingId: "book_1" },
  },
  {
    id: "notif_2",
    userId: "user_demo",
    type: "message_received",
    title: "New message from Lisa Hartwell",
    body: "\"Hey! Just wanted to check in — did you get a chance to review the two attorney options I sent?\"",
    link: "/messages/conv_1",
    read: false,
    createdAt: hoursAgo(3),
    metadata: { journeyId: "journey_1", proId: "pro_9" },
  },
  {
    id: "notif_3",
    userId: "user_demo",
    type: "doc_uploaded",
    title: "Document uploaded",
    body: "Jordan Lee uploaded your pre-approval letter for the Lincoln Park Condo journey.",
    link: "/journey/journey_2",
    read: false,
    createdAt: hoursAgo(6),
    metadata: { journeyId: "journey_2", proId: "pro_2" },
  },
  {
    id: "notif_4",
    userId: "user_demo",
    type: "moment_triggered",
    title: "Attorney review period ending",
    body: "Your attorney review period for Oak Park Bungalow ends in 48 hours. Make sure you have an attorney selected.",
    link: "/journey/journey_1",
    read: true,
    createdAt: daysAgo(1),
    metadata: { journeyId: "journey_1", momentId: "moment_atty_review" },
  },
  {
    id: "notif_5",
    userId: "user_demo",
    type: "connect_request",
    title: "Connect request from Sam Patel",
    body: "Sam Patel wants to connect about the Lincoln Park Condo — they're looking for insurance guidance.",
    link: "/messages",
    read: true,
    createdAt: daysAgo(1),
    metadata: { journeyId: "journey_2" },
  },
  {
    id: "notif_6",
    userId: "user_demo",
    type: "review_received",
    title: "New 5-star review!",
    body: "Morgan Davis left a 5-star review: \"Incredible experience from start to finish. The Relays team made everything seamless.\"",
    link: "/pro/profile",
    read: true,
    createdAt: daysAgo(3),
  },
  {
    id: "notif_7",
    userId: "user_demo",
    type: "system",
    title: "Welcome to Relays!",
    body: "Your account is set up. Start by exploring the marketplace or creating your first journey.",
    link: "/dashboard",
    read: true,
    createdAt: daysAgo(5),
  },
  {
    id: "notif_8",
    userId: "user_demo",
    type: "booking_requested",
    title: "Booking request sent",
    body: "Your inspection booking request has been sent to Alex Martinez. You'll hear back within 2 hours.",
    link: "/journey/journey_1",
    read: true,
    createdAt: daysAgo(2),
    metadata: { journeyId: "journey_1", proId: "pro_1", bookingId: "book_1" },
  },
];

/* ── Mock Conversations ───────────────────────────────────────── */

export const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    journeyId: "journey_1",
    participants: ["user_demo", "pro_9"],
    lastMessage: "Hey! Just wanted to check in — did you get a chance to review the two attorney options I sent?",
    lastMessageAt: hoursAgo(3),
    unreadCount: 1,
  },
  {
    id: "conv_2",
    journeyId: "journey_2",
    participants: ["user_demo", "pro_2"],
    lastMessage: "Your pre-approval letter is ready! I've uploaded it to your journey docs.",
    lastMessageAt: hoursAgo(6),
    unreadCount: 1,
  },
  {
    id: "conv_3",
    journeyId: "journey_1",
    participants: ["user_demo", "pro_1"],
    lastMessage: "Perfect, I'll see you Saturday at 10:30. I'll send the report within 24 hours after.",
    lastMessageAt: daysAgo(1),
    unreadCount: 0,
  },
];

/* ── Conversation metadata (for display) ──────────────────────── */

export interface ConversationMeta {
  id: string;
  otherPartyName: string;
  otherPartyAvatar: string;
  otherPartyRole: string;
  journeyTitle: string;
  journeyAddress: string;
}

export const conversationMeta: Record<string, ConversationMeta> = {
  conv_1: {
    id: "conv_1",
    otherPartyName: "Lisa Hartwell",
    otherPartyAvatar: "/demo/headshots/lisa.svg",
    otherPartyRole: "Realtor",
    journeyTitle: "Oak Park Bungalow",
    journeyAddress: "742 Maple Ave, Oak Park, IL 60302",
  },
  conv_2: {
    id: "conv_2",
    otherPartyName: "Jordan Lee",
    otherPartyAvatar: "/demo/headshots/jordan.svg",
    otherPartyRole: "Mortgage Lender",
    journeyTitle: "Lincoln Park Condo",
    journeyAddress: "1455 N Wells St, Chicago, IL 60614",
  },
  conv_3: {
    id: "conv_3",
    otherPartyName: "Alex Martinez",
    otherPartyAvatar: "/demo/headshots/alex.svg",
    otherPartyRole: "Home Inspector",
    journeyTitle: "Oak Park Bungalow",
    journeyAddress: "742 Maple Ave, Oak Park, IL 60302",
  },
};

/* ── Mock Messages ────────────────────────────────────────────── */

export const mockMessages: Record<string, Message[]> = {
  // Conversation 1: Consumer ↔ Lisa Hartwell (Realtor)
  conv_1: [
    {
      id: "msg_1_1",
      conversationId: "conv_1",
      senderId: "pro_9",
      senderName: "Lisa Hartwell",
      senderRole: "pro",
      content: "Hi Jamie! Congrats on going under contract on the Oak Park bungalow! 🎉 I've set up your journey so we can track everything in one place.",
      type: "text",
      createdAt: daysAgo(5),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_2",
      conversationId: "conv_1",
      senderId: "user_demo",
      senderName: "Jamie Rodriguez",
      senderRole: "consumer",
      content: "Thank you Lisa! This is so exciting. What do we need to do first?",
      type: "text",
      createdAt: daysAgo(5),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_3",
      conversationId: "conv_1",
      senderId: "pro_9",
      senderName: "Lisa Hartwell",
      senderRole: "pro",
      content: "First priority is getting your attorney and home inspector lined up. I've added my top recommendations for both to your journey. Take a look when you get a chance!",
      type: "text",
      createdAt: daysAgo(5),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_4",
      conversationId: "conv_1",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Lisa Hartwell recommended Marcus Williams and Priya Kapoor as attorneys for this journey.",
      type: "system",
      createdAt: daysAgo(4),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_5",
      conversationId: "conv_1",
      senderId: "user_demo",
      senderName: "Jamie Rodriguez",
      senderRole: "consumer",
      content: "I checked out both attorneys. Marcus Williams looks great — his reviews are incredible. Going with him!",
      type: "text",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_6",
      conversationId: "conv_1",
      senderId: "pro_9",
      senderName: "Lisa Hartwell",
      senderRole: "pro",
      content: "Great choice! Marcus is fantastic. He'll catch anything in the contract. I'll introduce you.",
      type: "text",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_7",
      conversationId: "conv_1",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Jordan Lee uploaded a document: Pre-Approval Letter (PDF, 245 KB)",
      type: "booking_update",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_8",
      conversationId: "conv_1",
      senderId: "user_demo",
      senderName: "Jamie Rodriguez",
      senderRole: "consumer",
      content: "Still need to pick an inspector. What's the timeline on that?",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_9",
      conversationId: "conv_1",
      senderId: "pro_9",
      senderName: "Lisa Hartwell",
      senderRole: "pro",
      content: "Ideally within the next 3-4 days. The inspection contingency period is 10 days from contract. I'll check Alex Martinez's availability — he's excellent with older homes like yours.",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_9"],
    },
    {
      id: "msg_1_10",
      conversationId: "conv_1",
      senderId: "pro_9",
      senderName: "Lisa Hartwell",
      senderRole: "pro",
      content: "Hey! Just wanted to check in — did you get a chance to review the two attorney options I sent?",
      type: "text",
      createdAt: hoursAgo(3),
      readBy: ["pro_9"],
    },
  ],

  // Conversation 2: Consumer ↔ Jordan Lee (Lender)
  conv_2: [
    {
      id: "msg_2_1",
      conversationId: "conv_2",
      senderId: "pro_2",
      senderName: "Jordan Lee",
      senderRole: "pro",
      content: "Hi there! I'm Jordan, your mortgage lender for the Lincoln Park Condo. Let's get your financing locked in.",
      type: "text",
      createdAt: daysAgo(4),
      readBy: ["user_demo", "pro_2"],
    },
    {
      id: "msg_2_2",
      conversationId: "conv_2",
      senderId: "user_demo",
      senderName: "Sam Patel",
      senderRole: "consumer",
      content: "Hi Jordan! What documents do you need from me to get started?",
      type: "text",
      createdAt: daysAgo(4),
      readBy: ["user_demo", "pro_2"],
    },
    {
      id: "msg_2_3",
      conversationId: "conv_2",
      senderId: "pro_2",
      senderName: "Jordan Lee",
      senderRole: "pro",
      content: "I'll need your last 2 years of tax returns, 2 months of bank statements, and recent pay stubs. You can upload them directly through the journey docs section.",
      type: "text",
      createdAt: daysAgo(4),
      readBy: ["user_demo", "pro_2"],
    },
    {
      id: "msg_2_4",
      conversationId: "conv_2",
      senderId: "user_demo",
      senderName: "Sam Patel",
      senderRole: "consumer",
      content: "Got it, uploading now!",
      type: "text",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_2"],
    },
    {
      id: "msg_2_5",
      conversationId: "conv_2",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Sam Patel uploaded: 2024 Tax Return (PDF, 1.2 MB)",
      type: "doc_share",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_2"],
      docMeta: {
        fileName: "2024_Tax_Return.pdf",
        fileType: "pdf",
        fileSize: "1.2 MB",
        uploadedAt: daysAgo(3),
      },
    },
    {
      id: "msg_2_6",
      conversationId: "conv_2",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Sam Patel uploaded: Bank Statements Jan-Feb 2026 (PDF, 890 KB)",
      type: "doc_share",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_2"],
      docMeta: {
        fileName: "Bank_Statements_Jan_Feb_2026.pdf",
        fileType: "pdf",
        fileSize: "890 KB",
        uploadedAt: daysAgo(3),
      },
    },
    {
      id: "msg_2_7",
      conversationId: "conv_2",
      senderId: "pro_2",
      senderName: "Jordan Lee",
      senderRole: "pro",
      content: "Perfect, got everything. I'll have your pre-approval letter ready by tomorrow. Looking great so far! 👍",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_2"],
    },
    {
      id: "msg_2_8",
      conversationId: "conv_2",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Jordan Lee uploaded: Pre-Approval Letter (PDF, 245 KB)",
      type: "doc_share",
      createdAt: hoursAgo(6),
      readBy: ["pro_2"],
      docMeta: {
        fileName: "Pre_Approval_Letter_Lincoln_Park.pdf",
        fileType: "pdf",
        fileSize: "245 KB",
        uploadedAt: hoursAgo(6),
      },
    },
    {
      id: "msg_2_9",
      conversationId: "conv_2",
      senderId: "pro_2",
      senderName: "Jordan Lee",
      senderRole: "pro",
      content: "Your pre-approval letter is ready! I've uploaded it to your journey docs.",
      type: "text",
      createdAt: hoursAgo(6),
      readBy: ["pro_2"],
    },
  ],

  // Conversation 3: Consumer ↔ Alex Martinez (Inspector)
  conv_3: [
    {
      id: "msg_3_1",
      conversationId: "conv_3",
      senderId: "pro_1",
      senderName: "Alex Martinez",
      senderRole: "pro",
      content: "Hi Jamie! Lisa let me know about the Oak Park bungalow. 1928 construction — that's my specialty. When works best for the inspection?",
      type: "text",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_2",
      conversationId: "conv_3",
      senderId: "user_demo",
      senderName: "Jamie Rodriguez",
      senderRole: "consumer",
      content: "Hi Alex! Saturday morning would be ideal if you're available. I'm a bit worried about the foundation and electrical — the house is almost 100 years old.",
      type: "text",
      createdAt: daysAgo(3),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_3",
      conversationId: "conv_3",
      senderId: "pro_1",
      senderName: "Alex Martinez",
      senderRole: "pro",
      content: "Saturday works great! I'll block off 10:30 AM – 12:30 PM. For a 1928 bungalow, I'll do a thorough check on foundation, electrical panel, plumbing, and roof. I see these homes every week — most have been well-maintained.",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_4",
      conversationId: "conv_3",
      senderId: "system",
      senderName: "System",
      senderRole: "system",
      content: "Inspection booked: Saturday, Feb 15 at 10:30 AM — 742 Maple Ave, Oak Park",
      type: "booking_update",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_5",
      conversationId: "conv_3",
      senderId: "user_demo",
      senderName: "Jamie Rodriguez",
      senderRole: "consumer",
      content: "That makes me feel a lot better. Thank you! Should I be at the property for the inspection?",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_6",
      conversationId: "conv_3",
      senderId: "pro_1",
      senderName: "Alex Martinez",
      senderRole: "pro",
      content: "I always recommend it! I'll walk you through everything I find as we go. It's a great learning experience for first-time buyers. Bring comfortable shoes — we'll be at it for about 2 hours.",
      type: "text",
      createdAt: daysAgo(2),
      readBy: ["user_demo", "pro_1"],
    },
    {
      id: "msg_3_7",
      conversationId: "conv_3",
      senderId: "pro_1",
      senderName: "Alex Martinez",
      senderRole: "pro",
      content: "Perfect, I'll see you Saturday at 10:30. I'll send the report within 24 hours after.",
      type: "text",
      createdAt: daysAgo(1),
      readBy: ["user_demo", "pro_1"],
    },
  ],
};

/* ── Mock Connect Requests ────────────────────────────────────── */

export const mockConnectRequests: ConnectRequest[] = [
  {
    id: "conn_1",
    consumerId: "user_demo",
    consumerName: "Jamie Rodriguez",
    consumerEmail: "jamie.r@email.com",
    proId: "pro_6",
    proName: "Nina Reyes",
    journeyId: "journey_1",
    message: "Hi Nina — I'm buying a home in Oak Park and need homeowner's insurance. My realtor Lisa Hartwell recommended I reach out. When can we chat?",
    preferredContact: "in_app",
    status: "pending",
    createdAt: hoursAgo(8),
  },
];

/* ── Helper functions ─────────────────────────────────────────── */

export function getNotificationsForUser(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return mockNotifications.filter((n) => n.userId === userId && !n.read).length;
}

export function getConversation(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

export function getConversationMeta(id: string): ConversationMeta | undefined {
  return conversationMeta[id];
}

export function getMessagesForConversation(conversationId: string): Message[] {
  return mockMessages[conversationId] ?? [];
}

export function getTotalUnreadMessages(): number {
  return mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);
}
