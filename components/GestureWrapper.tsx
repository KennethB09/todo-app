import Animated, { runOnJS, withTiming } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type GestureWrapperProps = {
  children: React.ReactNode;
  onGesureEnd: () => void;
  iconSize?: number;
};

export default function GestureWrapper({
  children,
  onGesureEnd,
  iconSize = 25
}: GestureWrapperProps) {
  const translateX = useSharedValue(0);
  const translateXValid = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = 0;
        translateXValid.value = 0;
      } else {
        translateX.value = event.translationX;
        translateXValid.value = event.translationX;
      }
    })
    .onEnd(() => {
      translateX.value = withTiming(0, undefined, (isFinished) => {
        if (isFinished && translateXValid.value <= -80) {
          runOnJS(onGesureEnd)();
          translateXValid.value = 0;
        }
        translateXValid.value = 0;
      });
    })
    .activateAfterLongPress(150);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconContainerOpacity = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < -80 ? 1 : 0);
    return { opacity };
  });

  return (
    <>
      <Animated.View style={[styles.animatedView, iconContainerOpacity]}>
        <Ionicons name="trash-outline" color={"red"} size={iconSize} />
      </Animated.View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    width: "auto",
    height: "100%",
    right: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
