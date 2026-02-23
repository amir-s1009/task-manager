import { loginAction } from "@/actions/auth/login.action";
import { signupAction } from "@/actions/auth/signup.action";
import AuthPageClient from "@/components/features/auth/authPage";

export default function AuthPage() {
  return <AuthPageClient onLogin={loginAction} onRegister={signupAction} />;
}
