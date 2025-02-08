// import 'package:cloud_firestore/cloud_firestore.dart';
import 'dart:convert';

// import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;

class GoogleSignInScreen extends StatefulWidget {
  const GoogleSignInScreen({super.key});

  @override
  State<GoogleSignInScreen> createState() => _GoogleSignInScreenState();
}

class _GoogleSignInScreenState extends State<GoogleSignInScreen> {
  // Future<UserCredential?> signInWithGoogle(BuildContext context) async {
  //   print("SIGNING IN");
  //   try {
  //     final GoogleSignInAccount? googleUser = await GoogleSignIn(
  //     clientId: 'YOUR_CLIENT_ID_HERE',
  //     serverClientId: 'YOUR_SERVER_CLIENT_ID_HERE',
  //     ).signIn();
  //     if (googleUser == null) {
  //     // User canceled the sign-in
  //     return null;
  //     }

  //     final GoogleSignInAuthentication googleAuth =
  //         await googleUser.authentication;
  //     final credential = GoogleAuthProvider.credential(
  //       accessToken: googleAuth.accessToken,
  //       idToken: googleAuth.idToken,
  //     );

  //     // Sign in to Firebase with the Google credential
  //     return await FirebaseAuth.instance.signInWithCredential(credential);
  //   } catch (e) {
  //     debugPrint("Google Sign-In error: $e");
  //     return null; // Return null in case of error
  //   }
  // }

Future<void> signInWithGoogle(BuildContext context) async {
  debugPrint("SIGNING IN");

  final GoogleSignIn googleSignIn = GoogleSignIn(
    clientId:
        "",
  );

  final GoogleSignInAccount? googleUser = await googleSignIn.signIn();

  if (googleUser != null) {
    final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

    final Map<String, String> credentials = {
      "idToken": googleAuth.idToken ?? "",
      "accessToken": googleAuth.accessToken ?? "",
    };

    debugPrint("CREDENTIALS: ${jsonEncode(credentials)}");

    final response = await http.post(
      Uri.parse("https://"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(credentials),
    );

    if (response.statusCode == 200) {
      debugPrint("LOGIN SUCCESS: ${response.body}");
    } else {
      debugPrint("LOGIN FAILED: ${response.statusCode} - ${response.body}");
    }
  }

  debugPrint("FINISHING LOGIN");
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // LogoComponent(),
            const SizedBox(height: 48),
            const Text(
              'Overcoming challenges together, with AI',
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w600,
              ),
            ),
            // Image.asset(
            //   'assets/login_asset.png',
            //   height: 320,
            // ),
            const SizedBox(height: 48),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  elevation: 1,
                ),
                onPressed: () async {
                  try {
                    // UserCredential? userCredential =
                    //     await signInWithGoogle(context);
                    await signInWithGoogle(context);

                    // if (userCredential == null || userCredential.user == null) {
                    //   if (context.mounted) {
                    //     ScaffoldMessenger.of(context).showSnackBar(
                    //       const SnackBar(
                    //         content: Text("Sign-in failed. Please try again."),
                    //       ),
                    //     );
                    //   }
                    //   return;
                    // }

                    // if (context.mounted) {
                    //   Navigator.push(
                    //     context,
                    //     MaterialPageRoute(
                    //       builder: (context) => ManageLogin(
                    //         email: userCredential.user!.email,
                    //       ),
                    //     ),
                    //   );
                    // }
                  } catch (e) {
                    debugPrint("Error during sign-in: $e");
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("An error occurred. Please try again."),
                        ),
                      );
                    }
                  }
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Image.asset(
                    //   'assets/google_icon.png',
                    //   height: 24,
                    // ),
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
    );
  }
}

class ManageLogin extends StatefulWidget {
  final String? email;

  const ManageLogin({super.key, required this.email});

  @override
  State<ManageLogin> createState() => _ManageLoginState();
}

class _ManageLoginState extends State<ManageLogin> {
  bool completed = false;
  bool onboarding = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: completed
            ? const Text("Redirecting...")
            : const CircularProgressIndicator(),
      ),
    );
  }
}
