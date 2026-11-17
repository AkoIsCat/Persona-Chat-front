import { AuthShell } from "@/features/auth/AuthShell";
import { PasswordResetForm } from "@/features/auth/PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <AuthShell mode="reset">
      <PasswordResetForm />
    </AuthShell>
  );
}
