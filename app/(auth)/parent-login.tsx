import Logo from "@/assets/svg-icons/Logo";
import PageView from "@/components/ui/PageView";
import ParentLoginUI from "@/features/auth/components/parent/ParentLoginUI";

export default function ParentLogin() {
  return (
    <PageView>
      <Logo />
      <ParentLoginUI />
    </PageView>
  );
}
