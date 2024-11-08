import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router} from "expo-router";

export default function Index() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to StoryPath</Text>
      <Text style={styles.subtitle}>Explore Unlimited Location-based Experiences</Text>
      <Text style={styles.description}>
        With StoryPath, you can discover and create amazing location-based
        adventures. From city tours to treasure hunts, the possibilities are
        endless!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/profile");
        }}
      >
        <Text style={styles.buttonText}>Create Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/(tabs)/projectList/projects");
        }}
      >
        <Text style={styles.buttonText}>Explore Projects</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#777",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    paddingHorizontal: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#F76C6A", 
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});