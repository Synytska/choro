import { View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppIcon, Icons } from "@/components/ui/AppIcon";
import { Palette } from "@/constants/theme";

import { styles } from "./styles";

export function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <ThemedView style={styles.iconWrapper}>
        <AppIcon icon={Icons.user} size={30} color={Palette.darkNavy} />
      </ThemedView>
      <View style={styles.textWrapper}>
        <ThemedText style={styles.header}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      </View>
    </>
  );
}
