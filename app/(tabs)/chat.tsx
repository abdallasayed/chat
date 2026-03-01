import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const router = useRouter();

  // هنبدأ بجروب عام يجمع الشلة كلها لحد ما نبرمج المحادثات الفردية
  const CHATS = [
    { id: 'global', name: 'شلة الأنس (جروب عام)', message: 'ادخل دردش مع كل الشلة دلوقتي!', time: 'الآن', unread: 0, image: 'https://avatar.iran.liara.run/public/boy?username=Group' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الرسائل</Text>
        <TouchableOpacity style={styles.iconButton}><Ionicons name="add" size={24} color="#FFF" /></TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="ابحث عن صديق..." placeholderTextColor="#888" textAlign="right" />
      </View>

      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => router.push(`/chatRoom?id=${item.id}&name=${item.name}`)}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  iconButton: { backgroundColor: '#1E1E1E', padding: 8, borderRadius: 50 },
  searchContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', marginHorizontal: 20, borderRadius: 15, paddingHorizontal: 15, marginBottom: 20 },
  searchIcon: { marginLeft: 10 },
  searchInput: { flex: 1, color: '#FFF', height: 45, textAlign: 'right' },
  chatItem: { flexDirection: 'row-reverse', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  avatar: { width: 55, height: 55, borderRadius: 27.5, marginLeft: 15 },
  chatInfo: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 5 },
  chatName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  chatTime: { color: '#888', fontSize: 12 },
  chatMessage: { color: '#AAA', fontSize: 14, textAlign: 'right' },
});
