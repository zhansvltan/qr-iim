import { ApplicationFormPage } from "@/src/components/application/ApplicationFormPage";

type ApplicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { id } = await params;
  return <ApplicationFormPage vacancyId={id} />;
}
