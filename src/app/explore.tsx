import {
  getAllNotes,
  Note,
} from '@/database/database';

import {
  router,
  useFocusEffect,
} from 'expo-router';

import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const [notes, setNotes] =
    useState<Note[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  // --------------------------------------------------
  // LOAD NOTES
  // --------------------------------------------------

  const loadNotes = async () => {
    try {
      setLoading(true);

      const savedNotes =
        await getAllNotes();

      setNotes(savedNotes);
    } catch (error) {
      console.log(
        'Explore database error:',
        error
      );

      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  // --------------------------------------------------
  // OPEN NOTE
  // --------------------------------------------------

  const openNote = (id: number) => {
    router.push(
      `/note/${id}` as any
    );
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const searchText =
    search.trim().toLowerCase();

  const filteredNotes =
    notes
      .filter((note) => {
        if (!searchText) {
          return true;
        }

        const title =
          note.title?.toLowerCase() || '';

        const body =
          note.body?.toLowerCase() || '';

        const tags =
          note.tags?.toLowerCase() || '';

        return (
          title.includes(searchText) ||
          body.includes(searchText) ||
          tags.includes(searchText)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Explore
        </Text>

        <Text style={styles.subtitle}>
          Search your journal
        </Text>
      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LOADING */}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#4F46E5"
          />

          <Text style={styles.loadingText}>
            Loading notes...
          </Text>
        </View>
      ) : filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            🔍
          </Text>

          <Text style={styles.emptyTitle}>
            {notes.length === 0
              ? 'No journal entries'
              : 'No notes found'}
          </Text>

          <Text style={styles.emptyText}>
            {notes.length === 0
              ? 'Create your first journal entry to see it here.'
              : 'Try a different search term.'}
          </Text>

          {notes.length === 0 && (
            <Pressable
              style={styles.createButton}
              onPress={() =>
                router.push('/create')
              }
            >
              <Text
                style={styles.createButtonText}
              >
                + Create Entry
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) =>
            String(item.id)
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                openNote(item.id)
              }
            >

              <View style={styles.cardHeader}>
                <Text
                  style={styles.cardTitle}
                  numberOfLines={1}
                >
                  {item.title ||
                    'Untitled Note'}
                </Text>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </View>

              <Text
                style={styles.cardBody}
                numberOfLines={2}
              >
                {item.body ||
                  'No content'}
              </Text>

              {item.tags &&
                item.tags.trim() !== '' && (
                  <View
                    style={
                      styles.tagsContainer
                    }
                  >
                    {item.tags
                      .split(',')
                      .map((tag) =>
                        tag.trim()
                      )
                      .filter(Boolean)
                      .map(
                        (
                          tag,
                          index
                        ) => (
                          <View
                            key={`${tag}-${index}`}
                            style={styles.tag}
                          >
                            <Text
                              style={
                                styles.tagText
                              }
                            >
                              #{tag}
                            </Text>
                          </View>
                        )
                      )}
                  </View>
                )}

              <View style={styles.footer}>
                <Text style={styles.date}>
                  {new Date(
                    item.timestamp
                  ).toLocaleDateString()}
                </Text>

                <View
                  style={
                    styles.statusContainer
                  }
                >
                  <Text
                    style={
                      item.synced === 1
                        ? styles.syncedText
                        : styles.unsyncedText
                    }
                  >
                    {item.synced === 1
                      ? '☁️ Synced'
                      : '📱 Offline'}
                  </Text>
                </View>
              </View>

            </Pressable>
          )}
        />
      )}

    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  searchBox: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: '#222',
  },

  list: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginRight: 10,
  },

  arrow: {
    fontSize: 28,
    color: '#888',
  },

  cardBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 7,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  tag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 5,
  },

  tagText: {
    fontSize: 12,
    color: '#4F46E5',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  date: {
    fontSize: 12,
    color: '#999',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  syncedText: {
    fontSize: 12,
    color: '#16A34A',
  },

  unsyncedText: {
    fontSize: 12,
    color: '#999',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#777',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 50,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
    marginTop: 7,
    textAlign: 'center',
    lineHeight: 20,
  },

  createButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 20,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});