import 'package:flutter/material.dart';
import 'package:pie_chart/pie_chart.dart';
import 'package:servolend_ai/components/my_textfield.dart';
import 'package:servolend_ai/helpers/fetch.dart';

class ApplyForLoan extends StatefulWidget {
  const ApplyForLoan({super.key});

  @override
  State<ApplyForLoan> createState() => _ApplyForLoanState();
}

class _ApplyForLoanState extends State<ApplyForLoan> {
  final PageController _pageController = PageController();
  final Map<String, dynamic> loanInfo = {};
  final Map<String, dynamic> personalDetails = {};

  void nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeIn,
    );
  }

  void previousPage() {
    _pageController.previousPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeIn,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Apply for Loan",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF2c5cf2),
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          Page1(
            next: (loanAmount, interestRate) {
              setState(() {
                loanInfo['loanAmount'] = loanAmount;
                loanInfo['interestRate'] = interestRate;
              });
              nextPage();
            },
          ),
          Page2(
            next: (age, annualIncome, employmentLength, creditHistoryLength,
                homeOwnership, loanIntent) {
              setState(() {
                personalDetails['age'] = age;
                personalDetails['annualIncome'] = annualIncome;
                personalDetails['employmentLength'] = employmentLength;
                personalDetails['creditHistoryLength'] = creditHistoryLength;
                personalDetails['homeOwnership'] = homeOwnership;
                personalDetails['loanIntent'] = loanIntent;
              });
              nextPage();
            },
            back: previousPage,
          ),
          Page3(
            loanInfo: loanInfo,
            personalDetails: personalDetails,
            back: previousPage,
          ),
        ],
      ),
    );
  }
}

class Page1 extends StatelessWidget {
  final Function(int, double) next;
  Page1({super.key, required this.next});
  final TextEditingController loanAmountController = TextEditingController();
  final TextEditingController interestRateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.max,
        spacing: 10,
        children: [
          const Text("Check Loan Eligibility",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          MyTextfield(
            hintText: "Loan Amount",
            controller: loanAmountController,
            inputType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) {},
            prefixIcon: Icon(Icons.currency_rupee),
          ),
          const SizedBox(height: 16),
          MyTextfield(
            hintText: "Interest Rate",
            controller: interestRateController,
            inputType: const TextInputType.numberWithOptions(decimal: true),
            onChanged: (v) {},
            prefixIcon: Icon(Icons.percent),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ElevatedButton(
                onPressed: () {
                  if (loanAmountController.text.isNotEmpty &&
                      interestRateController.text.isNotEmpty) {
                    next(
                      int.parse(loanAmountController.text),
                      double.parse(interestRateController.text),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Please fill all fields")),
                    );
                  }
                },
                child: const Text("Next"),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class Page2 extends StatelessWidget {
  final Function(int, int, double, int, String, String) next;
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
    return SingleChildScrollView(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Personal Details",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            MyTextfield(
              hintText: "Age",
              controller: ageController,
              inputType: const TextInputType.numberWithOptions(decimal: false),
              onChanged: (v) {},
              prefixIcon: Icon(Icons.person),
            ),
            const SizedBox(height: 16),
            MyTextfield(
              hintText: "Annual Income",
              controller: annualIncomeController,
              inputType: const TextInputType.numberWithOptions(decimal: true),
              onChanged: (v) {},
              prefixIcon: Icon(Icons.currency_rupee),
            ),
            const SizedBox(height: 16),
            MyTextfield(
              hintText: "Employment Length (in years)",
              controller: employmentLengthController,
              inputType: const TextInputType.numberWithOptions(decimal: true),
              onChanged: (v) {},
              prefixIcon: Icon(Icons.timelapse_rounded),
            ),
            const SizedBox(height: 16),
            MyTextfield(
              hintText: "Credit History Length (in years)",
              controller: creditHistoryLengthController,
              inputType: const TextInputType.numberWithOptions(decimal: true),
              onChanged: (v) {},
              prefixIcon: Icon(Icons.credit_card),
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
                border: OutlineInputBorder(),
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
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: back,
                  child: const Text("Back"),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (ageController.text.isNotEmpty &&
                        annualIncomeController.text.isNotEmpty &&
                        employmentLengthController.text.isNotEmpty &&
                        creditHistoryLengthController.text.isNotEmpty) {
                      next(
                        int.parse(ageController.text),
                        int.parse(annualIncomeController.text),
                        double.parse(employmentLengthController.text),
                        int.parse(creditHistoryLengthController.text),
                        selectedHomeOwnership,
                        selectedLoanIntent,
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Please fill all fields")),
                      );
                    }
                  },
                  child: const Text("Next"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Page3 extends StatefulWidget {
  final VoidCallback back;
  final Map<String, dynamic> loanInfo;
  final Map<String, dynamic> personalDetails;

  Page3(
      {super.key,
      required this.back,
      required this.loanInfo,
      required this.personalDetails});

  @override
  State<Page3> createState() => _Page3State();
}

class _Page3State extends State<Page3> {
  Map<String, dynamic> finalObject = {};
  Map<String, dynamic> result = {};

  @override
  void initState() {
    super.initState();
    finalObject = {
      'age': widget.personalDetails['age'],
      'income': widget.personalDetails['annualIncome'],
      'ownership': (widget.personalDetails['homeOwnership'] as String)
          .replaceAll(' ', '')
          .toUpperCase(),
      'employment_len': widget.personalDetails['employmentLength'],
      'loan_intent': (widget.personalDetails['loanIntent'] as String)
          .replaceAll(' ', '')
          .toUpperCase(),
      'loan_amnt': widget.loanInfo['loanAmount'],
      'loan_int_rate': widget.loanInfo['interestRate'],
      'loan_percent_income': widget.loanInfo['loanAmount'] /
          widget.personalDetails['annualIncome'],
      'cred_hist_len': widget.personalDetails['creditHistoryLength'],
    };
    getData();
  }

  Future<void> getData() async {
    final Map<String, dynamic> res = await fetch(
      'https://deploy-api-17es.onrender.com/predict',
      finalObject,
      method: "post",
    );
    if (res.isNotEmpty) {
      setState(() {
        result = res;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      physics: BouncingScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          spacing: 8,
          children: [
            if (result.isNotEmpty) ...[
              const SizedBox(height: 16),
              // const Text("Eligibility Probability",
            // style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              SizedBox(
          height: 200,
          child: PieChart(
            dataMap: {
              "Eligible": result['prob_eligible'],
              "Not Eligible": result['prob_not_eligible'],
            },
            colorList: [Colors.blue, Colors.grey],
            chartType: ChartType.ring,
            ringStrokeWidth: 32,
            chartValuesOptions: const ChartValuesOptions(
              showChartValuesInPercentage: true,
              showChartValuesOutside: true,
            ),
            legendOptions: const LegendOptions(
              showLegends: true,
              legendPosition: LegendPosition.bottom,
            ),
          ),
              ),
              const SizedBox(height: 16),
              Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.blue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children: [
              Text(
              (result['prob_eligible'] >= 0.5)
                ? "You meet the eligibility criteria for the loan."
                : "You do not meet the eligibility criteria for the loan.",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
              "Your eligibility score is ${(result['prob_eligible'] * 100).toStringAsFixed(2)}%",
              style: const TextStyle(fontSize: 16),
              ),
            ],
          ),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
          ElevatedButton(
            onPressed: widget.back,
            child: const Text("Back"),
          ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
