import React from 'react';
import {
    Alert,
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type AttachmentItemProps = {
uri: string;
onDelete?: () => void;
};

export default function AttachmentItem({
uri,
onDelete,
}: AttachmentItemProps) {
const isImage =
/.(jpg|jpeg|png|gif|webp)$/i.test(uri);

const fileName = uri
.split('/')
.pop()
?.split('?')[0] || 'Attachment';

const openAttachment = async () => {
try {
const supported =
await Linking.canOpenURL(uri);


  if (supported) {
    await Linking.openURL(uri);
  } else {
    Alert.alert(
      'Cannot Open File',
      'This file cannot be opened on this device.'
    );
  }
} catch (error) {
  console.log(
    'Attachment error:',
    error
  );

  Alert.alert(
    'Error',
    'Unable to open this attachment.'
  );
}


};

return ( <View style={styles.container}> <Pressable
     style={styles.content}
     onPress={openAttachment}
   >
{isImage ? (
<Image
source={{ uri }}
style={styles.image}
/>
) : ( <View style={styles.fileIcon}> <Text style={styles.fileEmoji}>
📄 </Text> </View>
)}


    <View style={styles.info}>
      <Text
        style={styles.fileName}
        numberOfLines={2}
      >
        {fileName}
      </Text>

      <Text style={styles.openText}>
        Tap to open
      </Text>
    </View>
  </Pressable>

  {onDelete && (
    <Pressable
      style={styles.deleteButton}
      onPress={onDelete}
    >
      <Text style={styles.deleteText}>
        🗑
      </Text>
    </Pressable>
  )}
</View>


);
}

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#FFFFFF',
borderWidth: 1,
borderColor: '#E5E7EB',
borderRadius: 12,
padding: 10,
marginTop: 10,
},

content: {
flex: 1,
flexDirection: 'row',
alignItems: 'center',
},

image: {
width: 55,
height: 55,
borderRadius: 10,
},

fileIcon: {
width: 55,
height: 55,
borderRadius: 10,
backgroundColor: '#EEF2FF',
justifyContent: 'center',
alignItems: 'center',
},

fileEmoji: {
fontSize: 25,
},

info: {
flex: 1,
marginLeft: 12,
},

fileName: {
fontSize: 14,
fontWeight: '600',
color: '#222222',
},

openText: {
fontSize: 12,
color: '#4F46E5',
marginTop: 4,
},

deleteButton: {
width: 40,
height: 45,
justifyContent: 'center',
alignItems: 'center',
},

deleteText: {
fontSize: 18,
},
});
