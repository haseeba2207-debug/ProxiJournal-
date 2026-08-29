import * as ImagePicker from 'expo-image-picker';

export async function pickImage() {
try {
const permission =
await ImagePicker.requestMediaLibraryPermissionsAsync();


if (!permission.granted) {
  throw new Error(
    'Photo library permission was not granted.'
  );
}

const result =
  await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  });

if (
  result.canceled ||
  !result.assets ||
  result.assets.length === 0
) {
  return null;
}

return result.assets[0];


} catch (error) {
console.log(
'Failed to select image:',
error
);


throw error;


}
}

export async function takePhoto() {
try {
const permission =
await ImagePicker.requestCameraPermissionsAsync();


if (!permission.granted) {
  throw new Error(
    'Camera permission was not granted.'
  );
}

const result =
  await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  });

if (
  result.canceled ||
  !result.assets ||
  result.assets.length === 0
) {
  return null;
}

return result.assets[0];


} catch (error) {
console.log(
'Failed to capture photo:',
error
);

throw error;


}
}
