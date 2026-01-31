// Block Share App v2.0 - Give or Get Screen
// Choose to keep your freebie or donate to a neighbor in need

import React, { useState } from 'react';
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
  Gift,
  Heart,
  CheckCircle,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { BEEF_COLLECTIVE } from '@/types/food';

export default function GiveOrGetScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<'keep' | 'give' | null>(null);
  const [selectedFreebie, setSelectedFreebie] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const freebies = BEEF_COLLECTIVE.giveOrGetOptions;

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <View style={styles.successIcon}>
          {choice === 'give' ? (
            <Heart size={80} color={SECTION_COLORS.food.primary} fill={SECTION_COLORS.food.primary} />
          ) : (
            <CheckCircle size={80} color={COLORS.success} />
          )}
        </View>
        
        <Text style={styles.successTitle}>
          {choice === 'give' ? 'Thank You! ❤️' : 'Great Choice!'}
        </Text>
        <Text style={styles.successText}>
          {choice === 'give' 
            ? 'Your freebie will be donated to a neighbor in need. You\'re making a real difference!'
            : `Your ${freebies.find(f => f.id === selectedFreebie)?.name} will be included in your next delivery.`
          }
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Gift size={48} color={SECTION_COLORS.food.primary} />
        <Text style={styles.title}>Give or Get</Text>
        <Text style={styles.subtitle}>
          Every delivery includes a freebie. Keep it for yourself, or donate it to a neighbor in need.
        </Text>
      </View>

      {/* Choice Buttons */}
      <View style={styles.choiceContainer}>
        <TouchableOpacity
          style={[styles.choiceCard, choice === 'keep' && styles.choiceCardActive]}
          onPress={() => setChoice('keep')}
        >
          <Text style={styles.choiceEmoji}>🎁</Text>
          <Text style={[styles.choiceTitle, choice === 'keep' && styles.choiceTitleActive]}>
            Keep My Gift
          </Text>
          <Text style={styles.choiceDescription}>
            Select a freebie to include with your delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.choiceCard, choice === 'give' && styles.choiceCardGive]}
          onPress={() => setChoice('give')}
        >
          <Text style={styles.choiceEmoji}>❤️</Text>
          <Text style={[styles.choiceTitle, choice === 'give' && styles.choiceTitleActive]}>
            Give to Neighbor
          </Text>
          <Text style={styles.choiceDescription}>
            Donate your freebie to someone who needs it
          </Text>
        </TouchableOpacity>
      </View>

      {/* Freebie Selection (only if keeping) */}
      {choice === 'keep' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Freebie</Text>
          <View style={styles.freebieGrid}>
            {freebies.map((freebie) => (
              <TouchableOpacity
                key={freebie.id}
                style={[
                  styles.freebieCard,
                  selectedFreebie === freebie.id && styles.freebieCardSelected,
                ]}
                onPress={() => setSelectedFreebie(freebie.id)}
              >
                {selectedFreebie === freebie.id && (
                  <View style={styles.freebieCheck}>
                    <CheckCircle size={20} color={COLORS.white} />
                  </View>
                )}
                <Text style={styles.freebieEmoji}>
                  {freebie.category === 'broth' ? '🍲' : 
                   freebie.category === 'spice' ? '🧂' :
                   freebie.category === 'tool' ? '🌡️' : '👨‍🍳'}
                </Text>
                <Text style={styles.freebieName}>{freebie.name}</Text>
                <Text style={styles.freebieDescription} numberOfLines={2}>
                  {freebie.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Give Message */}
      {choice === 'give' && (
        <View style={styles.giveMessage}>
          <Heart size={24} color={SECTION_COLORS.food.primary} fill={SECTION_COLORS.food.primary} />
          <Text style={styles.giveMessageText}>
            Your generosity helps build a caring community. The freebie will go to a neighbor experiencing food insecurity.
          </Text>
        </View>
      )}

      {/* Confirm Button */}
      {choice && (choice === 'give' || selectedFreebie) && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>
            {choice === 'give' ? 'Confirm Donation' : 'Confirm Selection'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centeredContent: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },

  // Header
  header: { alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xxl },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 22 },

  // Choice Cards
  choiceContainer: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.md },
  choiceCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  choiceCardActive: { borderColor: SECTION_COLORS.food.primary, backgroundColor: SECTION_COLORS.food.light },
  choiceCardGive: { borderColor: '#E91E63', backgroundColor: '#FCE4EC' },
  choiceEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  choiceTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xs },
  choiceTitleActive: { color: SECTION_COLORS.food.primary },
  choiceDescription: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, textAlign: 'center' },

  // Section
  section: { padding: SPACING.md, marginTop: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },

  // Freebie Grid
  freebieGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  freebieCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.sm,
  },
  freebieCardSelected: { borderColor: SECTION_COLORS.food.primary },
  freebieCheck: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SECTION_COLORS.food.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freebieEmoji: { fontSize: 32, marginBottom: SPACING.sm },
  freebieName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xs },
  freebieDescription: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, textAlign: 'center' },

  // Give Message
  giveMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: '#FCE4EC',
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  giveMessageText: { flex: 1, fontSize: FONT_SIZES.md, color: COLORS.text, lineHeight: 22 },

  // Buttons
  confirmButton: {
    backgroundColor: SECTION_COLORS.food.primary,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  confirmButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  primaryButton: {
    backgroundColor: SECTION_COLORS.food.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  primaryButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },

  // Success
  successIcon: { marginBottom: SPACING.xl },
  successTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  successText: { fontSize: FONT_SIZES.md, color: COLORS.text, textAlign: 'center', lineHeight: 22 },

  bottomSpacer: { height: SPACING.xxl },
});
