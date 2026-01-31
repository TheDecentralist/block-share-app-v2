// Block Share App v2.0 - Host Application Screen
// Simple application flow for becoming a Block Host

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Users, 
  CheckCircle,
  ChevronRight,
  Award,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

type Step = 'intro' | 'form' | 'confirmation';

export default function HostApplyScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    // In real app, would submit to backend
    setStep('confirmation');
  };

  if (step === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Award size={64} color={SECTION_COLORS.host.primary} />
        </View>
        
        <Text style={styles.title}>Become a Block Share Host</Text>
        <Text style={styles.subtitle}>
          Help your building build community through sharing
        </Text>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What Hosts Do</Text>
          
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Welcome and onboard new members</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Facilitate pool decisions and voting</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Coordinate food collective deliveries</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Send announcements to residents</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <CheckCircle size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Help resolve minor issues between neighbors</Text>
          </View>
        </View>

        <View style={styles.timeCard}>
          <Text style={styles.timeTitle}>Time Commitment</Text>
          <Text style={styles.timeText}>~2-4 hours per month</Text>
          <Text style={styles.timeSubtext}>
            Most tasks can be done from your phone in a few minutes
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setStep('form')}
        >
          <Text style={styles.primaryButtonText}>I'm Interested</Text>
          <ChevronRight size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (step === 'form') {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.formTitle}>Tell Us About Yourself</Text>
          <Text style={styles.formSubtitle}>
            We'll review your application and get back to you within 48 hours
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Building</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>The Gardens</Text>
            </View>
            <Text style={styles.helpText}>This is based on your profile address</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Why do you want to be a Host?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us what motivates you to help build community..."
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, !reason && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!reason}
          >
            <Text style={styles.primaryButtonText}>Submit Application</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setStep('intro')}
          >
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Confirmation
  return (
    <View style={[styles.container, styles.centeredContent]}>
      <View style={styles.successIcon}>
        <CheckCircle size={80} color={COLORS.success} />
      </View>
      
      <Text style={styles.successTitle}>Application Received!</Text>
      <Text style={styles.successText}>
        We'll review your application and get back to you within 48 hours.
      </Text>
      <Text style={styles.successSubtext}>
        Once approved, you'll get access to Host training materials.
      </Text>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.back()}
      >
        <Text style={styles.primaryButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },

  // Intro Screen
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  // Benefits Card
  benefitsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  benefitsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  benefitText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },

  // Time Card
  timeCard: {
    backgroundColor: SECTION_COLORS.host.light,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: SECTION_COLORS.host.primary,
  },
  timeTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  timeText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timeSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },

  // Form Screen
  formTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  formSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  readOnlyField: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  readOnlyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Buttons
  primaryButton: {
    backgroundColor: SECTION_COLORS.host.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },

  // Success Screen
  successIcon: {
    marginBottom: SPACING.xl,
  },
  successTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  successText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
