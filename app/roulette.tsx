import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function RouletteScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('اضغط للف!');
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const names = querySnapshot.docs.map(doc => doc.data().name || doc.data().email.split('@'));
      setFriends(names);
    };
    fetchFriends();
  }, []);

  const spinWheel = () => {
    if (friends.length === 0) return Alert.alert('تنبيه', 'مفيش أصدقاء كفاية في الشلة!');
    setSpinning(true);
    
    let count = 0;
    const interval = setInterval(() => {
      const randomName = friends[Math.floor(Math.random() * friends.length)];
      setSelected(randomName);
      count++;
      if (count > 20) { // بيلف 20 مرة سريع
        clearInterval(interval);
        setSpinning(false);
        const finalWinner = friends[Math.floor(Math.random() * friends.length)];
        setSelected(`🎉 ${finalWinner} هو اللي هيدفع! 🎉`);
      }
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{padding: 5}}><Ionicons name="chevron-forward" size={28} color="#FFF" /></TouchableOpacity>
        <Text style={styles.headerTitle}>مين هيدفع الحساب؟ 🎡</Text>
        <View style={{width: 28}} />
      </View>

      <View style={styles.content}>
        <Ionicons name="cash-outline" size={80} color="#FFD60A" style={{marginBottom: 30}} />
        <Text style={styles.instruction}>القرار العادل وقت دفع الحساب!</Text>
        
        <View style={styles.wheelBox}>
          <Text style={[styles.resultText, spinning && styles.spinningText]}>{selected}</Text>
        </View>

        <TouchableOpacity style={[styles.spinBtn, spinning && {opacity: 0.5}]} onPress={spinWheel} disabled={spinning}>
          <Text style={styles.spinBtnText}>{spinning ? 'بيلف...' : 'لف العجلة ودبس حد!'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFD60A' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  instruction: { color: '#AAA', fontSize: 16, marginBottom: 40 },
  wheelBox: { backgroundColor: '#1E1E1E', width: '100%', height: 150, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#6C63FF', marginBottom: 40 },
  resultText: { color: '#FFF', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  spinningText: { color: '#6C63FF', fontSize: 35 },
  spinBtn: { backgroundColor: '#6C63FF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  spinBtnText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' }
});
