"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getConversation,
  getConversationMeta,
  getMessagesForConversation,
} from "@/lib/mock-notifications";
import { type Message } from "@/lib/types";

/* ── Helpers ──────────────────────────────────────────────────── */
function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDateHeader(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  if (d >= today) return "Today";
  if (d >= yesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function groupByDate(messages: Message[]): { date: string; label: string; messages: Message[] }[] {
  const groups: Map<string, { label: string; messages: Message[] }> = new Map();

  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups.has(key)) {
      groups.set(key, { label: formatDateHeader(msg.createdAt), messages: [] });
    }
    groups.get(key)!.messages.push(msg);
  }

  return Array.from(groups.entries()).map(([date, group]) => ({
    date,
    ...group,
  }));
}

/* ── Doc Message Component ────────────────────────────────────── */
function DocMessage({ message }: { message: Message }) {
  const doc = message.docMeta;
  if (!doc) return null;

  const fileTypeIcon = doc.fileType === "pdf" ? (
    <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="mx-auto max-w-xs">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 flex-shrink-0">
            {fileTypeIcon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{doc.fileName}</p>
            <p className="text-[10px] text-slate-500">{doc.fileSize} • {doc.fileType.toUpperCase()}</p>
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex-shrink-0">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Message Bubble ───────────────────────────────────────────── */
function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  // System messages (centered)
  if (message.senderRole === "system" || message.type === "system" || message.type === "booking_update") {
    return (
      <div className="flex flex-col items-center my-3 px-4">
        {message.type === "doc_share" && message.docMeta ? (
          <DocMessage message={message} />
        ) : (
          <div className="rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--border-subtle)] px-4 py-1.5 max-w-sm">
            <p className="text-[11px] text-slate-500 text-center">{message.content}</p>
          </div>
        )}
        <span className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">{formatTime(message.createdAt)}</span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1 px-4`}>
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 ${
            isOwn
              ? "bg-blue-500/90 text-white rounded-br-md shadow-[0_2px_12px_rgba(59,130,246,0.2)]"
              : "liquid-glass text-slate-800 dark:text-slate-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-slate-500 dark:text-slate-600">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <svg width="12" height="12" fill="none" stroke="#475569" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Typing Indicator ─────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex justify-start px-4 mb-2">
      <div className="liquid-glass rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = use(params);
  const conversation = getConversation(conversationId);
  const meta = getConversationMeta(conversationId);
  const messages = getMessagesForConversation(conversationId);
  const [newMessage, setNewMessage] = React.useState("");
  const [localMessages, setLocalMessages] = React.useState<Message[]>(messages);
  const [showTyping, setShowTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [localMessages, showTyping]);

  if (!conversation || !meta) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">💬</div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">Conversation not found</h1>
          <p className="text-sm text-slate-500 mb-4">This conversation may have been removed.</p>
          <Link href="/messages">
            <Button>Back to Messages</Button>
          </Link>
        </div>
      </div>
    );
  }

  const grouped = groupByDate(localMessages);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `msg_new_${Date.now()}`,
      conversationId,
      senderId: "user_demo",
      senderName: "You",
      senderRole: "consumer",
      content: newMessage.trim(),
      type: "text",
      createdAt: new Date().toISOString(),
      readBy: ["user_demo"],
    };

    setLocalMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // Show typing indicator briefly for demo
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          {/* Back button */}
          <Link
            href="/messages"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors md:hidden"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-9 w-9 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]">
              <Image
                src={meta.otherPartyAvatar}
                alt={meta.otherPartyName}
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-emerald-500" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{meta.otherPartyName}</h2>
              <Badge variant="outline" className="text-[10px]">{meta.otherPartyRole}</Badge>
            </div>
            <p className="text-[11px] text-slate-500 truncate">Active now</p>
          </div>

          {/* Hidden on mobile back link for desktop */}
          <Link
            href="/messages"
            className="hidden md:flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            All Messages
          </Link>
        </div>
      </div>

      {/* Journey context banner */}
      <div className="flex-shrink-0 border-b border-[var(--border-subtle)] bg-blue-500/[0.03]">
        <div className="mx-auto max-w-3xl flex items-center gap-2 px-4 py-2">
          <svg width="12" height="12" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24" className="flex-shrink-0">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            This conversation is within your <Link href={`/journey/${conversation.journeyId}`} className="text-blue-400 hover:underline">{meta.journeyTitle}</Link> journey
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-600">• {meta.journeyAddress}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="mx-auto max-w-3xl py-4">
          {grouped.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center justify-center my-4">
                <div className="rounded-full bg-black/[0.04] dark:bg-white/[0.04] border border-[var(--border-subtle)] px-3 py-1">
                  <span className="text-[11px] text-slate-500 font-medium">{group.label}</span>
                </div>
              </div>

              {/* Messages */}
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === "user_demo"}
                />
              ))}
            </div>
          ))}

          {showTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl flex items-end gap-2 px-4 py-3">
          {/* Attach button */}
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex-shrink-0">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 outline-none transition-all focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] max-h-32"
              style={{ minHeight: "40px" }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all flex-shrink-0 ${
              newMessage.trim()
                ? "bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)] hover:bg-blue-600"
                : "bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-600"
            }`}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
