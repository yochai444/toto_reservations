import { PageTitle } from "@/components/admin/admin-styles";
import { PasswordForm } from "@/components/admin/password-form";
import { Muted } from "@/components/ui/primitives";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AccountPage() {
  const { user } = await requireAdmin();
  return (
    <>
      <PageTitle sx={{ mb: 0.5 }}>החשבון שלי</PageTitle>
      <Muted dir="ltr" sx={{ mb: 2.5 }} style={{ textAlign: "right" }}>
        {user.email}
      </Muted>
      <PasswordForm />
    </>
  );
}
