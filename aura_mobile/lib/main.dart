import 'package:aura_mobile/core/services/local_storage_service.dart';
import 'package:aura_mobile/core/theme/app_theme.dart';
import 'package:aura_mobile/features/chat/presentation/smart_folders_screen.dart';
import 'package:aura_mobile/features/chat/presentation/time_capsule_screen.dart';
import 'package:aura_mobile/features/intro/splash_screen.dart';
import 'package:aura_mobile/features/privacy/presentation/privacy_settings_screen.dart';
import 'package:aura_mobile/features/vault/presentation/media_vault_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LocalStorageService().init();
  runApp(const ProviderScope(child: AuraApp()));
}

class AuraApp extends ConsumerWidget {
  const AuraApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // In a real app, this would be watched from a StateProvider
    const currentMood = AuraMood.mystic; 

    return MaterialApp(
      title: 'Aura Messenger',
      debugShowCheckedModeBanner: false,
      theme: AuraTheme.getThemeData(currentMood),
      home: const SplashScreen(),
    );
  }
}

class AuraShell extends StatefulWidget {
  final AuraMood mood;
  const AuraShell({super.key, required this.mood});

  @override
  State<AuraShell> createState() => _AuraShellState();
}

class _AuraShellState extends State<AuraShell> {
  int _currentIndex = 1; // Default to Folders

  @override
  Widget build(BuildContext context) {
    // Pages for navigation
    final pages = [
       const Center(child: Text("Chats (Coming Soon)", style: TextStyle(color: Colors.white))),
       const SmartFoldersScreen(),
       const MediaVaultScreen(),
    ];

    return Container(
      decoration: BoxDecoration(
        gradient: AuraTheme.getBackgroundGradient(widget.mood),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent, 
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          title: const Text('Aura', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          actions: [
            IconButton(icon: const Icon(Icons.search, color: Colors.white), onPressed: () {}),
            IconButton(
              icon: const Icon(Icons.hourglass_empty, color: Colors.cyanAccent), 
              tooltip: "Time Capsule",
              onPressed: () {
                 Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TimeCapsuleScreen()),
                );
              }
            ),
            IconButton(
              icon: const Icon(Icons.settings, color: Colors.white), 
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PrivacySettingsScreen()),
                );
              },
            ),
          ],
        ),
        body: pages[_currentIndex],
        bottomNavigationBar: Theme(
          data: Theme.of(context).copyWith(
            canvasColor: Colors.transparent,
          ),
          child: GlassContainer(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            margin: EdgeInsets.zero,
            padding: EdgeInsets.zero,
            opacity: 0.1,
            blur: 15,
            child: BottomNavigationBar(
               currentIndex: _currentIndex,
               onTap: (index) => setState(() => _currentIndex = index),
               backgroundColor: Colors.transparent,
               elevation: 0,
               selectedItemColor: Colors.white,
               unselectedItemColor: Colors.white54,
               type: BottomNavigationBarType.fixed,
               items: const [
                 BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
                 BottomNavigationBarItem(icon: Icon(Icons.folder_open), label: 'Folders'),
                 BottomNavigationBarItem(icon: Icon(Icons.lock_outline), label: 'Vault'),
               ]
            ),
          ),
        ),
      ),
    );
  }
}
