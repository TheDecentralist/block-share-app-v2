// Block Share App v2.0 - Food Tab
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
  ChevronRight,
  Leaf,
  Package,
  Users,
} from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { MOCK_FOOD_SUBSCRIPTION } from '@/mocks/data';
import { BEEF_COLLECTIVE } from '@/types/food';

export default function FoodScreen() {
  const router = useRouter();
  const subscription = MOCK_FOOD_SUBSCRIPTION;
  const hasSubscription = subscription && subscription.status === 'active';
  const collective = BEEF_COLLECTIVE;
  const delivery = subscription.currentDelivery;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Food</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {hasSubscription ? (
          <>
            {/* Active badge + heading */}
            <View style={styles.activeBadgeRow}>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
              <Text style={styles.tierLabel}>{subscription.tier}</Text>
            </View>
            <Text style={styles.collectiveName}>{subscription.collectiveName}</Text>

            {/* Next Delivery Card */}
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryKicker}>NEXT DELIVERY</Text>
              <View style={styles.deliveryDateChip}>
                <Text style={styles.deliveryDateText}>
                  {subscription.nextDelivery ? formatDate(subscription.nextDelivery) : 'Coming Soon'}
                </Text>
              </View>

              {/* Box contents as pills */}
              {delivery && (
                <View style={styles.contentsPills}>
                  {delivery.contents.map((item, index) => (
                    <View key={index} style={styles.pill}>
                      <Text style={styles.pillText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Give or Get */}
              {delivery?.giveOrGetChoice === 'pending' && (
                <TouchableOpacity
                  style={styles.giveGetArea}
                  onPress={() => router.push('/food/give-or-get')}
                >
                  <Text style={styles.giveGetPrompt}>Make your Give-or-Get choice</Text>
                  <ChevronRight size={16} color={COLORS.primary} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>

            {/* Collective Impact */}
            <Text style={styles.kicker}>COLLECTIVE IMPACT</Text>
            <View style={styles.statsRow}>
              <View style={styles.statTile}>
                <Leaf size={16} color={COLORS.food} strokeWidth={1.8} />
                <Text style={styles.statNumber}>${subscription.totalSaved.toFixed(0)}</Text>
                <Text style={styles.statLabel}>saved</Text>
              </View>
              <View style={styles.statTile}>
                <Package size={16} color={COLORS.food} strokeWidth={1.8} />
                <Text style={styles.statNumber}>{subscription.totalDeliveries}</Text>
                <Text style={styles.statLabel}>deliveries</Text>
              </View>
              <View style={styles.statTile}>
                <Users size={16} color={COLORS.food} strokeWidth={1.8} />
                <Text style={styles.statNumber}>{subscription.neighborsHelped}</Text>
                <Text style={styles.statLabel}>helped</Text>
              </View>
            </View>

            {/* Manage */}
            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Photo placeholder */}
            <View style={styles.heroPhoto}>
              <Text style={styles.heroEmoji}>🥩</Text>
            </View>

            <Text style={styles.heroTitle}>{collective.name}</Text>
            <Text style={styles.heroTagline}>{collective.tagline}</Text>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push('/food/subscribe')}
            >
              <Text style={styles.joinButtonText}>Join the collective</Text>
            </TouchableOpacity>
          </>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.food,
    letterSpacing: -0.3,
  },

  // Active subscription heading
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  activeBadge: {
    backgroundColor: '#FDEAEC',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  activeBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.food,
  },
  tierLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSoft,
    textTransform: 'capitalize',
  },
  collectiveName: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: SPACING.lg,
  },

  // Delivery Card
  deliveryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  deliveryKicker: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  deliveryDateChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    marginBottom: SPACING.md,
  },
  deliveryDateText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  contentsPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  pill: {
    backgroundColor: COLORS.surface2,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSoft,
  },
  giveGetArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primaryWash,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  giveGetPrompt: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Stats
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textFaint,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  },

  // Manage
  manageButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.food,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.food,
  },

  // Not subscribed
  heroPhoto: {
    height: 200,
    backgroundColor: COLORS.cream,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxl,
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  heroTagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSoft,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  joinButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
