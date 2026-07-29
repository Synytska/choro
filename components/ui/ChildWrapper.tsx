import { ReactNode } from "react";
import { StatusBar, StyleProp, ViewStyle } from "react-native";

import GridOverlay from "@/components/ui/GridOverlay";
import PageView from "@/components/ui/PageView";
import { fullScreenWidth, role } from "@/lib/constants";
import { FooterButton } from "@/lib/types";

export default function ChildWrapper({
  children,
  withStars = false,
  withConfetti = false,
  buttons,
  style,
}: {
  children: ReactNode;
  withStars?: boolean;
  buttons?: FooterButton[];
  withConfetti?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <PageView screen={role.kid} buttons={buttons} containerStyle={style}>
      <StatusBar barStyle="light-content" />
      <GridOverlay width={fullScreenWidth} withStars={withStars} withConfetti={withConfetti} />
      {children}
    </PageView>
  );
}
