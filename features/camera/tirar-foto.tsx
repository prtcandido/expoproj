// ATENÇÃO: NECESSÁRIO INSTALAR O EXPO CAMERA PARA FUNCIONAR ESTE COMPONENTE. O COMANDO É: npx expo install expo-camera

import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Importe o tipo correto para a referência do componente CameraView
type CameraViewRef = React.ComponentRef<typeof CameraView>;

interface ChildProps {
  setURI: (arquivo: string) => void;
  setBase64: (base64: string) => void;
}

const TirarFoto: React.FC<ChildProps> = ({ setURI, setBase64 }) => {
  const [permission, requestPermission] = useCameraPermissions();

  // Referência para o componente CameraView
  const cameraRef = useRef<CameraViewRef>(null);

  async function tirarFoto() {
    if (cameraRef.current) {
      try {
        const options: CameraPictureOptions = {
          quality: 0, // Qualidade da imagem - Compressão máxima
          base64: true, // Gerar foto convertida para string base64
        };

        // Chamada do método nativo de captura
        const photo: CameraCapturedPicture =
          await cameraRef.current.takePictureAsync(options);

        // Armazena o URI da foto
        setURI(photo.uri);
        // Armazena base64 da foto
        if (photo.base64) {
          setBase64(photo.base64);
        } else {
          setBase64("Não gerado");
        }

        // Mostra um alerta simples com o URI (para debug)
        Alert.alert("Foto Capturada!", photo.uri);
      } catch {
        Alert.alert("Erro", "Não foi possível tirar a foto.");
      }
    } else {
      Alert.alert("Erro", "Câmera não está pronta.");
    }
  }

  if (!permission) {
    return (
      <ThemedView style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.textLoading}>
          Sincronizando câmera...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.containerCenter}>
        {/* Ícone visual ajuda na identificação rápida do erro */}
        <MaterialIcons name="camera-alt" size={64} color="#ccc" />

        <ThemedText style={styles.titlePermission}>
          Câmera Desabilitada
        </ThemedText>

        <ThemedText style={styles.descriptionPermission}>
          Para capturar fotos dos produtos e enviar para a API, precisamos de
          acesso à sua câmera.
        </ThemedText>

        <ThemedView style={styles.buttonGroup}>
          <Button
            onPress={requestPermission}
            title="Tentar Novamente"
            disabled={!permission.canAskAgain} // Bloqueia se o sistema não permitir mais o pop-up
          />

          {!permission.canAskAgain && (
            <TouchableOpacity
              onPress={() => Linking.openSettings()}
              style={styles.linkButton}
            >
              <ThemedText style={styles.linkText}>
                Habilitar nas Configurações
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <ThemedView style={{ minHeight: "50%" }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back" // ou "front" para a câmera frontal
          ref={cameraRef}
        ></CameraView>
        <Button onPress={tirarFoto} title="Tirar Foto" color="#007AFF" />
      </ThemedView>
    </ThemedView>
  );
};

export default TirarFoto;

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  titlePermission: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionPermission: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  textLoading: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  buttonGroup: {
    width: "100%",
    gap: 15, // Espaçamento moderno entre elementos (SDK 50+)
  },
  linkButton: {
    padding: 10,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
