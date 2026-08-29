import * as DocumentPicker from 'expo-document-picker';

export async function pickFile() {
try {
const result =
await DocumentPicker.getDocumentAsync({
type: '*/*',
copyToCacheDirectory: true,
multiple: false,
});


if (result.canceled) {
  return null;
}

if (
  !result.assets ||
  result.assets.length === 0
) {
  return null;
}

return result.assets[0];


} catch (error) {
console.log(
'Failed to select file:',
error
);

throw error;


}
}
