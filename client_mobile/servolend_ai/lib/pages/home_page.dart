import 'package:flutter/material.dart';
import 'package:servolend_ai/components/my_drawer.dart';

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Map<String, dynamic>? profile;
  bool isEditing = false;
  final TextEditingController fullNameController =
      TextEditingController(text: "Jagjit Singh");
  final TextEditingController emailController =
      TextEditingController(text: "jagjit0306@gmail.com");
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  final TextEditingController occupationController = TextEditingController();
  final TextEditingController employerController = TextEditingController();
  final TextEditingController incomeController = TextEditingController();
  final TextEditingController creditScoreController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadProfileImage();
  }

  Future<void> _loadProfileImage() async {
    final prefs = await SharedPreferences.getInstance();
    final accountJson = prefs.getString('account');
    if (accountJson != null) {
      print("DATA RETRIEVED");
      print(accountJson);
      final account = jsonDecode(accountJson) as Map<String, dynamic>;
      setState(() {
        profile = account["user"] as Map<String, dynamic>;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Servolend.ai",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF2c5cf2),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              if (profile != null)
                CircleAvatar(
                  backgroundImage: NetworkImage(profile!['picture']),
                  radius: 70,
                ),
              const SizedBox(height: 20),
              if (profile != null)
                Text(
                  "Welcome ${profile!['name'] ?? ""}!",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.blueAccent,
                  ),
                ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withAlpha((0.2 * 255).toInt()),
                        spreadRadius: 2,
                        blurRadius: 5,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                        "Personal Information",
                        style: TextStyle(
                          fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ],
                      ),
                      const SizedBox(height: 16),
                      GridView.count(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 8, // Decreased vertical spacing
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        children: [
                        buildTextField("Full Name", fullNameController),
                        buildTextField("Email Address", emailController),
                        buildTextField("Phone Number", phoneController),
                        buildTextField("Address", addressController),
                        buildTextField("Occupation", occupationController),
                        buildTextField("Employer Name", employerController),
                        buildTextField("Monthly Income", incomeController),
                        buildTextField("Credit Score", creditScoreController),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      drawer: MyDrawer(),
    );
  }

  Widget buildTextField(String label, TextEditingController controller) {
    return Flexible(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        TextField(
          controller: controller,
          enabled: isEditing,
          decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          ),
        ),
        ],
      ),
    );
  }
}
