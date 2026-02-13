import { redirect, notFound } from "next/navigation";
import { getProfessionalById } from "@/lib/idfpr-data";

export default async function LegacyProfessionalByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const professional = getProfessionalById(id);
  if (!professional) notFound();

  redirect(`/pros/${professional.slug}`);
}
