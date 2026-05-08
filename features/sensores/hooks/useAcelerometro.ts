// ATENÇÃO: Instalar o pacote expo-sensors para acessar os sensores do dispositivo, incluindo o acelerômetro
// usar: npx expo install expo-sensors
import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";

// updateInterval é o intervalo em milissegundos para atualização dos dados do acelerômetro
// Subscription é armazenada em um ref para evitar re-renderizações desnecessárias
// isListening é um estado booleano para indicar se o acelerômetro está ativo ou não
export const useAcelerometro = (updateInterval = 100) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const subscription = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  // Desativa o acelerômetro e limpa a subscrição
  // Com useCallback, a função unsubscribe é memoizada e não será recriada a cada renderização,
  //   evitando problemas de dependências em useEffect
  const unsubscribe = useCallback(() => {
    if (subscription.current) {
      // verifica se está ligado o acelerômetro antes de tentar desligar
      subscription.current.remove();
      subscription.current = null;
      setIsListening(false);
    }
  }, []);

  // Ativa o acelerômetro e atualiza os dados a cada intervalo definido
  // Com useCallback, a função subscribe é memoizada e só será recriada quando updateInterval ou unsubscribe mudarem,
  //   garantindo que a lógica de subscrição seja consistente e evitando loops infinitos em useEffect
  const subscribe = useCallback(() => {
    // Garante que não existam duas subscrições abertas
    unsubscribe();

    Accelerometer.setUpdateInterval(updateInterval);
    subscription.current = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });
    setIsListening(true);
  }, [updateInterval, unsubscribe]);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return {
    data,
    isListening,
    methods: { subscribe, unsubscribe },
  };
};
