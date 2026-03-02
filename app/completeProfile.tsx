import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) return Alert.alert('تنبيه', 'لازم تكتب اسمك يا صاحبي عشان الشلة تعرفك!');
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: fullName,
          createdAt: serverTimestamp()
        }, { merge: true }); // تحديث البيانات بدون مسح القديم
        
        router.replace('/(tabs)'); // دخول التطبيق!
      }
    } catch (error) {
      Alert.alert('خطأ', 'حصلت مشكلة في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>خطوة أخيرة! 🚀</Text>
        <Text style={styles.subtitle}>البروفايل بتاعك ناقصه اسمك الحقيقي عشان أصحابك يلاقوك بسهولة.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="اسمك الحقيقي (مثال: عبدالله)" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} textAlign="right" />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>حفظ ودخول التطبيق</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center' },
  content: { padding: 20, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#AAA', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
  inputContainer: { width: '100%', backgroundColor: '#1E1E1E', borderRadius: 15, paddingHorizontal: 15, height: 60, borderWidth: 1, borderColor: '#6C63FF', marginBottom: 20, justifyContent: 'center' },
  input: { color: '#FFF', fontSize: 18, textAlign: 'right' },
  button: { width: '100%', backgroundColor: '#6C63FF', borderRadius: 15, height: 60, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
