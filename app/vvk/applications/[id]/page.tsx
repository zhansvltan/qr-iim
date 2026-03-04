import { VvkApplicationDetailsPage } from "@/src/components/vvk/VvkApplicationDetailsPage";

type VvkApplicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VvkApplicationPage({ params }: VvkApplicationPageProps) {
  const { id } = await params;
  return <VvkApplicationDetailsPage id={id} />;
}
