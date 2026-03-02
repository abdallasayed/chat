import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{padding: 5}}><Ionicons name="chevron-forward" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إعدادات التطبيق</Text>
          
          <View style={styles.settingRow}>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#333', true: '#6C63FF' }} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>الإشعارات</Text>
              <Text style={styles.settingSub}>تفعيل تنبيهات الرسائل والطلبات</Text>
            </View>
            <Ionicons name="notifications" size={24} color="#888" />
          </View>

          <View style={styles.settingRow}>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#333', true: '#6C63FF' }} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>الوضع الداكن</Text>
              <Text style={styles.settingSub}>تغيير مظهر التطبيق</Text>
            </View>
            <Ionicons name="moon" size={24} color="#888" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخصوصية والأمان</Text>
          
          <View style={styles.settingRow}>
            <Switch value={privateAccount} onValueChange={setPrivateAccount} trackColor={{ false: '#333', true: '#6C63FF' }} />
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>حساب خاص</Text>
              <Text style={styles.settingSub}>الأصدقاء فقط يمكنهم رؤية منشوراتك</Text>
            </View>
            <Ionicons name="lock-closed" size={24} color="#888" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إدارة الحساب</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={() => Alert.alert('تنبيه', 'سيتم حذف حسابك نهائياً، هل أنت متأكد؟')}>
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <Text style={styles.dangerText}>حذف الحساب نهائياً</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  sectionTitle: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold', marginBottom: 15, textAlign: 'right' },
  settingRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingInfo: { flex: 1, alignItems: 'flex-end', marginRight: 15 },
  settingText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  settingSub: { color: '#888', fontSize: 12, marginTop: 4 },
  dangerButton: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#2C1212', padding: 15, borderRadius: 15, justifyContent: 'center', borderWidth: 1, borderColor: '#FF3B30' },
  dangerText: { color: '#FF3B30', fontSize: 16, fontWeight: 'bold', marginRight: 10 }
});
