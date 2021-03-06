import React, { FC, useRef } from "react";
import {
  Text,
  Animated,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  View,
} from "react-native";
import tw, { useDeviceContext } from "twrnc";

// const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
interface IBoxProps {
  position: Animated.ValueXY;
  borderRadius: Animated.AnimatedInterpolation;
  panResponder: PanResponderInstance;
}
const Box: FC<IBoxProps> = ({ position, borderRadius, panResponder }) => (
  <Animated.View
    style={[
      tw`bg-red-400 justify-center items-center p-5`,
      {
        transform: position.getTranslateTransform(),
        borderRadius,
      },
    ]}
    {...panResponder.panHandlers}
  >
    <Text style={tw`text-white text-3xl`}>๐คฃ</Text>
  </Animated.View>
);
const DragTest = () => {
  useDeviceContext(tw);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const borderRadius = position.y.interpolate({
    inputRange: [-100, 100],
    outputRange: [0, 100],
  });
  const panResponder = useRef(
    PanResponder.create({
      // ์ฌ์ฉ์๊ฐ view์ interectํ  ์ ์๋๋ก ๊ฐ์ง๋ฅผ ํ์ฉ
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // setOffset์ ์ฒ์ ์์น๋ฅผ ๊ฒฐ์ ํจ.
        position.setOffset({
          // position์ x,y ๋ฐ ํจ์๊ฐ ํจ๊ป ์๊ธฐ ๋๋ฌธ์ _value ์์ฑ์ผ๋ก ๊ฐ์ ๋ถ๋ฌ์จ๋ค.
          // @ts-ignore
          x: position.x._value,
          // @ts-ignore
          y: position.y._value,
        });
      },
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        // setOffset ์ดํ offSet์ ์ด๊ธฐํํ์ฌ, ๋ค์ ํฐ์น ์ ์ด์ ๊ฐ์ด ์ถ๊ฐ๋ก ๋ํด์ง์ง ์๋๋ก ํ๋ค.
        // ์ด๋ ๊ฒ ํ์ง ์์ผ๋ฉด Offset๊ฐ์ ์๋ก์ด Offset์ด ์ด์ค์ผ๋ก ๋ํด์ง๋ค.
        position.flattenOffset();
        // Animated.spring(position, {
        //   toValue: {
        //     x: 0,
        //     y: 0,
        //   },
        //   useNativeDriver: true,
        // }).start();
      },
    })
  ).current;
  return (
    <View style={tw`dark:bg-gray-800 flex-1 justify-center items-center`}>
      <Box
        position={position}
        borderRadius={borderRadius}
        panResponder={panResponder}
      />
    </View>
  );
};

export default DragTest;
