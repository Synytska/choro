import Logo from "@/assets/svg-icons/Logo";
import PageView from "@/components/ui/PageView";
import ParentSignUpUI from "@/features/auth/components/parent/ParentSignUpUI";

export default function ParentSignup() {
  return (
    <PageView>
      <Logo />
      <ParentSignUpUI />
    </PageView>
  );
}
