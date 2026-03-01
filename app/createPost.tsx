import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, uploadcare } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreatePostScreen() {
  const router = useRouter();
  const [postText, setPostText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState('الأصدقاء');

  // دالة اختيار الصورة من الموبايل
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets.uri);
    }
  };

  // دالة النشر (رفع الصورة + حفظ في فايربيز)
  const handlePost = async () => {
    if (!postText.trim() && !imageUri) return;
    setLoading(true);

    try {
      let imageUrl = '';
      
      // لو اختار صورة، نرفعها لـ Uploadcare الأول
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileInfo = await uploadcare.uploadFile(blob);
        imageUrl = fileInfo.cdnUrl; // ده رابط الصورة السريع جداً
      }

      // حفظ البوست في Firestore
      await addDoc(collection(db, 'posts'), {
        text: postText,
        imageUrl: imageUrl,
        privacy: privacy,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'مجهول',
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
      });

      router.back(); // نرجع للرئيسية بعد النجاح
    } catch (error: any) {
      Alert.alert('خطأ في النشر', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={loading}><Text style={styles.cancelText}>إلغاء</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>إنشاء منشور</Text>
        <TouchableOpacity style={[styles.postButton, (!postText.trim() && !imageUri) && styles.postButtonDisabled]} onPress={handlePost} disabled={loading || (!postText.trim() && !imageUri)}>
          {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.postButtonText}>نشر</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.userSection}>
          <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy?username=Me' }} style={styles.avatar} />
          <TouchableOpacity style={styles.privacyBadge} onPress={() => setPrivacy(privacy === 'الأصدقاء' ? 'العامة' : 'الأصدقاء')}>
            <Ionicons name={privacy === 'الأصدقاء' ? 'people' : 'earth'} size={14} color="#6C63FF" style={{marginLeft: 4}} />
            <Text style={styles.privacyText}>{privacy}</Text>
            <Ionicons name="caret-down" size={12} color="#888" style={{marginRight: 4}} />
          </TouchableOpacity>
        </View>

        <TextInput style={styles.input} placeholder="بتفكر في إيه يا صاحبي؟" placeholderTextColor="#888" multiline autoFocus value={postText} onChangeText={setPostText} textAlignVertical="top" />
        
        {/* معاينة الصورة لو تم اختيارها */}
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
              <Ionicons name="close-circle" size={28} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.toolsWrapper}>
        <View style={styles.toolsContainer}>
          <TouchableOpacity style={styles.toolButton} onPress={pickImage} disabled={loading}>
            <Ionicons name="image" size={28} color="#4CD964" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}><Ionicons name="location" size={28} color="#FF3B30" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#1E1E1E' },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  postButton: { backgroundColor: '#6C63FF', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, minWidth: 70, alignItems: 'center' },
  postButtonDisabled: { backgroundColor: '#333' },
  postButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  inputContainer: { padding: 15, flex: 1 },
  userSection: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginLeft: 10 },
  privacyBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#1E1E1E', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: '#2C2C2C' },
  privacyText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  input: { color: '#FFF', fontSize: 18, textAlign: 'right', minHeight: 100 },
  imagePreviewContainer: { marginTop: 15, position: 'relative' },
  imagePreview: { width: '100%', height: 250, borderRadius: 15 },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15 },
  toolsWrapper: { borderTopWidth: 1, borderTopColor: '#1E1E1E', padding: 15 },
  toolsContainer: { flexDirection: 'row-reverse', justifyContent: 'space-around' },
  toolButton: { backgroundColor: '#1E1E1E', padding: 10, borderRadius: 15, width: 60, alignItems: 'center' }
});
