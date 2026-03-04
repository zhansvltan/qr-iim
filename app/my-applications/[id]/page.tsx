import { MyApplicationDetailsPage } from "@/src/components/my-applications/MyApplicationDetailsPage";

type MyApplicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MyApplicationPage({ params }: MyApplicationPageProps) {
  const { id } = await params;
  return <MyApplicationDetailsPage id={id} />;
}
