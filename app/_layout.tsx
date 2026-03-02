import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Stack } from 'expo-router';

// 1. كاشف الأخطاء العميقة (اللي بتحصل في الخلفية قبل ما التطبيق يفتح)
if (typeof ErrorUtils !== 'undefined') {
  ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    Alert.alert(
      "🚨 عطل قاتل في النظام",
      `الرسالة: ${error.message}\n\nصور الشاشة دي للمبرمج!`,
      [{ text: "فهمت" }]
    );
  });
}

// 2. كاشف أخطاء الشاشات والواجهات (Error Boundary)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMsg: '', errorStack: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorMsg: error.message, errorStack: error.stack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' }}>
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FF3B30', marginBottom: 15, textAlign: 'center' }}>🚨 تم كشف خطأ! 🚨</Text>
            
            <Text style={{ fontSize: 16, color: '#FFF', textAlign: 'left', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#FF3B30' }}>
              <Text style={{color: '#FFD60A', fontWeight: 'bold'}}>الرسالة:{'\n'}</Text>
              {this.state.errorMsg}{'\n\n'}
              <Text style={{color: '#FFD60A', fontWeight: 'bold'}}>التفاصيل:{'\n'}</Text>
              {this.state.errorStack}
            </Text>
            
            <Text style={{color: '#AAA', marginTop: 25, textAlign: 'center', fontSize: 16, fontWeight: 'bold', lineHeight: 24}}>
              التطبيق مقفلش عشان الكاشف شغال! 🛡️{'\n'}
              خد سكرين شوت (صورة) للشاشة دي وابعتها ليا عشان نفرتك المشكلة دي فوراً! 📸
            </Text>
          </ScrollView>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
