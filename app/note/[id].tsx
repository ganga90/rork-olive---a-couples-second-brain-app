import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, Tag, User, Edit, Trash2 } from "lucide-react-native";
import { useNotes } from "@/providers/NotesProvider";
import { colors } from "@/constants/colors";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getNoteById, deleteNote } = useNotes();
  
  const note = getNoteById(id as string);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteNote(id as string);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.oliveLight + "30" }]}>
            <Text style={styles.categoryText}>{note.category}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Trash2 size={20} color={colors.coral} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.summary}>{note.summary}</Text>
        
        <View style={styles.originalContainer}>
          <Text style={styles.originalLabel}>Original note:</Text>
          <Text style={styles.originalText}>{note.originalText}</Text>
        </View>

        <View style={styles.metadata}>
          <View style={styles.metaRow}>
            <User size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>Added by {note.addedBy}</Text>
          </View>
          {note.dueDate && (
            <View style={styles.metaRow}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                Due {new Date(note.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <Tag size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              Created {new Date(note.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.askOliveButton}
          onPress={() => router.push({
            pathname: "/ask-olive" as any,
            params: { noteId: note.id }
          })}
        >
          <Text style={styles.askOliveEmoji}>🫒</Text>
          <Text style={styles.askOliveText}>Ask Olive for help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.olive,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summary: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 20,
    lineHeight: 28,
  },
  originalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  originalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  originalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  metadata: {
    gap: 12,
    marginBottom: 32,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  askOliveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.olive,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  askOliveEmoji: {
    fontSize: 24,
  },
  askOliveText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});