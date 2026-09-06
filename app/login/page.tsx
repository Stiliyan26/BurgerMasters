import { Header } from "@/components/Header";
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

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center px-4 py-16">
        <LoginForm nextPath={nextPath} />
      </main>
    </>
  );
}
