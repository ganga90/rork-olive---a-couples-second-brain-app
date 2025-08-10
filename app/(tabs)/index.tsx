import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Send, Sparkles, Calendar, Tag } from "lucide-react-native";
import { useNotes } from "@/providers/NotesProvider";
import { useCouple } from "@/providers/CoupleProvider";
import { colors } from "@/constants/colors";
import { processNoteWithAI } from "@/utils/aiProcessor";
import NoteCard from "@/components/NoteCard";

export default function NotesScreen() {
  const [noteText, setNoteText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { notes, addNote } = useNotes();
  const { currentUser, partner1 } = useCouple();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSendNote = async () => {
    if (!noteText.trim() || isProcessing) return;

    setIsProcessing(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    try {
      const processedNote = await processNoteWithAI(noteText, currentUser || partner1);
      addNote(processedNote);
      setNoteText("");
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error processing note:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const recentNotes = notes.slice(0, 5);

  return (
    <LinearGradient
      colors={[colors.background, colors.lightSage]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.greeting}>
                Hi {currentUser || partner1} 👋
              </Text>
              <Text style={styles.title}>Drop a thought</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Buy lemons tomorrow, plan date night, fix kitchen sink..."
                placeholderTextColor={colors.textSecondary}
                value={noteText}
                onChangeText={setNoteText}
                multiline
                maxLength={500}
                editable={!isProcessing}
              />
              
              {isProcessing && (
                <Animated.View style={[styles.processingOverlay, { opacity: fadeAnim }]}>
                  <ActivityIndicator size="small" color={colors.olive} />
                  <Text style={styles.processingText}>Olive is thinking...</Text>
                </Animated.View>
              )}

              <TouchableOpacity
                style={[styles.sendButton, (!noteText.trim() || isProcessing) && styles.sendButtonDisabled]}
                onPress={handleSendNote}
                disabled={!noteText.trim() || isProcessing}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.aiFeatures}>
              <View style={styles.aiFeature}>
                <Sparkles size={16} color={colors.olive} />
                <Text style={styles.aiFeatureText}>AI categorization</Text>
              </View>
              <View style={styles.aiFeature}>
                <Calendar size={16} color={colors.olive} />
                <Text style={styles.aiFeatureText}>Smart dates</Text>
              </View>
              <View style={styles.aiFeature}>
                <Tag size={16} color={colors.olive} />
                <Text style={styles.aiFeatureText}>Auto-tagging</Text>
              </View>
            </View>

            {recentNotes.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent Notes</Text>
                {recentNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </View>
            )}

            {recentNotes.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyTitle}>No notes yet</Text>
                <Text style={styles.emptyText}>
                  Start by dropping your first thought above
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    paddingRight: 60,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.olive,
  },
  sendButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.olive,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0.05,
  },
  aiFeatures: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  aiFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aiFeatureText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
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