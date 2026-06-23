import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export function useAppColors() {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
}
