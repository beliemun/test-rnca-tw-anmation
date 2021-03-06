import React, { FC, useRef, useState } from "react";
import { Text, TouchableOpacity, Animated, View } from "react-native";
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
    <Text style={tw`text-white text-3xl`}>๐คฃ</Text>
  </AnimatedTouchable>
);

const AnimationTest = () => {
  useDeviceContext(tw); // ํฐ์ ๋คํฌ๋ชจ๋ ์ค์ ์ ๋ฐ๋ผ tailwind๊ฐ ์ ์ฉ๋  ์ ์๊ฒ ํ๋ค.
  const [pressed, setPressed] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 0, y: -200 })).current;
  const toggle = () => setPressed((prev) => !prev);
  const moveUp = () => {
    Animated.timing(position, {
      toValue: pressed ? { x: 0, y: -200 } : { x: 0, y: 200 },
      // friction: 10,
      // tension: 100,
      duration: 1000,
      // native driver๋ animation์ ํผํฌ๋จผ์ค ํฅ์์ ์ข์ง๋ง, ๋ช๊ฐ์ง ์์ฑ(์:backgroundColor)์ ๋ํด์๋ ์๋๋ฉ์ด์์ ํ  ์ ์๋ค.
      // false๋ก ํ  ๊ฒฝ์ฐ ํผํฌ๋จผ์ค๋ฅผ ํฌ๊ธฐํ๊ณ  ์๋๋ฉ์ด์์ ์ฌ์ฉํ  ์ ์๋ค.(๋น์ถ์ฒ)
      useNativeDriver: true,
    }).start(toggle);
  };
  // Animated์ ๊ด๋ จ๋ ๋ณ์๋ State์ ๋ถ๋ฆฌํ๋ค.
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
    <View style={tw`dark:bg-gray-800 flex-1 justify-center items-center`}>
      <Box
        onPress={moveUp}
        position={position}
        opacity={opacity}
        rotation={rotation}
        borderRadius={borderRadius}
      />
    </View>
  );
};

export default AnimationTest;
