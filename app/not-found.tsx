import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function BecauseScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Because!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This Because screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to because home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
