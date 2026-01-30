import 'package:flutter_riverpod/flutter_riverpod.dart';

class GhostModeState {
  final bool isEnabled;
  final bool freezeLastSeen;
  final bool hideTyping;

  GhostModeState({
    this.isEnabled = false,
    this.freezeLastSeen = false,
    this.hideTyping = false,
  });

  GhostModeState copyWith({
    bool? isEnabled,
    bool? freezeLastSeen,
    bool? hideTyping,
  }) {
    return GhostModeState(
      isEnabled: isEnabled ?? this.isEnabled,
      freezeLastSeen: freezeLastSeen ?? this.freezeLastSeen,
      hideTyping: hideTyping ?? this.hideTyping,
    );
  }
}

class GhostModeNotifier extends StateNotifier<GhostModeState> {
  GhostModeNotifier() : super(GhostModeState());

  void toggleGhostMode() {
    state = state.copyWith(isEnabled: !state.isEnabled);
  }

  void toggleFreezeLastSeen() {
    state = state.copyWith(freezeLastSeen: !state.freezeLastSeen);
  }

  void toggleHideTyping() {
    state = state.copyWith(hideTyping: !state.hideTyping);
  }
}

final ghostModeProvider = StateNotifierProvider<GhostModeNotifier, GhostModeState>((ref) {
  return GhostModeNotifier();
});
