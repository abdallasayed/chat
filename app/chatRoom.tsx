import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function ChatRoomScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUserEmail = auth.currentUser?.email || 'مجهول';

  useEffect(() => {
    // استدعاء الرسائل لحظياً من فايربيز
    const q = query(collection(db, `chats/${id}/messages`), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    const textToSend = inputText;
    setInputText(''); // تفريغ الخانة فوراً
    
    await addDoc(collection(db, `chats/${id}/messages`), {
      text: textToSend,
      senderEmail: currentUserEmail,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Ionicons name="chevron-forward" size={28} color="#FFF" /></TouchableOpacity>
        <View style={styles.headerInfo}><Text style={styles.headerTitle}>{name}</Text><Text style={styles.statusText}>متصل الآن</Text></View>
      </View>

      {loading ? <ActivityIndicator style={{flex:1}} color="#6C63FF" /> : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            const isMe = item.senderEmail === currentUserEmail;
            return (
              <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
                {!isMe && <Text style={styles.senderName}>{item.senderEmail.split('@')}</Text>}
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            );
          }}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="اكتب رسالة..." placeholderTextColor="#888" value={inputText} onChangeText={setInputText} multiline textAlign="right" />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}><Ionicons name="send" size={20} color="#FFF" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E', backgroundColor: '#121212' },
  backButton: { padding: 5, marginLeft: 10 },
  headerInfo: { flex: 1, alignItems: 'flex-end' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statusText: { color: '#4CD964', fontSize: 12, marginTop: 2 },
  messagesList: { padding: 15 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 20, marginBottom: 10 },
  myMessage: { alignSelf: 'flex-start', backgroundColor: '#6C63FF', borderBottomLeftRadius: 5 },
  otherMessage: { alignSelf: 'flex-end', backgroundColor: '#1E1E1E', borderBottomRightRadius: 5 },
  senderName: { color: '#AAA', fontSize: 10, marginBottom: 4, textAlign: 'right' },
  messageText: { color: '#FFF', fontSize: 15, lineHeight: 22 },
  inputContainer: { flexDirection: 'row-reverse', alignItems: 'center', padding: 10, backgroundColor: '#1E1E1E', margin: 15, borderRadius: 25 },
  input: { flex: 1, color: '#FFF', fontSize: 15, maxHeight: 100, paddingHorizontal: 15, textAlign: 'right' },
  sendButton: { backgroundColor: '#6C63FF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
});
