"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/provider";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type GateAction =
  | "add_to_team"
  | "request_booking"
  | "download_pdf"
  | "contact_pro";

type GateContext = {
  proSlug?: string;
  from?: string;
};

function logLeadEvent(payload: { action: GateAction; context: GateContext; email?: string }) {
  // Mock-first: console log only. Later swap to DB/event pipeline.
  // eslint-disable-next-line no-console
  console.log("[lead_event]", payload);
}

export function SoftWallGate({
  action,
  context,
  children,
}: {
  action: GateAction;
  context: GateContext;
  children: (authed: boolean, begin: () => void) => React.ReactNode;
}) {
  const { state, loginFake } = useAuth();
  const authed = state.status === "authed";

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const begin = React.useCallback(() => {
    if (authed) {
      logLeadEvent({ action, context, email: state.status === "authed" ? state.user.email : undefined });
      return;
    }
    setOpen(true);
  }, [authed, action, context, state]);

  const completeSignup = React.useCallback(() => {
    if (!email.trim()) return;
    loginFake({ email: email.trim(), role: "consumer" });
    logLeadEvent({ action, context, email: email.trim() });
    setOpen(false);
  }, [email, loginFake, action, context]);

  return (
    <>
      {children(authed, begin)}

      <Modal open={open} title="Create an account to continue" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Quick sign-in (fake for now): enter your email and we’ll continue.
          </p>
          <label className="block">
            <span className="text-xs text-slate-600">Email</span>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Button onClick={completeSignup}>Continue</Button>
          </div>
          <div className="text-[11px] text-slate-500">
            Next: we’ll replace this with Magic Link + Google (and later Apple/Facebook).
          </div>
        </div>
      </Modal>
    </>
  );
}
