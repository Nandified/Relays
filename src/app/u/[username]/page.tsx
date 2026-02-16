"use client";

import { useParams } from "next/navigation";
import { SharePageContent } from "@/components/share/SharePageContent";

export default function SharePage() {
  const params = useParams<{ username: string }>();
  return <SharePageContent username={params.username} />;
}
