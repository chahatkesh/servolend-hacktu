import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:cookie_jar/cookie_jar.dart';

String _encodeQueryParameters(Map<String, dynamic> params) {
  return params.entries.map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value.toString())}').join('&');
}

Future<dynamic> fetch(String url, Map<String, dynamic> jsonData, {String method = 'GET'}) async {
  http.Response response;
  final cookieJar = CookieJar();
  final client = http.Client();

  if (method.toUpperCase() == 'POST') {
    response = await client.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(jsonData),
    );
  } else {
    final queryString = _encodeQueryParameters(jsonData);
    final uri = Uri.parse('$url?$queryString');
    response = await client.get(
      uri,
      headers: {'Content-Type': 'application/json'},
    );
  }

  // Save cookies
  final cookies = response.headers['set-cookie'];
  if (cookies != null) {
    cookieJar.saveFromResponse(Uri.parse(url), cookies.split(';').map((cookie) => Cookie.fromSetCookieValue(cookie)).toList());
  }

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}