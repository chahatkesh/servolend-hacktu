import 'package:flutter/material.dart';

class MyTextfield extends StatelessWidget {
  final String hintText;
  final Icon? prefixIcon;
  final Icon? suffixIcon; // New field for optional icon
  final bool obscureText;
  final TextEditingController controller;
  final TextInputType inputType;
  final Function(String) onChanged;

  const MyTextfield({
    super.key,
    required this.hintText,
    this.prefixIcon,
    this.suffixIcon, // Initialize the new field
    this.obscureText = false,
    required this.controller,
    required this.inputType,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: inputType,
      onChanged: onChanged,
      style: TextStyle(
        color: Colors.black,
        fontSize: 16,
      ),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          color: Colors.grey[700],
          fontSize: 14,
        ),
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon, // Add the new field to the decoration
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(vertical: 16, horizontal: 20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Theme.of(context).primaryColor,
            width: 2,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.grey[400]!,
            width: 1,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.red,
            width: 1,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.red,
            width: 2,
          ),
        ),
      ),
    );
  }
}
