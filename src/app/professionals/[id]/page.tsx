import { redirect, notFound } from "next/navigation";
import { getProfessionalById } from "@/lib/idfpr-data";

export default function LegacyProfessionalByIdPage({ params }: { params: { id: string } }) {
  const professional = getProfessionalById(params.id);
  if (!professional) notFound();

  redirect(`/pros/${professional.slug}`);
}
