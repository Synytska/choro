import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FlatListProps = {
  data: ArrayLike<any>;
  keyExtractor: (item?: any, index?: number) => string;
  renderItem: ListRenderItem<any>;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  withBottomPadding?: boolean;
  horizontal?: boolean;
  keyboardShouldPersistTaps?: "handled" | "always" | "never";
  scrollEnabled?: boolean;
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function CustomFlatList({
  data,
  keyExtractor,
  renderItem,
  style,
  contentContainerStyle,
  withBottomPadding = false,
  horizontal = false,
  keyboardShouldPersistTaps,
  scrollEnabled,
  onScrollBeginDrag,
  refreshing = false,
  onRefresh,
}: FlatListProps) {
  const bottomInsets = useSafeAreaInsets().bottom;

  const styles = StyleSheet.create({
    bottomPadding: {
      paddingBottom: bottomInsets,
    },
  });

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      style={style}
      contentContainerStyle={[contentContainerStyle, withBottomPadding && styles.bottomPadding]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={horizontal}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollEnabled={scrollEnabled}
      onScrollBeginDrag={onScrollBeginDrag}
      refreshControl={
        onRefresh && !horizontal ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
}
