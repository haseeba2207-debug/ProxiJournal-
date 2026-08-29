
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync
} from 'expo-audio';

/**
 * Request microphone permission.
 */
export async function requestAudioPermission(): Promise<boolean> {
  try {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    return status.granted;
  } catch (error) {
    console.log('Audio permission error:', error);
    return false;
  }
}

/**
 * Start recording.
 *
 * NOTE:
 * expo-audio's recorder is normally used as a React hook.
 * This service therefore provides the permission helper,
 * while recording is handled inside the Create Note screen.
 */
export async function prepareAudioRecording(): Promise<boolean> {
  try {
    const granted = await requestAudioPermission();

    if (!granted) {
      return false;
    }

    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
    });

    return true;
  } catch (error) {
    console.log('Prepare recording error:', error);
    return false;
  }
}

/**
 * Default recording preset for the application.
 */
export const AUDIO_RECORDING_PRESET = RecordingPresets.HIGH_QUALITY;

