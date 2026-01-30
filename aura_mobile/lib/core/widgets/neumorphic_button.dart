import 'package:flutter/material.dart';

class NeumorphicButton extends StatefulWidget {
  final VoidCallback onPressed;
  final Widget child;
  final Color? color;

  const NeumorphicButton({
    super.key, 
    required this.onPressed, 
    required this.child,
    this.color,
  });

  @override
  State<NeumorphicButton> createState() => _NeumorphicButtonState();
}

class _NeumorphicButtonState extends State<NeumorphicButton> {
  bool _isPressed = false;

  void _onPointerDown(PointerDownEvent event) {
    setState(() => _isPressed = true);
  }

  void _onPointerUp(PointerUpEvent event) {
    setState(() => _isPressed = false);
    widget.onPressed();
  }

  @override
  Widget build(BuildContext context) {
    final baseColor = widget.color ?? Colors.white.withOpacity(0.15); // Glassy neumorphism
    
    return Listener(
      onPointerDown: _onPointerDown,
      onPointerUp: _onPointerUp,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: baseColor,
          borderRadius: BorderRadius.circular(16),
          // In glassmorphism/dark mode, neumorphism relies more on light/shadow play
          boxShadow: _isPressed
              ? [] // Flat when pressed
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    offset: const Offset(4, 4),
                    blurRadius: 10,
                  ),
                  BoxShadow(
                    color: Colors.white.withOpacity(0.1),
                    offset: const Offset(-4, -4),
                    blurRadius: 10,
                  ),
                ],
        ),
        transform: _isPressed 
            ? Matrix4.translationValues(2, 2, 0) 
            : Matrix4.identity(),
        child: widget.child,
      ),
    );
  }
}
