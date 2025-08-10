import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { User, Bell, Shield, HelpCircle, LogOut, Heart } from "lucide-react-native";
import { useCouple } from "@/providers/CoupleProvider";
import { useOnboarding } from "@/providers/OnboardingProvider";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { partner1, partner2, currentUser, switchUser } = useCouple();
  const { resetOnboarding } = useOnboarding();
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = () => {
    resetOnboarding();
    router.replace("/onboarding");
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.lightSage]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.coupleCard}>
            <View style={styles.coupleHeader}>
              <Heart size={24} color={colors.coral} />
              <Text style={styles.coupleTitle}>
                {partner1} & {partner2}
              </Text>
            </View>
            <Text style={styles.coupleSubtitle}>
              Together on Olive since today
            </Text>
          </View>

          <View style={styles.currentUserCard}>
            <Text style={styles.sectionTitle}>Current User</Text>
            <TouchableOpacity
              style={styles.userSwitch}
              onPress={switchUser}
            >
              <View style={styles.userAvatar}>
                <User size={20} color={colors.olive} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser}</Text>
                <Text style={styles.userHint}>Tap to switch user</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={colors.text} />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.disabled, true: colors.oliveLight }}
                thumbColor={notifications ? colors.olive : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Shield size={20} color={colors.text} />
                <Text style={styles.settingText}>Privacy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color={colors.text} />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={colors.coral} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Olive v1.0.0</Text>
            <Text style={styles.footerSubtext}>Made with 💚 for couples</Text>
          </View>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: colors.text,
  },
  coupleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  coupleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  coupleTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.text,
  },
  coupleSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  currentUserCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  userSwitch: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.oliveLight + "30",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  userHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.coral,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});