"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import {
  getBookingsForPro,
  getProById,
  getBookingTypeLabel,
  getBookingStatusInfo,
} from "@/lib/mock-data";
import type { Booking, BookingTimeWindow } from "@/lib/types";

function formatDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ── Booking Card ─────────────────────────────────────────────── */

function BookingCard({
  booking,
  onAccept,
  onDecline,
  onSuggestAlt,
}: {
  booking: Booking;
  onAccept: (b: Booking, w: BookingTimeWindow) => void;
  onDecline: (b: Booking) => void;
  onSuggestAlt: (b: Booking) => void;
}) {
  const statusInfo = getBookingStatusInfo(booking.status);
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card padding="none" hover className="overflow-hidden">
      {/* Top accent bar */}
      <div className={`h-0.5 ${booking.status === "pending" ? "bg-gradient-to-r from-amber-500/60 to-amber-500/0" : booking.status === "confirmed" ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500/0" : "bg-gradient-to-r from-slate-500/30 to-transparent"}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-[var(--border)] flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
              {booking.consumerName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{booking.consumerName}</div>
              <div className="text-xs text-slate-600 dark:text-slate-500">{booking.consumerEmail}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            <span className="text-[10px] text-slate-500 dark:text-slate-500">{timeAgo(booking.createdAt)}</span>
          </div>
        </div>

        {/* Service type & property */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-[10px]">{getBookingTypeLabel(booking.type)}</Badge>
          {booking.property && (
            <span className="text-xs text-slate-600 dark:text-slate-500 flex items-center gap-1">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {booking.property.address}
            </span>
          )}
        </div>

        {/* Confirmed window */}
        {booking.confirmedWindow && (
          <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 p-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
              <svg width="12" height="12" fill="#10b981" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
              Confirmed
            </div>
            <div className="text-sm text-slate-800 dark:text-slate-200">{formatDate(booking.confirmedWindow.date)}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{formatTime(booking.confirmedWindow.startTime)} – {formatTime(booking.confirmedWindow.endTime)}</div>
          </div>
        )}

        {/* Pro suggested window */}
        {booking.proSuggestedWindow && (
          <div className="rounded-xl bg-blue-500/[0.06] border border-blue-500/15 p-3 mb-3">
            <div className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1">Your suggested alternative</div>
            <div className="text-sm text-slate-800 dark:text-slate-200">{formatDate(booking.proSuggestedWindow.date)}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{formatTime(booking.proSuggestedWindow.startTime)} – {formatTime(booking.proSuggestedWindow.endTime)}</div>
          </div>
        )}

        {/* Proposed windows (for pending) */}
        {booking.status === "pending" && (
          <div className="mb-3">
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Client&apos;s preferred times:</div>
            <div className="space-y-1.5">
              {booking.proposedWindows.map((w, i) => (
                <div key={w.id} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400">{i + 1}</div>
                  <div className="flex-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-[var(--border)] px-3 py-1.5 text-xs">
                    <span className="text-slate-800 dark:text-slate-200">{formatDate(w.date)}</span>
                    <span className="text-slate-600 dark:text-slate-500 ml-2">{formatTime(w.startTime)} – {formatTime(w.endTime)}</span>
                  </div>
                  <Button size="sm" onClick={() => onAccept(booking, w)} className="text-[10px] h-7 px-2">
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decline reason */}
        {booking.declineReason && (
          <div className="rounded-xl bg-red-500/[0.04] border border-red-500/10 p-3 mb-3">
            <div className="text-xs text-red-400 font-medium mb-0.5">Decline reason</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{booking.declineReason}</div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-3">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform ${expanded ? "rotate-90" : ""}`}><path d="M9 5l7 7-7 7" /></svg>
            {expanded ? "Hide notes" : "Show notes"}
          </button>
        )}
        {expanded && booking.notes && (
          <div className="rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border)] p-3 mb-3 text-xs text-slate-600 dark:text-slate-400">{booking.notes}</div>
        )}

        {/* Journey link */}
        {booking.journeyId && (
          <Link href={`/journey/${booking.journeyId}`} className="text-[10px] text-blue-500 dark:text-blue-400/60 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
            View journey →
          </Link>
        )}

        {/* Actions for pending */}
        {booking.status === "pending" && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
            <Button size="sm" variant="secondary" onClick={() => onSuggestAlt(booking)} className="flex-1 text-xs">
              Suggest Alternative
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              Request Call
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDecline(booking)} className="text-xs text-red-400 hover:text-red-300">
              Decline
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ── Calendar Mini View ───────────────────────────────────────── */

function CalendarMiniView({ bookings }: { bookings: Booking[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" && b.confirmedWindow);
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  function getBookingsForDate(dayNum: number) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const confirmed = confirmedBookings.filter((b) => b.confirmedWindow?.date === dateStr);
    const pending = pendingBookings.filter((b) => b.proposedWindows.some((w) => w.date === dateStr));
    return { confirmed, pending };
  }

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{monthName}</h2>
        <div className="flex gap-1">
          <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); } else setCurrentMonth((m) => m - 1); }}
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg></button>
          <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); } else setCurrentMonth((m) => m + 1); }}
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] text-slate-500 dark:text-slate-500 font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isToday = dayNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const { confirmed, pending } = getBookingsForDate(dayNum);
          const hasConfirmed = confirmed.length > 0;
          const hasPending = pending.length > 0;

          return (
            <div key={dayNum} className={`relative rounded-lg p-1.5 text-center text-xs ${isToday ? "bg-[var(--accent-light)] text-blue-500 dark:text-blue-400 font-bold" : "text-slate-600 dark:text-slate-400"} ${hasConfirmed || hasPending ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" : ""}`}>
              {dayNum}
              {(hasConfirmed || hasPending) && (
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {hasConfirmed && <div className="h-1 w-1 rounded-full bg-emerald-500" />}
                  {hasPending && <div className="h-1 w-1 rounded-full bg-amber-500" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] text-slate-600 dark:text-slate-500">Confirmed</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[10px] text-slate-600 dark:text-slate-500">Pending</span></div>
      </div>
    </Card>
  );
}

/* ── Main Pro Bookings Page ───────────────────────────────────── */

export default function ProBookingsPage() {
  const proId = "pro_1"; // Mock: Alex Martinez
  const allBookings = getBookingsForPro(proId);
  const pro = getProById(proId);

  const [activeTab, setActiveTab] = React.useState("pending");
  const [viewMode, setViewMode] = React.useState<"list" | "calendar">("list");
  const [actionModal, setActionModal] = React.useState<{ type: "accept" | "decline" | "suggest"; booking: Booking; window?: BookingTimeWindow } | null>(null);
  const [actionDone, setActionDone] = React.useState<string[]>([]);

  const pendingBookings = allBookings.filter((b) => b.status === "pending" && !actionDone.includes(b.id));
  const upcomingBookings = allBookings.filter((b) => (b.status === "confirmed" || b.status === "rescheduled") && !actionDone.includes(b.id));
  const pastBookings = allBookings.filter((b) => b.status === "completed");
  const declinedBookings = allBookings.filter((b) => b.status === "declined" || actionDone.includes(b.id));

  const tabs = [
    { id: "pending", label: "Pending", count: pendingBookings.length },
    { id: "upcoming", label: "Upcoming", count: upcomingBookings.length },
    { id: "past", label: "Past", count: pastBookings.length },
    { id: "declined", label: "Declined", count: declinedBookings.length },
  ];

  const filteredBookings = activeTab === "pending" ? pendingBookings : activeTab === "upcoming" ? upcomingBookings : activeTab === "past" ? pastBookings : declinedBookings;

  const handleAccept = (b: Booking, w: BookingTimeWindow) => {
    setActionModal({ type: "accept", booking: b, window: w });
  };
  const handleDecline = (b: Booking) => {
    setActionModal({ type: "decline", booking: b });
  };
  const handleSuggestAlt = (b: Booking) => {
    setActionModal({ type: "suggest", booking: b });
  };
  const confirmAction = () => {
    if (actionModal) {
      setActionDone((prev) => [...prev, actionModal.booking.id]);
      setActionModal(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bookings</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage your appointment requests and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-[var(--border)] overflow-hidden">
            <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "list" ? "bg-[var(--bg-card)] text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            </button>
            <button onClick={() => setViewMode("calendar")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "calendar" ? "bg-[var(--bg-card)] text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            </button>
          </div>
          <Link href="/pro/settings"><Button size="sm" variant="secondary">⚙ Calendar Settings</Button></Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pending", value: pendingBookings.length, color: "amber" },
          { label: "Upcoming", value: upcomingBookings.length, color: "blue" },
          { label: "Completed", value: pastBookings.length, color: "emerald" },
          { label: "Declined", value: declinedBookings.length, color: "slate" },
        ].map((stat) => (
          <Card key={stat.label} padding="sm" className="text-center py-3">
            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
            <div className="text-[10px] text-slate-600 dark:text-slate-500 mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </div>

      {viewMode === "calendar" ? (
        <CalendarMiniView bookings={allBookings} />
      ) : (
        <>
          <div className="mb-4">
            <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
          </div>

          {filteredBookings.length === 0 ? (
            <Card padding="lg" className="text-center py-12">
              <div className="text-3xl mb-2">{activeTab === "pending" ? "📬" : activeTab === "upcoming" ? "📅" : activeTab === "past" ? "✅" : "❌"}</div>
              <p className="text-sm text-slate-600 dark:text-slate-400">No {activeTab} bookings</p>
            </Card>
          ) : (
            <div className="space-y-3 stagger-children">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onAccept={handleAccept} onDecline={handleDecline} onSuggestAlt={handleSuggestAlt} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Action confirmation modal */}
      <Modal open={!!actionModal} title={actionModal?.type === "accept" ? "Confirm Booking" : actionModal?.type === "decline" ? "Decline Booking" : "Suggest Alternative"} onClose={() => setActionModal(null)}>
        {actionModal?.type === "accept" && actionModal.window && (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 p-4">
              <div className="text-xs text-emerald-400 font-medium mb-1">Confirming this time:</div>
              <div className="text-sm text-slate-800 dark:text-slate-200">{formatDate(actionModal.window.date)}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{formatTime(actionModal.window.startTime)} – {formatTime(actionModal.window.endTime)}</div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-500">The client will be notified and a calendar event will be created.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
              <Button onClick={confirmAction}>Confirm Booking</Button>
            </div>
          </div>
        )}
        {actionModal?.type === "decline" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-red-500/[0.06] border border-red-500/15 p-4">
              <div className="text-xs text-red-400 font-medium mb-1">Declining booking from:</div>
              <div className="text-sm text-slate-800 dark:text-slate-200">{actionModal.booking.consumerName}</div>
            </div>
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1.5">Reason (optional)</label>
              <textarea className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none min-h-[80px] resize-y" placeholder="Let the client know why..." />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmAction}>Decline</Button>
            </div>
          </div>
        )}
        {actionModal?.type === "suggest" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-500">Suggest a different time for {actionModal.booking.consumerName}:</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Date</label>
                <input type="date" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                <input type="time" className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
              <Button onClick={confirmAction}>Send Suggestion</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
