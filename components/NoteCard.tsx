import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, User, CheckCircle, Circle } from "lucide-react-native";
import { Note } from "@/types/note";
import { colors } from "@/constants/colors";
import { useNotes } from "@/providers/NotesProvider";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const { toggleNoteCompletion } = useNotes();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push({
        pathname: "/note/[id]" as any,
        params: { id: note.id },
      });
    });
  };

  const handleToggleComplete = () => {
    toggleNoteCompletion(note.id);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleToggleComplete} style={styles.checkbox}>
            {note.completed ? (
              <CheckCircle size={24} color={colors.olive} />
            ) : (
              <Circle size={24} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={[styles.summary, note.completed && styles.completedText]} numberOfLines={2}>
              {note.summary}
            </Text>
            <View style={styles.metadata}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{note.category}</Text>
              </View>
              <View style={styles.metaInfo}>
                <User size={12} color={colors.textSecondary} />
                <Text style={styles.metaText}>{note.addedBy}</Text>
              </View>
              {note.dueDate && (
                <View style={styles.metaInfo}>
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {new Date(note.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  summary: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: colors.oliveLight + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: colors.olive,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});