import React, { useRef } from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

const Card = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const onPressDown = Animated.spring(scale, {
    toValue: 0.95,
    speed: 200,
    useNativeDriver: true,
  }).start;
  const onPressUp = Animated.spring(scale, {
    toValue: 1,
    speed: 200,
    useNativeDriver: true,
  }).start;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressDown();
      },
      onPanResponderMove: (_, { dx }) => {
        translateX.setValue(dx);
      },
      onPanResponderRelease: () => {
        onPressUp();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  return (
    <View style={tw`bg-blue-500 flex-1 justify-center items-center`}>
      <Animated.View
        style={[
          tw`flex justify-center items-center bg-white w-48 h-48 p-4 rounded-4 shadow-lg`,
          { transform: [{ scale }, { translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Ionicons name={"pizza"} style={tw`text-blue-800 text-8xl`} />
      </Animated.View>
    </View>
  );
};

export default Card;
