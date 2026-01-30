import 'package:aura_mobile/core/widgets/glass_container.dart';
import 'package:flutter/material.dart';

class MediaVaultScreen extends StatefulWidget {
  const MediaVaultScreen({super.key});

  @override
  State<MediaVaultScreen> createState() => _MediaVaultScreenState();
}

class _MediaVaultScreenState extends State<MediaVaultScreen> {
  bool _isUnlocked = false;

  @override
  Widget build(BuildContext context) {
    if (!_isUnlocked) {
      return Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock, size: 64, color: Colors.white54),
              const SizedBox(height: 24),
              const Text(
                "Aura Vault",
                style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                "Locked with Biometric Security",
                style: TextStyle(color: Colors.white54),
              ),
              const SizedBox(height: 48),
              GlassContainer(
                borderRadius: BorderRadius.circular(50),
                color: Colors.blueAccent,
                opacity: 0.2,
                child: IconButton(
                  iconSize: 48,
                  icon: const Icon(Icons.fingerprint, color: Colors.white),
                  onPressed: () {
                    // Mock Unlock
                    setState(() => _isUnlocked = true);
                  },
                ),
              ),
              const SizedBox(height: 16),
              const Text("Tap to Unlock", style: TextStyle(color: Colors.white30)),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text("Hidden Gallery", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
             icon: const Icon(Icons.lock, color: Colors.white),
             onPressed: () => setState(() => _isUnlocked = false),
          )
        ],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        itemCount: 12,
        itemBuilder: (context, index) {
          return GlassContainer(
            padding: EdgeInsets.zero,
            child: Center(
              child: Icon(Icons.image, color: Colors.white.withOpacity(0.3), size: 40),
            ),
          );
        },
      ),
    );
  }
}
