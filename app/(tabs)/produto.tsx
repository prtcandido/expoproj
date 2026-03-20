import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";

export default function Produto() {
  // Listagem de produtos mockada - futuramente virá do backend via API
  const listaProduto = [
    { id: 1, nome: "Produto 1", preco: 10.99 },
    { id: 2, nome: "Produto 2", preco: 20.99 },
    { id: 3, nome: "Produto 3", preco: 30.99 },
  ];

  const router = useRouter(); // navegação entre telas usando expo-router
  return (
    <ThemedView style={{ flex: 1, marginTop: 20, alignItems: "center" }}>
      <ThemedText>Lista de Produtos</ThemedText>
      <Pressable
        onPress={() => router.push("/produto/create")} // navegacão para tela de criação de produto
        style={styles.botaoNovo}
      >
        <ThemedText>Novo Produto</ThemedText>
      </Pressable>
      <FlatList // lista de produtos usando FlatList para melhor performance em listas longas
        style={styles.lista}
        data={listaProduto}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.listaItems}>
            <ThemedText style={{ marginTop: 10, color: "#000" }}>
              {item.nome} - R$ {item.preco.toFixed(2)}
            </ThemedText>
            <Pressable
              onPress={() => router.push(`/produto/edit/${item.id}`)} // navegação para tela de edição de produto
              style={styles.botaoEditar}
            >
              <ThemedText>Editar</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push(`/produto/delete/${item.id}`)} // navegação para tela de exclusão de produto
              style={styles.botaoEditar}
            >
              <ThemedText>Excluir</ThemedText>
            </Pressable>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  botaoEditar: {
    color: "white",
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: "#9999FF",
    padding: 0,
    borderRadius: 5,
    width: 60,
  },
  botaoNovo: {
    color: "white",
    marginTop: 20,
    backgroundColor: "#9999FF",
    padding: 1,
    borderRadius: 5,
    width: 120,
  },
  lista: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  listaItems: {
    flexDirection: "row",
    borderRadius: 8,
    elevation: 2, // Shadow no Android
    shadowColor: "#000", // Shadow no iOS
    padding: 0,
  },
});
