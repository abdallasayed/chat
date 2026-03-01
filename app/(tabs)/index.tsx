import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function HomeScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البوستات الحقيقية من فايربيز لحظياً
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });
    return unsubscribe; // بيوقف الاستماع لما تطلع من الشاشة
  }, []);

  const theme = {
    bg: isDark ? '#121212' : '#F2F2F7',
    cardBg: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1C1C1E',
    subText: isDark ? '#888888' : '#8E8E93',
    borderColor: isDark ? '#2C2C2C' : '#E5E5EA',
    iconBg: isDark ? '#1E1E1E' : '#E5E5EA',
  };

  // دالة لضبط شكل الوقت الحقيقي للبوست
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'الآن...';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.bg} />
      
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.iconBg }]} onPress={() => setIsDark(!isDark)}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={22} color={isDark ? "#FFD60A" : "#6C63FF"} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text }]}>شِلتنا</Text>
      </View>

      {loading ? (
        <View style={styles.loader}><ActivityIndicator size="large" color="#6C63FF" /></View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="documents-outline" size={50} color={theme.subText} />
              <Text style={[styles.emptyText, {color: theme.subText}]}>مفيش بوستات لسه.. خليك أول واحد يكتب حاجة!</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={[styles.postCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.postHeader}>
                <View style={styles.postHeaderText}>
                  <Text style={[styles.postUser, { color: theme.text }]}>{item.userEmail?.split('@') || 'مجهول'}</Text>
                  <Text style={[styles.postTime, { color: theme.subText }]}>{formatTime(item.createdAt)} • {item.privacy}</Text>
                </View>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{item.userEmail ? item.userEmail.charAt(0).toUpperCase() : 'U'}</Text>
                </View>
              </View>
              <Text style={[styles.postContent, { color: theme.text }]}>{item.text}</Text>
              
              {/* عرض الصورة اللي اترفعت على Uploadcare */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
              ) : null}

              <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
                <TouchableOpacity style={styles.actionButton}><Ionicons name="share-social-outline" size={20} color={theme.subText} /></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}><Text style={[styles.actionText, { color: theme.subText }]}>{item.comments || 0}</Text><Ionicons name="chatbubble-outline" size={20} color={theme.subText} /></TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}><Text style={[styles.actionText, { color: theme.subText }]}>{item.likes || 0}</Text><Ionicons name="heart-outline" size={22} color={theme.subText} /></TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/createPost')}>
        <Ionicons name="pencil" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row' },
  iconButton: { padding: 8, borderRadius: 50 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  postCard: { marginHorizontal: 15, marginTop: 15, borderRadius: 20, padding: 15, marginBottom: 5 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'flex-end' },
  avatarPlaceholder: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  postHeaderText: { alignItems: 'flex-end' },
  postUser: { fontSize: 16, fontWeight: 'bold' },
  postTime: { fontSize: 12, marginTop: 2 },
  postContent: { fontSize: 15, lineHeight: 22, marginBottom: 15, textAlign: 'right' },
  postImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { marginRight: 5, fontSize: 14 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#6C63FF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});
