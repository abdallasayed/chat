import 'dart:async';

class AuthService {
  // Simulate Firebase Auth
  Future<bool> verifyPhoneNumber(String phoneNumber) async {
    await Future.delayed(const Duration(seconds: 1)); // Mock network
    return true; // OTP sent
  }

  Future<bool> signInWithOtp(String smsCode) async {
     await Future.delayed(const Duration(seconds: 1));
     return true; // Success
  }

  Future<void> signOut() async {
     await Future.delayed(const Duration(milliseconds: 500));
  }
}

class ChatService {
  // Simulate Firestore Real-time stream
  Stream<List<Map<String, dynamic>>> getMessagesStream(String chatId) {
    return Stream.periodic(const Duration(seconds: 2), (count) {
      return [
        {
          'id': '1',
          'text': 'Welcome to Aura!',
          'senderId': 'system',
          'timestamp': DateTime.now().subtract(const Duration(minutes: 5)).toIso8601String(),
        },
        if (count > 0)
        {
          'id': '2',
          'text': 'This message arrived just now.',
          'senderId': 'friend',
          'timestamp': DateTime.now().toIso8601String(),
        }
      ];
    });
  }

  Future<void> sendMessage(String chatId, String text) async {
    // In real app: await Firestore.instance.collection('chats')...
    await Future.delayed(const Duration(milliseconds: 300));
    print('Message sent to $chatId: $text');
  }
}
