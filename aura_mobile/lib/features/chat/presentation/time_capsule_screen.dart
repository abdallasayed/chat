import 'package:aura_mobile/core/widgets/glass_container.dart';
import 'package:aura_mobile/core/widgets/neumorphic_button.dart';
import 'package:flutter/material.dart';

class TimeCapsuleScreen extends StatefulWidget {
  const TimeCapsuleScreen({super.key});

  @override
  State<TimeCapsuleScreen> createState() => _TimeCapsuleScreenState();
}

class _TimeCapsuleScreenState extends State<TimeCapsuleScreen> {
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 365));
  final TextEditingController _messageController = TextEditingController();

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime(2050),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: Colors.blueAccent,
              onPrimary: Colors.white,
              surface: Color(0xFF1a1a2e),
              onSurface: Colors.white,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text("Time Capsule", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Send to the Future",
              style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              "Write a message that will only be delivered on a specific date.",
              style: TextStyle(color: Colors.white54, fontSize: 14),
            ),
            const SizedBox(height: 30),

            GlassContainer(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Delivery Date", style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: _pickDate,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')}",
                            style: const TextStyle(color: Colors.white, fontSize: 16),
                          ),
                          const Icon(Icons.calendar_today, color: Colors.white70, size: 20),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text("Message", style: TextStyle(color: Colors.blueAccent, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Container(
                    height: 150,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: Colors.white24),
                    ),
                    child: TextField(
                      controller: _messageController,
                      maxLines: null,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: "Dear future self...",
                        hintStyle: TextStyle(color: Colors.white30),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            Center(
              child: NeumorphicButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Capsule Sealed. Delivering in future."),
                      backgroundColor: Colors.blueAccent,
                    ),
                  );
                  Navigator.pop(context);
                },
                child: const Text(
                  "SEAL CAPSULE",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 2),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
