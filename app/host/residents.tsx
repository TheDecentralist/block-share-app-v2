// Block Share App v2.0 - Host Residents Screen
// View and message building residents

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search,
  MessageCircle,
  Package,
  Clock,
  Filter,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '@/constants/theme';
import { MOCK_BUILDING_MEMBERS } from '@/mocks/data';

export default function HostResidentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'items'>('name');

  const filteredMembers = MOCK_BUILDING_MEMBERS
    .filter(member => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return member.name.toLowerCase().includes(query) || member.unit.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'activity') return b.lastActive.getTime() - a.lastActive.getTime();
      if (sortBy === 'items') return b.itemsShared - a.itemsShared;
      return 0;
    });

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderMember = ({ item }: { item: typeof MOCK_BUILDING_MEMBERS[0] }) => (
    <View style={styles.memberCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberUnit}>Unit {item.unit}</Text>
        
        <View style={styles.memberMeta}>
          <View style={styles.metaItem}>
            <Clock size={12} color={COLORS.textLight} />
            <Text style={styles.metaText}>{formatLastActive(item.lastActive)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Package size={12} color={COLORS.textLight} />
            <Text style={styles.metaText}>{item.itemsShared} items</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <MessageCircle size={20} color={SECTION_COLORS.host.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or unit..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{MOCK_BUILDING_MEMBERS.length}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {MOCK_BUILDING_MEMBERS.filter(m => {
              const diffDays = Math.floor((new Date().getTime() - m.lastActive.getTime()) / (1000 * 60 * 60 * 24));
              return diffDays < 7;
            }).length}
          </Text>
          <Text style={styles.statLabel}>Active this week</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {MOCK_BUILDING_MEMBERS.reduce((sum, m) => sum + m.itemsShared, 0)}
          </Text>
          <Text style={styles.statLabel}>Items shared</Text>
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['name', 'activity', 'items'] as const).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortButton, sortBy === option && styles.sortButtonActive]}
            onPress={() => setSortBy(option)}
          >
            <Text style={[styles.sortButtonText, sortBy === option && styles.sortButtonTextActive]}>
              {option === 'name' ? 'Name' : option === 'activity' ? 'Activity' : 'Items'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No members found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: SECTION_COLORS.host.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },

  // Sort
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  sortLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  sortButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
  },
  sortButtonActive: {
    backgroundColor: SECTION_COLORS.host.primary,
  },
  sortButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  sortButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },

  // Member Card
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  memberUnit: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  memberMeta: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  messageButton: {
    width: TOUCH_TARGET.min,
    height: TOUCH_TARGET.min,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SECTION_COLORS.host.light,
    borderRadius: BORDER_RADIUS.md,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
});
