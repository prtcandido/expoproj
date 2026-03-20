import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function Delete() {
  const params = useLocalSearchParams();
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
      <ThemedText>Excluir Produto - ID: {params.id}</ThemedText>
      <Pressable onPress={() => router.back()} style={styles.botaoVoltar}>
        <ThemedText>Voltar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  botaoVoltar: {
    color: "white",
    marginTop: 20,
    backgroundColor: "#9999FF",
    padding: 1,
    borderRadius: 5,
    width: 120,
  },
});
