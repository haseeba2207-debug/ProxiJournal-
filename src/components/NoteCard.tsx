import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type NoteCardData = {
id: string;
title: string;
body: string;
timestamp: string;
tags?: string[];
audioUri?: string;
attachments?: string[];
synced?: boolean;
};

type NoteCardProps = {
note: NoteCardData;
onPress: (id: string) => void;
};

export default function NoteCard({
note,
onPress,
}: NoteCardProps) {
const formattedDate = new Date(
note.timestamp
).toLocaleDateString();

return (
<Pressable
style={styles.card}
onPress={() => onPress(note.id)}
> <View style={styles.header}> <Text
       style={styles.title}
       numberOfLines={1}
     >
{note.title || 'Untitled Note'} </Text>


    <Text style={styles.arrow}>›</Text>
  </View>

  <Text
    style={styles.body}
    numberOfLines={3}
  >
    {note.body || 'No content'}
  </Text>

  {note.tags && note.tags.length > 0 && (
    <View style={styles.tagsContainer}>
      {note.tags.slice(0, 3).map((tag) => (
        <View
          key={tag}
          style={styles.tag}
        >
          <Text style={styles.tagText}>
            #{tag}
          </Text>
        </View>
      ))}
    </View>
  )}

  <View style={styles.footer}>
    <Text style={styles.date}>
      {formattedDate}
    </Text>

    <View style={styles.statusContainer}>
      {note.audioUri && (
        <Text style={styles.statusIcon}>
          🎤
        </Text>
      )}

      {note.attachments &&
        note.attachments.length > 0 && (
          <Text style={styles.statusIcon}>
            📎
          </Text>
        )}

      <Text style={styles.syncText}>
        {note.synced ? 'Synced' : 'Local'}
      </Text>
    </View>
  </View>
</Pressable>


);
}

const styles = StyleSheet.create({
card: {
backgroundColor: '#FFFFFF',
borderRadius: 16,
padding: 17,
marginBottom: 14,
elevation: 2,
},

header: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
},

title: {
flex: 1,
fontSize: 18,
fontWeight: '700',
color: '#222222',
marginRight: 10,
},

arrow: {
fontSize: 28,
color: '#888888',
},

body: {
fontSize: 14,
lineHeight: 21,
color: '#666666',
marginTop: 8,
},

tagsContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
marginTop: 12,
},

tag: {
backgroundColor: '#EEF2FF',
paddingHorizontal: 9,
paddingVertical: 5,
borderRadius: 8,
marginRight: 6,
marginBottom: 5,
},

tagText: {
color: '#4F46E5',
fontSize: 12,
fontWeight: '500',
},

footer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginTop: 14,
},

date: {
fontSize: 12,
color: '#999999',
},

statusContainer: {
flexDirection: 'row',
alignItems: 'center',
},

statusIcon: {
fontSize: 16,
marginLeft: 8,
},

syncText: {
fontSize: 11,
color: '#777777',
marginLeft: 8,
},
});
