import { StyleSheet } from "react-native";

import { Palette } from "@/constants/theme";
import { authTabBarHeight } from "@/lib/constants";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
    paddingBottom: authTabBarHeight / 2,
  },
  form: {
    alignSelf: "stretch",
    gap: 18,
  },
  modalContainer: {
    flex: 1,
    gap: 28,
  },
  modalHeader: {
    gap: 8,
  },
  modalTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  modalSubtitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  googleWrapper: {
    alignItems: "center",
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    shadowColor: Palette.darkGrey,
  },
  icon: {
    width: 25,
    height: 25,
  },

  iconWrapper: {
    borderRadius: 50,
    padding: 22,
    backgroundColor: Palette.lightGrey,
  },
  headerIcon: {
    width: 50,
    height: 50,
  },
  textWrapper: {
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.darkGrey,
  },
  formContainer: {
    flex: 1,
    gap: 24,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: 500,
  },
});
