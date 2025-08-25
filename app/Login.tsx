import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { login } from "../src/services/auth";
import useAuthStore from "../src/stores/authStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      setUser({ username });
      router.push("/home");
    } else {
      alert("Credenciais inválidas");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SzaboFlix</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#fff"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#fff"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={!username || !password}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 10,
    color: "#fff",
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
