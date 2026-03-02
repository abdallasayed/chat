import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export default function FriendsScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) return;

    const q = query(collection(db, 'users'), where('id', '!=', currentUserUid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data());
      setUsers(usersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>مجتمع الشلة</Text>
      </View>

      {loading ? <ActivityIndicator size="large" color="#6C63FF" style={{marginTop: 50}} /> : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>مفيش مستخدمين تانيين لسه سجلوا</Text>}
          renderItem={({ item }) => {
            // حل مشكلة الخطأ (لو مفيش اسم، هيجيب أول حرف من الإيميل، ولو مفيش إيميل هيحط حرف U)
            const displayName = item.name || item.email?.split('@') || 'مستخدم';
            const firstLetter = displayName.charAt(0).toUpperCase();

            return (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/user/${item.id}`)}>
                <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{firstLetter}</Text></View>
                <View style={styles.info}>
                  <Text style={styles.name}>{displayName}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                <TouchableOpacity style={styles.viewBtn}><Ionicons name="chevron-back" size={24} color="#6C63FF" /></TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 50 },
  card: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 15 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2C2C2C', justifyContent: 'center', alignItems: 'center', marginLeft: 15, borderWidth: 1, borderColor: '#6C63FF' },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1, alignItems: 'flex-end' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  email: { fontSize: 14, color: '#888' },
  viewBtn: { padding: 5 }
});
