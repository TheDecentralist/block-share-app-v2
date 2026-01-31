// Block Share App v2.0 - Stuff Tab (Pools)
// Browse, borrow, and share items with simplified category grid

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search, 
  Plus, 
  MapPin, 
  Star,
  ChevronLeft,
  Filter,
} from 'lucide-react-native';
import { COLORS, SECTION_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '@/constants/theme';
import { CATEGORIES, POOL_TYPES } from '@/constants/categories';
import { MOCK_ITEMS } from '@/mocks/data';
import { Item, ItemCategory } from '@/types/item';

type ViewMode = 'categories' | 'items';
type PoolScope = 'building' | 'block' | 'nearby';

export default function StuffScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  const [poolScope, setPoolScope] = useState<PoolScope>('building');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let items = MOCK_ITEMS;
    
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
    
    if (poolScope === 'building') {
      items = items.filter(item => item.poolType === 'building');
    } else if (poolScope === 'block') {
      items = items.filter(item => item.poolType === 'building' || item.poolType === 'block');
    }
    
    return items;
  }, [selectedCategory, poolScope, searchQuery]);

  const handleCategoryPress = (categoryId: ItemCategory) => {
    setSelectedCategory(categoryId);
    setViewMode('items');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setSearchQuery('');
  };

  const getCategoryInfo = (id: ItemCategory) => CATEGORIES.find(c => c.id === id);

  return (
    <View style={styles.container}>
      {/* Pool Scope Selector */}
      <View style={styles.scopeSelector}>
        {POOL_TYPES.map((pool) => (
          <TouchableOpacity
            key={pool.id}
            style={[styles.scopeButton, poolScope === pool.id && styles.scopeButtonActive]}
            onPress={() => setPoolScope(pool.id as PoolScope)}
          >
            <Text style={[styles.scopeButtonText, poolScope === pool.id && styles.scopeButtonTextActive]}>
              {pool.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'categories' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => searchQuery && setViewMode('items')}
            />
          </View>

          <View style={styles.categoryGrid}>
            {CATEGORIES.filter(c => c.id !== 'wanted').map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.wantedCard} onPress={() => handleCategoryPress('wanted')}>
            <Text style={styles.wantedEmoji}>🔍</Text>
            <View style={styles.wantedText}>
              <Text style={styles.wantedTitle}>Looking for Something?</Text>
              <Text style={styles.wantedSubtitle}>See what neighbors need</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.itemsContainer}>
          <View style={styles.itemsHeader}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToCategories}>
              <ChevronLeft size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.itemsHeaderText}>
              {selectedCategory && (
                <>
                  <Text style={styles.itemsHeaderEmoji}>{getCategoryInfo(selectedCategory)?.emoji}</Text>
                  <Text style={styles.itemsHeaderTitle}>{getCategoryInfo(selectedCategory)?.name}</Text>
                </>
              )}
              {!selectedCategory && searchQuery && (
                <Text style={styles.itemsHeaderTitle}>Search: "{searchQuery}"</Text>
              )}
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />}
            contentContainerStyle={styles.itemsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📦</Text>
                <Text style={styles.emptyStateText}>No items found</Text>
                <Text style={styles.emptyStateSubtext}>Be the first to share something!</Text>
              </View>
            }
          />
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/item/add')}>
        <Plus size={28} color={COLORS.white} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

function ItemCard({ item, onPress }: { item: Item; onPress: () => void }) {
  const isAvailable = item.status === 'available';
  
  return (
    <TouchableOpacity style={styles.itemCard} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isAvailable ? COLORS.available : COLORS.borrowed }]}>
            <Text style={styles.statusText}>{isAvailable ? 'Available' : 'Borrowed'}</Text>
          </View>
        </View>

        <View style={styles.itemMeta}>
          <View style={styles.itemMetaRow}>
            <MapPin size={14} color={COLORS.textLight} />
            <Text style={styles.itemMetaText}>
              {item.distance ? `${Math.round(item.distance * 10)} min walk` : item.location}
            </Text>
          </View>
          {item.rating && (
            <View style={styles.itemMetaRow}>
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.itemMetaText}>{item.rating.average.toFixed(1)} ({item.rating.count})</Text>
            </View>
          )}
        </View>

        <View style={styles.itemOwner}>
          {item.ownerAvatar && <Image source={{ uri: item.ownerAvatar }} style={styles.ownerAvatar} />}
          <Text style={styles.ownerName}>{item.ownerName}</Text>
        </View>
      </View>

      {isAvailable && (
        <TouchableOpacity style={styles.borrowButton}>
          <Text style={styles.borrowButtonText}>Borrow</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  scopeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scopeButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  scopeButtonActive: { backgroundColor: SECTION_COLORS.stuff.primary },
  scopeButtonText: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textLight },
  scopeButtonTextActive: { color: COLORS.white },
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  categoryEmoji: { fontSize: 36, marginBottom: SPACING.xs },
  categoryName: { fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  wantedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: SECTION_COLORS.stuff.light,
    borderStyle: 'dashed',
  },
  wantedEmoji: { fontSize: 32, marginRight: SPACING.md },
  wantedText: { flex: 1 },
  wantedTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  wantedSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginTop: 2 },
  itemsContainer: { flex: 1 },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { width: TOUCH_TARGET.min, height: TOUCH_TARGET.min, alignItems: 'center', justifyContent: 'center' },
  itemsHeaderText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemsHeaderEmoji: { fontSize: 24 },
  itemsHeaderTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  filterButton: { width: TOUCH_TARGET.min, height: TOUCH_TARGET.min, alignItems: 'center', justifyContent: 'center' },
  itemsList: { padding: SPACING.md, paddingBottom: 100 },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  itemImage: { width: '100%', height: 180, backgroundColor: COLORS.border },
  itemContent: { padding: SPACING.md },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  itemTitle: { flex: 1, fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text, marginRight: SPACING.sm },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  statusText: { fontSize: FONT_SIZES.xs, fontWeight: '600', color: COLORS.white },
  itemMeta: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.sm },
  itemMetaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  itemMetaText: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  itemOwner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  ownerAvatar: { width: 24, height: 24, borderRadius: BORDER_RADIUS.full },
  ownerName: { fontSize: FONT_SIZES.sm, color: COLORS.textLight },
  borrowButton: { backgroundColor: SECTION_COLORS.stuff.primary, paddingVertical: SPACING.md, alignItems: 'center' },
  borrowButtonText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: SPACING.xxl },
  emptyStateEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyStateText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  emptyStateSubtext: { fontSize: FONT_SIZES.md, color: COLORS.textLight },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: SECTION_COLORS.stuff.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
