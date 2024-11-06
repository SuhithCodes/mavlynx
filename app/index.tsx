import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useTheme } from "react-native-paper";
import { FIRESTORE_DB } from "@/utils/FirebaseConfig"; // Adjust the import based on your Firebase setup
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import React from "react";

export default function Page() {
  const { user } = useUser();
  const theme = useTheme();

  // Function to save user data to Firestore
  const saveUserData = async () => {
    if (user) {
      const userData = {
        email: user?.emailAddresses[0]?.emailAddress || "",
        firstName: user?.firstName || "", // Add firstName with optional chaining and default value
        lastName: user?.lastName || "", // Add lastName with optional chaining and default value
        userId: user?.id || "",
      };

      try {
        await setDoc(doc(FIRESTORE_DB, "users", user.id), userData); // Save data with user ID as document ID
        console.log("User data saved successfully!");
      } catch (error) {
        console.error("Error saving user data: ", error);
      }
    }
  };

  // Call saveUserData when the user is signed in
  React.useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SignedIn>
        <Redirect href="/(tabs)/home" />
      </SignedIn>

      <SignedOut>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 40,
          }}
        >
          {/* Welcome Section */}
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "mon-b",
                color: theme.colors.primary,
                textAlign: "center",
              }}
            >
              Welcome to MavLynx
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: "center",
                color: theme.colors.onSurfaceVariant,
                marginTop: 8,
              }}
            >
              Your all-in-one student companion for UTA, Now lets get you
              started
            </Text>
          </View>

          {/* Auth Buttons */}
          <View style={{ width: "100%", gap: 16 }}>
            <Button
              mode="contained"
              onPress={() => {}}
              style={{
                borderRadius: 8,
                paddingVertical: 8,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontSize: 16, fontFamily: "mon-sb" }}
            >
              <Link href="/sign-in" asChild>
                <Text style={{ color: "white", fontSize: 16 }}>Sign In</Text>
              </Link>
            </Button>

            <Button
              mode="outlined"
              onPress={() => {}}
              style={{
                borderRadius: 8,
                paddingVertical: 8,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontSize: 16, fontFamily: "mon-sb" }}
            >
              <Link href="/sign-up" asChild>
                <Text style={{ fontSize: 16 }}>Create Account</Text>
              </Link>
            </Button>
          </View>
        </View>
      </SignedOut>
    </View>
  );
}
