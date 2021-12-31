import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";

const DragAndDrop = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleYes = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleNo = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });
  const onOpcityYes = position.y.interpolate({
    inputRange: [-250, -249],
    outputRange: [0.7, 1],
    extrapolate: "clamp",
  });
  const onOpcityNo = position.y.interpolate({
    inputRange: [240, 250],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });
  const onPressDown = Animated.spring(scale, {
    toValue: 0.9,
    speed: 200,
    useNativeDriver: true,
  });
  const onPressUp = Animated.spring(scale, {
    toValue: 1,
    speed: 200,
    useNativeDriver: true,
  });
  const goBackHomeSpring = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressDown.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
        console.log(dy);
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -250 || dy > 250) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressUp, goBackHomeSpring]).start();
        }
      },
    })
  ).current;
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    console.log("next");
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setIndex((prev) => prev + 1);
  };
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <Animated.View
          style={[
            tw`bg-green-500 rounded-full px-6 py-4`,
            {
              opacity: onOpcityYes,
              transform: [{ scale: scaleYes }],
            },
          ]}
        >
          <Text style={tw`text-white text-2xl`}>I now</Text>
        </Animated.View>
      </View>
      <View style={tw`flex-3 justify-center items-center z-10`}>
        <Animated.View
          style={[
            tw`rounded-full bg-white border-8 border-gray-200 p-4`,
            {
              opacity,
              transform: [...position.getTranslateTransform(), { scale }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Ionicons
            // @ts-ignore
            name={icons[index]}
            size={64}
            style={tw`text-gray-800`}
          />
        </Animated.View>
      </View>
      <View style={tw`flex-1 justify-center items-center rounded-xl`}>
        <Animated.View
          style={[
            tw`bg-red-500 rounded-full px-6 py-4`,
            { opacity: onOpcityNo, transform: [{ scale: scaleNo }] },
          ]}
        >
          <Text style={tw`text-white text-2xl`}>I don't know</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default DragAndDrop;
