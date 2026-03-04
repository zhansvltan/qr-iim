import { FizoApplicationDetailsPage } from "@/src/components/fizo/FizoApplicationDetailsPage";

type FizoApplicationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FizoApplicationPage({ params }: FizoApplicationPageProps) {
  const { id } = await params;
  return <FizoApplicationDetailsPage id={id} />;
}
