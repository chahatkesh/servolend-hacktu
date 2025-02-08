import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:servolend_ai/helpers/fetch.dart';
import 'package:shared_preferences/shared_preferences.dart';

class GoogleSignInScreen extends StatefulWidget {
  const GoogleSignInScreen({super.key});

  @override
  State<GoogleSignInScreen> createState() => _GoogleSignInScreenState();
}

class _GoogleSignInScreenState extends State<GoogleSignInScreen>
    with SingleTickerProviderStateMixin {
  late SharedPreferences _prefs;
  late AnimationController _controller;
  late Animation<Color?> _colorAnimation;

  @override
  void initState() {
    super.initState();
    _initializeSharedPreferences();
    getLoginState();

    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _colorAnimation = ColorTween(
      begin: Colors.blue[300],
      end: Colors.blue[900],
    ).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _initializeSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<void> getLoginState() async {
    print("PREPARING AUTO LOGIN");
    final response = await fetch(
      "https://servolend-server.onrender.com/api/auth/status",
      {},
      "GET",
    );
    if (response != null) {
      print("RESPONSE HAS COME");
      print(jsonEncode(response));
      saveInfo(response);
      // ignore: use_build_context_synchronously
      Navigator.pushNamed(context, '/home');
    }
  }

  Future<void> sendPostRequest(String v) async {
    final url = Uri.parse(
        "https://servolend-server.onrender.com/api/auth/google"); // API endpoint
    final headers = {"Content-Type": "application/json"}; // Set headers
    final body = jsonEncode({"credential": v}); // JSON-encoded body

    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        print("Success: ${response.body}");
      } else {
        print("Failed with status code: ${response.statusCode}");
      }
    } catch (e) {
      print("Error: $e");
    }
  }

  void saveInfo(Map<String, dynamic> d) {
    _prefs.setString("account", jsonEncode(d));
  }

  Future<void> signInWithGoogle(BuildContext context) async {
    debugPrint("SIGNING IN");

    final GoogleSignIn googleSignIn = GoogleSignIn(
      serverClientId:
          "1050145168673-pglcbe7c6but4tb4r2u2bdkflmp8km9i.apps.googleusercontent.com",
    );
    try {
      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();

      if (googleUser != null) {
        print("RESPONSE RECEIVED XYZZ");
        final GoogleSignInAuthentication googleAuth =
            await googleUser.authentication;

        final Map<String, String> credentials = {
          "idToken": googleAuth.idToken ?? "",
          "accessToken": googleAuth.accessToken ?? "",
        };

        debugPrint("CREDENTIALS: ${jsonEncode(credentials['idToken'])}");
        print("SENDING FETCH");
        final response = await fetch(
          "https://servolend-server.onrender.com/api/auth/google",
          {"credential": credentials['idToken']},
          "POST",
        );
        if (response != null) {
          print(jsonEncode(response));
          saveInfo(response);
          Navigator.pushNamed(context, "/home");
        }
      } else {
        print("ERROR XYZZ");
      }
    } catch (e) {
      print(e);
    }

    debugPrint("FINISHING LOGIN");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  _colorAnimation.value!,
                  Colors.blue[100]!,
                ],
              ),
            ),
            child: child,
          );
        },
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 48),
              const Text(
                'ServoLend.ai',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'For all your AI loan lending needs',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 48),
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 1,
                  ),
                  onPressed: () async {
                    try {
                      signInWithGoogle(context);
                    } catch (e) {
                      debugPrint("Error during sign-in: $e");
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content:
                                Text("An error occurred. Please try again."),
                          ),
                        );
                      }
                    }
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        'assets/google_icon.png',
                        height: 24,
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Continue with Google',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
