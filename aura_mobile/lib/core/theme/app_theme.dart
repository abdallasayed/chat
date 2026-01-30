import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum AuraMood {
  serene, // Blue/Cyan - Day
  mystic, // Purple/Violet - Night
  energetic, // Orange/Red
  focus, // Green/Teal
}

class AuraTheme {
  static final AuraTheme _instance = AuraTheme._internal();
  factory AuraTheme() => _instance;
  AuraTheme._internal();

  // Glassmorphism Constants
  static const double glassBlur = 20.0;
  static const double glassOpacity = 0.2;
  static const double glassBorderOpacity = 0.1;

  // Gradients
  static LinearGradient getBackgroundGradient(AuraMood mood) {
    switch (mood) {
      case AuraMood.serene:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF89f7fe), Color(0xFF66a6ff)],
        );
      case AuraMood.mystic:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF2E3192), Color(0xFF1BFFFF)],
        );
      case AuraMood.energetic:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFd299c2), Color(0xFFfef9d7)],
        );
      case AuraMood.focus:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF00c6ff), Color(0xFF0072ff)],
        );
    }
  }

  static ThemeData getThemeData(AuraMood mood) {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _getSeedColor(mood),
        brightness: mood == AuraMood.mystic ? Brightness.dark : Brightness.light,
      ),
      textTheme: GoogleFonts.outfitTextTheme(),
      scaffoldBackgroundColor: Colors.transparent, // Important for glassmorphism
    );
  }

  static Color _getSeedColor(AuraMood mood) {
    switch (mood) {
      case AuraMood.serene: return Colors.lightBlue;
      case AuraMood.mystic: return Colors.deepPurple;
      case AuraMood.energetic: return Colors.orange;
      case AuraMood.focus: return Colors.teal;
    }
  }
}
