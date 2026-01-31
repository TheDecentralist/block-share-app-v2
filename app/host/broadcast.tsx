// Block Share App v2.0 - Host Broadcast Screen
// Send announcements to building/block residents

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
  Megaphone,
  Building2,
  Users,
  CheckCircle,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { MESSAGE_TEMPLATES, MessageTemplate, BroadcastScope } from '@/types/chat';

export default function HostBroadcastScreen() {
  const router = useRouter();
  const [scope, setScope] = useState<BroadcastScope>('building');
  const [template, setTemplate] = useState<MessageTemplate | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const templates: { id: MessageTemplate; label: string; icon: string }[] = [
    { id: 'welcome', label: 'Welcome', icon: '👋' },
    { id: 'reminder', label: 'Reminder', icon: '🔔' },
    { id: 'delivery', label: 'Food Delivery', icon: '📦' },
    { id: 'vote', label: 'Vote Reminder', icon: '🗳️' },
    { id: 'custom', label: 'Custom', icon: '✏️' },
  ];

  const handleTemplateSelect = (templateId: MessageTemplate) => {
    setTemplate(templateId);
    const templateData = MESSAGE_TEMPLATES[templateId];
    setSubject(templateData.subject);
    setMessage(templateData.content);
  };

  const handleSend = () => {
    setSent(true);
  };

  if (sent) {
    return (
      <View style={[styles.container, styles.centeredContent]}>
        <View style={styles.successIcon}>
          <CheckCircle size={80} color={COLORS.success} />
        </View>
        
        <Text style={styles.successTitle}>Message Sent!</Text>
        <Text style={styles.successText}>
          Your announcement has been sent to {scope === 'building' ? 'all building' : 'all block'} residents.
        </Text>
        <Text style={styles.successSubtext}>47 recipients</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Scope Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Send to</Text>
          <View style={styles.scopeButtons}>
            <TouchableOpacity
              style={[styles.scopeButton, scope === 'building' && styles.scopeButtonActive]}
              onPress={() => setScope('building')}
            >
              <Building2 size={20} color={scope === 'building' ? COLORS.white : COLORS.textLight} />
              <Text style={[styles.scopeButtonText, scope === 'building' && styles.scopeButtonTextActive]}>
                My Building
              </Text>
              <Text style={[styles.scopeCount, scope === 'building' && styles.scopeCountActive]}>47</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.scopeButton, scope === 'block' && styles.scopeButtonActive]}
              onPress={() => setScope('block')}
            >
              <Users size={20} color={scope === 'block' ? COLORS.white : COLORS.textLight} />
              <Text style={[styles.scopeButtonText, scope === 'block' && styles.scopeButtonTextActive]}>
                My Block
              </Text>
              <Text style={[styles.scopeCount, scope === 'block' && styles.scopeCountActive]}>124</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Template Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>Quick Templates</Text>
          <View style={styles.templateGrid}>
            {templates.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.templateButton, template === t.id && styles.templateButtonActive]}
                onPress={() => handleTemplateSelect(t.id)}
              >
                <Text style={styles.templateIcon}>{t.icon}</Text>
                <Text style={[styles.templateLabel, template === t.id && styles.templateLabelActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="What's this about?"
            placeholderTextColor={COLORS.textLight}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your message here..."
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {/* Preview */}
        {(subject || message) && (
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.previewContent}>
              {subject && <Text style={styles.previewSubject}>{subject}</Text>}
              {message && <Text style={styles.previewMessage}>{message}</Text>}
            </View>
          </View>
        )}

        {/* Send Button */}
        <TouchableOpacity 
          style={[styles.sendButton, (!subject || !message) && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={!subject || !message}
        >
          <Megaphone size={20} color={COLORS.white} />
          <Text style={styles.sendButtonText}>
            Send to {scope === 'building' ? '47' : '124'} Residents
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  centeredContent: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  section: { padding: SPACING.md },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },

  // Scope Selector
  scopeButtons: { flexDirection: 'row', gap: SPACING.md },
  scopeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  scopeButtonActive: { backgroundColor: SECTION_COLORS.host.primary, borderColor: SECTION_COLORS.host.primary },
  scopeButtonText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight },
  scopeButtonTextActive: { color: COLORS.white },
  scopeCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textLight,
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  scopeCountActive: { backgroundColor: 'rgba(255,255,255,0.3)', color: COLORS.white },

  // Template Grid
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  templateButton: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 80,
  },
  templateButtonActive: { borderColor: SECTION_COLORS.host.primary, backgroundColor: SECTION_COLORS.host.light },
  templateIcon: { fontSize: 24, marginBottom: SPACING.xs },
  templateLabel: { fontSize: FONT_SIZES.xs, fontWeight: '600', color: COLORS.textLight },
  templateLabelActive: { color: SECTION_COLORS.host.primary },

  // Inputs
  input: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Preview
  previewCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: SECTION_COLORS.host.primary,
    ...SHADOWS.sm,
  },
  previewLabel: { fontSize: FONT_SIZES.xs, fontWeight: '600', color: COLORS.textLight, marginBottom: SPACING.sm },
  previewContent: { gap: SPACING.xs },
  previewSubject: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  previewMessage: { fontSize: FONT_SIZES.sm, color: COLORS.text, lineHeight: 20 },

  // Buttons
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: SECTION_COLORS.host.primary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  buttonDisabled: { backgroundColor: COLORS.textLight },
  sendButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  primaryButton: {
    backgroundColor: SECTION_COLORS.host.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  primaryButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },

  // Success
  successIcon: { marginBottom: SPACING.xl },
  successTitle: { fontSize: FONT_SIZES.xxl, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  successText: { fontSize: FONT_SIZES.md, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  successSubtext: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, textAlign: 'center' },

  bottomSpacer: { height: SPACING.xxl },
});
