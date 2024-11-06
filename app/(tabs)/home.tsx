import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { Avatar, Card, Title, Text, useTheme } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import { useUser } from "@clerk/clerk-expo";
import { holds } from "@/data/mock/holds";
import { HoldCard } from "@/components/user/HoldCard";
import { router } from "expo-router";

const HomeScreen = () => {
  const theme = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();

  // Sample data for monthly expenses
  const barData = [
    { value: 2500, label: "Jan" },
    { value: 3000, label: "Feb" },
    { value: 4000, label: "Mar" },
    { value: 3500, label: "Apr" },
    { value: 4500, label: "May" },
    { value: 5000, label: "Jun" },
    { value: 6000, label: "Jul" },
    { value: 7000, label: "Aug" },
    { value: 8000, label: "Sep" },
    { value: 9000, label: "Oct" },
    { value: 10000, label: "Nov" },
    { value: 11000, label: "Dec" },
  ];

  // Sample data for donut chart
  const donutData = [
    { value: 70, color: theme.colors.primary },
    { value: 30, color: theme.colors.surfaceVariant },
  ];

  // Calculate the estimated costs for the current month
  const estimatedCosts =
    barData.reduce((total, item) => total + item.value, 0) / barData.length; // Calculate average costs

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      {/* Sticky Header Section */}
      <View style={{ padding: 14 }}>
        <View style={{ width: "100%" }}>
          {/* Header row with name and avatar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 16,
            }}
          >
            <Title
              style={{ fontFamily: "mon-b", fontSize: 30, lineHeight: 36 }}
            >
              Welcome, {user.firstName}
            </Title>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar.Image
                size={50}
                source={{
                  uri: user.imageUrl || "https://placekitten.com/200/200",
                }}
              />
            </Pressable>
          </View>

          {/* Separator line */}
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.outlineVariant,
              marginHorizontal: 8,
            }}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1 }}>
        {/* Top Section */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
          <View style={{ width: "100%" }}>
            {/* Middle Section - Expenses */}
            <Title
              style={{
                color: theme.colors.primary,
                fontSize: 26,
                marginBottom: 16,
              }}
            >
              Your Expenses
            </Title>
            <Card
              style={{
                padding: 24,
                marginBottom: 16,
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                borderRadius: 24,
              }}
            >
              <View>
                {/* Header row with label and period */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                ></View>

                {/* Costs row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: 20,
                    }}
                  >
                    Estimated Costs
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={{
                      fontFamily: "mon-b",
                      fontSize: 24,
                      color: theme.colors.onSurface,
                    }}
                  >
                    ${estimatedCosts}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
          <Card
            style={{
              padding: 24,
              borderRadius: 24,
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <Title>Monthly Expenses</Title>
            <BarChart
              data={barData}
              barWidth={22}
              spacing={24}
              height={200}
              noOfSections={3}
              barBorderRadius={4}
              frontColor={theme.colors.primary}
              yAxisThickness={0}
              xAxisThickness={0}
            />
          </Card>
        </View>

        {/* Separator line */}
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginHorizontal: 8,
            marginBottom: 16,
          }}
        />

        {/* Bottom Section - Holds */}
        <View style={{ paddingHorizontal: 24 }}>
          <Title style={{ marginBottom: 16 }}>Your In-progress Items</Title>
        </View>

        {/* Filter holds to show only in-progress items */}
        {holds
          .filter((hold) => hold.status === "in_progress")
          .map((hold) => (
            <HoldCard key={hold.id} hold={hold} />
          ))}
      </ScrollView>
    </View>
  );
};

HomeScreen.options = {
  headerShown: false,
};

export default HomeScreen;
