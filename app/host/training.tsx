// Block Share App v2.0 - Host Training Screen
// Training modules list with progress tracking

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  CheckCircle,
  Circle,
  PlayCircle,
  Clock,
  ChevronRight,
  Award,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { TRAINING_MODULES } from '@/constants/training-modules';
import { MOCK_HOST_USER } from '@/mocks/data';

export default function HostTrainingScreen() {
  const router = useRouter();
  const hostProfile = MOCK_HOST_USER.hostProfile;
  
  const getModuleStatus = (moduleId: string) => {
    if (!hostProfile) return 'locked';
    const progress = hostProfile.trainingProgress.find(p => p.moduleId === moduleId);
    if (progress?.completed) return 'completed';
    
    // Check if previous modules are completed
    const moduleIndex = TRAINING_MODULES.findIndex(m => m.id === moduleId);
    if (moduleIndex === 0) return 'available';
    
    const previousModule = TRAINING_MODULES[moduleIndex - 1];
    const previousProgress = hostProfile.trainingProgress.find(p => p.moduleId === previousModule.id);
    
    return previousProgress?.completed ? 'available' : 'locked';
  };

  const completedCount = hostProfile?.trainingProgress.filter(p => p.completed).length || 0;
  const totalRequired = TRAINING_MODULES.filter(m => m.requiredToActivate).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Progress Header */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Award size={24} color={SECTION_COLORS.host.primary} />
          <Text style={styles.progressTitle}>Your Progress</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(completedCount / TRAINING_MODULES.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.progressText}>
          {completedCount} of {TRAINING_MODULES.length} modules completed
        </Text>
        
        {completedCount >= totalRequired ? (
          <View style={styles.activationBadge}>
            <CheckCircle size={16} color={COLORS.success} />
            <Text style={styles.activationText}>Host tools activated!</Text>
          </View>
        ) : (
          <Text style={styles.progressSubtext}>
            Complete {totalRequired - completedCount} more required modules to activate Host tools
          </Text>
        )}
      </View>

      {/* Module List */}
      <View style={styles.moduleList}>
        {TRAINING_MODULES.map((module, index) => {
          const status = getModuleStatus(module.id);
          
          return (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleCard,
                status === 'locked' && styles.moduleCardLocked,
              ]}
              onPress={() => {
                if (status !== 'locked') {
                  router.push(`/host/training/${module.id}`);
                }
              }}
              disabled={status === 'locked'}
            >
              <View style={styles.moduleStatus}>
                {status === 'completed' ? (
                  <CheckCircle size={24} color={COLORS.success} />
                ) : status === 'available' ? (
                  <PlayCircle size={24} color={SECTION_COLORS.host.primary} />
                ) : (
                  <Circle size={24} color={COLORS.textLight} />
                )}
              </View>
              
              <View style={styles.moduleContent}>
                <View style={styles.moduleHeader}>
                  <Text style={[
                    styles.moduleNumber,
                    status === 'locked' && styles.textLocked,
                  ]}>
                    Module {index + 1}
                  </Text>
                  {module.requiredToActivate && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[
                  styles.moduleTitle,
                  status === 'locked' && styles.textLocked,
                ]}>
                  {module.title}
                </Text>
                
                <Text style={[
                  styles.moduleDescription,
                  status === 'locked' && styles.textLocked,
                ]} numberOfLines={2}>
                  {module.description}
                </Text>
                
                <View style={styles.moduleMeta}>
                  <Clock size={14} color={status === 'locked' ? COLORS.textLight : COLORS.textLight} />
                  <Text style={[
                    styles.moduleMetaText,
                    status === 'locked' && styles.textLocked,
                  ]}>
                    {module.duration}
                  </Text>
                </View>
              </View>
              
              {status !== 'locked' && (
                <ChevronRight size={20} color={COLORS.textLight} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Progress Card
  progressCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: SECTION_COLORS.host.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  progressSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  activationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  activationText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },

  // Module List
  moduleList: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  moduleCardLocked: {
    backgroundColor: COLORS.border,
    opacity: 0.7,
  },
  moduleStatus: {
    marginRight: SPACING.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  moduleNumber: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: SECTION_COLORS.host.primary,
    textTransform: 'uppercase',
  },
  requiredBadge: {
    backgroundColor: SECTION_COLORS.host.light,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  requiredText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: SECTION_COLORS.host.primary,
  },
  moduleTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  moduleDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  moduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  moduleMetaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  textLocked: {
    color: COLORS.textLight,
  },

  bottomSpacer: {
    height: SPACING.xl,
  },
});
