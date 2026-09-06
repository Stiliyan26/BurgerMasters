import { LoginForm } from "@/components/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin";

  if (session) {
    redirect(nextPath);
  }

  return <LoginForm nextPath={nextPath} />;
}
