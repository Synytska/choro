import Logo from "@/assets/svg-icons/Logo";
import { AppLayout } from "@/components/ui/AppLayout";
import ParentLoginUI from "@/features/auth/components/parent/ParentLoginUI";

export default function ParentLogin() {
  return (
    <AppLayout>
      <Logo />
      <ParentLoginUI />
    </AppLayout>
  );
}
