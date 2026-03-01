import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب بيانات المستخدم
    const fetchUser = async () => {
      if (typeof id === 'string') {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    };

    // جلب بوستات المستخدم ده بس
    const q = query(collection(db, 'posts'), where('userId', '==', id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
      setLoading(false);
    });

    fetchUser();
    return unsubscribe;
  }, [id]);

  if (loading) return <SafeAreaView style={styles.loader}><ActivityIndicator size="large" color="#6C63FF" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Ionicons name="chevron-forward" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
        <View style={{width: 28}} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.infoSection}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{userData?.name?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <Text style={styles.name}>{userData?.name || 'مستخدم'}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryBtn}><Ionicons name="person-add" size={18} color="#FFF" style={{marginRight:5}}/><Text style={styles.btnText}>إضافة صديق</Text></TouchableOpacity>
              <TouchableOpacity style={styles.nudgeBtn}><Ionicons name="hand-right" size={18} color="#FFD60A" /></TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>منشورات {userData?.name}</Text>
          </View>
        )}
        data={userPosts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>هذا المستخدم لم يقم بنشر أي شيء بعد.</Text>}
        renderItem={({ item }) => (
          <View style={styles.postMock}>
            <Text style={styles.postText}>{item.text}</Text>
            <Text style={styles.postTime}>{item.privacy} • {item.likes || 0} إعجاب</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loader: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  infoSection: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 30 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 40, color: '#FFF', fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  email: { fontSize: 14, color: '#AAA', marginBottom: 20 },
  actionButtons: { flexDirection: 'row-reverse', gap: 10, width: '100%', justifyContent: 'center', marginBottom: 30 },
  primaryBtn: { backgroundColor: '#6C63FF', flexDirection: 'row-reverse', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' },
  nudgeBtn: { backgroundColor: '#2C2C2C', padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFD60A' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-end', marginBottom: 15 },
  postMock: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, marginHorizontal: 20, marginBottom: 10 },
  postText: { color: '#FFF', fontSize: 16, textAlign: 'right' },
  postTime: { color: '#888', fontSize: 12, textAlign: 'right', marginTop: 10 },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 20 }
});
