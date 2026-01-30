import 'package:aura_mobile/core/widgets/glass_container.dart';
import 'package:aura_mobile/features/chat/presentation/widgets/message_bubble.dart';
import 'package:flutter/material.dart';

class ChatScreen extends StatelessWidget {
  final String userName;
  const ChatScreen({super.key, required this.userName});

  @override
  Widget build(BuildContext context) {
    return Container(
      // Ensure gradient background is visible if pushed directly, 
      // but usually inherited from Shell. 
      // We assume this is pushed onto the stack covering the shell body.
      decoration: const BoxDecoration(
        color: Colors.transparent, 
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(80),
          child: GlassContainer(
            borderRadius: const BorderRadius.vertical(bottom: Radius.circular(20)),
            opacity: 0.15,
            blur: 20,
            padding: const EdgeInsets.only(top: 30, left: 10, right: 10, bottom: 10),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
                ),
                const CircleAvatar(
                  radius: 20,
                  backgroundColor: Colors.white24,
                  child: Icon(Icons.person, color: Colors.white),
                ),
                const SizedBox(width: 12),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      userName,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    Row(
                      children: [
                        Container(
                          width: 8, height: 8,
                          decoration: const BoxDecoration(color: Colors.greenAccent, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          "Online",
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    )
                  ],
                ),
                const Spacer(),
                // Ghost Mode Indicator (Mock)
                IconButton(
                  icon: const Icon(Icons.privacy_tip_outlined, color: Colors.white70),
                  tooltip: 'Ghost Mode Active',
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.auto_awesome, color: Colors.amberAccent),
                  tooltip: 'AI Summary',
                  onPressed: () async {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Consulting Aura AI..."), backgroundColor: Colors.black87),
                    );
                    
                    // Mock AI Call
                    await Future.delayed(const Duration(seconds: 1));
                    
                    if (context.mounted) {
                      showDialog(
                        context: context,
                        builder: (c) => AlertDialog(
                          backgroundColor: const Color(0xFF1a1a2e).withOpacity(0.9),
                          title: const Text("Chat Summary", style: TextStyle(color: Colors.white)),
                          content: const Text(
                            "The conversation focused on design aesthetics. User validated the Neumorphic approach and requested emphasis on privacy features.",
                            style: TextStyle(color: Colors.white70),
                          ),
                          actions: [
                            TextButton(
                              child: const Text("Close"),
                              onPressed: () => Navigator.pop(c),
                            )
                          ],
                        ),
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                itemCount: 20,
                itemBuilder: (context, index) {
                  final isMe = index % 2 == 0;
                  return MessageBubble(
                    message: isMe 
                      ? "Have you checked the latest designs for Aura?" 
                      : "Yes! The glassmorphism looks stunning. Especially the dynamic gradients.",
                    isMe: isMe,
                    time: "10:${30 + index} AM",
                  );
                },
              ),
            ),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return GlassContainer(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      borderRadius: BorderRadius.circular(30),
      opacity: 0.1,
      child: Row(
        children: [
          IconButton(icon: const Icon(Icons.add, color: Colors.white70), onPressed: () {}),
          const Expanded(
            child: TextField(
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Type a message...",
                hintStyle: TextStyle(color: Colors.white30),
                border: InputBorder.none,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.mic, color: Colors.white70), 
            onPressed: () {},
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Colors.blueAccent,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.send, color: Colors.white, size: 20),
          ),
        ],
      ),
    );
  }
}
