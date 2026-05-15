import { ThemedView } from "@/components/themed-view";
import { router } from "expo-router";
import { Button, StyleSheet } from "react-native";

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <Button
        title="Acelerômetro"
        onPress={() => router.push("/sensor/acelerometro")}
      />
      <ThemedView style={styles.button}>
        <Button title="GPS" onPress={() => router.push("/gps/gps")} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    marginTop: 10,
  },
});
