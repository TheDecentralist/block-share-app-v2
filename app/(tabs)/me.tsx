// Block Share App v2.0 - Me Tab (Profile)
// Design system port from Claude Design prototype

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Settings,
  Coins,
  Package,
  ChevronRight,
  Award,
  BookOpen,
  Megaphone,
  Users,
  UserCircle,
  LogOut,
  MapPin,
  Shield,
} from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, SECTION_COLORS } from '@/constants/theme';
import { MOCK_CURRENT_USER } from '@/mocks/data';

export default function MeScreen() {
  const router = useRouter();
  const user = MOCK_CURRENT_USER;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Me</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Settings size={20} color={COLORS.text} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Avatar Circle with Initials */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{user.firstName} {user.lastName}</Text>
          <View style={styles.locationRow}>
            <MapPin size={13} color={COLORS.textFaint} strokeWidth={1.8} />
            <Text style={styles.locationText}>{user.buildingName} · {user.location}</Text>
          </View>
        </View>

        {/* Credits Card */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsIconBox}>
            <Coins size={20} color={COLORS.accent} strokeWidth={1.8} />
          </View>
          <View style={styles.creditsInfo}>
            <Text style={styles.creditsLabel}>Block credits</Text>
            <Text style={styles.creditsNumber}>{user.creditBalance.toFixed(0)}</Text>
          </View>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Host Tools (if host) */}
        {user.isHost && (
          <>
            <Text style={styles.kicker}>HOST TOOLS</Text>
            <View style={styles.card}>
              <RowLink
                icon={<BookOpen size={18} color={COLORS.accent} strokeWidth={1.8} />}
                iconBg={COLORS.accentWash}
                label="Training Materials"
                onPress={() => router.push('/host/training')}
              />
              <RowLink
                icon={<Megaphone size={18} color={COLORS.accent} strokeWidth={1.8} />}
                iconBg={COLORS.accentWash}
                label="Send Announcement"
                onPress={() => router.push('/host/broadcast')}
              />
              <RowLink
                icon={<Users size={18} color={COLORS.accent} strokeWidth={1.8} />}
                iconBg={COLORS.accentWash}
                label="View Residents"
                onPress={() => router.push('/host/residents')}
                isLast
              />
            </View>
          </>
        )}

        {/* Become a Block Host (if not host) */}
        {!user.isHost && (
          <TouchableOpacity style={styles.becomeHostCard} onPress={() => router.push('/host/apply')} activeOpacity={0.85}>
            <View style={styles.becomeHostIconBox}>
              <Shield size={22} color={COLORS.white} strokeWidth={1.8} />
            </View>
            <View style={styles.becomeHostText}>
              <Text style={styles.becomeHostTitle}>Become a Block Host</Text>
              <Text style={styles.becomeHostSub}>Help your building share better</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          </TouchableOpacity>
        )}

        {/* Account Section */}
        <Text style={styles.kicker}>ACCOUNT</Text>
        <View style={styles.card}>
          <RowLink
            icon={<Package size={18} color={COLORS.textSoft} strokeWidth={1.8} />}
            iconBg={COLORS.border}
            label="My shared items"
          />
          <RowLink
            icon={<UserCircle size={18} color={COLORS.textSoft} strokeWidth={1.8} />}
            iconBg={COLORS.border}
            label="Edit profile"
          />
          <RowLink
            icon={<Settings size={18} color={COLORS.textSoft} strokeWidth={1.8} />}
            iconBg={COLORS.border}
            label="Settings"
            isLast
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <LogOut size={17} color={COLORS.error} strokeWidth={1.8} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RowLink({
  icon,
  iconBg,
  label,
  onPress,
  isLast,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.rowLink, !isLast && styles.rowLinkBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      <ChevronRight size={16} color={COLORS.textFaint} strokeWidth={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.me,
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.accentWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarInitials: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: -0.5,
  },
  displayName: {
    fontSize: 26,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textFaint,
  },

  // Credits Card
  creditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  creditsIconBox: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accentWash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditsInfo: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textFaint,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  creditsNumber: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  historyButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSoft,
  },

  // Kicker
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },

  // Row Link
  rowLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    minHeight: 52,
  },
  rowLinkBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowIconBox: {
    width: 34,
    height: 34,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },

  // Become Host Card
  becomeHostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.me,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  becomeHostIconBox: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  becomeHostText: {
    flex: 1,
  },
  becomeHostTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  becomeHostSub: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.75)',
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  signOutText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    fontWeight: '500',
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
