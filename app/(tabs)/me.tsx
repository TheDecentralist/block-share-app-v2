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
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  CreditCard,
  Package,
  Star,
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
  // Toggle between regular user and host for demo
  const user = MOCK_CURRENT_USER; // Change to MOCK_HOST_USER to see Host view

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            {user.isHost && (
              <View style={styles.hostBadge}>
                <Award size={12} color={COLORS.white} />
                <Text style={styles.hostBadgeText}>Host</Text>
              </View>
            )}
          </View>
          <Text style={styles.location}>{user.buildingName} • {user.location}</Text>
          <Text style={styles.memberSince}>
            Member since {user.memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Text>
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
            <Text style={styles.menuValue}>3 items</Text>
          </View>
          <ChevronRight size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: SECTION_COLORS.home.light }]}>
            <Star size={20} color={SECTION_COLORS.home.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuLabel}>My Ratings</Text>
            <Text style={styles.menuValue}>
              {user.rating?.asLender.toFixed(1)} as lender • {user.rating?.asBorrower.toFixed(1)} as borrower
            </Text>
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
            <Text style={styles.sectionTitle}>Host Tools</Text>
            <View style={styles.hostIndicator}>
              <Award size={14} color={SECTION_COLORS.host.primary} />
            </View>
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

  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
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
  location: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
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
  hostIndicator: {
    marginBottom: SPACING.md,
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
