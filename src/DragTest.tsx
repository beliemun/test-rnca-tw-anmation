import React, { FC, useRef } from "react";
import {
  Text,
  SafeAreaView,
  Animated,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
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
    <Text style={tw`text-white text-3xl`}>🤣</Text>
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
      // 사용자가 view와 interect할 수 있도록 감지를 허용
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        Animated.spring(position, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  return (
    <SafeAreaView
      style={tw`dark:bg-gray-800 flex-1 justify-center items-center`}
    >
      <Box
        position={position}
        borderRadius={borderRadius}
        panResponder={panResponder}
      />
    </SafeAreaView>
  );
};

export default DragTest;
