// Block Share App v2.0 - Me Tab (Profile)
// Personal account, credits, Host tools, and settings

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CreditCard,
  Package,
  ChevronRight,
  Award,
  BookOpen,
  Megaphone,
  Users,
  BarChart3,
  MessageCircle,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Shield,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '@/constants/theme';
import { MOCK_CURRENT_USER, MOCK_HOST_USER } from '@/mocks/data';

export default function MeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Toggle between regular user and host for demo
  const user = MOCK_CURRENT_USER; // Change to MOCK_HOST_USER to see Host view

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Profile Hero Header */}
      <View style={[styles.profileHero, { paddingTop: insets.top + SPACING.md }]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        <View style={styles.nameRow}>
          <Text style={styles.heroName}>{user.firstName} {user.lastName}</Text>
          {user.isHost && (
            <View style={styles.hostBadge}>
              <Award size={12} color={COLORS.white} />
              <Text style={styles.hostBadgeText}>Host</Text>
            </View>
          )}
        </View>

        <Text style={styles.heroLocation}>{user.buildingName} · {user.location}</Text>
        <Text style={styles.heroMemberSince}>
          Member since {user.memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </Text>

        {/* Quick stats row */}
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>3</Text>
            <Text style={styles.heroStatLabel}>sharing</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>{user.rating?.asLender.toFixed(1)}</Text>
            <Text style={styles.heroStatLabel}>lender ★</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>{user.rating?.asBorrower.toFixed(1)}</Text>
            <Text style={styles.heroStatLabel}>borrower ★</Text>
          </View>
        </View>
      </View>

      {/* Credits Card */}
      <TouchableOpacity style={styles.creditsCard}>
        <View style={styles.creditsHeader}>
          <CreditCard size={20} color={SECTION_COLORS.me.primary} />
          <Text style={styles.creditsLabel}>Your Credits</Text>
        </View>
        <Text style={styles.creditsAmount}>${user.creditBalance.toFixed(2)}</Text>
        <Text style={styles.creditsHelp}>Tap to see how to earn more →</Text>
      </TouchableOpacity>

      {/* My Contributions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Contributions</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.stuff.light }]}>
            <Package size={20} color={SECTION_COLORS.stuff.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Items I'm Sharing</Text>
            <Text style={styles.menuValue}>3 items active</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      {/* Become a Host CTA (if not a host) */}
      {!user.isHost && (
        <TouchableOpacity 
          style={styles.becomeHostCard}
          onPress={() => router.push('/host/apply')}
        >
          <Users size={32} color={SECTION_COLORS.host.primary} />
          <View style={styles.becomeHostText}>
            <Text style={styles.becomeHostTitle}>Help Your Building Share Better</Text>
            <Text style={styles.becomeHostSubtitle}>Apply to become a Block Host</Text>
          </View>
          <ChevronRight size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      )}

      {/* Host Tools Section (only for hosts) */}
      {user.isHost && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={16} color={SECTION_COLORS.host.primary} />
            <Text style={styles.sectionTitleInline}>Host Tools</Text>
          </View>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/host/training')}
          >
            <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.host.light }]}>
              <BookOpen size={20} color={SECTION_COLORS.host.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Training Materials</Text>
              <Text style={styles.menuValue}>6 modules completed</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/host/broadcast')}
          >
            <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.host.light }]}>
              <Megaphone size={20} color={SECTION_COLORS.host.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Send Announcement</Text>
              <Text style={styles.menuValue}>Message all residents</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/host/residents')}
          >
            <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.host.light }]}>
              <Users size={20} color={SECTION_COLORS.host.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>View Residents</Text>
              <Text style={styles.menuValue}>47 members in building</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.host.light }]}>
              <BarChart3 size={20} color={SECTION_COLORS.host.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Building Stats</Text>
              <Text style={styles.menuValue}>View activity metrics</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.host.light }]}>
              <MessageCircle size={20} color={SECTION_COLORS.host.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>Host Network</Text>
              <Text style={styles.menuValue}>Connect with other Hosts</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: COLORS.border }]}>
            <Bell size={20} color={COLORS.textLight} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Notifications</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: COLORS.border }]}>
            <Shield size={20} color={COLORS.textLight} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Privacy</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: COLORS.border }]}>
            <CreditCard size={20} color={COLORS.textLight} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Membership & Billing</Text>
            <Text style={styles.menuValue}>{user.isPremium ? 'Premium' : 'Basic'}</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: COLORS.border }]}>
            <HelpCircle size={20} color={COLORS.textLight} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Profile Hero Header
  profileHero: {
    backgroundColor: SECTION_COLORS.me.primary,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  heroName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: SECTION_COLORS.host.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  hostBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  heroLocation: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  heroMemberSince: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: SPACING.lg,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  heroStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: SPACING.sm,
  },

  // Credits Card
  creditsCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: SECTION_COLORS.me.primary,
    ...SHADOWS.sm,
  },
  creditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  creditsLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  creditsAmount: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  creditsHelp: {
    fontSize: FONT_SIZES.sm,
    color: SECTION_COLORS.me.primary,
  },

  // Sections
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionTitleInline: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    minHeight: TOUCH_TARGET.preferred,
    ...SHADOWS.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Become Host Card
  becomeHostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: SECTION_COLORS.host.light,
    borderStyle: 'dashed',
  },
  becomeHostText: {
    flex: 1,
  },
  becomeHostTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  becomeHostSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
