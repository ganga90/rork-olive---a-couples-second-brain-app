import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, ArrowRight } from "lucide-react-native";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { colors } from "@/constants/colors";

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, saveCoupleName } = useOnboarding();
  const [step, setStep] = useState(0);
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1 && partner1Name.trim()) {
      setStep(2);
    } else if (step === 2 && partner2Name.trim()) {
      saveCoupleName(partner1Name.trim(), partner2Name.trim());
      completeOnboarding();
      router.replace("/(tabs)");
    }
  };

  const canProceed = 
    (step === 0) ||
    (step === 1 && partner1Name.trim()) ||
    (step === 2 && partner2Name.trim());

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
          >
            {step === 0 && (
              <View style={styles.content}>
                <View style={styles.logoContainer}>
                  <View style={styles.oliveLogo}>
                    <Text style={styles.oliveEmoji}>🫒</Text>
                  </View>
                </View>
                <Text style={styles.title}>Welcome to Olive</Text>
                <Text style={styles.subtitle}>
                  Your shared second brain for couples
                </Text>
                <Text style={styles.description}>
                  Capture thoughts, organize life, and grow together with AI-powered notes that understand you both
                </Text>
                <View style={styles.features}>
                  <View style={styles.featureRow}>
                    <Heart size={20} color={colors.olive} />
                    <Text style={styles.featureText}>Shared notes & lists</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Text style={styles.featureIcon}>✨</Text>
                    <Text style={styles.featureText}>AI categorization</Text>
                  </View>
                  <View style={styles.featureRow}>
                    <Text style={styles.featureIcon}>🤖</Text>
                    <Text style={styles.featureText}>Personal AI assistant</Text>
                  </View>
                </View>
              </View>
            )}

            {step === 1 && (
              <View style={styles.content}>
                <Text style={styles.stepTitle}>Let&apos;s get to know you</Text>
                <Text style={styles.stepSubtitle}>What&apos;s your name?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                  value={partner1Name}
                  onChangeText={setPartner1Name}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={handleNext}
                />
              </View>
            )}

            {step === 2 && (
              <View style={styles.content}>
                <Text style={styles.stepTitle}>Perfect, {partner1Name}!</Text>
                <Text style={styles.stepSubtitle}>What&apos;s your partner&apos;s name?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter partner's name"
                  placeholderTextColor={colors.textSecondary}
                  value={partner2Name}
                  onChangeText={setPartner2Name}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, !canProceed && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!canProceed}
            >
              <Text style={styles.buttonText}>
                {step === 2 ? "Start using Olive" : "Continue"}
              </Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
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
    justifyContent: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 32,
  },
  oliveLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.oliveLight,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  oliveEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  features: {
    gap: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    fontSize: 18,
    color: colors.text,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.olive,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0.05,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#fff",
  },
});