// Block Share App v2.0 - Food Tab
// Food collective subscriptions and orders

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
  Truck, 
  Gift, 
  ChevronRight,
  Heart,
  Calendar,
  Package,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { MOCK_FOOD_SUBSCRIPTION } from '@/mocks/data';
import { BEEF_COLLECTIVE } from '@/types/food';

export default function FoodScreen() {
  const router = useRouter();
  const subscription = MOCK_FOOD_SUBSCRIPTION;
  const hasSubscription = subscription && subscription.status === 'active';
  const collective = BEEF_COLLECTIVE;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {hasSubscription ? (
        // Active Subscription View
        <>
          {/* Next Delivery Card */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryHeader}>
              <Truck size={24} color={COLORS.white} />
              <Text style={styles.deliveryLabel}>Next Delivery</Text>
            </View>
            
            <Text style={styles.deliveryDate}>
              {subscription.nextDelivery ? formatDate(subscription.nextDelivery) : 'Coming Soon'}
            </Text>
            
            <View style={styles.deliveryMeta}>
              <View style={styles.deliveryMetaItem}>
                <Package size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.deliveryMetaText}>
                  {subscription.tier === 'family' ? '6.5kg' : subscription.tier === 'gathering' ? '10.5kg' : '18kg'}
                </Text>
              </View>
              <View style={styles.deliveryMetaItem}>
                <Calendar size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.deliveryMetaText}>Every 2 weeks</Text>
              </View>
            </View>
          </View>

          {/* Give or Get Choice */}
          {subscription.currentDelivery?.giveOrGetChoice === 'pending' && (
            <TouchableOpacity 
              style={styles.giveOrGetCard}
              onPress={() => router.push('/food/give-or-get')}
            >
              <Gift size={32} color={SECTION_COLORS.food.primary} />
              <View style={styles.giveOrGetText}>
                <Text style={styles.giveOrGetTitle}>Choose Your Freebie! 🎁</Text>
                <Text style={styles.giveOrGetSubtitle}>Keep it or gift to a neighbor in need</Text>
              </View>
              <ChevronRight size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          )}

          {/* Box Contents Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's in Your Box</Text>
            <View style={styles.contentsCard}>
              {subscription.currentDelivery?.contents.map((item, index) => (
                <View key={index} style={styles.contentItem}>
                  <Text style={styles.contentEmoji}>🥩</Text>
                  <Text style={styles.contentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Impact Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Food Impact</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>${subscription.totalSaved.toFixed(0)}</Text>
                <Text style={styles.statLabel}>saved</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{subscription.totalDeliveries}</Text>
                <Text style={styles.statLabel}>deliveries</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{subscription.neighborsHelped}</Text>
                <Text style={styles.statLabel}>neighbors helped</Text>
              </View>
            </View>
          </View>

          {/* Manage Subscription */}
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Join Collective View
        <>
          {/* Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>🥩</Text>
            <Text style={styles.heroTitle}>{collective.name}</Text>
            <Text style={styles.heroTagline}>{collective.tagline}</Text>
            <Text style={styles.heroPrice}>Every cut, one price: $14/kg</Text>
          </View>

          {/* Philosophy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What We Believe</Text>
            <View style={styles.philosophyList}>
              {collective.philosophy.slice(0, 4).map((item, index) => (
                <View key={index} style={styles.philosophyItem}>
                  <Heart size={16} color={SECTION_COLORS.food.primary} fill={SECTION_COLORS.food.primary} />
                  <Text style={styles.philosophyText}>{item.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Four Pillars */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Four Pillars</Text>
            <View style={styles.pillarsGrid}>
              {collective.pillars.map((pillar, index) => (
                <View key={index} style={styles.pillarCard}>
                  <Text style={styles.pillarIcon}>{pillar.icon}</Text>
                  <Text style={styles.pillarTitle}>{pillar.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Subscription Tiers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            {collective.subscriptionTiers.map((tier) => (
              <TouchableOpacity 
                key={tier.id} 
                style={styles.tierCard}
                onPress={() => router.push('/food/subscribe')}
              >
                <View style={styles.tierHeader}>
                  <Text style={styles.tierName}>{tier.name}</Text>
                  <View style={styles.tierPriceContainer}>
                    <Text style={styles.tierPrice}>${tier.price}</Text>
                    <Text style={styles.tierPricePer}>/month</Text>
                  </View>
                </View>
                <View style={styles.tierDetails}>
                  <Text style={styles.tierDetail}>📦 {tier.weight}</Text>
                  <Text style={styles.tierDetail}>👨‍👩‍👧 {tier.servings}</Text>
                  <Text style={[styles.tierDetail, styles.tierSavings]}>💰 Save {tier.savings}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => router.push('/food/subscribe')}
          >
            <Text style={styles.joinButtonText}>Join the Collective</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Delivery Card (Active Subscription)
  deliveryCard: {
    backgroundColor: SECTION_COLORS.food.primary,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  deliveryLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  deliveryDate: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  deliveryMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  deliveryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  deliveryMetaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
  },

  // Give or Get Card
  giveOrGetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 2,
    borderColor: SECTION_COLORS.food.light,
    ...SHADOWS.sm,
  },
  giveOrGetText: {
    flex: 1,
  },
  giveOrGetTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  giveOrGetSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Section
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  // Contents Card
  contentsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contentEmoji: {
    fontSize: 20,
  },
  contentText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: SECTION_COLORS.food.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },

  // Manage Button
  manageButton: {
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: SECTION_COLORS.food.primary,
    alignItems: 'center',
  },
  manageButtonText: {
    color: SECTION_COLORS.food.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },

  // Hero Card (Join View)
  heroCard: {
    backgroundColor: SECTION_COLORS.food.primary,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  heroPrice: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },

  // Philosophy
  philosophyList: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  philosophyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  philosophyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },

  // Pillars Grid
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  pillarCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  pillarIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  pillarTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },

  // Tier Cards
  tierCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tierName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: SECTION_COLORS.food.primary,
  },
  tierPricePer: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  tierDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  tierDetail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  tierSavings: {
    color: COLORS.success,
    fontWeight: '600',
  },

  // Join Button
  joinButton: {
    backgroundColor: SECTION_COLORS.food.primary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
