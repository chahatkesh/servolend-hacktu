import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

String _encodeQueryParameters(Map<String, dynamic> params) {
  return params.entries
      .map((e) =>
          '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value.toString())}')
      .join('&');
}

Future<dynamic> fetch(
    String url, Map<String, dynamic> jsonData, String method) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();

  final uri = Uri.parse(url);
  final client = http.Client();
  final cookiesString = prefs.getString("cookies");
  final Map<String, dynamic> cookies = cookiesString != null ? jsonDecode(cookiesString) : {};

  http.Response response;
  Map<String, String> headers = {
    'Content-Type': 'application/json',
  };

  if (cookies.isNotEmpty) {
    headers['Cookie'] =
        cookies.entries.map((e) => '${e.key}=${e.value}').join('; ');
  }

  if (method.toUpperCase() == 'POST') {
    response = await client.post(
      uri,
      headers: headers,
      body: jsonEncode(jsonData),
    );
  } else if (method.toUpperCase() == 'PUT') {
    response = await client.put(
      uri,
      headers: headers,
      body: jsonEncode(jsonData),
    );
  } else {
    final queryString = _encodeQueryParameters(jsonData);
    final uriWithQuery = Uri.parse('$url?$queryString');
    response = await client.get(
      uriWithQuery,
      headers: headers,
    );
  }
  print(response.statusCode);
  if (response.statusCode == 200) {
    // Save cookies from response
    final setCookie = response.headers['set-cookie'];
    if (setCookie != null) {
      final cookieList = setCookie.split(',');
      final cookieMap = <String, String>{};
      for (var cookie in cookieList) {
        final parts = cookie.split(';')[0].split('=');
        if (parts.length == 2) {
          cookieMap[parts[0].trim()] = parts[1].trim();
        }
      }
      prefs.setString("cookies", jsonEncode(cookieMap));
      // You can now use cookieMap as needed
      print('Received cookies: $cookieMap');
    }
    return jsonDecode(response.body);
  } else {
    print("!!!!!!!!!!!!!!!!!!!!");
    print("RESPONSE FAILED");
    print("!!!!!!!!!!!!!!!!!!!!");
    return null;
  }
}
