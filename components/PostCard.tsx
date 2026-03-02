import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PostCard({ item, onLike, onShare, onComment }: any) {
  // 1. حماية فولاذية للوقت ⏳
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'الآن...';
    // التأكد إن دالة الوقت موجودة فعلاً قبل تشغيلها (عشان البوستات القديمة)
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }
    return 'سابقاً'; 
  };

  // 2. حماية فولاذية للأسماء والنصوص 🛡️
  const userEmailStr = String(item.userEmail || '');
  const userNameStr = String(item.userName || '');
  
  const displayName = item.userName ? userNameStr : (userEmailStr ? userEmailStr.split('@') : 'مجهول');
  const nameString = String(displayName);
  const firstLetter = nameString ? nameString.charAt(0).toUpperCase() : 'U';

  // 3. كشف الذكاء الاصطناعي بأمان 🤖
  const isAI = userEmailStr.includes('@ai.com');

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postHeaderText}>
          <Text style={styles.postUser}>
            {nameString} {isAI && <Ionicons name="hardware-chip" size={14} color="#6C63FF" />}
          </Text>
          <Text style={styles.postTime}>{formatTime(item.createdAt)} • {item.privacy || 'العامة'}</Text>
        </View>
        <View style={[styles.avatarPlaceholder, isAI && {backgroundColor: '#2C2C2C', borderColor: '#6C63FF', borderWidth: 1}]}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item?.text || ''}</Text>
      {item?.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.postImage} /> : null}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onShare(item)}>
          <Ionicons name="share-social-outline" size={22} color="#888" />
          <Text style={styles.actionText}>مشاركة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(item)}>
          <Text style={styles.actionNumber}>{item?.comments || 0}</Text>
          <Ionicons name="chatbubble-outline" size={22} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onLike(item?.id)}>
          <Text style={styles.actionNumber}>{item?.likes || 0}</Text>
          <Ionicons name="heart-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: { backgroundColor: '#1E1E1E', marginHorizontal: 15, marginTop: 15, borderRadius: 20, padding: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'flex-end' },
  avatarPlaceholder: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  postHeaderText: { alignItems: 'flex-end', marginRight: 10 },
  postUser: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  postTime: { fontSize: 12, color: '#888', marginTop: 2 },
  postContent: { fontSize: 15, color: '#FFF', lineHeight: 22, marginBottom: 15, textAlign: 'right' },
  postImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#2C2C2C', paddingTop: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  actionNumber: { color: '#FFF', marginRight: 5, fontSize: 15, fontWeight: 'bold' },
  actionText: { color: '#888', marginLeft: 5, fontSize: 14 }
});
