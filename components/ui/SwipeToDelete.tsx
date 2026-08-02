import React, { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, PanResponder, StyleSheet, TouchableOpacity, View } from "react-native";

import { Palette } from "@/constants/theme";

import { ThemedText } from "../themed-text";

const DELETE_BUTTON_WIDTH = 80;

export type SwipeToDeleteRef = {
  close: () => void;
};

type SwipeToDeleteItem = {
  id: string;
};

type SwipeToDeleteProps<TItem extends SwipeToDeleteItem> = {
  item: TItem;
  handleSwipeOpen: (value: string) => void;
  handleDelete: (value: string) => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  children: ReactNode;
};

const SwipeToDelete = forwardRef<SwipeToDeleteRef, SwipeToDeleteProps<SwipeToDeleteItem>>(
  ({ item, handleSwipeOpen, handleDelete, onSwipeStart, onSwipeEnd, children }, ref) => {
    const { t } = useTranslation();

    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    const close = () => {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => onSwipeEnd?.());
      isOpen.current = false;
    };

    const open = () => {
      Animated.spring(translateX, {
        toValue: -DELETE_BUTTON_WIDTH,
        useNativeDriver: true,
      }).start();
      isOpen.current = true;
      handleSwipeOpen(item.id);
      onSwipeEnd?.();
    };

    useImperativeHandle(ref, () => ({
      close,
    }));

    const shouldSetPanResponder = (dx: number, dy: number) => {
      const shouldSet = Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 10;

      if (shouldSet) {
        onSwipeStart?.();
      }

      return shouldSet;
    };

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return shouldSetPanResponder(dx, dy);
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return shouldSetPanResponder(dx, dy);
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderTerminate: () => {
          onSwipeEnd?.();
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx < 0) {
            translateX.setValue(Math.max(gestureState.dx, -DELETE_BUTTON_WIDTH));
          } else if (isOpen.current) {
            translateX.setValue(Math.min(-DELETE_BUTTON_WIDTH + gestureState.dx, 0));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -40) {
            open();
          } else {
            close();
          }
        },
      }),
    ).current;

    return (
      <View style={[styles.listItemContainer, { backgroundColor: Palette.logoDotRed }]}>
        <View style={[styles.deleteWrapper, { width: DELETE_BUTTON_WIDTH }]}>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.rightActions}>
            <ThemedText style={[styles.text, { color: Palette.white }]}>
              {t("common.remove")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
          {children}
        </Animated.View>
      </View>
    );
  },
);

SwipeToDelete.displayName = "SwipeToDelete";

export default SwipeToDelete;

const styles = StyleSheet.create({
  rightActions: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 14,
  },
  listItemContainer: {
    width: "100%",
    padding: 0,
    borderRadius: 12,
  },
  deleteWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
