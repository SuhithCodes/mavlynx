import * as React from "react";
import { View, Text } from "react-native";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { TextInput, Button, useTheme } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const theme = useTheme();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onSignUpWithGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("OAuth error:", err);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 20,
          maxWidth: 500,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={{ alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: "mon-b",
              color: theme.colors.primary,
              textAlign: "center",
            }}
          >
            Create Account
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Join MavLynxs today
          </Text>
        </View>

        {!pendingVerification ? (
          <View style={{ gap: 16 }}>
            <TextInput
              mode="outlined"
              label="Email"
              autoCapitalize="none"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={{ backgroundColor: theme.colors.background }}
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={{ backgroundColor: theme.colors.background }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: theme.colors.outline,
                }}
              />
              <Text
                style={{
                  marginHorizontal: 8,
                  color: theme.colors.onSurfaceVariant,
                }}
              >
                or
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: theme.colors.outline,
                }}
              />
            </View>

            <Button
              mode="outlined"
              onPress={onSignUpWithGoogle}
              style={{
                borderRadius: 8,
                paddingVertical: 8,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontSize: 16, fontFamily: "mon-sb" }}
              icon="google"
            >
              Continue with Google
            </Button>

            <Button
              mode="contained"
              onPress={onSignUpPress}
              style={{
                borderRadius: 8,
                paddingVertical: 8,
                marginTop: 8,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontSize: 16, fontFamily: "mon-sb" }}
            >
              Sign Up
            </Button>
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <TextInput
              mode="outlined"
              label="Verification Code"
              value={code}
              onChangeText={setCode}
              style={{ backgroundColor: theme.colors.background }}
            />
            <Button
              mode="contained"
              onPress={onPressVerify}
              style={{
                borderRadius: 8,
                paddingVertical: 8,
                marginTop: 8,
              }}
              contentStyle={{ height: 40 }}
              labelStyle={{ fontSize: 16, fontFamily: "mon-sb" }}
            >
              Verify Email
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
