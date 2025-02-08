// import 'dart:convert';

// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
// import 'package:google_sign_in/google_sign_in.dart';
// import 'package:servolend_ai/auth/auth.dart';
// import 'package:servolend_ai/firebase_options.dart';
// import 'package:servolend_ai/helpers/fetch.dart';
import 'package:servolend_ai/pages/apply_for_loan.dart';
// import 'package:servolend_ai/pages/google_sign_in.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp(
  //   options: DefaultFirebaseOptions.currentPlatform,
  // );
  // await FirebaseAuth.instance.signOut();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Servolend AI',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Color.fromARGB(255, 44, 94, 242)),
        useMaterial3: true,
      ),
      home: ApplyForLoan(),
    );
  }
}