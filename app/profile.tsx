import { View, ScrollView } from "react-native";
import React from "react";
import {
  Avatar,
  Card,
  Title,
  Text,
  Button,
  useTheme,
  List,
} from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import {
  Mail,
  Phone,
  School,
  Building2,
  BookOpen,
  GraduationCap,
  Calendar,
  UserCog,
  Lock,
  Bell,
  ChevronRight,
} from "lucide-react-native";

const ProfileScreen = () => {
  const theme = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header Section */}
      <View
        style={{
          alignItems: "center",
          padding: 20,
          paddingTop: 60,
          backgroundColor: theme.colors.primaryContainer,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <Avatar.Image
          size={120}
          source={{ uri: user.imageUrl || "https://placekitten.com/200/200" }}
          style={{ marginBottom: 16 }}
        />
        <Title style={{ fontFamily: "mon-b", fontSize: 24 }}>
          {user.firstName} {user.lastName}
        </Title>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          {user.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Profile Information */}
      <Card style={{ margin: 16, borderRadius: 16 }}>
        <Card.Content>
          <List.Section>
            <List.Subheader style={{ fontSize: 18 }}>
              Personal Information
            </List.Subheader>

            <List.Item
              title="Email"
              description={user.primaryEmailAddress?.emailAddress}
              left={(props) => (
                <Mail
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="Phone"
              description={
                user.phoneNumbers?.[0]?.phoneNumber || "Not provided"
              }
              left={(props) => (
                <Phone
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="University"
              description="University of Texas at Arlington"
              left={(props) => (
                <School
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="College"
              description="College of Engineering"
              left={(props) => (
                <Building2
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="Degree Plan"
              description="MSCS"
              left={(props) => (
                <BookOpen
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="Enrollment Type"
              description="Grad Student"
              left={(props) => (
                <GraduationCap
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />

            <List.Item
              title="Expected Graduation"
              description="2025"
              left={(props) => (
                <Calendar
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
            />
          </List.Section>
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={{ margin: 16, borderRadius: 16 }}>
        <Card.Content>
          <List.Section>
            <List.Subheader style={{ fontSize: 18 }}>
              Account Settings
            </List.Subheader>

            <List.Item
              title="Edit Profile"
              left={(props) => (
                <UserCog
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
              right={(props) => (
                <ChevronRight size={24} color={theme.colors.onSurface} />
              )}
              onPress={() => {
                /* Handle edit profile */
              }}
            />

            <List.Item
              title="Change Password"
              left={(props) => (
                <Lock
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
              right={(props) => (
                <ChevronRight size={24} color={theme.colors.onSurface} />
              )}
              onPress={() => {
                /* Handle password change */
              }}
            />

            <List.Item
              title="Notifications"
              left={(props) => (
                <Bell
                  size={24}
                  style={{ marginLeft: 8 }}
                  color={theme.colors.onSurface}
                />
              )}
              right={(props) => (
                <ChevronRight size={24} color={theme.colors.onSurface} />
              )}
              onPress={() => {
                /* Handle notifications settings */
              }}
            />
          </List.Section>
        </Card.Content>
      </Card>

      {/* Sign Out Button */}
      <View style={{ padding: 16 }}>
        <Button
          mode="outlined"
          onPress={() => signOut()}
          style={{ borderRadius: 8 }}
          contentStyle={{ paddingVertical: 8 }}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

ProfileScreen.options = {
  headerShown: false,
};

export default ProfileScreen;
