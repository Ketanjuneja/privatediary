import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function abc() {
  console.log('Abc component rendered'); // Debugging log to check if the component is rendered
  return  (
    <ThemedView> 
        <ThemedText>ABC</ThemedText>
    </ThemedView>
  ); // This component does not render anything
}