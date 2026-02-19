import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function LegacyProfessionalByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const sb = createServerSupabaseClient();
  const { data, error } = await sb
    .from("licensed_professionals")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (error || !data?.slug) notFound();
  redirect(`/pros/${data.slug}`);
}
