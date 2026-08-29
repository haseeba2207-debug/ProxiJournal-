import {
  clearDatabase,
  getDatabaseStats,
  initDatabase,
} from '@/database/database';

import { router } from 'expo-router';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [notesCount, setNotesCount] =
    useState(0);

  const [attachmentsCount, setAttachmentsCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // --------------------------------------------------
  // LOAD STATS
  // --------------------------------------------------

  const loadStats = async () => {
    try {
      setLoading(true);

      await initDatabase();

      const stats =
        await getDatabaseStats();

      setNotesCount(stats.notes);
      setAttachmentsCount(
        stats.attachments
      );
    } catch (error) {
      console.log(
        'Settings database error:',
        error
      );

      setNotesCount(0);
      setAttachmentsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // --------------------------------------------------
  // CLEAR DATA
  // --------------------------------------------------

  const handleClearData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all journal entries and attachment records.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete Everything',
          style: 'destructive',

          onPress: async () => {
            try {
              await clearDatabase();

              setNotesCount(0);
              setAttachmentsCount(0);

              Alert.alert(
                'Data Cleared',
                'All journal data has been deleted.'
              );
            } catch (error) {
              console.log(
                'Clear data error:',
                error
              );

              Alert.alert(
                'Error',
                'Unable to clear journal data.'
              );
            }
          },
        },
      ]
    );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text style={styles.backText}>
              ‹ Back
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Settings
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        {/* STORAGE */}

        <Text style={styles.sectionTitle}>
          Storage
        </Text>

        <View style={styles.card}>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📝
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.itemTitle}>
                Journal Entries
              </Text>

              <Text style={styles.itemText}>
                {loading
                  ? 'Loading...'
                  : `${notesCount} ${
                      notesCount === 1
                        ? 'entry'
                        : 'entries'
                    } saved locally`}
              </Text>
            </View>

            <Text style={styles.count}>
              {loading
                ? '-'
                : notesCount}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                📎
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.itemTitle}>
                Attachments
              </Text>

              <Text style={styles.itemText}>
                {loading
                  ? 'Loading...'
                  : `${attachmentsCount} ${
                      attachmentsCount === 1
                        ? 'file'
                        : 'files'
                    } stored locally`}
              </Text>
            </View>

            <Text style={styles.count}>
              {loading
                ? '-'
                : attachmentsCount}
            </Text>
          </View>

        </View>

        {/* DATABASE */}

        <Text style={styles.sectionTitle}>
          Database
        </Text>

        <View style={styles.statusCard}>
          <View style={styles.statusDot} />

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Local Database Active
            </Text>

            <Text style={styles.statusText}>
              Your journal data is stored
              locally using SQLite.
            </Text>
          </View>
        </View>

        {/* DATA MANAGEMENT */}

        <Text style={styles.sectionTitle}>
          Data Management
        </Text>

        <Pressable
          style={styles.dangerCard}
          onPress={handleClearData}
        >
          <View
            style={styles.dangerIconBox}
          >
            <Text style={styles.dangerIcon}>
              🗑️
            </Text>
          </View>

          <View style={styles.dangerInfo}>
            <Text style={styles.dangerTitle}>
              Clear All Journal Data
            </Text>

            <Text style={styles.dangerText}>
              Delete all notes and attachment
              records from this device.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* ABOUT */}

        <Text style={styles.sectionTitle}>
          About
        </Text>

        <View style={styles.aboutCard}>
          <Text style={styles.appName}>
            ProxiJournal
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>

          <Text style={styles.description}>
            A private offline journal for
            storing your thoughts, memories,
            audio recordings and files locally
            on your device.
          </Text>
        </View>

        {/* PRIVACY */}

        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>
            🔒
          </Text>

          <View style={styles.privacyInfo}>
            <Text style={styles.privacyTitle}>
              Privacy First
            </Text>

            <Text style={styles.privacyText}>
              Your journal is stored locally
              on this device.
            </Text>
          </View>
        </View>

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
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  backButton: {
    width: 70,
  },

  backText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222222',
  },

  headerSpace: {
    width: 70,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginTop: 20,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 21,
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  itemText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    lineHeight: 18,
  },

  count: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4F46E5',
    marginLeft: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },

  statusInfo: {
    flex: 1,
    marginLeft: 13,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  statusText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 18,
    marginTop: 4,
  },

  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dangerIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dangerIcon: {
    fontSize: 21,
  },

  dangerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  dangerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },

  dangerText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 18,
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: '#999999',
    marginLeft: 8,
  },

  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },

  appName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#4F46E5',
  },

  version: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },

  description: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginTop: 12,
  },

  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  privacyIcon: {
    fontSize: 27,
  },

  privacyInfo: {
    flex: 1,
    marginLeft: 13,
  },

  privacyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },

  privacyText: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 18,
    marginTop: 4,
  },
});