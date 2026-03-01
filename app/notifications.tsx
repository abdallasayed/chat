import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
  { id: '1', type: 'like', text: 'عمر أعجب بمنشورك', time: 'منذ 10 دقائق', image: 'https://avatar.iran.liara.run/public/boy?username=Omar' },
  { id: '2', type: 'split', text: 'أحمد أضاف مصروف جديد (مشاريب القهوة)', time: 'منذ ساعة', image: 'https://avatar.iran.liara.run/public/boy?username=Ahmed' },
  { id: '3', type: 'comment', text: 'سارة علقت على صورتك', time: 'منذ ساعتين', image: 'https://avatar.iran.liara.run/public/girl?username=Sara' },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const getIcon = (type: string) => {
    if(type === 'like') return <Ionicons name="heart" size={14} color="#FF3B30" />;
    if(type === 'split') return <Ionicons name="wallet" size={14} color="#4CD964" />;
    return <Ionicons name="chatbubble" size={14} color="#5AC8FA" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-forward" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <View style={{width: 28}} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.iconBadge}>{getIcon(item.type)}</View>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  backBtn: { padding: 5 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  notificationItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E', alignItems: 'center' },
  imageContainer: { marginRight: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  iconBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#1E1E1E', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#121212' },
  info: { flex: 1 },
  text: { color: '#FFF', fontSize: 15, marginBottom: 5, textAlign: 'right' },
  time: { color: '#888', fontSize: 12, textAlign: 'right' }
});
