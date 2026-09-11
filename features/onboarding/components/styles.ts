import { StyleSheet } from "react-native";

import { Palette } from "@/constants/theme";

export const styles = StyleSheet.create({
  //Common styles
  content: {
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 29,
    textAlign: "center",
  },
  //Age styles
  buttonsWrapper: {
    gap: 32,
    alignSelf: "center",
  },
  ageText: {
    fontSize: 48,
    lineHeight: 48,
    fontWeight: 700,
  },
  titleGroup: {
    alignItems: "center",
    gap: 12,
  },

  //Name styles
  pickerWrapper: {
    gap: 32,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  //Gender styles
  genderOptions: {
    flexDirection: "row",
    gap: 16,
    borderColor: Palette.orange,
  },
  genderOption: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 28,
  },
  selectedGenderOption: {
    borderColor: Palette.orange,
    backgroundColor: Palette.orange,
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectedGenderOptionText: {
    color: Palette.white,
  },

  //   Interests styles
  interestsContent: {
    flex: 1,
    minHeight: 0,
    paddingTop: 40,
  },
  taskList: {
    flex: 1,
    minHeight: 0,
  },

  //Prize styles
  prizeContent: {
    paddingTop: 40,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
  },
  estimate: {
    alignSelf: "center",
    fontSize: 14,
    lineHeight: 21,
  },
  imagePicker: {
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
  },
  giftIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  giftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  giftEmoji: {
    fontSize: 48,
  },
  imagePickerText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 16,
  },

  //Success styles
  successContent: {
    alignItems: "center",
    paddingTop: 40,
    flex: 1,
  },
  codeSection: {
    width: "100%",
    gap: 12,
  },
  codeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  checkIcon: {
    width: 140,
    height: 140,
  },
});
