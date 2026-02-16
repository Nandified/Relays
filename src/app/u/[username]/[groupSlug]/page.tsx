"use client";

import { useParams } from "next/navigation";
import { SharePageContent } from "@/components/share/SharePageContent";

export default function GroupSharePage() {
  const params = useParams<{ username: string; groupSlug: string }>();
  return <SharePageContent username={params.username} groupSlug={params.groupSlug} />;
}
