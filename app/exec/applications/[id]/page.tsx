import { ExecApplicationDetailsPage } from "@/src/components/exec/ExecApplicationDetailsPage";

type ExecApplicationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExecApplicationPage({ params }: ExecApplicationPageProps) {
  const { id } = await params;
  return <ExecApplicationDetailsPage id={id} />;
}
