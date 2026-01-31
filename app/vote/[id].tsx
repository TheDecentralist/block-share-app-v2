// Block Share App v2.0 - Vote Screen
// Ranked-choice voting interface

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Vote as VoteIcon,
  Clock,
  Users,
  CheckCircle,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '@/constants/theme';
import { MOCK_ACTIVE_VOTE } from '@/mocks/data';

export default function VoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const vote = MOCK_ACTIVE_VOTE; // In real app, fetch by id
  
  const [rankings, setRankings] = useState<string[]>(vote.options.map(o => o.id));
  const [submitted, setSubmitted] = useState(false);

  const moveOption = (optionId: string, direction: 'up' | 'down') => {
    const currentIndex = rankings.indexOf(optionId);
    if (direction === 'up' && currentIndex > 0) {
      const newRankings = [...rankings];
      [newRankings[currentIndex - 1], newRankings[currentIndex]] = 
        [newRankings[currentIndex], newRankings[currentIndex - 1]];
      setRankings(newRankings);
    } else if (direction === 'down' && currentIndex < rankings.length - 1) {
      const newRankings = [...rankings];
      [newRankings[currentIndex], newRankings[currentIndex + 1]] = 
        [newRankings[currentIndex + 1], newRankings[currentIndex]];
      setRankings(newRankings);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const formatTimeRemaining = () => {
    const now = new Date();
    const end = new Date(vote.endsAt);
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return `${diffDays} days left`;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${diffHours} hours left`;
  };

  if (submitted) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <View style={styles.successIcon}>
          <CheckCircle size={80} color={COLORS.success} />
        </View>
        
        <Text style={styles.successTitle}>Vote Submitted!</Text>
        <Text style={styles.successText}>
          Thank you for participating in community decision-making.
        </Text>
        <Text style={styles.successSubtext}>
          Results will be available when voting closes.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Vote Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <VoteIcon size={16} color={COLORS.white} />
          <Text style={styles.headerBadgeText}>{vote.type.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.title}>{vote.title}</Text>
        <Text style={styles.description}>{vote.description}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{formatTimeRemaining()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color={COLORS.textLight} />
            <Text style={styles.metaText}>{vote.eligibleVoters} voters</Text>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How Ranked-Choice Voting Works</Text>
        <Text style={styles.instructionsText}>
          Drag options to rank them in order of preference. Your #1 choice is most preferred. 
          If no option wins a majority, lowest-ranked options are eliminated and votes redistributed.
        </Text>
      </View>

      {/* Ranking Interface */}
      <View style={styles.rankingSection}>
        <Text style={styles.sectionTitle}>Rank Your Preferences</Text>
        <Text style={styles.sectionSubtitle}>Tap arrows to reorder</Text>

        {rankings.map((optionId, index) => {
          const option = vote.options.find(o => o.id === optionId)!;
          return (
            <View key={optionId} style={styles.optionCard}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>
              
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription} numberOfLines={2}>
                  {option.description}
                </Text>
              </View>

              <View style={styles.optionControls}>
                <TouchableOpacity 
                  style={[styles.arrowButton, index === 0 && styles.arrowButtonDisabled]}
                  onPress={() => moveOption(optionId, 'up')}
                  disabled={index === 0}
                >
                  <ChevronUp size={24} color={index === 0 ? COLORS.border : COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.arrowButton, index === rankings.length - 1 && styles.arrowButtonDisabled]}
                  onPress={() => moveOption(optionId, 'down')}
                  disabled={index === rankings.length - 1}
                >
                  <ChevronDown size={24} color={index === rankings.length - 1 ? COLORS.border : COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <VoteIcon size={20} color={COLORS.white} />
        <Text style={styles.submitButtonText}>Submit My Vote</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Your vote is anonymous. You can change your vote until voting closes.
      </Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centeredContent: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },

  // Header
  header: { padding: SPACING.lg, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: SECTION_COLORS.community.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  headerBadgeText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: '600', textTransform: 'capitalize' },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  description: { fontSize: FONT_SIZES.md, color: COLORS.textLight, lineHeight: 22, marginBottom: SPACING.md },
  metaRow: { flexDirection: 'row', gap: SPACING.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaText: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },

  // Instructions
  instructionsCard: {
    backgroundColor: SECTION_COLORS.community.light,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: SECTION_COLORS.community.primary,
  },
  instructionsTitle: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  instructionsText: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, lineHeight: 20 },

  // Ranking Section
  rankingSection: { padding: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  sectionSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginBottom: SPACING.md },

  // Option Cards
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SECTION_COLORS.community.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rankNumber: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  optionDescription: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  optionControls: { marginLeft: SPACING.sm },
  arrowButton: {
    width: TOUCH_TARGET.min,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: { opacity: 0.3 },

  // Submit
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: SECTION_COLORS.community.primary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  submitButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  disclaimer: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
  },

  // Success
  successIcon: { marginBottom: SPACING.xl },
  successTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  successText: { fontSize: FONT_SIZES.md, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  successSubtext: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, textAlign: 'center' },
  primaryButton: {
    backgroundColor: SECTION_COLORS.community.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  primaryButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },

  bottomSpacer: { height: SPACING.xxl },
});
