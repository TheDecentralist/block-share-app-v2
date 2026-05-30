// Block Share App v2.0 - Stuff Tab
// Design system port from Claude Design prototype

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus, Star } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { CATEGORIES } from '@/constants/categories';
import { MOCK_ITEMS } from '@/mocks/data';
import { Item, ItemCategory } from '@/types/item';

export default function StuffScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories that have items in the mock data
  const categoriesWithItems = useMemo(() => {
    const cats = new Set(MOCK_ITEMS.map(i => i.category));
    return CATEGORIES.filter(c => cats.has(c.id) && c.id !== 'wanted');
  }, []);

  const filteredItems = useMemo(() => {
    let items = MOCK_ITEMS;
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Stuff</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/item/add')}>
          <Plus size={22} color={COLORS.text} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.textFaint} strokeWidth={1.8} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor={COLORS.textFaint}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsContent}
      >
        <TouchableOpacity
          style={[styles.chip, selectedCategory === 'all' && styles.chipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.chipText, selectedCategory === 'all' && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {categoriesWithItems.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>
              {cat.emoji} {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Item Grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySub}>Be the first to share something!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ItemCard({ item, onPress }: { item: Item; onPress: () => void }) {
  const category = CATEGORIES.find(c => c.id === item.category);
  const isAvailable = item.status === 'available';

  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress} activeOpacity={0.8}>
      {/* Photo placeholder */}
      <View style={styles.photoPlaceholder}>
        {/* Striped pattern via diagonal lines illusion with background */}
        <View style={styles.stripedBg} />
        {/* Emoji + status badge */}
        <View style={styles.badgeRow}>
          <Text style={styles.categoryEmoji}>{category?.emoji ?? '📦'}</Text>
          <View style={[styles.statusDot, { backgroundColor: isAvailable ? COLORS.available : COLORS.borrowed }]} />
        </View>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.ownerName}>{item.ownerName}</Text>
          {item.rating && (
            <View style={styles.ratingRow}>
              <Star size={11} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.ratingText}>{item.rating.average.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // App Bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appBarTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.stuff,
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },

  // Chips
  chipsScroll: {
    flexGrow: 0,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chipsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  chipTextActive: {
    color: COLORS.white,
  },

  // Grid
  columnWrapper: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  gridContent: {
    paddingTop: SPACING.md,
    paddingBottom: 100,
    gap: SPACING.sm,
  },

  // Item Card
  itemCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  photoPlaceholder: {
    height: 130,
    backgroundColor: COLORS.cream,
    position: 'relative',
    overflow: 'hidden',
  },
  stripedBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.cream,
    opacity: 0.5,
  },
  badgeRow: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  itemInfo: {
    padding: SPACING.sm,
  },
  itemTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textFaint,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSoft,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySub: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textFaint,
  },
});
