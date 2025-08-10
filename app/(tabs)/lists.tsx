import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Search, ShoppingCart, Home, Plane, Heart, Briefcase, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useNotes } from "@/providers/NotesProvider";
import { colors } from "@/constants/colors";
import { categories } from "@/constants/categories";

export default function ListsScreen() {
  const router = useRouter();
  const { getNotesbyCategory } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");

  const categoryIcons: Record<string, any> = {
    groceries: ShoppingCart,
    task: Briefcase,
    "home improvement": Home,
    "travel idea": Plane,
    "date idea": Heart,
  };

  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/category/[name]" as any,
      params: { name: category }
    });
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.lightSage]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Lists</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.olive} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search lists..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCategories.map((category) => {
            const Icon = categoryIcons[category.toLowerCase()] || Briefcase;
            const categoryNotes = getNotesbyCategory(category);
            const itemCount = categoryNotes.length;

            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryIcon}>
                  <Icon size={24} color={colors.olive} />
                </View>
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })}

          {filteredCategories.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No lists found</Text>
              <Text style={styles.emptyText}>
                Try a different search or create a new list
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.oliveLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: colors.textSecondary,
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
});