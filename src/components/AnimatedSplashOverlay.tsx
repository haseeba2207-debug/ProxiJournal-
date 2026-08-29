
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AnimatedSplashOverlay() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(1000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { opacity }]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          ProxiJournal
        </Text>

        <Text style={styles.subtitle}>
          Your personal journal
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4F46E5',
    zIndex: 999,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

