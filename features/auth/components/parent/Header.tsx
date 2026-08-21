import { View } from "react-native";

import ParentIcon from "@/assets/svg-icons/ParentIcon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Palette } from "@/constants/theme";

import { styles } from "./styles";

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <ThemedView style={styles.iconWrapper}>
        <ParentIcon color={Palette.black} style={styles.icon} />
      </ThemedView>
      <View style={styles.textWrapper}>
        <ThemedText style={styles.header}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>
    </>
  );
}
