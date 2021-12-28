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
      onPanResponderGrant: () => {
        // setOffset은 처음 위치를 결정함.
        position.setOffset({
          // position은 x,y 및 함수가 함께 있기 때문에 _value 속성으로 값을 불러온다.
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
        // setOffset 이후 offSet을 초기화하여, 다음 터치 시 이전값이 추가로 더해지지 않도록 한다.
        // 이렇게 하지 않으면 Offset값에 새로운 Offset이 이중으로 더해진다.
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
