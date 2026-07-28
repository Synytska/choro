import { ReactNode } from "react";
import { StatusBar } from "react-native";

import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { fullScreenWidth, role } from "@/lib/constants";
import { FooterButton } from "@/lib/types";

export default function ChildWrapper({
  children,
  withStars = false,
  buttons,
}: {
  children: ReactNode;
  withStars?: boolean;
  buttons?: FooterButton[];
}) {
  return (
    <PageView screen={role.kid} buttons={buttons}>
      <StatusBar barStyle="light-content" />
      {children}
      <GridOverlay width={fullScreenWidth} withStars={withStars} />
    </PageView>
  );
}
