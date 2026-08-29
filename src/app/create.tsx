import {
  addAttachment,
  createNote,
  getNoteById,
  updateNote,
} from '@/database/database';

import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CreateNoteScreen() {
  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  const isEditing = !!id;

  const noteId = id
    ? Number(id)
    : null;

  const [title, setTitle] =
    useState('');

  const [body, setBody] =
    useState('');

  const [tags, setTags] =
    useState('');

  const [attachmentUri, setAttachmentUri] =
    useState<string | null>(null);

  const [attachmentName, setAttachmentName] =
    useState<string | null>(null);

  const [attachmentType, setAttachmentType] =
    useState<string | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  // --------------------------------------------------
  // RECORDER
  // --------------------------------------------------

  const recorder =
    useAudioRecorder(
      RecordingPresets.HIGH_QUALITY
    );

  const recorderState =
    useAudioRecorderState(recorder);

  // --------------------------------------------------
  // PLAYER
  // --------------------------------------------------

  const player =
    useAudioPlayer(
      attachmentType === 'audio'
        ? attachmentUri
        : null
    );

  // --------------------------------------------------
  // LOAD NOTE
  // --------------------------------------------------

  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) {
        return;
      }

      try {
        const note =
          await getNoteById(noteId);

        if (note) {
          setTitle(note.title || '');
          setBody(note.body || '');
          setTags(note.tags || '');
        }
      } catch (error) {
        console.log(
          'Load note error:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to load the journal entry.'
        );
      }
    };

    loadNote();
  }, [noteId]);

  // --------------------------------------------------
  // MICROPHONE
  // --------------------------------------------------

  const requestMicrophonePermission =
    async () => {
      try {
        const permission =
          await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Permission Required',
            'Microphone permission is required to record audio.'
          );

          return false;
        }

        return true;
      } catch (error) {
        console.log(
          'Microphone permission error:',
          error
        );

        return false;
      }
    };

  // --------------------------------------------------
  // RECORD
  // --------------------------------------------------

  const handleRecording =
    async () => {
      try {
        if (recorderState.isRecording) {
          await recorder.stop();

          const uri =
            recorder.uri;

          if (uri) {
            setAttachmentUri(uri);

            setAttachmentName(
              `audio-${Date.now()}.m4a`
            );

            setAttachmentType(
              'audio'
            );

            Alert.alert(
              'Recording Complete',
              'Audio is ready.'
            );
          }

          return;
        }

        const allowed =
          await requestMicrophonePermission();

        if (!allowed) {
          return;
        }

        await recorder.prepareToRecordAsync();

        recorder.record();

        setIsPlaying(false);
      } catch (error) {
        console.log(
          'Recording error:',
          error
        );

        Alert.alert(
          'Recording Error',
          'Unable to record audio.'
        );
      }
    };

  // --------------------------------------------------
  // PLAY
  // --------------------------------------------------

  const handlePlayPause =
    () => {
      try {
        if (!attachmentUri) {
          return;
        }

        if (isPlaying) {
          player.pause();
          setIsPlaying(false);
        } else {
          player.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log(
          'Playback error:',
          error
        );
      }
    };

  // --------------------------------------------------
  // IMAGE
  // --------------------------------------------------

  const handlePickImage =
    async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Permission Required',
            'Gallery permission is required.'
          );

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
          });

        if (result.canceled) {
          return;
        }

        const asset =
          result.assets[0];

        if (!asset?.uri) {
          return;
        }

        setAttachmentUri(
          asset.uri
        );

        setAttachmentName(
          asset.fileName ||
            `image-${Date.now()}.jpg`
        );

        setAttachmentType(
          'image'
        );
      } catch (error) {
        console.log(
          'Image picker error:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to select image.'
        );
      }
    };

  // --------------------------------------------------
  // FILE
  // --------------------------------------------------

  const handlePickFile =
    async () => {
      try {
        const result =
          await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
          });

        if (result.canceled) {
          return;
        }

        const file =
          result.assets[0];

        if (!file?.uri) {
          return;
        }

        setAttachmentUri(
          file.uri
        );

        setAttachmentName(
          file.name
        );

        setAttachmentType(
          'file'
        );
      } catch (error) {
        console.log(
          'File picker error:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to select file.'
        );
      }
    };

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const handleSave =
    async () => {
      if (
        !title.trim() &&
        !body.trim()
      ) {
        Alert.alert(
          'Empty Note',
          'Please enter a title or journal content.'
        );

        return;
      }

      try {
        let savedNoteId: number;

        if (noteId) {
          await updateNote(
            noteId,
            title.trim(),
            body.trim(),
            tags.trim()
          );

          savedNoteId = noteId;
        } else {
          savedNoteId =
            await createNote(
              title.trim(),
              body.trim(),
              tags.trim()
            );
        }

        if (
          attachmentUri &&
          attachmentName &&
          attachmentType
        ) {
          await addAttachment(
            savedNoteId,
            attachmentType,
            attachmentName,
            attachmentUri
          );
        }

        Alert.alert(
          'Saved',
          'Journal entry saved successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace(
                  `/note/${savedNoteId}` as any
                );
              },
            },
          ]
        );
      } catch (error) {
        console.log(
          'Save note error:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to save the journal entry.'
        );
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              router.back()
            }
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              ‹ Back
            </Text>
          </Pressable>

          <Text
            style={styles.headerTitle}
          >
            {isEditing
              ? 'Edit Note'
              : 'New Note'}
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor="#999999"
            style={styles.titleInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Journal
          </Text>

          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Write your thoughts..."
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            style={styles.bodyInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Tags
          </Text>

          <TextInput
            value={tags}
            onChangeText={setTags}
            placeholder="personal, work, travel"
            placeholderTextColor="#999999"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Audio
          </Text>

          <Pressable
            style={[
              styles.actionButton,
              recorderState.isRecording &&
                styles.recordingButton,
            ]}
            onPress={handleRecording}
          >
            <Text
              style={
                styles.actionButtonText
              }
            >
              {recorderState.isRecording
                ? '⏹ Stop Recording'
                : '🎤 Record Audio'}
            </Text>
          </Pressable>

          {attachmentType === 'audio' &&
            attachmentUri &&
            !recorderState.isRecording && (
              <View
                style={
                  styles.audioPlayerCard
                }
              >
                <Text
                  style={styles.audioTitle}
                >
                  🎵 Audio Recording
                </Text>

                <Text
                  style={
                    styles.audioFileName
                  }
                >
                  {attachmentName}
                </Text>

                <Pressable
                  style={
                    styles.playButton
                  }
                  onPress={
                    handlePlayPause
                  }
                >
                  <Text
                    style={
                      styles.playButtonText
                    }
                  >
                    {isPlaying
                      ? '⏸ Pause Audio'
                      : '▶ Play Audio'}
                  </Text>
                </Pressable>
              </View>
            )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Attachments
          </Text>

          <View
            style={
              styles.attachmentRow
            }
          >
            <Pressable
              style={styles.smallButton}
              onPress={
                handlePickImage
              }
            >
              <Text
                style={
                  styles.smallButtonText
                }
              >
                🖼 Image
              </Text>
            </Pressable>

            <Pressable
              style={styles.smallButton}
              onPress={
                handlePickFile
              }
            >
              <Text
                style={
                  styles.smallButtonText
                }
              >
                📎 File
              </Text>
            </Pressable>
          </View>

          {attachmentName &&
            attachmentType !== 'audio' && (
              <Text
                style={
                  styles.selectedFile
                }
              >
                Selected: {attachmentName}
              </Text>
            )}
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text
            style={
              styles.saveButtonText
            }
          >
            {isEditing
              ? 'Update Note'
              : 'Save Note'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
  },

  headerSpace: {
    width: 70,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  titleInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222222',
  },

  bodyInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    minHeight: 220,
    fontSize: 16,
    lineHeight: 24,
    color: '#222222',
  },

  actionButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },

  recordingButton: {
    backgroundColor: '#E53935',
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  audioPlayerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    elevation: 2,
  },

  audioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
  },

  audioFileName: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },

  playButton: {
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },

  playButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },

  attachmentRow: {
    flexDirection: 'row',
    gap: 12,
  },

  smallButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  smallButtonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },

  selectedFile: {
    marginTop: 10,
    fontSize: 13,
    color: '#4F46E5',
  },

  saveButton: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});