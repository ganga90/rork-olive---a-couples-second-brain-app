import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Search, Filter } from "lucide-react-native";
import { useNotes } from "@/providers/NotesProvider";
import { colors } from "@/constants/colors";
import NoteCard from "@/components/NoteCard";

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const { getNotesbyCategory } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  const categoryNotes = getNotesbyCategory(name as string);
  
  const filteredNotes = categoryNotes.filter(note => {
    const matchesSearch = note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.originalText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompleted = showCompleted || !note.completed;
    return matchesSearch && matchesCompleted;
  });

  const incompleteCount = categoryNotes.filter(n => !n.completed).length;
  const completeCount = categoryNotes.filter(n => n.completed).length;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: name as string,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }} 
      />
      <LinearGradient
        colors={[colors.background, colors.lightSage]}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{incompleteCount}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completeCount}</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in this list..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowCompleted(!showCompleted)}
          >
            <Filter size={20} color={showCompleted ? colors.olive : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? "Try a different search" : "Add your first item to this list"}
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => router.push("/(tabs)")}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  stats: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.olive,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});