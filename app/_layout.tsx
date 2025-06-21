//import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  console.log('RootLayout rendered'); // Debugging log to check if the component is rendered
  if (!loaded) {
    console.log('Fonts not loaded yet'); // Debugging log to check if fonts are loading
    return null; // Prevent rendering until fonts are loaded
  }
  console.log('Fonts loaded successfully'); // Debugging log to confirm fonts are loaded
  console.log(`Current color scheme: ${colorScheme}`); // Debugging log to check the current color scheme
  return (
    <ThemeProvider>
      <Stack >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="not-found" options={{ headerShown: false }} />
          <Stack.Screen name="ModeSelector" options={{ headerShown: false }} />
          <Stack.Screen name="FreeTextMode" options={{headerShown: false}}/>
          <Stack.Screen name="QuestionAnswerMode" options={{headerShown: false}}/>
        </Stack>
      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}