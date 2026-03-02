import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function CommentSheet({ postId, onClose }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    const q = query(collection(db, `posts/${postId}/comments`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comms = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(comms);
      setLoading(false);
    });
    return unsubscribe;
  }, [postId]);

  const sendComment = async () => {
    if (!text.trim()) return;
    const msg = text;
    setText(''); 
    
    try {
      const userName = auth.currentUser?.email?.split('@')[0] || 'مجهول';
      await addDoc(collection(db, `posts/${postId}/comments`), {
        text: msg,
        userName: userName,
        userEmail: auth.currentUser?.email,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'posts', postId), { comments: increment(1) });
    } catch (e) {
      console.log("Error adding comment", e);
    }
  };

  return (
    <View style={styles.sheetContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>التعليقات</Text>
        <TouchableOpacity onPress={onClose}><Ionicons name="close-circle" size={28} color="#888" /></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color="#6C63FF" style={{marginTop: 20}} /> : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>كن أول من يعلق!</Text>}
          renderItem={({ item }) => {
            // الحماية الفولاذية هنا: تحويل أي اسم لنص سليم عشان ميضربش Error
            const safeName = String(item.userName || item.userEmail?.split('@')[0] || 'مجهول');
            const firstLetter = safeName.charAt(0).toUpperCase();

            return (
              <View style={styles.commentBox}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{firstLetter}</Text></View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentUser}>
                    {safeName} {item.userEmail?.includes('@ai.com') && <Ionicons name="hardware-chip" size={12} color="#6C63FF" />}
                  </Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="اكتب تعليقاً..." placeholderTextColor="#888" value={text} onChangeText={setText} textAlign="right" />
          <TouchableOpacity style={styles.sendBtn} onPress={sendComment}><Ionicons name="send" size={18} color="#FFF" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '80%', padding: 20 },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2C2C2C', paddingBottom: 15, marginBottom: 15 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 20 },
  commentBox: { flexDirection: 'row-reverse', marginBottom: 15 },
  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#2C2C2C', justifyContent: 'center', alignItems: 'center', marginLeft: 10, borderWidth: 1, borderColor: '#6C63FF' },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  commentContent: { flex: 1, backgroundColor: '#2C2C2C', padding: 10, borderRadius: 15 },
  commentUser: { color: '#AAA', fontSize: 12, marginBottom: 5, textAlign: 'right', fontWeight: 'bold' },
  commentText: { color: '#FFF', fontSize: 14, textAlign: 'right' },
  inputContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#2C2C2C', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5, marginTop: 10 },
  input: { flex: 1, color: '#FFF', height: 45, textAlign: 'right' },
  sendBtn: { backgroundColor: '#6C63FF', width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center', marginRight: 10 }
});
