import { StyleSheet } from "react-native";

export const createStyles = (theme: any, borderColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    card: {
      padding: 24,
      borderRadius: 24,
      borderWidth: 2.5,
      borderColor: borderColor,
      backgroundColor: theme.colors.surface,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 5,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    contentContainer: {
      flex: 1,
      paddingRight: 16,
      maxWidth: "75%",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    title: {
      fontSize: 18,
      marginBottom: 8,
      fontFamily: "mon-b",
      flexWrap: "wrap",
    },
    infoContainer: {
      gap: 8,
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    chartContainer: {
      width: 90,
      height: 80,
      flexShrink: 0,
    },
    expandedContent: {
      marginTop: 24,
    },
    description: {
      marginBottom: 16,
    },
    separator: {
      height: 1,
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 16,
      marginBottom: 8,
      fontFamily: "mon-b",
    },
    checklistContainer: {
      marginBottom: 16,
    },
    checklistItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
  });
