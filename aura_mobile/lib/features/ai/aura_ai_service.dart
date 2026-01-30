class AuraAI {
  static Future<String> summarizeChat(List<String> messages) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    return "Summary: The user and friend discussed the new project requirements. "
        "Key points: Glassmorphism design is approved, Privacy features are a priority, "
        "and the deadline is set for next Friday.";
  }

  static Future<String> translateMessage(String message, String targetLang) async {
    await Future.delayed(const Duration(milliseconds: 500));
    // Mock translation
    return "[Translated to $targetLang]: $message";
  }

  static Future<List<String>> suggestReplies(String lastMessage) async {
    return ["Sounds great!", "Let me check my calendar.", "Can you send the details?"];
  }
}
