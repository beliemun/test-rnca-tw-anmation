import React, { FC, useRef } from "react";
import {
  Animated,
  PanResponder,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

const Card = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotateZ = translateX.interpolate({
    inputRange: [-200, 200],
    outputRange: ["-20deg", "20deg"],
    extrapolate: "clamp", // outputRange를 벗어나지 않도록 해줌
  });
  const secondScale = translateX.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const onPressDown = Animated.spring(scale, {
    toValue: 0.95,
    speed: 200,
    useNativeDriver: true,
  });
  const onPressUp = Animated.spring(scale, {
    toValue: 1,
    speed: 200,
    useNativeDriver: true,
  });
  const goBack = Animated.spring(translateX, {
    toValue: 0,
    useNativeDriver: true,
  });
  const disappear = (dx: number) =>
    Animated.spring(translateX, {
      toValue: dx * 3,
      useNativeDriver: true,
    }).start();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressDown.start(),
      onPanResponderMove: (_, { dx }) => {
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -150) {
          disappear(dx);
        } else if (dx > 150) {
          disappear(dx);
        } else {
          Animated.parallel([onPressUp, goBack]).start();
        }
      },
    })
  ).current;
  interface ICardItemProps {
    transform?: [
      { scale: Animated.Value | Animated.AnimatedInterpolation },
      { translateX: Animated.Value | number },
      { rotateZ: Animated.AnimatedInterpolation | string }
    ];
  }
  const CardItem: FC<ICardItemProps> = ({ children, transform }) => (
    <Animated.View
      style={[
        tw`flex justify-center items-center bg-white w-48 h-48 p-4 rounded-4 shadow-lg absolute`,
        transform && { transform },
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
  return (
    <SafeAreaView style={tw`bg-blue-500 flex-1 justify-center items-center`}>
      <View style={tw`bg-red-500 flex-1 justify-center items-center`}>
        <CardItem
          transform={[
            { scale: secondScale },
            { translateX: 0 },
            { rotateZ: "0deg" },
          ]}
        >
          <Ionicons name={"beer"} style={tw`text-blue-800 text-8xl`} />
        </CardItem>
        <CardItem transform={[{ scale }, { translateX }, { rotateZ }]}>
          <Ionicons name={"pizza"} style={tw`text-blue-800 text-8xl`} />
        </CardItem>
      </View>
      <View style={tw`flex-row mt-10`}>
        <TouchableOpacity onPress={() => disappear(-150)}>
          <Ionicons name="close-circle" color={"white"} size={40} />
        </TouchableOpacity>
        <View style={tw`m-2`} />
        <TouchableOpacity onPress={() => disappear(150)}>
          <Ionicons name="checkmark-circle" color={"white"} size={40} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Card;
