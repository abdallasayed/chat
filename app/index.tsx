import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true); // بتبدأ بـ true عشان تفحص الأول

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // فحص الحساب: هل عنده اسم ولا لأ؟
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().name) {
            router.replace('/(tabs)');
          } else {
            router.replace('/completeProfile');
          }
        } catch (e) {
          router.replace('/(tabs)');
        }
      } else {
        setLoading(false); // لو مش مسجل دخول، يظهر شاشة اللوجين
      }
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !fullName)) return Alert.alert('تنبيه', 'أكمل كل البيانات!');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // التوجيه هيحصل تلقائي من الـ useEffect
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          id: userCred.user.uid,
          email: email.toLowerCase(),
          name: fullName,
          createdAt: serverTimestamp()
        });
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('مشكلة ❌', 'تأكد من صحة البيانات.');
      setLoading(false);
    }
  };

  if (loading) return <View style={{flex: 1, backgroundColor: '#121212', justifyContent: 'center'}}><ActivityIndicator size="large" color="#6C63FF" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}><Ionicons name="people" size={60} color="#FFF" /></View>
          <Text style={styles.title}>شِلتنا</Text>
        </View>
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="اسمك الحقيقي" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} textAlign="right" />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="البريد الإلكتروني" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" textAlign="right" />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="كلمة المرور" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry textAlign="right" />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</Text>}
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.signupLink}>{isLogin ? 'حساب جديد؟ سجل من هنا' : 'عندك حساب؟ سجل دخول'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 100, height: 100, backgroundColor: '#6C63FF', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
  form: { width: '100%' },
  inputContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', borderRadius: 15, marginBottom: 15, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#2C2C2C' },
  inputIcon: { marginLeft: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 16, textAlign: 'right' },
  loginButton: { backgroundColor: '#6C63FF', borderRadius: 15, height: 55, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 30 },
  signupLink: { color: '#6C63FF', fontSize: 15, fontWeight: 'bold' }
});
