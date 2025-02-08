import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:cookie_jar/cookie_jar.dart';
import 'dart:io';

String _encodeQueryParameters(Map<String, dynamic> params) {
  return params.entries.map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value.toString())}').join('&');
}


Future<dynamic> fetch(String url, Map<String, dynamic> jsonData, String method) async {
  final cookieJar = CookieJar();
  final uri = Uri.parse(url);
  // final cookies = await cookieJar.loadForRequest(uri); // Load cookies for the request
  final client = http.Client();

  http.Response response;
  if (method.toUpperCase() == 'POST') {
    response = await client.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        // 'Cookie': cookies.map((cookie) => '${cookie.name}=${cookie.value}').join('; '), // Include cookies in the request
      },
      body: jsonEncode(jsonData),
    );
  } else {
    final queryString = _encodeQueryParameters(jsonData);
    final uriWithQuery = Uri.parse('$url?$queryString');
    response = await client.get(
      uriWithQuery,
      headers: {
        'Content-Type': 'application/json',
        // 'Cookie': cookies.map((cookie) => '${cookie.name}=${cookie.value}').join('; '), // Include cookies in the request
      },
    );
  }

  // Save cookies
  // final setCookies = response.headers['set-cookie'];
  // if (setCookies != null) {
  //   cookieJar.saveFromResponse(uri, setCookies.split(',').map((cookie) => Cookie.fromSetCookieValue(cookie)).toList());
  // }

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}