import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function AddExpenseScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !amount) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        title,
        amount: Number(amount),
        paidBy: auth.currentUser?.email?.split('@') || 'مجهول',
        createdAt: serverTimestamp(),
        category: 'عام 💸'
      });
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}><Text style={styles.cancelText}>إلغاء</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>إضافة مصروف</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading || !title || !amount}>
          {loading ? <ActivityIndicator color="#4CD964"/> : <Text style={[styles.saveText, (!title || !amount) && {color: '#333'}]}>حفظ</Text>}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>وصف المصروف</Text>
          <TextInput style={styles.input} placeholder="عشاء، مواصلات..." placeholderTextColor="#888" value={title} onChangeText={setTitle} textAlign="right" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>المبلغ (ج.م)</Text>
          <TextInput style={styles.input} placeholder="0" placeholderTextColor="#888" keyboardType="numeric" value={amount} onChangeText={setAmount} textAlign="right" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  saveText: { color: '#4CD964', fontSize: 16, fontWeight: 'bold' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#AAA', fontSize: 14, marginBottom: 8, textAlign: 'right' },
  input: { backgroundColor: '#1E1E1E', color: '#FFF', fontSize: 16, padding: 15, borderRadius: 12, textAlign: 'right' }
});
