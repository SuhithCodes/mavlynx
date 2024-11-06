import React from "react";
import { View, StyleSheet, Pressable, Linking } from "react-native";
import { Card, Text, Button, Chip, useTheme } from "react-native-paper";
import { PhonePlan } from "../../types/PhonePlans";

interface PhonePlanCardProps {
  plan: PhonePlan;
  providerName: string;
}

export function PhonePlanCard({ plan, providerName }: PhonePlanCardProps) {
  const theme = useTheme();

  const handleViewPlan = () => {
    Linking.openURL(plan.link);
  };

  const handleViewCoverage = () => {
    Linking.openURL(plan.coverage_map);
  };

  return (
    <Card style={styles.card}>
      <Card.Title title={providerName} />
      <Card.Content>
        <View style={styles.priceContainer}>
          <Text variant="headlineMedium" style={styles.price}>
            ${plan?.plan_details?.price_per_month}
          </Text>
          <Text variant="bodySmall">/month</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text variant="titleMedium">Plan Details:</Text>
          <Text>Data: {plan?.plan_details?.data}</Text>
          <Text>Hotspot: {plan?.plan_details?.hotspot_data}</Text>
          <Text>International: {plan?.plan_details?.international}</Text>
          <Text>Plan Type: {plan?.plan_details?.plan_type}</Text>
        </View>

        <View style={styles.networkContainer}>
          {plan?.plan_details?.network_options?.map(
            (network: string, index: number) => (
              <Chip key={index} style={styles.chip}>
                {network}
              </Chip>
            )
          )}
        </View>
      </Card.Content>

      <Card.Actions>
        <Button onPress={handleViewCoverage}>View Coverage</Button>
        <Button mode="contained" onPress={handleViewPlan}>
          View Plan
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 8,
  },
  price: {
    fontWeight: "bold",
    marginRight: 4,
  },
  detailsContainer: {
    gap: 4,
    marginVertical: 8,
  },
  networkContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    marginRight: 4,
  },
});
