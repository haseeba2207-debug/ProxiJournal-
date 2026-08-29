import {
    useAudioPlayer,
    useAudioPlayerStatus,
} from 'expo-audio';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type AudioPlayerProps = {
uri: string;
onDelete?: () => void;
};

export default function AudioPlayer({
uri,
onDelete,
}: AudioPlayerProps) {
const player = useAudioPlayer(uri);
const status = useAudioPlayerStatus(player);

const [loading, setLoading] = useState(false);

useEffect(() => {
return () => {
try {
player.remove();
} catch (error) {
console.log(
'Audio cleanup error:',
error
);
}
};
}, [player]);

const togglePlayback = async () => {
try {
setLoading(true);


  if (status.playing) {
    player.pause();
  } else {
    player.play();
  }
} catch (error) {
  console.log(
    'Audio playback error:',
    error
  );

  Alert.alert(
    'Playback Error',
    'Unable to play this recording.'
  );
} finally {
  setLoading(false);
}


};

const deleteAudio = () => {
Alert.alert(
'Delete Recording',
'Are you sure you want to delete this audio recording?',
[
{
text: 'Cancel',
style: 'cancel',
},
{
text: 'Delete',
style: 'destructive',
onPress: onDelete,
},
]
);
};

return ( <View style={styles.container}> <View style={styles.iconContainer}> <Text style={styles.microphone}>
🎤 </Text> </View>

  <View style={styles.info}>
    <Text style={styles.title}>
      Audio Recording
    </Text>

    <Text style={styles.status}>
      {status.playing
        ? 'Playing...'
        : 'Audio note'}
    </Text>
  </View>

  <Pressable
    style={styles.playButton}
    onPress={togglePlayback}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <Text style={styles.playText}>
        {status.playing ? '❚❚' : '▶'}
      </Text>
    )}
  </Pressable>

  {onDelete && (
    <Pressable
      style={styles.deleteButton}
      onPress={deleteAudio}
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
backgroundColor: '#F3F4F6',
borderRadius: 14,
padding: 12,
marginTop: 10,
},

iconContainer: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: '#E0E7FF',
justifyContent: 'center',
alignItems: 'center',
},

microphone: {
fontSize: 20,
},

info: {
flex: 1,
marginLeft: 10,
},

title: {
fontSize: 14,
fontWeight: '600',
color: '#222222',
},

status: {
fontSize: 12,
color: '#777777',
marginTop: 3,
},

playButton: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: '#4F46E5',
justifyContent: 'center',
alignItems: 'center',
},

playText: {
color: '#FFFFFF',
fontSize: 16,
},

deleteButton: {
width: 38,
height: 42,
justifyContent: 'center',
alignItems: 'center',
marginLeft: 5,
},

deleteText: {
fontSize: 18,
},
});
