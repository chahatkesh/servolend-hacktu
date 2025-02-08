import 'package:flutter/material.dart';
import 'package:servolend_ai/components/my_textfield.dart';

class ApplyForLoan extends StatefulWidget {
  const ApplyForLoan({super.key});

  @override
  State<ApplyForLoan> createState() => _ApplyForLoanState();
}

class _ApplyForLoanState extends State<ApplyForLoan> {
  int pageNo = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Apply for Loan",
          style: TextStyle(
        color: Colors.white,
          ),
        ),
        centerTitle: true,
        backgroundColor: Color(0xFF2c5cf2),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (pageNo == 0)
              Page1(
                next: () => setState(() {
                  pageNo += 1;
                }),
              ),
            if (pageNo == 1)
              Page2(
                next: () => setState(() {
                  pageNo += 1;
                }),
                back: () => setState(() {
                  pageNo -= 1;
                }),
              ),
            if (pageNo == 2)
              Page3(
                next: () => setState(() {
                  pageNo += 1;
                }),
                back: () => setState(() {
                  pageNo -= 1;
                }),
              ),
            if (pageNo == 3)
              Page4(
                back: () => setState(() {
                  pageNo -= 1;
                }),
              ),
          ],
        ),
      ),
    );
  }
}

class Page1 extends StatelessWidget {
  final VoidCallback next;
  Page1({super.key, required this.next});
  final TextEditingController loanAmountController = TextEditingController();
  final TextEditingController interestRateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Loan Information",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Loan Amount",
          obscureText: false,
          controller: loanAmountController,
          inputType: TextInputType.numberWithOptions(
            decimal: true,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Interest Rate",
          obscureText: false,
          controller: interestRateController,
          inputType: TextInputType.numberWithOptions(
            decimal: true,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            ElevatedButton(
              onPressed: next,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Next"),
            ),
          ],
        )
      ],
    );
  }
}

class Page2 extends StatelessWidget {
  final VoidCallback next;
  final VoidCallback back;
  Page2({super.key, required this.next, required this.back});
  final TextEditingController ageController = TextEditingController();
  final TextEditingController annualIncomeController = TextEditingController();
  final TextEditingController employmentLengthController =
      TextEditingController();
  final TextEditingController creditHistoryLengthController =
      TextEditingController();
  final List<String> homeOwnershipOptions = [
    "Rent",
    "Own",
    "Mortgage",
    "Other"
  ];
  final List<String> loanIntentOptions = [
    "Personal",
    "Education",
    "Medical",
    "Venture",
    "Home Improvement",
    "Debt Consolation"
  ];
  String selectedHomeOwnership = "Rent";
  String selectedLoanIntent = "Personal";

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Personal Details",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Age",
          obscureText: false,
          controller: ageController,
          inputType: TextInputType.numberWithOptions(
            decimal: false,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Annual Income",
          obscureText: false,
          controller: annualIncomeController,
          inputType: TextInputType.numberWithOptions(
            decimal: true,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Employment Length (in years)",
          obscureText: false,
          controller: employmentLengthController,
          inputType: TextInputType.numberWithOptions(
            decimal: true,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Credit History Length (in years)",
          obscureText: false,
          controller: creditHistoryLengthController,
          inputType: TextInputType.numberWithOptions(
            decimal: true,
            signed: false,
          ),
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: selectedHomeOwnership,
          items: homeOwnershipOptions.map((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
          onChanged: (newValue) {
            selectedHomeOwnership = newValue!;
          },
          decoration: const InputDecoration(
            labelText: "Home Ownership",
          ),
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          value: selectedLoanIntent,
          items: loanIntentOptions.map((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
          onChanged: (newValue) {
            selectedLoanIntent = newValue!;
          },
          decoration: const InputDecoration(
            labelText: "Loan Intent",
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ElevatedButton(
              onPressed: back,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Back"),
            ),
            ElevatedButton(
              onPressed: next,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Next"),
            ),
          ],
        )
      ],
    );
  }
}

class Page3 extends StatelessWidget {
  final VoidCallback next;
  final VoidCallback back;
  Page3({super.key, required this.next, required this.back});
  final TextEditingController loanAmountController = TextEditingController();
  final TextEditingController interestRateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Page 3",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Loan Amount",
          obscureText: false,
          controller: loanAmountController,
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Interest Rate",
          obscureText: false,
          controller: interestRateController,
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            ElevatedButton(
              onPressed: back,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Back"),
            ),
            ElevatedButton(
              onPressed: next,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Next"),
            ),
          ],
        )
      ],
    );
  }
}

class Page4 extends StatelessWidget {
  final VoidCallback back;
  Page4({super.key, required this.back});
  final TextEditingController loanAmountController = TextEditingController();
  final TextEditingController interestRateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Page 4",
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Loan Amount",
          obscureText: false,
          controller: loanAmountController,
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        MyTextfield(
          hintText: "Interest Rate",
          obscureText: false,
          controller: interestRateController,
          onChanged: (v) {},
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            ElevatedButton(
              onPressed: back,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: const Text("Back"),
            ),
          ],
        )
      ],
    );
  }
}
