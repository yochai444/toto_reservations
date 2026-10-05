import { PasswordForm } from "@/components/admin/password-form";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AccountPage() {
  const { user } = await requireAdmin();
  return (
    <>
      <h1 className="mb-1 text-3xl">החשבון שלי</h1>
      <p className="mb-5 text-muted" dir="ltr" style={{ textAlign: "right" }}>
        {user.email}
      </p>
      <PasswordForm />
    </>
  );
}
