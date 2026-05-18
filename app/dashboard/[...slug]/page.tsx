import { redirect } from "next/navigation";

export default function DashboardRedirect({
  params,
}: {
  params: { slug: string[] };
}) {
  const newPath = `/${params.slug.join("/")}`;
  redirect(newPath);
}
