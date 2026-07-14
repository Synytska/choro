import { Image } from "expo-image";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

import { useAppColors } from "@/hooks/use-app-colors";

import { ThemedView } from "../themed-view";
import { AppIcon, Icons } from "./AppIcon";

type ImagePickerProps = {
  uri: string | null;
  onPress: () => void;
  customText?: string;
  customTextStyle?: StyleProp<TextStyle>;
};

export function CustomImagePicker({ uri, onPress, customText, customTextStyle }: ImagePickerProps) {
  const colors = useAppColors();

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.imagePicker} hitSlop={10}>
      <ThemedView style={[styles.photo, { backgroundColor: colors.middleGrey }]}>
        {uri ? (
          <Image source={uri} contentFit="cover" style={styles.giftImage} />
        ) : (
          <Text style={[styles.giftEmoji, customTextStyle]}>{customText}</Text>
        )}
      </ThemedView>
      <View style={[styles.iconContainer, { backgroundColor: colors.white }]}>
        <View style={[styles.iconWrapper, { backgroundColor: colors.orange }]}>
          <AppIcon icon={uri ? Icons.pencil : Icons.camera} size={16} color={colors.white} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  giftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  imagePicker: {
    position: "relative",
    alignItems: "center",
    alignSelf: "center",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 50,
    padding: 2,
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 6,
  },
  giftEmoji: {
    fontSize: 48,
  },
});
