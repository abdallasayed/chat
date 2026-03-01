import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'متأكد إنك عايز تخرج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'خروج', 
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>حسابي</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.email ? user.email.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.email?.split('@') || 'مستخدم'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'لا يوجد بريد إلكتروني'}</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}><Ionicons name="notifications" size={20} color="#FFF" /></View>
            <Text style={styles.settingText}>الإشعارات</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={[styles.settingIconContainer, {backgroundColor: '#FF3B30'}]}><Ionicons name="log-out" size={20} color="#FFF" /></View>
            <Text style={[styles.settingText, {color: '#FF3B30'}]}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 20, alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  profileSection: { alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 3, borderColor: '#1E1E1E' },
  avatarText: { fontSize: 40, color: '#FFF', fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#AAA', marginBottom: 20 },
  editButton: { backgroundColor: '#1E1E1E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#6C63FF' },
  editButtonText: { color: '#6C63FF', fontWeight: 'bold' },
  settingsSection: { padding: 20 },
  sectionTitle: { color: '#888', fontSize: 14, marginBottom: 15, fontWeight: 'bold', textAlign: 'right' },
  settingItem: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 15, marginBottom: 10 },
  settingIconContainer: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  settingText: { flex: 1, color: '#FFF', fontSize: 16, textAlign: 'right' },
});
