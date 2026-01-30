import 'package:aura_mobile/features/chat/domain/smart_folder.dart';
import 'package:aura_mobile/features/chat/presentation/chat_screen.dart';
import 'package:flutter/material.dart';
import 'package:aura_mobile/core/widgets/glass_container.dart';

class SmartFoldersScreen extends StatefulWidget {
  const SmartFoldersScreen({super.key});

  @override
  State<SmartFoldersScreen> createState() => _SmartFoldersScreenState();
}

class _SmartFoldersScreenState extends State<SmartFoldersScreen> {
  FolderType _selectedType = FolderType.all;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Folders Selector
        SizedBox(
          height: 80,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            scrollDirection: Axis.horizontal,
            itemCount: SmartFolder.defaults.length,
            separatorBuilder: (c, i) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final folder = SmartFolder.defaults[index];
              final isSelected = folder.type == _selectedType;

              return GestureDetector(
                onTap: () => setState(() => _selectedType = folder.type),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  child: isSelected
                      ? GlassContainer(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          color: Colors.white,
                          opacity: 0.25,
                          child: Row(
                            children: [
                              Icon(folder.icon, color: Colors.white, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                folder.name,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white.withOpacity(0.1)),
                          ),
                          child: Row(
                            children: [
                              Icon(folder.icon, color: Colors.white60, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                folder.name,
                                style: const TextStyle(
                                  color: Colors.white60,
                                ),
                              ),
                            ],
                          ),
                        ),
                ),
              );
            },
          ),
        ),

        // Chat List Area
        Expanded(
          child: GlassContainer(
            margin: const EdgeInsets.only(top: 10),
            opacity: 0.05,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: 10, // Mock count
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context, 
                      MaterialPageRoute(builder: (_) => ChatScreen(userName: 'User ${index + 1}')),
                    );
                  },
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                    children: [
                      const CircleAvatar(
                        radius: 28,
                        backgroundColor: Colors.white10,
                        child: Icon(Icons.person, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'User ${index + 1}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Hey, how are you regarding the project?',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.6),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '10:30 PM',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.4),
                              fontSize: 12,
                            ),
                          ),
                          if (index < 3)
                            Container(
                              margin: const EdgeInsets.only(top: 6),
                              padding: const EdgeInsets.all(6),
                              decoration: const BoxDecoration(
                                color: Color(0xFF66a6ff),
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                '${3 - index}',
                                style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
