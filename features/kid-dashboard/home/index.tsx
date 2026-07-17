import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { fullScreenWidth, role } from "@/lib/constants";

export default function ChildrenDashboardUI() {
  return (
    <PageView screen={role.kid}>
      <GridOverlay width={fullScreenWidth} />
    </PageView>
  );
}
