import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PostCard from '../../components/PostCard';
import CommentSheet from '../../components/CommentSheet';
import { triggerAutoBotActivity } from '../../utils/botEngine';

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [shareModalVisible, setShareModalVisible] = useState(false);
  
  // حالات التعليقات
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    // جلب البوستات
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });

    // 🚀 تشغيل محرك التفاعل الآلي (AI) كل 15 ثانية!
    const aiInterval = setInterval(() => {
      triggerAutoBotActivity();
    }, 15000); // 15000 ملي ثانية = 15 ثانية

    return () => {
      unsubscribe();
      clearInterval(aiInterval); // إيقاف الـ AI لو خرجنا من الصفحة
    };
  }, []);

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), { likes: increment(1) });
    } catch (error) {
      console.log(error);
    }
  };

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    setCommentModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={28} color="#FFF" onPress={() => router.push('/chat')} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="hardware-chip" size={20} color="#FFD60A" style={{marginRight: 10}} />
          <Text style={styles.headerTitle}>شِلتنا</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#6C63FF" /></View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>مفيش بوستات لسه..</Text>}
          renderItem={({ item }) => {
            if (!item) return null; // حماية ضد البيانات التالفة
            return (
              <PostCard 
                item={item} 
                onLike={() => handleLike(item.id)} 
                onShare={() => setShareModalVisible(true)} 
                onComment={() => openComments(item.id)} 
              />
            );
          }}
        />
      )}

      {/* نافذة التعليقات */}
      <Modal visible={commentModalVisible} transparent={true} animationType="slide" onRequestClose={() => setCommentModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{flex: 1}} onPress={() => setCommentModalVisible(false)} />
          <CommentSheet postId={selectedPostId} onClose={() => setCommentModalVisible(false)} />
        </View>
      </Modal>

      {/* نافذة المشاركة */}
      <Modal visible={shareModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.shareSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>مشاركة</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}><Ionicons name="close-circle" size={28} color="#888" /></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.shareOption} onPress={() => { setShareModalVisible(false); Alert.alert('تم', 'تمت المشاركة!'); }}>
              <Text style={styles.shareOptionText}>مشاركة على يومياتي</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/createPost')}>
        <Ionicons name="pencil" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#6C63FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  shareSheet: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, minHeight: 200 },
  sheetHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#2C2C2C', paddingBottom: 15 },
  sheetTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  shareOption: { backgroundColor: '#2C2C2C', padding: 15, borderRadius: 15, alignItems: 'center' },
  shareOptionText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
