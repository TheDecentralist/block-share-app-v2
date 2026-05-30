// Block Share App v2.0 - Home Tab
// Dashboard with impact metrics, quick actions, and activity feed

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
  TrendingUp,
  Clock,
  Package,
  Truck,
  Vote,
  ChevronRight,
  Megaphone,
  Users,
  Award,
  PlusCircle,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { MOCK_CURRENT_USER, MOCK_ITEMS, MOCK_ACTIVE_VOTE, MOCK_FOOD_SUBSCRIPTION } from '@/mocks/data';

export default function HomeScreen() {
  const router = useRouter();
  const user = MOCK_CURRENT_USER;
  const hasActiveVote = MOCK_ACTIVE_VOTE.status === 'active';
  const hasUpcomingDelivery = MOCK_FOOD_SUBSCRIPTION.status === 'active';

  // Calculate impact metrics
  const moneySaved = 127.50; // Mock: would calculate from borrow history
  const hourlyWage = 25; // User could set this in settings
  const hoursReclaimed = Math.round(moneySaved / hourlyWage);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Impact Card */}
      <TouchableOpacity style={styles.impactCard} activeOpacity={0.8}>
        <View style={styles.impactHeader}>
          <TrendingUp size={24} color={COLORS.white} />
          <Text style={styles.impactLabel}>Your Impact This Month</Text>
        </View>
        
        <View style={styles.impactStats}>
          <View style={styles.impactStat}>
            <Text style={styles.impactNumber}>${moneySaved.toFixed(0)}</Text>
            <Text style={styles.impactStatLabel}>saved</Text>
          </View>
          <View style={styles.impactDivider} />
          <View style={styles.impactStat}>
            <Text style={styles.impactNumber}>{hoursReclaimed}</Text>
            <Text style={styles.impactStatLabel}>hours reclaimed</Text>
          </View>
        </View>
        
        <View style={styles.impactFooter}>
          <Clock size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.impactFooterText}>
            That's {hoursReclaimed} hours of life you didn't have to work for stuff!
          </Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: SECTION_COLORS.stuff.light }]}
            onPress={() => router.push('/stuff')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: SECTION_COLORS.stuff.primary }]}>
              <Package size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionLabel}>Borrow</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: SECTION_COLORS.stuff.light }]}
            onPress={() => router.push('/item/add')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: SECTION_COLORS.stuff.primary }]}>
              <PlusCircle size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionLabel}>Share</Text>
          </TouchableOpacity>

          {hasUpcomingDelivery && (
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: SECTION_COLORS.food.light }]}
              onPress={() => router.push('/food')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: SECTION_COLORS.food.primary }]}>
                <Truck size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionLabel}>Delivery</Text>
            </TouchableOpacity>
          )}

          {hasActiveVote && !hasUpcomingDelivery && (
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: SECTION_COLORS.community.light }]}
              onPress={() => router.push(`/vote/${MOCK_ACTIVE_VOTE.id}`)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: SECTION_COLORS.community.primary }]}>
                <Vote size={24} color={COLORS.white} />
              </View>
              <Text style={styles.quickActionLabel}>Vote</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Host Dashboard Card (only shown if user is a host) */}
      {user.isHost && (
        <View style={styles.section}>
          <View style={styles.hostCard}>
            <View style={styles.hostHeader}>
              <Award size={20} color={SECTION_COLORS.host.primary} />
              <Text style={styles.hostTitle}>Host Dashboard</Text>
            </View>
            
            <View style={styles.hostStats}>
              <View style={styles.hostStat}>
                <Text style={styles.hostStatNumber}>3</Text>
                <Text style={styles.hostStatLabel}>new members</Text>
              </View>
              <View style={styles.hostStat}>
                <Text style={styles.hostStatNumber}>2</Text>
                <Text style={styles.hostStatLabel}>messages</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.hostAction}
              onPress={() => router.push('/host/broadcast')}
            >
              <Megaphone size={18} color={SECTION_COLORS.host.primary} />
              <Text style={styles.hostActionText}>Send Announcement</Text>
              <ChevronRight size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Vote Banner */}
      {hasActiveVote && (
        <TouchableOpacity 
          style={styles.voteBanner}
          onPress={() => router.push(`/vote/${MOCK_ACTIVE_VOTE.id}`)}
        >
          <View style={styles.voteBannerContent}>
            <Vote size={20} color={COLORS.white} />
            <View style={styles.voteBannerText}>
              <Text style={styles.voteBannerTitle}>Active Vote</Text>
              <Text style={styles.voteBannerSubtitle} numberOfLines={1}>
                {MOCK_ACTIVE_VOTE.title}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* Activity Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityList}>
          <ActivityItem
            avatar="https://i.pravatar.cc/150?img=4"
            text="Mike borrowed the pressure washer"
            time="2 hours ago"
          />
          <ActivityItem
            avatar="https://i.pravatar.cc/150?img=5"
            text="New item: Kayak added to pool"
            time="Yesterday"
          />
          <ActivityItem
            avatar="https://i.pravatar.cc/150?img=3"
            text="Marcus sent an announcement"
            time="2 days ago"
            isLast
          />
        </View>
      </View>

      {/* Become a Host CTA (if not already a host) */}
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

      {/* Philosophy Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "Trade the Poverty of Individual Consumerism for the Richness of Shared Community"
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

// Activity Item Component
function ActivityItem({ avatar, text, time, isLast }: { avatar: string; text: string; time: string; isLast?: boolean }) {
  return (
    <View style={[styles.activityItem, isLast && styles.activityItemLast]}>
      <Image source={{ uri: avatar }} style={styles.activityAvatar} />
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{text}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Impact Card
  impactCard: {
    backgroundColor: SECTION_COLORS.home.primary,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  impactLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  impactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  impactStat: {
    flex: 1,
    alignItems: 'center',
  },
  impactNumber: {
    color: COLORS.white,
    fontSize: FONT_SIZES.hero,
    fontWeight: '700',
  },
  impactStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  impactDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  impactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  impactFooterText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },

  // Sections
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

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Host Card
  hostCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: SECTION_COLORS.host.primary,
    ...SHADOWS.sm,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  hostTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  hostStats: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.md,
  },
  hostStat: {
    alignItems: 'center',
  },
  hostStatNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: SECTION_COLORS.host.primary,
  },
  hostStatLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  hostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  hostActionText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: SECTION_COLORS.host.primary,
  },

  // Vote Banner
  voteBanner: {
    backgroundColor: SECTION_COLORS.community.primary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  voteBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  voteBannerText: {
    flex: 1,
  },
  voteBannerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    opacity: 0.9,
  },
  voteBannerSubtitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },

  // Activity List
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },

  // Become Host Card
  becomeHostCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
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

  // Quote Card
  quoteCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  quoteText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },

  bottomSpacer: {
    height: SPACING.xl,
  },
});
