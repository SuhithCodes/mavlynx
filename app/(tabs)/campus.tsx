import { View, Text, ScrollView } from "react-native";
import {
  Title,
  Paragraph,
  TextInput,
  Button,
  Card,
  Modal,
  Portal,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import { Building2, BookCopy, Import, Map } from "lucide-react-native";
import React from "react";
import { FIRESTORE_DB } from "../../utils/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import WebView from "react-native-webview";
import { PaperProvider } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
const Tab = createMaterialTopTabNavigator();

function DeptLocatorScreen() {
  const theme = useTheme();
  const [roomNumber, setRoomNumber] = React.useState("");
  const [result, setResult] = React.useState("");
  const [mapVisible, setMapVisible] = React.useState(false);
  const [mapData, setMapData] = React.useState<number | null>(null);

  const handleSearch = async () => {
    if (!roomNumber) return;

    try {
      const formattedRoomNumber = roomNumber.toUpperCase();
      const docRef = doc(FIRESTORE_DB, "departments", formattedRoomNumber);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setMapData(data.dataValue);
        setResult(
          `Room ${data.roomNumber} is located in ${data.buildingName} (${data.buildingCode}) on the ${data.floor}.\n` +
            `Department: ${data.department}\n` +
            `Square Feet: ${data.squareFeet}\n` +
            `Student Capacity: ${data.studentCapacity}`
        );
      } else {
        setResult(
          "Room not found. Please check the room number and try again."
        );
        setMapData(null);
      }
    } catch (error) {
      console.error("Error searching for room:", error);
      setResult("An error occurred while searching. Please try again.");
      setMapData(null);
    }
  };

  const MapModal = () => (
    <Portal>
      <Modal
        visible={mapVisible}
        onDismiss={() => setMapVisible(false)}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 16,
          height: 500,
        }}
      >
        {mapData ? (
          <WebView
            source={{
              uri: `https://www.uta.edu/maps/embed?id=${mapData}`,
            }}
            style={{ flex: 1 }}
          />
        ) : (
          <Text>Map data not available</Text>
        )}
        <Button
          mode="contained"
          onPress={() => setMapVisible(false)}
          style={{ marginTop: 10 }}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {/* Sticky Header Section */}
      <View style={{ padding: 14 }}>
        <View style={{ width: "100%" }}>
          {/* Header row with name */}
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
              Department Room Finder
            </Title>
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

        {/* Middle sections */}
      </View>
      <Card
        style={{
          margin: 24,
          padding: 24,
          borderRadius: 24,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }}
      >
        <Card.Content>
          <Paragraph
            style={{
              fontSize: 20,
              marginBottom: 12,
              color: theme.colors.secondary,
            }}
          >
            Let's find your room
          </Paragraph>
          <TextInput
            label="Enter your room number: ex: NH109"
            value={roomNumber}
            onChangeText={setRoomNumber}
            style={{ marginBottom: 16 }}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            icon="magnify"
            style={{ borderRadius: 8 }}
          >
            Find Room
          </Button>
        </Card.Content>
      </Card>

      {/* Separator line */}
      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.outlineVariant,
          marginHorizontal: 8,
        }}
      />

      {/* Result display */}
      {result ? (
        <Card
          style={{
            marginHorizontal: 24,
            marginTop: 20,
            borderRadius: 24,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          <Card.Content>
            <Title style={{ marginBottom: 8 }}>{roomNumber}</Title>
            <Paragraph>{result}</Paragraph>
          </Card.Content>
          <Card.Actions
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Button
              onPress={() => {
                /* Save action */
              }}
              icon={({ size, color }) => (
                <Import
                  size={24}
                  color={color}
                  style={{ width: "100%", height: "100%", paddingLeft: 8 }}
                />
              )}
              style={{
                height: 50,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ marginLeft: 8 }}>Save</Text>
            </Button>
            <Button
              onPress={() => {
                if (mapData) setMapVisible(true);
              }}
              icon={({ size, color }) => (
                <Map
                  size={24}
                  color={color}
                  style={{ width: "100%", height: "100%", paddingLeft: 8 }}
                />
              )}
              style={{
                height: 50,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              disabled={!mapData}
            >
              <Text style={{ marginLeft: 8 }}>Maps</Text>
            </Button>
          </Card.Actions>
        </Card>
      ) : null}
      <MapModal />
    </View>
  );
}

function StudyRoomScreen() {
  const theme = useTheme();
  interface Library {
    id: string;
    building_name: string;
    url: string;
  }
  const [libraries, setLibraries] = React.useState<Library[]>([]);
  const [mapVisible, setMapVisible] = React.useState(false);
  const [selectedMapId, setSelectedMapId] = React.useState<string | null>(null);

  // Fetch libraries from Firestore
  React.useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const librariesRef = collection(FIRESTORE_DB, "libraries");
        const librariesSnap = await getDocs(librariesRef);
        const librariesData = librariesSnap.docs.map((doc) => ({
          id: doc.id, // This will be the map_id
          ...doc.data(),
        }));
        setLibraries(librariesData as Library[]);
      } catch (error) {
        console.error("Error fetching libraries:", error);
      }
    };

    fetchLibraries();
  }, []);

  const MapModal = () => (
    <Portal>
      <Modal
        visible={mapVisible}
        onDismiss={() => setMapVisible(false)}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 16,
          height: 500,
        }}
      >
        {selectedMapId ? (
          <WebView
            source={{
              uri: `https://www.uta.edu/maps/embed?id=${selectedMapId}`,
            }}
            style={{ flex: 1 }}
          />
        ) : (
          <Text>Map data not available</Text>
        )}
        <Button
          mode="contained"
          onPress={() => setMapVisible(false)}
          style={{ marginTop: 10 }}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      {/* Sticky Header Section */}
      <View style={{ padding: 14 }}>
        <Title
          style={{
            fontFamily: "mon-sb",
            fontSize: 30,
            lineHeight: 36,
            marginBottom: 10,
          }}
        >
          Study Rooms
        </Title>
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginHorizontal: 8,
          }}
        />
      </View>

      <ScrollView>
        {libraries.map((library) => (
          <Card
            key={library.id}
            style={{
              marginHorizontal: 24,
              marginVertical: 12,
              borderRadius: 24,
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <Card.Content>
              <Title style={{ marginBottom: 8, fontSize: 24 }}>
                {library.building_name}
              </Title>
              <Paragraph style={{ fontSize: 20 }}>{library.url}</Paragraph>
            </Card.Content>
            <Card.Actions style={{ justifyContent: "flex-end" }}>
              <Button
                onPress={() => {
                  /* Save action */
                }}
                icon={({ size, color }) => (
                  <Import
                    size={24}
                    color={color}
                    style={{ width: "100%", height: "100%", paddingLeft: 8 }}
                  />
                )}
                style={{
                  height: 50,
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginLeft: 8 }}>Save</Text>
              </Button>
              <Button
                onPress={() => {
                  setSelectedMapId(library.id);
                  setMapVisible(true);
                }}
                icon={({ size, color }) => (
                  <Map
                    size={24}
                    color={color}
                    style={{ width: "100%", height: "100%", paddingLeft: 8 }}
                  />
                )}
                style={{
                  height: 50,
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginLeft: 8 }}>Maps</Text>
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      <MapModal />
    </View>
  );
}

export default function CampusScreen() {
  const theme = useTheme();

  return (
    <PaperProvider theme={theme}>
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
            name="Departments"
            component={DeptLocatorScreen}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <Building2
                  size={20}
                  color={color}
                  style={{ marginBottom: -4 }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Study Rooms"
            component={StudyRoomScreen}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <BookCopy
                  size={20}
                  color={color}
                  style={{ marginBottom: -4 }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </PaperProvider>
  );
}
