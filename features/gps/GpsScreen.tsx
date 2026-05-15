// ATENÇÃO: Necessário instalar expo-location: npx expo install expo-location

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet } from "react-native";

// Definição de interface para tipagem (TypeScript)
interface LocationState {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
}

export default function GpsScreen() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Função principal para capturar a localização atual
  const getDeviceLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Verifica se o serviço de localização do dispositivo está ligado
      const hasServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!hasServicesEnabled) {
        setErrorMsg(
          "O serviço de localização (GPS) está desativado no dispositivo.",
        );
        setLoading(false);
        Alert.alert(
          "GPS Desativado",
          "Por favor, ative o GPS do seu aparelho.",
        );
        return;
      }

      // 2. Solicita permissão de acesso à localização (Foreground)
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permissão de acesso à localização negada.");
        setLoading(false);
        return;
      }

      // 3. Obtém a posição atual com alta precisão
      // Usamos getLastKnownPositionAsync primeiro como fallback rápido, ou vamos direto para o getCurrentPositionAsync
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Balanced balanceia precisão e consumo de bateria. Use 'Highest' se precisar de precisão milimétrica.
      });

      setLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        altitude: currentPosition.coords.altitude,
        accuracy: currentPosition.coords.accuracy,
      });
    } catch (error) {
      setErrorMsg("Erro ao tentar obter a localização.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Opcional: Buscar automaticamente ao carregar a tela
  useEffect(() => {
    getDeviceLocation();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Captura de GPS</ThemedText>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spacer} />
      )}

      {errorMsg && <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>}

      {location && !loading && (
        <ThemedView style={styles.card}>
          <ThemedText style={styles.label}>
            Latitude:{" "}
            <ThemedText style={styles.value}>{location.latitude}</ThemedText>
          </ThemedText>
          <ThemedText style={styles.label}>
            Longitude:{" "}
            <ThemedText style={styles.value}>{location.longitude}</ThemedText>
          </ThemedText>
          {location.accuracy && (
            <ThemedText style={styles.label}>
              Precisão:{" "}
              <ThemedText style={styles.value}>
                {location.accuracy.toFixed(1)} metros
              </ThemedText>
            </ThemedText>
          )}
        </ThemedView>
      )}

      <ThemedView style={styles.buttonContainer}>
        <Button
          title="Atualizar Coordenadas"
          onPress={getDeviceLocation}
          disabled={loading}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  value: {
    fontWeight: "normal",
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  spacer: {
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    backgroundColor: "#007AFF",
  },
});
