import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:servolend_ai/pages/apply_for_loan.dart';
import 'package:servolend_ai/pages/google_sign_in.dart';
import 'package:servolend_ai/pages/home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
      
      // home: GoogleSignInScreen(),
      routes: {
        '/': (context) => GoogleSignInScreen(),
        '/home': (context) => HomePage(),
        '/apply_for_loan': (context) => ApplyForLoan(),
      },
    );
  }
}

class ApplyForLoanPage {
}