// layouts/_layout.jsx
import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useContext } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { UsernameContext, UsernameProvider } from "../components/usernameContext";

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const { username } = useContext(UsernameContext);

  useEffect(() => {
    console.log("Current Path", pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.infoContainer}>
        <View style={styles.infoDetailsContainer}>
          <Text style={styles.appTitle}>StoryPath</Text>
          {username ? (
            <Text style={styles.usernameText}>Welcome, {username}!</Text>
          ) : (
            <Text style={styles.usernameText}>Welcome!</Text>
          )}
        </View>
      </View>
      
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="home"
            size={size}
            color={pathname === "/" ? "#fff" : "#000"}
          />
        )}
        label={"Welcome"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/");
        }}
      />
      
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="user"
            size={size}
            color={pathname === "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/profile" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/profile");
        }}
      />
      
      <DrawerItem
        icon={({ color, size }) => (
          <Feather
            name="briefcase"
            size={size}
            color={pathname === "/projectList/projects" ? "#fff" : "#000"}
          />
        )}
        label={"Projects"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname === "/projectList/projects" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname === "/projectList/projects" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(tabs)/projectList/projects");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <UsernameProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen
          name="index"
          options={{ headerShown: true, headerTitle: "Welcome" }}
        />
        <Drawer.Screen
          name="profile"
          options={{ headerShown: true, headerTitle: "Profile" }}
        />
      </Drawer>
    </UsernameProvider>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  infoDetailsContainer: {
    marginLeft: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});