import 'package:flutter/material.dart';
import 'package:servolend_ai/components/my_drawer.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Home page"),
        centerTitle: true,
      ),
      body: const Text("app"),
      drawer: MyDrawer(),
    );
  }
}