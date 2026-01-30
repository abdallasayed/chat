import 'package:flutter/material.dart';

enum FolderType {
  all,
  personal,
  work,
  family,
  study,
}

class SmartFolder {
  final String id;
  final String name;
  final FolderType type;
  final IconData icon;
  final int unreadCount;

  const SmartFolder({
    required this.id, 
    required this.name, 
    required this.type,
    required this.icon,
    this.unreadCount = 0,
  });

  static List<SmartFolder> get defaults => [
    const SmartFolder(id: '1', name: 'All Chats', type: FolderType.all, icon: Icons.maps_ugc_outlined),
    const SmartFolder(id: '2', name: 'Personal', type: FolderType.personal, icon: Icons.person_outline),
    const SmartFolder(id: '3', name: 'Work', type: FolderType.work, icon: Icons.work_outline),
    const SmartFolder(id: '4', name: 'Family', type: FolderType.family, icon: Icons.home_outlined),
    const SmartFolder(id: '5', name: 'Study', type: FolderType.study, icon: Icons.school_outlined),
  ];
}
