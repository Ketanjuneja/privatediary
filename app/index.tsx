import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/providers/ThemeProvider';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('ModeSelector');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const LogoComponent = () => (
    <Svg width={120} height={120} viewBox="0 0 100 100">
      {/* Outer circle */}
      <Circle
        cx="50"
        cy="50"
        r="48"
        fill={theme.colors.primary}
      />
      
      {/* Book/document shape */}
      <Rect
        x="20"
        y="25"
        width="60"
        height="50"
        rx="8"
        ry="8"
        fill={theme.colors.surface}
      />
      
      {/* Book spine */}
      <Rect
        x="47"
        y="25"
        width="6"
        height="50"
        fill={theme.colors.border}
        opacity={0.3}
      />
      
      {/* Text lines */}
      <Rect x="28" y="35" width="15" height="2" fill={theme.colors.primary} />
      <Rect x="28" y="40" width="15" height="2" fill={theme.colors.primary} />
      <Rect x="28" y="58" width="15" height="2" fill={theme.colors.primary} />
      <Rect x="28" y="63" width="15" height="2" fill={theme.colors.primary} />
      
      <Rect x="57" y="35" width="15" height="2" fill={theme.colors.primary} />
      <Rect x="57" y="40" width="10" height="2" fill={theme.colors.primary} />
      <Rect x="57" y="58" width="15" height="2" fill={theme.colors.primary} />
      <Rect x="57" y="63" width="12" height="2" fill={theme.colors.primary} />
      
      {/* Lock icon */}
      <Circle
        cx="50"
        cy="45"
        r="6"
        fill="none"
        stroke={theme.colors.primary}
        strokeWidth="2"
      />
      <Rect
        x="46"
        y="48"
        width="8"
        height="6"
        rx="1"
        fill={theme.colors.primary}
      />
      <Circle
        cx="50"
        cy="51"
        r="1"
        fill={theme.colors.surface}
      />
    </Svg>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `${theme.colors.primary}15`,
    },
    pulseCircle: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: `${theme.colors.primary}10`,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.gradient} />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.pulseCircle} />
        <LogoComponent />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;