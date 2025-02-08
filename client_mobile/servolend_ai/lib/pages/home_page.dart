import 'package:flutter/material.dart';
import 'package:servolend_ai/components/my_drawer.dart';
import 'package:servolend_ai/components/my_textfield.dart';
import 'package:servolend_ai/helpers/fetch.dart';

import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Map<String, dynamic>? profile;
  Map<String, dynamic>? fetchedProfile = {};
  bool isEditing = false;
  final TextEditingController fullNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
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
    retrieveData();
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

  Future<void> retrieveData() async {
    final Map<String, dynamic> response = await fetch(
        "https://servolend-server.onrender.com/api/user/profile", {}, "GET");
    if (response.isNotEmpty) {
      print(jsonEncode(response));
      setState(() {
        fetchedProfile = response;
      });
      fullNameController.text = response['name']?.toString() ?? "";
      emailController.text = response['email']?.toString() ?? "";
      creditScoreController.text = response['creditScore']?.toString() ?? "";
      phoneController.text = response['phone'] ?? "";
      addressController.text = response['address'] ?? "";
      occupationController.text = response['occupation'] ?? "";
      employerController.text = response['employerName'] ?? "";
      incomeController.text = response['monthlyIncome'] ?? "";
    }
  }

  Future<void> saveNewData() async {
    await fetch(
      "https://servolend-server.onrender.com/api/user/profile",
      {
        "name": fullNameController.text,
        "phone": phoneController.text,
        "address": addressController.text,
        "occupation": occupationController.text,
        "employerName": employerController.text,
        "monthlyIncome": incomeController.text,
        "creditScore": creditScoreController.text,
        "preferredLanguage": "English",
        "communicationPreferences": [],
      },
      "PUT",
    );
    await retrieveData();
  }

  @override
  Widget build(BuildContext context) {
    bool incomplete = fetchedProfile!['profileStatus'] != "complete";
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
          physics: BouncingScrollPhysics(),
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
              if (profile != null && profile!.isNotEmpty)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: incomplete ? Color(0xFFfdf9c8) : Color(0xFFe2fbe8),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    (incomplete ? "Profile Incomplete" : "Profile Complete"),
                    style: TextStyle(
                      color: incomplete ? Color(0xFFc68a08) : Color(0xFF3ea34b),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
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
                          IconButton(
                            icon: Icon(isEditing ? Icons.check : Icons.edit),
                            onPressed: () {
                              setState(() {
                                if (isEditing) saveNewData();
                                isEditing = !isEditing;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ListView(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        children: [
                          MyTextfield(
                            hintText: "Full Name",
                            enabled: false,
                            controller: fullNameController,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Email Address",
                            enabled: false,
                            controller: emailController,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Phone Number",
                            controller: phoneController,
                            enabled: isEditing,
                            inputType: TextInputType.phone,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Address",
                            controller: addressController,
                            enabled: isEditing,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Occupation",
                            controller: occupationController,
                            enabled: isEditing,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Employer Name",
                            controller: employerController,
                            enabled: isEditing,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Monthly Income",
                            inputType: TextInputType.number,
                            enabled: isEditing,
                            controller: incomeController,
                            onChanged: (v) {},
                          ),
                          MyTextfield(
                            hintText: "Credit Score",
                            inputType: TextInputType.number,
                            enabled: isEditing,
                            controller: creditScoreController,
                            onChanged: (v) {},
                          ),
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
}
