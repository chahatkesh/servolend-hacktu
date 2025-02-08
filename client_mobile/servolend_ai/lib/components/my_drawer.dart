import 'package:flutter/material.dart';
import 'package:servolend_ai/helpers/fetch.dart';
import 'package:servolend_ai/pages/google_sign_in.dart';

class MyDrawer extends StatelessWidget {
  Future<void> logoutNow() async {
    await fetch(
      "https://servolend-server.onrender.com/api/auth/logout",
      {},
      "POST",
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: <Widget>[
          DrawerHeader(
            child: Text('Menu'),
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
          ),
          ListTile(
            leading: Icon(Icons.home),
            title: Text('Home'),
            onTap: () {
              Navigator.pushNamed(context, '/home');
            },
          ),
          ListTile(
            leading: Icon(Icons.attach_money),
            title: Text('Apply for Loan'),
            onTap: () {
              Navigator.pushNamed(context, '/apply_for_loan');
            },
          ),
          Spacer(),
          ListTile(
            leading: Icon(Icons.logout),
            title: Text('Logout'),
            onTap: () {
              logoutNow();
                Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => GoogleSignInScreen()),
                (Route<dynamic> route) => false,
                );
              // Implement your logout functionality here
            },
          ),
        ],
      ),
    );
  }
}
