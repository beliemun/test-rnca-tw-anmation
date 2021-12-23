import React, { FC, useRef, useState } from "react";
import { Text, SafeAreaView, TouchableOpacity, Animated } from "react-native";
import tw, { useDeviceContext } from "twrnc";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
interface IBoxProps {
  onPress: () => void;
  position: Animated.ValueXY;
  opacity: Animated.AnimatedInterpolation;
  rotation: Animated.AnimatedInterpolation;
  borderRadius: Animated.AnimatedInterpolation;
}
const Box: FC<IBoxProps> = ({
  onPress,
  position,
  opacity,
  rotation,
  borderRadius,
}) => (
  <AnimatedTouchable
    style={[
      tw`bg-red-400 justify-center items-center p-5`,
      {
        transform: [{ rotateY: rotation }, ...position.getTranslateTransform()],
        opacity,
        borderRadius,
      },
    ]}
    onPress={onPress}
  >
    <Text style={tw`text-white text-3xl`}>🤣</Text>
  </AnimatedTouchable>
);

const AnimationTest = () => {
  useDeviceContext(tw); // 폰의 다크모드 설정에 따라 tailwind가 적용될 수 있게 한다.
  const [pressed, setPressed] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 0, y: -200 })).current;
  const toggle = () => setPressed((prev) => !prev);
  const moveUp = () => {
    Animated.timing(position, {
      toValue: pressed ? { x: 0, y: -200 } : { x: 0, y: 200 },
      // friction: 10,
      // tension: 100,
      duration: 1000,
      // native driver는 animation의 퍼포먼스 향상에 좋지만, 몇가지 속성(예:backgroundColor)에 대해서는 에니메이션을 할 수 없다.
      // false로 할 경우 퍼포먼스를 포기하고 에니메이션을 사용할 수 있다.(비추천)
      useNativeDriver: true,
    }).start(toggle);
  };
  // Animated와 관련된 변수는 State와 분리한다.
  const opacity = position.y.interpolate({
    inputRange: [-200, -100, 100, 200],
    outputRange: [1, 0.2, 0.2, 1],
  });
  const rotation = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["0deg", "360deg"],
  });
  const borderRadius = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [0, 200],
  });
  position.addListener(() => console.log(position.getTranslateTransform()));
  // y.addListener(() => console.log("Animated State:", y));
  // console.log("Component State:", y);

  return (
    <SafeAreaView
      style={tw`dark:bg-gray-800 flex-1 justify-center items-center`}
    >
      <Box
        onPress={moveUp}
        position={position}
        opacity={opacity}
        rotation={rotation}
        borderRadius={borderRadius}
      />
    </SafeAreaView>
  );
};

export default AnimationTest;
