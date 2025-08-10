import React, { useState } from "react";
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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import { useNotes } from "@/providers/NotesProvider";
import { colors } from "@/constants/colors";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AskOliveScreen() {
  const { noteId } = useLocalSearchParams();
  const { getNoteById } = useNotes();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const note = noteId ? getNoteById(noteId as string) : null;

  React.useEffect(() => {
    if (note) {
      setMessages([
        {
          id: "1",
          text: `I see you need help with: "${note.summary}". How can I assist you with this?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: "1",
          text: "Hi! I'm Olive, your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [note]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const context = note ? `Context: User needs help with "${note.summary}" (${note.category})` : "";
      
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are Olive, a helpful AI assistant for couples managing their shared tasks and notes. ${context}. Be concise, friendly, and practical.`,
            },
            {
              role: "user",
              content: inputText,
            },
          ],
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process that. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.isUser && styles.messageRowUser,
            ]}
          >
            {!message.isUser && (
              <View style={styles.oliveAvatar}>
                <Text style={styles.oliveEmoji}>🫒</Text>
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.isUser && styles.messageBubbleUser,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser && styles.messageTextUser,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.olive} />
            <Text style={styles.loadingText}>Olive is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Olive anything..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  oliveAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.oliveLight + "30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  oliveEmoji: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: "75%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageBubbleUser: {
    backgroundColor: colors.olive,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  messageTextUser: {
    color: "#fff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 40,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 10,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.lightSage,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
});