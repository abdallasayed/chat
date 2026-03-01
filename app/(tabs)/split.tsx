import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let sum = 0;
      const exps = snapshot.docs.map(doc => {
        const data = doc.data();
        sum += data.amount || 0;
        return { id: doc.id, ...data };
      });
      setExpenses(exps);
      setTotal(sum);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المصاريف المشتركة</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addExpense')}><Ionicons name="add" size={24} color="#FFF" /></TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>إجمالي مصاريف الشلة</Text>
        <Text style={styles.summaryAmount}>{total} ج.م</Text>
      </View>

      <View style={styles.listHeader}><Text style={styles.listTitle}>العمليات الأخيرة</Text></View>

      {loading ? <ActivityIndicator color="#6C63FF" style={{marginTop: 50}} /> : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={{color: '#888', textAlign: 'center', marginTop: 50}}>مفيش مصاريف لسه متسجلة</Text>}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <View style={styles.expenseIcon}><Ionicons name="receipt-outline" size={24} color="#6C63FF" /></View>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expensePaidBy}>دفعها: {item.paidBy}</Text>
              </View>
              <Text style={styles.expenseAmount}>{item.amount} ج</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  addButton: { backgroundColor: '#6C63FF', padding: 8, borderRadius: 12 },
  summaryCard: { backgroundColor: '#1E1E1E', marginHorizontal: 20, marginBottom: 15, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#2C2C2C', alignItems: 'center' },
  summaryTitle: { color: '#AAA', fontSize: 14, marginBottom: 5 },
  summaryAmount: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  listHeader: { flexDirection: 'row-reverse', paddingHorizontal: 20, marginBottom: 10 },
  listTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  expenseItem: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 15 },
  expenseIcon: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#2C2C2C', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  expenseInfo: { flex: 1, alignItems: 'flex-end' },
  expenseTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  expensePaidBy: { color: '#AAA', fontSize: 12 },
  expenseAmount: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginRight: 15 }
});
