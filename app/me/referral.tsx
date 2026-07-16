// Block Share App v2.0 - Referral Code & QR Screen
// Shows personalised referral QR code and tracks Save the Pond invites

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Copy,
  Share2,
  Users,
  Clock,
  CheckCircle,
  Gift,
  ChevronRight,
  Droplets,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import {
  COLORS,
  SECTION_COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';
import { MOCK_REFERRAL_CODE } from '@/mocks/data';
import type { ReferralEvent } from '@/types/referral';

const POND_GREEN = '#2E7D4F';
const POND_LIGHT = '#E8F5EC';

export default function ReferralScreen() {
  const qrRef = useRef<any>(null);
  const referral = MOCK_REFERRAL_CODE;

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(referral.webUrl);
    Alert.alert('Copied!', 'Your referral link is on the clipboard.');
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join me on Block Share and help Save the Pond 🌿\n\n${referral.webUrl}`,
      url: referral.webUrl,
      title: 'Block Share – Save the Pond',
    });
  };

  const statusLabel = (s: ReferralEvent['status']) =>
    ({ pending: 'Pending', credited: 'Credited', rejected: 'Declined' }[s]);

  const statusColor = (s: ReferralEvent['status']) =>
    ({ pending: COLORS.warning, credited: COLORS.success, rejected: COLORS.error }[s]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Project banner */}
      <View style={styles.projectBanner}>
        <Droplets size={28} color={COLORS.white} />
        <View style={styles.projectText}>
          <Text style={styles.projectName}>{referral.project.name}</Text>
          <Text style={styles.projectTagline}>{referral.project.tagline}</Text>
        </View>
      </View>

      {/* How it works */}
      <View style={styles.howItWorks}>
        <Text style={styles.howTitle}>How it works</Text>
        <Text style={styles.howBody}>
          Share your personal QR code or link. When someone scans it, joins Block Share, and completes their community survey,{' '}
          <Text style={styles.howBold}>you earn {referral.project.ccReward} Community Credits</Text> — automatically unlocked.
        </Text>
      </View>

      {/* QR Card */}
      <View style={styles.qrCard}>
        <Text style={styles.qrLabel}>Your referral code</Text>
        <Text style={styles.codeText}>{referral.code}</Text>

        <View style={styles.qrWrapper}>
          <QRCode
            value={referral.webUrl}
            size={200}
            color={POND_GREEN}
            backgroundColor={COLORS.white}
            getRef={qrRef}
          />
        </View>

        <Text style={styles.qrHint}>Print this on stickers or share the link below</Text>

        <View style={styles.urlBox}>
          <Text style={styles.urlText} numberOfLines={1}>{referral.webUrl}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCopyLink}>
            <Copy size={18} color={POND_GREEN} />
            <Text style={styles.actionLabel}>Copy Link</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Share2 size={18} color={POND_GREEN} />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Users size={20} color={SECTION_COLORS.me.primary} />
          <Text style={styles.statNumber}>{referral.stats.totalReferrals}</Text>
          <Text style={styles.statLabel}>Invited</Text>
        </View>
        <View style={styles.statBox}>
          <CheckCircle size={20} color={COLORS.success} />
          <Text style={styles.statNumber}>{referral.stats.creditedReferrals}</Text>
          <Text style={styles.statLabel}>Joined</Text>
        </View>
        <View style={styles.statBox}>
          <Gift size={20} color={SECTION_COLORS.host.primary} />
          <Text style={styles.statNumber}>{referral.stats.totalCCEarned} CC</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      {/* Referral list */}
      {referral.referrals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Invites</Text>
          {referral.referrals.map((ref) => (
            <View key={ref.id} style={styles.referralRow}>
              <View style={styles.referralAvatar}>
                <Text style={styles.referralInitial}>{ref.referredName[0]}</Text>
              </View>
              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{ref.referredName}</Text>
                <Text style={styles.referralDate}>
                  {ref.createdAt.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(ref.status) + '1A' }]}>
                <Text style={[styles.statusText, { color: statusColor(ref.status) }]}>
                  {statusLabel(ref.status)}
                </Text>
              </View>
              {ref.status === 'credited' && (
                <Text style={styles.ccBadge}>+{ref.ccAmount} CC</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Pending explanation */}
      {referral.stats.pendingReferrals > 0 && (
        <View style={styles.pendingNote}>
          <Clock size={16} color={COLORS.warning} />
          <Text style={styles.pendingText}>
            Pending invites unlock once the new member completes Section A of their community survey.
          </Text>
        </View>
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

  projectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: POND_GREEN,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  projectText: { flex: 1 },
  projectName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  projectTagline: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },

  howItWorks: {
    backgroundColor: POND_LIGHT,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  howTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: POND_GREEN,
    marginBottom: SPACING.xs,
  },
  howBody: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  howBold: {
    fontWeight: '700',
    color: POND_GREEN,
  },

  qrCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  qrLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  codeText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: POND_GREEN,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    letterSpacing: 1,
  },
  qrWrapper: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  urlBox: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    width: '100%',
  },
  urlText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },

  actions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    width: '100%',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  actionDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  actionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: POND_GREEN,
  },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },

  section: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: POND_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  referralInitial: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: POND_GREEN,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  referralDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  ccBadge: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.success,
  },

  pendingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: '#FEF9EC',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  pendingText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 18,
  },

  bottomSpacer: {
    height: SPACING.xxl,
  },
});
