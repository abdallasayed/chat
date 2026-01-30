import 'package:aura_mobile/core/widgets/glass_container.dart';
import 'package:aura_mobile/features/privacy/presentation/ghost_mode_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PrivacySettingsScreen extends ConsumerWidget {
  const PrivacySettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ghostState = ref.watch(ghostModeProvider);
    final notifier = ref.read(ghostModeProvider.notifier);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Privacy & Security",
              style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              "Manage your visibility and data.",
              style: TextStyle(color: Colors.white54, fontSize: 16),
            ),
            const SizedBox(height: 30),

            // Ghost Mode Master Switch
            GlassContainer(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.privacy_tip, color: Colors.blueAccent, size: 28),
                          SizedBox(width: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Ghost Mode",
                                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                "Become invisible.",
                                style: TextStyle(color: Colors.white54, fontSize: 14),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Switch(
                        value: ghostState.isEnabled,
                        onChanged: (val) => notifier.toggleGhostMode(),
                        activeColor: Colors.blueAccent,
                      ),
                    ],
                  ),
                  if (ghostState.isEnabled) ...[
                    const Divider(color: Colors.white10, height: 30),
                    _buildSwitchTile(
                      "Freeze Last Seen",
                      "Appear as if you were last online hours ago.",
                      ghostState.freezeLastSeen,
                      (val) => notifier.toggleFreezeLastSeen(),
                    ),
                    const SizedBox(height: 16),
                    _buildSwitchTile(
                      "Hide Typing Indicator",
                      "Read and type without them knowing.",
                      ghostState.hideTyping,
                      (val) => notifier.toggleHideTyping(),
                    ),
                  ]
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, Function(bool) onChanged) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: Colors.cyanAccent,
        ),
      ],
    );
  }
}
