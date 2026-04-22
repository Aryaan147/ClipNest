import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export default function Toast({ message, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.delay(1600),
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, message]);

  return (
    <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    backgroundColor: '#1e1e20',
    borderWidth: 1,
    borderColor: '#303033',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  text: {
    color: Colors.text,
    fontFamily: Fonts.mono,
    fontSize: 13,
  },
});
