// Block Share App v2.0 - Home Tab
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
  Bell,
  MapPin,
  Coins,
  Leaf,
  Package,
  Users,
  ArrowRight,
} from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { MOCK_CURRENT_USER, MOCK_ACTIVE_VOTE, MOCK_FOOD_SUBSCRIPTION } from '@/mocks/data';

const MOCK_IMPACT = {
  moneySaved: 127.50,
  itemsBorrowed: 6,
  neighbours: 23,
};

export default function HomeScreen() {
  const router = useRouter();
  const user = MOCK_CURRENT_USER;
  const hasActiveVote = MOCK_ACTIVE_VOTE.status === 'active';
  const hasUpcomingDelivery = MOCK_FOOD_SUBSCRIPTION.status === 'active';
  const delivery = MOCK_FOOD_SUBSCRIPTION.currentDelivery;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* App Bar */}
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>Blockshare</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={22} color={COLORS.text} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greetingSub}>Welcome back,</Text>
          <Text style={styles.greetingName}>{user.firstName}.</Text>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <MapPin size={13} color={COLORS.textFaint} strokeWidth={1.8} />
          <Text style={styles.locationText}>{user.buildingName}</Text>
        </View>

        {/* Credits Hero Card */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsCardInner}>
            <Text style={styles.creditsLabel}>Block credits</Text>
            <Text style={styles.creditsNumber}>{user.creditBalance.toFixed(0)}</Text>
            <Text style={styles.creditsSubtext}>Earn more by sharing your stuff</Text>
          </View>
          <View style={styles.creditsIconBox}>
            <Coins size={28} color="rgba(255,255,255,0.9)" strokeWidth={1.6} />
          </View>
        </View>

        {/* Impact Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Leaf size={16} color={COLORS.accent} strokeWidth={1.8} style={styles.statIcon} />
            <Text style={styles.statNumber}>${MOCK_IMPACT.moneySaved.toFixed(0)}</Text>
            <Text style={styles.statLabel}>saved</Text>
          </View>
          <View style={styles.statTile}>
            <Package size={16} color={COLORS.accent} strokeWidth={1.8} style={styles.statIcon} />
            <Text style={styles.statNumber}>{MOCK_IMPACT.itemsBorrowed}</Text>
            <Text style={styles.statLabel}>borrowed</Text>
          </View>
          <View style={styles.statTile}>
            <Users size={16} color={COLORS.accent} strokeWidth={1.8} style={styles.statIcon} />
            <Text style={styles.statNumber}>{MOCK_IMPACT.neighbours}</Text>
            <Text style={styles.statLabel}>neighbours</Text>
          </View>
        </View>

        {/* Quick Actions Kicker */}
        <Text style={styles.kicker}>QUICK ACTIONS</Text>

        {/* Action Cards */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/stuff')} activeOpacity={0.8}>
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.primary }]}>
              <Package size={22} color={COLORS.white} strokeWidth={1.8} />
            </View>
            <Text style={styles.actionTitle}>Borrow something</Text>
            <Text style={styles.actionSub}>Browse your block's pool</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/stuff')} activeOpacity={0.8}>
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.accent }]}>
              <ArrowRight size={22} color={COLORS.white} strokeWidth={1.8} />
            </View>
            <Text style={styles.actionTitle}>Share an item</Text>
            <Text style={styles.actionSub}>List something to lend</Text>
          </TouchableOpacity>
        </View>

        {/* Vote Card */}
        {hasActiveVote && (
          <TouchableOpacity
            style={styles.voteCard}
            onPress={() => router.push(`/vote/${MOCK_ACTIVE_VOTE.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.voteBadge}>
              <Text style={styles.voteBadgeText}>Vote open</Text>
            </View>
            <Text style={styles.voteTitle} numberOfLines={2}>{MOCK_ACTIVE_VOTE.title}</Text>
            <Text style={styles.voteAction}>Cast your ballot →</Text>
          </TouchableOpacity>
        )}

        {/* Food Delivery Card */}
        {hasUpcomingDelivery && delivery && (
          <TouchableOpacity
            style={styles.deliveryCard}
            onPress={() => router.push('/food')}
            activeOpacity={0.8}
          >
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>Delivery soon</Text>
            </View>
            <Text style={styles.deliveryTitle}>{MOCK_FOOD_SUBSCRIPTION.collectiveName}</Text>
            <Text style={styles.deliveryAction}>
              {delivery.contents.length} items · make your Give-or-Get choice
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: SPACING.md,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
  },

  // Greeting
  greetingRow: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  greetingSub: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSoft,
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 32,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.8,
    lineHeight: 36,
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.lg,
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textFaint,
  },

  // Credits Card
  creditsCard: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.md,
  },
  creditsCardInner: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  creditsNumber: {
    fontSize: FONT_SIZES.hero,
    fontFamily: 'Georgia',
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: 50,
    letterSpacing: -1,
  },
  creditsSubtext: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  creditsIconBox: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Impact Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    marginBottom: 4,
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textFaint,
    marginTop: 2,
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

  // Action Cards
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  actionSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textFaint,
    lineHeight: 16,
  },

  // Vote Card
  voteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  voteBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryWash,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    marginBottom: SPACING.sm,
  },
  voteBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  voteTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  voteAction: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Delivery Card
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  deliveryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDEAEC',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    marginBottom: SPACING.sm,
  },
  deliveryBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.food,
  },
  deliveryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  deliveryAction: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSoft,
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
