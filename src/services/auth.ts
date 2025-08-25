import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export async function login(
  username: string,
  password: string
): Promise<boolean> {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    username + password
  );
  await AsyncStorage.setItem("token", hash);
  return true; // Simula sucesso (em produção, valide contra backend)
}

export async function logout() {
  await AsyncStorage.removeItem("token");
}
