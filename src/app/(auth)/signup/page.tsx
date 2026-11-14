import { AuthShell } from "@/features/auth/AuthShell";
import { SignupForm } from "@/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell mode="signup">
      <SignupForm />
    </AuthShell>
  );
}
