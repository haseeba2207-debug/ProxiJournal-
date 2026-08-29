import {
  Attachment,
  deleteNote,
  getAttachments,
  getNoteById,
  Note,
} from '@/database/database';

import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';

import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoteDetailScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const noteId = Number(id);

  const [note, setNote] =
    useState<Note | null>(null);

  const [attachments, setAttachments] =
    useState<Attachment[]>([]);

  const [selectedAudioUri, setSelectedAudioUri] =
    useState<string | null>(null);

  // --------------------------------------------------
  // AUDIO PLAYER
  // --------------------------------------------------

  const player =
    useAudioPlayer(
      selectedAudioUri
    );

  const playerStatus =
    useAudioPlayerStatus(player);

  // --------------------------------------------------
  // LOAD NOTE
  // --------------------------------------------------

  const loadNote = async () => {
    try {
      if (!Number.isFinite(noteId)) {
        setNote(null);
        setAttachments([]);
        return;
      }

      const foundNote =
        await getNoteById(noteId);

      if (!foundNote) {
        setNote(null);
        setAttachments([]);
        return;
      }

      setNote(foundNote);

      const savedAttachments =
        await getAttachments(noteId);

      setAttachments(savedAttachments);

      const firstAudio =
        savedAttachments.find(
          (item) =>
            item.type === 'audio'
        );

      setSelectedAudioUri(
        firstAudio
          ? firstAudio.file_uri
          : null
      );
    } catch (error) {
      console.log(
        'Failed to load note:',
        error
      );

      setNote(null);
      setAttachments([]);
      setSelectedAudioUri(null);
    }
  };

  // --------------------------------------------------
  // RELOAD WHEN SCREEN FOCUSES
  // --------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      loadNote();
    }, [noteId])
  );

  // --------------------------------------------------
  // STOP AUDIO
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  const editNote = () => {
    if (!note) {
      return;
    }

    try {
      player.pause();
    } catch {}

    router.push({
      pathname: '/create',
      params: {
        id: String(note.id),
      },
    });
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDeleteNote = () => {
    if (!note) {
      return;
    }

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              try {
                player.pause();
              } catch {}

              await deleteNote(note.id);

              router.back();
            } catch (error) {
              console.log(
                'Delete note error:',
                error
              );

              Alert.alert(
                'Error',
                'Unable to delete the note.'
              );
            }
          },
        },
      ]
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (
    timestamp: string
  ) => {
    const date =
      new Date(timestamp);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return timestamp;
    }

    return date.toLocaleString();
  };

  // --------------------------------------------------
  // FORMAT AUDIO TIME
  // --------------------------------------------------

  const formatAudioTime = (
    seconds: number
  ) => {
    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {
      return '0:00';
    }

    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      Math.floor(seconds % 60);

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };

  // --------------------------------------------------
  // CHECK IMAGE
  // --------------------------------------------------

  const isImage = (
    attachment: Attachment
  ) => {
    return (
      attachment.type === 'image' ||
      /\.(jpg|jpeg|png|gif|webp)$/i.test(
        attachment.file_uri
      )
    );
  };

  // --------------------------------------------------
  // PLAY
  // --------------------------------------------------

  const playAudio = (
    uri: string
  ) => {
    try {
      if (
        selectedAudioUri !== uri
      ) {
        setSelectedAudioUri(uri);

        setTimeout(() => {
          try {
            player.play();
          } catch (error) {
            console.log(
              'Play audio error:',
              error
            );
          }
        }, 300);

        return;
      }

      if (
        playerStatus.duration > 0 &&
        playerStatus.currentTime >=
          playerStatus.duration
      ) {
        player.seekTo(0);
      }

      player.play();
    } catch (error) {
      console.log(
        'Play audio error:',
        error
      );

      Alert.alert(
        'Audio Error',
        'Unable to play this recording.'
      );
    }
  };

  // --------------------------------------------------
  // PAUSE
  // --------------------------------------------------

  const pauseAudio = () => {
    try {
      player.pause();
    } catch (error) {
      console.log(
        'Pause audio error:',
        error
      );
    }
  };

  // --------------------------------------------------
  // REPLAY
  // --------------------------------------------------

  const replayAudio = (
    uri: string
  ) => {
    try {
      if (
        selectedAudioUri !== uri
      ) {
        setSelectedAudioUri(uri);

        setTimeout(() => {
          try {
            player.seekTo(0);
            player.play();
          } catch (error) {
            console.log(
              'Replay audio error:',
              error
            );
          }
        }, 300);

        return;
      }

      player.seekTo(0);
      player.play();
    } catch (error) {
      console.log(
        'Replay audio error:',
        error
      );
    }
  };

  // --------------------------------------------------
  // NOTE NOT FOUND
  // --------------------------------------------------

  if (!note) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View
          style={
            styles.notFoundContainer
          }
        >
          <Text
            style={
              styles.notFoundIcon
            }
          >
            📖
          </Text>

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Note not found
          </Text>

          <Pressable
            style={
              styles.backButtonLarge
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backButtonLargeText
              }
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // ATTACHMENT GROUPS
  // --------------------------------------------------

  const audioAttachments =
    attachments.filter(
      (item) =>
        item.type === 'audio'
    );

  const normalAttachments =
    attachments.filter(
      (item) =>
        item.type !== 'audio'
    );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={styles.backButton}
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              ‹ Back
            </Text>
          </Pressable>

          <View
            style={
              styles.headerActions
            }
          >
            <Pressable
              onPress={editNote}
              style={
                styles.editButton
              }
            >
              <Text
                style={
                  styles.editButtonText
                }
              >
                Edit
              </Text>
            </Pressable>

            <Pressable
              onPress={
                handleDeleteNote
              }
              style={
                styles.deleteButton
              }
            >
              <Text
                style={
                  styles.deleteButtonText
                }
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TITLE */}

        <Text style={styles.title}>
          {note.title ||
            'Untitled Note'}
        </Text>

        {/* DATE */}

        <Text style={styles.date}>
          {formatDate(
            note.timestamp
          )}
        </Text>

        {/* TAGS */}

        {note.tags &&
          note.tags.trim() !== '' && (
            <View
              style={
                styles.tagsContainer
              }
            >
              {note.tags
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

        {/* BODY */}

        <View
          style={styles.bodyCard}
        >
          <Text
            style={styles.body}
          >
            {note.body ||
              'No content'}
          </Text>
        </View>

        {/* AUDIO */}

        {audioAttachments.length >
          0 && (
            <View
              style={
                styles.section
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Audio Recording
              </Text>

              {audioAttachments.map(
                (attachment) => {
                  const isCurrentAudio =
                    selectedAudioUri ===
                    attachment.file_uri;

                  const isPlaying =
                    isCurrentAudio &&
                    playerStatus.playing;

                  return (
                    <View
                      key={
                        attachment.id
                      }
                      style={
                        styles.audioCard
                      }
                    >
                      <View
                        style={
                          styles.audioIconContainer
                        }
                      >
                        <Text
                          style={
                            styles.audioIcon
                          }
                        >
                          🎤
                        </Text>
                      </View>

                      <View
                        style={
                          styles.audioInfo
                        }
                      >
                        <Text
                          style={
                            styles.audioTitle
                          }
                          numberOfLines={2}
                        >
                          {
                            attachment.file_name
                          }
                        </Text>

                        <Text
                          style={
                            styles.audioPath
                          }
                        >
                          Recording saved locally
                        </Text>

                        {isCurrentAudio &&
                          playerStatus.duration >
                            0 && (
                            <Text
                              style={
                                styles.audioTime
                              }
                            >
                              {formatAudioTime(
                                playerStatus.currentTime
                              )}{' '}
                              /{' '}
                              {formatAudioTime(
                                playerStatus.duration
                              )}
                            </Text>
                          )}

                        <View
                          style={
                            styles.audioButtons
                          }
                        >
                          <Pressable
                            style={
                              styles.playButton
                            }
                            onPress={() => {
                              if (
                                isPlaying
                              ) {
                                pauseAudio();
                              } else {
                                playAudio(
                                  attachment.file_uri
                                );
                              }
                            }}
                          >
                            <Text
                              style={
                                styles.playButtonText
                              }
                            >
                              {isPlaying
                                ? '⏸ Pause'
                                : '▶ Play'}
                            </Text>
                          </Pressable>

                          <Pressable
                            style={
                              styles.replayButton
                            }
                            onPress={() =>
                              replayAudio(
                                attachment.file_uri
                              )
                            }
                          >
                            <Text
                              style={
                                styles.replayButtonText
                              }
                            >
                              🔄 Replay
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          )}

        {/* ATTACHMENTS */}

        {normalAttachments.length >
          0 && (
            <View
              style={
                styles.section
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Attachments
              </Text>

              {normalAttachments.map(
                (attachment) => (
                  <View
                    key={
                      attachment.id
                    }
                    style={
                      styles.attachmentCard
                    }
                  >
                    {isImage(
                      attachment
                    ) ? (
                      <Image
                        source={{
                          uri: attachment.file_uri,
                        }}
                        style={
                          styles.attachmentImage
                        }
                      />
                    ) : (
                      <Text
                        style={
                          styles.fileIcon
                        }
                      >
                        📎
                      </Text>
                    )}

                    <View
                      style={
                        styles.attachmentInfo
                      }
                    >
                      <Text
                        style={
                          styles.attachmentName
                        }
                        numberOfLines={2}
                      >
                        {
                          attachment.file_name
                        }
                      </Text>

                      <Text
                        style={
                          styles.attachmentText
                        }
                      >
                        Local attachment
                      </Text>
                    </View>
                  </View>
                )
              )}
            </View>
          )}

        {/* SYNC */}

        <View
          style={styles.syncCard}
        >
          <Text
            style={styles.syncIcon}
          >
            {note.synced === 1
              ? '☁️'
              : '📱'}
          </Text>

          <View
            style={styles.syncInfo}
          >
            <Text
              style={styles.syncTitle}
            >
              {note.synced === 1
                ? 'Synced'
                : 'Stored Locally'}
            </Text>

            <Text
              style={styles.syncText}
            >
              {note.synced === 1
                ? 'This note has been synchronized.'
                : 'This note is available offline.'}
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
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  backButton: {
    paddingVertical: 8,
    paddingRight: 10,
  },

  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
    marginRight: 8,
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#222',
    lineHeight: 38,
  },

  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },

  tag: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },

  bodyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    elevation: 2,
  },

  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 25,
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },

  audioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 10,
  },

  audioIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  audioIcon: {
    fontSize: 27,
  },

  audioInfo: {
    flex: 1,
  },

  audioTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  audioPath: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  audioTime: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 6,
  },

  audioButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  playButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    marginRight: 8,
  },

  playButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  replayButton: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
  },

  replayButtonText: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '600',
  },

  attachmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  attachmentImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 12,
  },

  fileIcon: {
    fontSize: 32,
    width: 65,
    textAlign: 'center',
    marginRight: 12,
  },

  attachmentInfo: {
    flex: 1,
  },

  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  attachmentText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  syncCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },

  syncIcon: {
    fontSize: 25,
    marginRight: 12,
  },

  syncInfo: {
    flex: 1,
  },

  syncTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },

  syncText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  notFoundIcon: {
    fontSize: 65,
  },

  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 25,
  },

  backButtonLarge: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backButtonLargeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});