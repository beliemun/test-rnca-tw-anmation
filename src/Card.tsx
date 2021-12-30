import React, { FC, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const Card = () => {
  const [index, setIndex] = useState(0);
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
  const dismiss = (dx: number) =>
    Animated.spring(translateX, {
      toValue: dx * 3,
      useNativeDriver: true,
      // 애니메이션이 정해진 임계치에 다다르면 끝난 것으로 간주
      restSpeedThreshold: 100,
      restDisplacementThreshold: 100,
    }).start(onDismiss);
  const onDismiss = () => {
    setIndex((prev) => prev + 1);
    translateX.setValue(0);
    scale.setValue(1);
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressDown.start(),
      onPanResponderMove: (_, { dx }) => {
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -150) {
          dismiss(dx);
        } else if (dx > 150) {
          dismiss(dx);
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
        {/* second card */}
        <CardItem
          transform={[
            { scale: secondScale },
            { translateX: 0 },
            { rotateZ: "0deg" },
          ]}
        >
          <Ionicons
            // @ts-ignore
            name={icons[index + 1]}
            style={tw`text-blue-800 text-8xl`}
          />
        </CardItem>
        {/* front card */}
        <CardItem transform={[{ scale }, { translateX }, { rotateZ }]}>
          <Ionicons
            // @ts-ignore
            name={icons[index]}
            style={tw`text-blue-800 text-8xl`}
          />
        </CardItem>
      </View>
      <View style={tw`flex-row mt-10`}>
        <TouchableOpacity onPress={() => dismiss(-150)}>
          <Ionicons name="close-circle" color={"white"} size={40} />
        </TouchableOpacity>
        <View style={tw`m-2`} />
        <TouchableOpacity onPress={() => dismiss(150)}>
          <Ionicons name="checkmark-circle" color={"white"} size={40} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Card;
