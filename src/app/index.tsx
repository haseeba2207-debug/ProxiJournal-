import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getDatabaseStats,
  initDatabase,
} from '@/database/database';

export default function HomeScreen() {
  const [notesCount, setNotesCount] = useState(0);
  const [attachmentsCount, setAttachmentsCount] =
    useState(0);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD STATS
  // --------------------------------------------------

  const loadStats = async () => {
    try {
      setLoading(true);

      await initDatabase();

      const stats = await getDatabaseStats();

      setNotesCount(stats.notes);
      setAttachmentsCount(stats.attachments);
    } catch (error) {
      console.log(
        'Home database error:',
        error
      );

      setNotesCount(0);
      setAttachmentsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>
              ProxiJournal
            </Text>

            <Text style={styles.subtitle}>
              Your private offline journal
            </Text>
          </View>

          <Pressable
            style={styles.settingsButton}
            onPress={() =>
              router.push('/settings')
            }
          >
            <Text style={styles.settingsIcon}>
              ⚙️
            </Text>
          </Pressable>
        </View>

        {/* WELCOME */}

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome back 👋
          </Text>

          <Text style={styles.welcomeText}>
            Capture your thoughts, memories,
            recordings and important files.
          </Text>

          <Pressable
            style={styles.createButton}
            onPress={() =>
              router.push('/create')
            }
          >
            <Text style={styles.createButtonText}>
              + Create Journal Entry
            </Text>
          </Pressable>
        </View>

        {/* STATS */}

        <Text style={styles.sectionTitle}>
          Your Journal
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              📝
            </Text>

            <Text style={styles.statNumber}>
              {loading ? '-' : notesCount}
            </Text>

            <Text style={styles.statLabel}>
              Entries
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>
              📎
            </Text>

            <Text style={styles.statNumber}>
              {loading
                ? '-'
                : attachmentsCount}
            </Text>

            <Text style={styles.statLabel}>
              Attachments
            </Text>
          </View>
        </View>

        {/* EXPLORE */}

        <Pressable
          style={styles.exploreCard}
          onPress={() =>
            router.push('/explore')
          }
        >
          <View
            style={styles.exploreIconContainer}
          >
            <Text style={styles.exploreIcon}>
              🔍
            </Text>
          </View>

          <View style={styles.exploreInfo}>
            <Text style={styles.exploreTitle}>
              Explore Journal
            </Text>

            <Text style={styles.exploreText}>
              View and search your saved entries
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* OFFLINE */}

        <View style={styles.offlineCard}>
          <View style={styles.statusDot} />

          <View style={styles.offlineInfo}>
            <Text style={styles.offlineTitle}>
              Offline Storage Active
            </Text>

            <Text style={styles.offlineText}>
              Your journal is stored locally
              on this device.
            </Text>
          </View>
        </View>

        {/* SETTINGS */}

        <Pressable
          style={styles.settingsCard}
          onPress={() =>
            router.push('/settings')
          }
        >
          <Text style={styles.settingsCardIcon}>
            ⚙️
          </Text>

          <View style={styles.settingsCardInfo}>
            <Text style={styles.settingsCardTitle}>
              Settings
            </Text>

            <Text style={styles.settingsCardText}>
              Storage, data management and app
              information
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

      </ScrollView>
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

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4F46E5',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#777777',
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsIcon: {
    fontSize: 22,
  },

  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
  },

  welcomeTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222222',
  },

  welcomeText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666666',
    marginTop: 8,
    marginBottom: 18,
  },

  createButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    marginHorizontal: 5,
  },

  statIcon: {
    fontSize: 25,
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: '800',
    color: '#4F46E5',
  },

  statLabel: {
    fontSize: 13,
    color: '#777777',
    marginTop: 3,
  },

  exploreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  exploreIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exploreIcon: {
    fontSize: 22,
  },

  exploreInfo: {
    flex: 1,
    marginLeft: 13,
  },

  exploreTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  exploreText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  arrow: {
    fontSize: 28,
    color: '#999999',
  },

  offlineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },

  offlineInfo: {
    marginLeft: 12,
    flex: 1,
  },

  offlineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  offlineText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingsCardIcon: {
    fontSize: 23,
  },

  settingsCardInfo: {
    flex: 1,
    marginLeft: 13,
  },

  settingsCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  settingsCardText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 3,
  },
});