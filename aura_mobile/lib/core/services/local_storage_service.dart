import 'package:hive_flutter/hive_flutter.dart';

class LocalStorageService {
  static const String _messageBoxName = 'aura_messages';
  static const String _userBoxName = 'aura_user_prefs';

  static final LocalStorageService _instance = LocalStorageService._internal();
  factory LocalStorageService() => _instance;
  LocalStorageService._internal();

  Future<void> init() async {
    await Hive.initFlutter();
    // Register Adapters here if we had generated TypeAdapters
    await Hive.openBox(_messageBoxName);
    await Hive.openBox(_userBoxName);
  }

  // --- Messages ---
  Future<void> saveMessage(String chatId, Map<String, dynamic> message) async {
    final box = Hive.box(_messageBoxName);
    final key = '${chatId}_${DateTime.now().millisecondsSinceEpoch}';
    await box.put(key, message);
  }

  List<Map<dynamic, dynamic>> getMessages(String chatId) {
    final box = Hive.box(_messageBoxName);
    // Naive implementation: filter all keys. In real app, use a list inside the box per chat.
    final messages = box.toMap().entries
        .where((e) => e.key.toString().startsWith(chatId))
        .map((e) => e.value as Map<dynamic, dynamic>)
        .toList();
    
    // Sort by timestamp if available, otherwise return as is
    return messages;
  }

  // --- User Prefs ---
  Future<void> saveThemeMode(String mode) async {
    final box = Hive.box(_userBoxName);
    await box.put('theme_mode', mode);
  }

  String? getThemeMode() {
    final box = Hive.box(_userBoxName);
    return box.get('theme_mode');
  }
}
