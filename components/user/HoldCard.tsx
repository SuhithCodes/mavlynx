import { Text, View, Pressable, Dimensions } from "react-native";
import { Hold } from "@/types/Hold";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import { Card, Title, useTheme, Checkbox } from "react-native-paper";
import { createStyles } from "@/constants/styles/HoldCard.styles";

export function HoldCard({ hold }: { hold: Hold }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [completedDocs, setCompletedDocs] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState(hold.status);
  const theme = useTheme();

  // Modify the getBackgroundColor function to getBorderColor
  const getBorderColor = () => {
    const daysLeft = getDaysUntilDue();
    if (daysLeft < 5) {
      return "#FA8072"; // Soft pastel red
    } else if (daysLeft < 30) {
      return "#F6C667"; // Soft pastel orange
    } else {
      return "#B2D8B6"; // Soft pastel teal
    }
  };

  // Calculate days until due date
  const getDaysUntilDue = () => {
    if (!hold.due_date_at) return 0;
    return Math.max(
      0,
      Math.floor(
        (new Date(hold.due_date_at).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
  };

  // Calculate total progress and status
  const calculateProgress = () => {
    const totalItems =
      (hold.steps?.length || 0) + (hold.required_documents?.length || 0);
    const completedItems = completedSteps.size + completedDocs.size;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  // Update getUpdatedStatus to use precise percentage thresholds
  const getUpdatedStatus = () => {
    const progress = calculateProgress();
    if (progress >= 100) return "completed";
    if (progress > 0) return "in_progress";
    return "not_started";
  };

  // Update pieData to use border color for the progress
  const progress = calculateProgress();
  const pieData = [
    {
      value: progress,
      color: getBorderColor(),
      text: `${Math.round(progress)}%`,
    },
    {
      value: Math.max(100 - progress, 0),
      color: theme.colors.surfaceVariant,
    },
  ];

  // Toggle completion handlers
  const toggleStep = (index: number) => {
    const newCompletedSteps = new Set(completedSteps);
    if (completedSteps.has(index)) {
      newCompletedSteps.delete(index);
    } else {
      newCompletedSteps.add(index);
    }
    setCompletedSteps(newCompletedSteps);
    const newStatus = getUpdatedStatus();
    setStatus(newStatus);
    hold.status = newStatus;
  };

  const toggleDoc = (index: number) => {
    const newCompletedDocs = new Set(completedDocs);
    if (completedDocs.has(index)) {
      newCompletedDocs.delete(index);
    } else {
      newCompletedDocs.add(index);
    }
    setCompletedDocs(newCompletedDocs);
    const newStatus = getUpdatedStatus();
    setStatus(newStatus);
    hold.status = newStatus;
  };

  const styles = createStyles(theme, getBorderColor());

  return (
    <Pressable
      style={styles.container}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <Card style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Title style={styles.title}>{hold.hold_type}</Title>
                <View style={styles.infoContainer}>
                  {hold.due_date_at && (
                    <View style={styles.iconRow}>
                      <FontAwesome6
                        name="calendar"
                        size={14}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text style={{ color: theme.colors.onSurfaceVariant }}>
                        {new Date(hold.due_date_at).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.iconRow}>
                    <FontAwesome6
                      name="clock"
                      size={14}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                      {getDaysUntilDue()}d left
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {hold.due_date_at && (
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                donut
                radius={45}
                innerRadius={35}
                textColor="black"
                textSize={12}
                focusOnPress={false}
                backgroundColor={theme.colors.surface}
              />
            </View>
          )}
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {hold.description && (
              <Text style={styles.description}>{hold.description}</Text>
            )}

            <View
              style={[
                styles.separator,
                { backgroundColor: theme.colors.outlineVariant },
              ]}
            />

            {/* Required Documents Checklist */}
            {hold.required_documents && hold.required_documents.length > 0 && (
              <View style={styles.checklistContainer}>
                <Title style={styles.sectionTitle}>Required Documents</Title>
                {hold.required_documents.map((doc, index) => (
                  <View style={styles.checklistItem} key={index}>
                    <Checkbox
                      status={
                        completedDocs.has(index) ? "checked" : "unchecked"
                      }
                      onPress={() => toggleDoc(index)}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={{
                        flex: 1,
                        textDecorationLine: completedDocs.has(index)
                          ? "line-through"
                          : "none",
                        color: completedDocs.has(index)
                          ? theme.colors.onSurfaceVariant
                          : theme.colors.onSurface,
                      }}
                    >
                      {doc}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Steps Checklist */}
            {hold.steps && hold.steps.length > 0 && (
              <View style={styles.checklistContainer}>
                <Title style={styles.sectionTitle}>Steps Pending</Title>
                {hold.steps.map((step, index) => (
                  <View style={styles.checklistItem} key={index}>
                    <Checkbox
                      status={
                        completedSteps.has(index) ? "checked" : "unchecked"
                      }
                      onPress={() => toggleStep(index)}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={{
                        flex: 1,
                        textDecorationLine: completedSteps.has(index)
                          ? "line-through"
                          : "none",
                        color: completedSteps.has(index)
                          ? theme.colors.onSurfaceVariant
                          : theme.colors.onSurface,
                      }}
                    >
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Card>
    </Pressable>
  );
}
