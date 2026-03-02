import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('منشوراتي'); // التبويبات الجديدة
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. جلب بيانات المستخدم
    const fetchMe = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (e) {
        console.log("Error:", e);
      }
    };
    fetchMe();

    // 2. جلب منشورات المستخدم ده بس (بشكل لحظي)
    const q = query(collection(db, 'posts'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyPosts(posts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'متأكد إنك عايز تخرج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'خروج', style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/');
        }
      }
    ]);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'الآن...';
    return timestamp.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  // حماية فولاذية للاسم عشان ميضربش أي Error
  const nameString = String(userData?.name || auth.currentUser?.email?.split('@') || 'مستخدم');
  const firstLetter = nameString.charAt(0).toUpperCase();

  // الهيدر اللي جواه كل بيانات البروفايل (عشان يشتغل صح مع القائمة)
  const renderHeader = () => (
    <View style={{ paddingBottom: 15 }}>
      <View style={styles.header}><Text style={styles.headerTitle}>حسابي</Text></View>

      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{firstLetter}</Text></View>
        <Text style={styles.userName}>{nameString}</Text>
        <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={() => Alert.alert('قريباً', 'تعديل الملف الشخصي هيشتغل في التحديث الجاي 🚀')}>
          <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <TouchableOpacity style={[styles.settingItem, {borderColor: '#FFD60A', borderWidth: 1}]} onPress={() => router.push('/roulette')}>
          <View style={[styles.settingIconContainer, {backgroundColor: '#FFD60A'}]}><Ionicons name="aperture" size={20} color="#121212" /></View>
          <Text style={[styles.settingText, {color: '#FFD60A', fontWeight: 'bold'}]}>عجلة الشلة (مين هيدفع؟) 🎡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={[styles.settingIconContainer, {backgroundColor: '#FF3B30'}]}><Ionicons name="log-out" size={20} color="#FFF" /></View>
          <Text style={[styles.settingText, {color: '#FF3B30'}]}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>

      {/* شريط التبويبات (Tabs) */}
      <View style={styles.tabsContainer}>
        {['الأصدقاء 🔒', 'الإشارات 🔒', 'منشوراتي'].map((tab, index) => {
          const tabName = tab.split(' '); // بناخد الكلمة الأولى بس للفلترة
          const isActive = activeTab === tabName;
          return (
            <TouchableOpacity key={index} style={[styles.tabButton, isActive && styles.activeTab]} onPress={() => setActiveTab(tabName)}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activeTab === 'منشوراتي' ? myPosts : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? <ActivityIndicator size="large" color="#6C63FF" /> : (
              <Text style={styles.emptyText}>
                {activeTab === 'منشوراتي' ? 'مفيش منشورات ليك لسه.. انشر حاجة عشان تظهر هنا!' : 'القسم ده لسه مقفول، هيتفتح في التحديثات الجاية! ⏳'}
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postHeaderText}>
                <Text style={styles.postUser}>{nameString}</Text>
                <Text style={styles.postTime}>{formatTime(item.createdAt)} • {item.privacy}</Text>
              </View>
              <View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>{firstLetter}</Text></View>
            </View>
            <Text style={styles.postContent}>{item.text}</Text>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.postImage} /> : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  profileSection: { alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: '#1E1E1E' },
  avatarText: { fontSize: 40, color: '#FFF', fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#AAA', marginBottom: 20 },
  editButton: { backgroundColor: '#1E1E1E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#6C63FF' },
  editButtonText: { color: '#6C63FF', fontWeight: 'bold' },
  settingsSection: { padding: 20 },
  settingItem: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 15, marginBottom: 10 },
  settingIconContainer: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  settingText: { flex: 1, color: '#FFF', fontSize: 16, textAlign: 'right' },
  tabsContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#1E1E1E', paddingBottom: 15 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#1E1E1E' },
  activeTab: { backgroundColor: '#6C63FF' },
  tabText: { color: '#888', fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: '#FFF' },
  emptyContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  emptyText: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  postCard: { backgroundColor: '#1E1E1E', marginHorizontal: 15, marginBottom: 15, borderRadius: 20, padding: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'flex-end' },
  postHeaderText: { alignItems: 'flex-end', marginRight: 10 },
  postUser: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  postTime: { fontSize: 12, color: '#888', marginTop: 2 },
  smallAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  smallAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  postContent: { fontSize: 15, color: '#FFF', textAlign: 'right', marginBottom: 10, lineHeight: 22 },
  postImage: { width: '100%', height: 200, borderRadius: 15 }
});
