import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="placeholder-page">
        <p style={{ color: "var(--accent-red)", fontWeight: 500 }}>Not authorized</p>
        <p>
          {user.email} is signed in but isn&apos;t on the admin allowlist for
          this dashboard.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
