import {
  View,
  FlatList,
  Button,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Title, useTheme, Card } from "react-native-paper";
import { holds } from "@/data/mock/holds";
import { HoldCard } from "@/components/user/HoldCard";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AlertCircle, Phone } from "lucide-react-native";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "@/utils/FirebaseConfig";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { Chip } from "react-native-paper";
import { PhonePlanCard } from "@/components/user/PhonePlanCard";
const Tab = createMaterialTopTabNavigator();

// Define the Plan interface
interface Plan {
  id: string;
  price_per_month: number;
  plan_details: {
    data: string;
  };
  coverage_map: string;
}

// Separate the Holds screen content into its own component
function HoldsScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Title Section */}
      <View style={{ padding: 14 }}>
        <Title style={{ fontFamily: "mon-sb", fontSize: 30, lineHeight: 36 }}>
          Active Holds
        </Title>
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginHorizontal: 8,
            marginTop: 16,
          }}
        />
      </View>

      <FlatList
        data={holds}
        contentContainerStyle={{ gap: 8, padding: 3 }}
        renderItem={({ item }) => <HoldCard hold={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

// Create a new Phone Plans screen
function PhonePlansScreen() {
  const theme = useTheme();
  const [plans, setPlans] = useState<PhonePlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PhonePlan[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [dataFilter, setDataFilter] = useState<string>("all");
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Fetch phone plans from Firestore
  useEffect(() => {
    const fetchPlans = async () => {
      const plansCollection = collection(FIRESTORE_DB, "plans");
      const plansSnapshot = await getDocs(plansCollection);
      const plansList = plansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PhonePlan[];
      setPlans(plansList);
      setFilteredPlans(plansList);
    };
    fetchPlans();
  }, []);

  // Filter plans based on selected criteria
  const filterPlans = () => {
    let filtered = plans;

    // Filter by price
    filtered = filtered.filter(
      (plan) => parseFloat(plan.plan_details.price_per_month) <= priceRange
    );

    // Filter by network if any selected
    if (selectedNetworks.length > 0) {
      filtered = filtered.filter((plan) =>
        plan.plan_details.network_options.some((network) =>
          selectedNetworks.includes(network)
        )
      );
    }

    // Filter by data plan type
    if (dataFilter !== "all") {
      filtered = filtered.filter((plan) =>
        plan.plan_details.data.toLowerCase().includes(dataFilter.toLowerCase())
      );
    }

    setFilteredPlans(filtered);
  };

  useEffect(() => {
    filterPlans();
  }, [priceRange, selectedNetworks, dataFilter]);

  // Get unique network options from all plans
  const networkOptions = Array.from(
    new Set(plans.flatMap((plan) => plan.plan_details.network_options))
  );

  return (
    <View style={{ flex: 1 }}>
      <Title
        style={{
          fontFamily: "mon-sb",
          fontSize: 30,
          lineHeight: 36,
          padding: 14,
        }}
      >
        Phone Plans
      </Title>

      {/* Separator line */}
      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.outlineVariant,
          marginHorizontal: 8,
        }}
      />

      {/* Filters Section */}
      <TouchableOpacity
        onPress={() => setIsFiltersExpanded(!isFiltersExpanded)}
      >
        <Card style={{ margin: 16, elevation: 4 }}>
          <Card.Content>
            <Title style={{ fontFamily: "mon-sb", marginBottom: 16 }}>
              Filters
            </Title>
            {isFiltersExpanded && (
              <>
                {/* Price Range Filter */}
                <Text style={{ marginBottom: 8 }}>
                  Price Range: ${priceRange}
                </Text>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  minimumTrackTintColor={theme.colors.primary}
                  style={{ marginBottom: 16 }}
                />

                {/* Network Filter */}
                <Text style={{ marginBottom: 8 }}>Network Provider:</Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {networkOptions.map((network) => (
                    <Chip
                      key={network}
                      selected={selectedNetworks.includes(network)}
                      onPress={() => {
                        setSelectedNetworks(
                          selectedNetworks.includes(network)
                            ? selectedNetworks.filter((n) => n !== network)
                            : [...selectedNetworks, network]
                        );
                      }}
                      style={{ marginRight: 8 }}
                    >
                      {network}
                    </Chip>
                  ))}
                </View>

                {/* Data Plan Filter */}
                <Text style={{ marginBottom: 8 }}>Data Plan Type:</Text>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {["all", "unlimited", "5GB", "10GB", "15GB"].map((type) => (
                    <Chip
                      key={type}
                      selected={dataFilter === type}
                      onPress={() => setDataFilter(type)}
                      style={{ marginRight: 8 }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Chip>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>

      {/* Separator line */}
      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.outlineVariant,
          marginHorizontal: 8,
        }}
      />

      {/* Plans List */}
      <FlatList
        data={filteredPlans}
        renderItem={({ item }) => (
          <PhonePlanCard
            plan={item}
            providerName={item.plan_details.provider_name}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

// Main component with tabs
export default function EssentialsScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: "mon-sb",
            textTransform: "none",
          },
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarShowIcon: true,
          tabBarIconStyle: { marginRight: 5 },
          tabBarStyle: { height: 48 },
          tabBarItemStyle: {
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Tab.Screen
          name="Holds"
          component={HoldsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AlertCircle
                size={20}
                color={color}
                style={{ marginBottom: -4 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Phone Plans"
          component={PhonePlansScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Phone size={20} color={color} style={{ marginBottom: -4 }} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
