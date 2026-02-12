"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getProBySlug, generateTimeWindows } from "@/lib/mock-data";

function getNextDays(count: number) {
  const days: { date: string; label: string; dayName: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

export default function BookingPage() {
  const params = useParams<{ proSlug: string }>();
  const pro = getProBySlug(params.proSlug);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"date" | "time" | "confirm">("date");

  if (!pro) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-100">Professional not found</h1>
        <Link href="/marketplace" className="mt-4 inline-block text-sm text-blue-400 hover:underline">
          ← Back to Marketplace
        </Link>
      </main>
    );
  }

  const isInspector = pro.categories.includes("Home Inspector");
  const days = getNextDays(14);
  const timeWindows = selectedDate
    ? generateTimeWindows(selectedDate, isInspector ? "inspector" : "trades")
    : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedWindow(null);
    setStep("time");
  };

  const handleTimeSelect = (windowId: string) => {
    setSelectedWindow(windowId);
    setStep("confirm");
  };

  const selectedWindowData = timeWindows.find((w) => w.id === selectedWindow);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link href={`/pros/${pro.slug}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 mb-6">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold text-slate-100 mb-2">Request Booking</h1>
      <p className="text-sm text-slate-400 mb-6">
        {isInspector ? "Select a date and 2-hour inspection window" : "Select a date and time"}
      </p>

      {/* Pro summary */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image src={pro.headshotUrl} alt={pro.name} width={48} height={48} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-100">{pro.name}</div>
            <div className="text-xs text-slate-500">{pro.companyName} • {pro.categories[0]}</div>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <Image src={pro.companyLogoUrl} alt={pro.companyName} width={36} height={36} />
          </div>
        </div>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {["date", "time", "confirm"].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`
              flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
              ${step === s ? "bg-[var(--accent)] text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]" : i < ["date", "time", "confirm"].indexOf(step) ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-600"}
            `}>
              {i + 1}
            </div>
            <span className={`text-xs ${step === s ? "text-blue-400 font-medium" : "text-slate-600"}`}>
              {s === "date" ? "Pick Date" : s === "time" ? "Pick Time" : "Confirm"}
            </span>
            {i < 2 && <div className="flex-1 h-px bg-[var(--border)]" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Date picker */}
      {step === "date" && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Select a Date</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {days.map((day) => (
              <button
                key={day.date}
                onClick={() => handleDateSelect(day.date)}
                className={`
                  rounded-xl border p-3 text-center transition-all
                  ${selectedDate === day.date
                    ? "border-[var(--accent)]/40 bg-[var(--accent-light)] text-blue-400"
                    : "border-[var(--border)] hover:border-[var(--border-hover)] text-slate-300"
                  }
                `}
              >
                <div className="text-xs text-slate-500">{day.dayName}</div>
                <div className="text-sm font-semibold mt-0.5">{day.label}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 2: Time window picker */}
      {step === "time" && selectedDate && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Available {isInspector ? "2-Hour Windows" : "Time Slots"} — {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <button onClick={() => setStep("date")} className="text-xs text-blue-400 hover:underline">
              Change date
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {timeWindows.map((tw) => (
              <button
                key={tw.id}
                onClick={() => tw.available && handleTimeSelect(tw.id)}
                disabled={!tw.available}
                className={`
                  rounded-xl border p-3 text-center transition-all
                  ${!tw.available
                    ? "border-[var(--border)] bg-white/[0.02] text-slate-700 cursor-not-allowed"
                    : selectedWindow === tw.id
                      ? "border-[var(--accent)]/40 bg-[var(--accent-light)] text-blue-400"
                      : "border-[var(--border)] hover:border-[var(--border-hover)] text-slate-300"
                  }
                `}
              >
                <div className="text-sm font-medium">
                  {tw.startTime} – {tw.endTime}
                </div>
                {!tw.available && <div className="text-[10px] text-slate-700 mt-0.5">Unavailable</div>}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirm" && selectedWindowData && (
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">Confirm Your Booking Request</h2>

          <div className="rounded-xl bg-white/5 border border-[var(--border)] p-4 mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Professional</span>
              <span className="text-slate-200 font-medium">{pro.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="text-slate-200 font-medium">
                {new Date(selectedWindowData.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Time</span>
              <span className="text-slate-200 font-medium">
                {selectedWindowData.startTime} – {selectedWindowData.endTime}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Duration</span>
              <span className="text-slate-200 font-medium">{isInspector ? "2 hours" : "1 hour"}</span>
            </div>
          </div>

          <Badge variant="accent" className="mb-4">
            This is a hold request — {pro.name} will confirm or suggest alternatives
          </Badge>

          <textarea
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm text-slate-300 placeholder:text-slate-500 outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent-light)] min-h-[80px] resize-y mb-4"
            placeholder="Add any notes for the professional (optional)..."
          />

          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => alert("Booking request sent! (Demo)")}>
              Submit Booking Request
            </Button>
            <Button variant="secondary" onClick={() => setStep("time")}>
              Change Time
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
