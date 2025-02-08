import 'package:pie_chart/pie_chart.dart';
import 'package:flutter/material.dart';
import 'package:servolend_ai/components/my_textfield.dart';
import 'package:servolend_ai/helpers/fetch.dart';

class ApplyForLoan extends StatefulWidget {
  const ApplyForLoan({super.key});

  @override
  State<ApplyForLoan> createState() => _ApplyForLoanState();
}

class _ApplyForLoanState extends State<ApplyForLoan> {
  int pageNo = 0;
  final Map<String, dynamic> loanInfo = {};
  final Map<String, dynamic> personalDetails = {};

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
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (pageNo == 0)
              Page1(
                next: (loanAmount, interestRate) => setState(() {
                  loanInfo['loanAmount'] = loanAmount;
                  loanInfo['interestRate'] = interestRate;
                  pageNo += 1;
                }),
              ),
            if (pageNo == 1)
              Page2(
                next: (age, annualIncome, employmentLength, creditHistoryLength,
                        homeOwnership, loanIntent) =>
                    setState(() {
                  personalDetails['age'] = age;
                  personalDetails['annualIncome'] = annualIncome;
                  personalDetails['employmentLength'] = employmentLength;
                  personalDetails['creditHistoryLength'] = creditHistoryLength;
                  personalDetails['homeOwnership'] = homeOwnership;
                  personalDetails['loanIntent'] = loanIntent;
                  pageNo += 1;
                }),
                back: () => setState(() {
                  pageNo -= 1;
                }),
              ),
            if (pageNo == 2)
              Page3(
                loanInfo: loanInfo,
                personalDetails: personalDetails,
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
  final Function(int, double) next;
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
              onPressed: () => next(
                int.parse(loanAmountController.text),
                double.parse(interestRateController.text),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
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
      child: Column(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
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
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text("Back"),
              ),
              ElevatedButton(
                onPressed: () => next(
                  int.parse(ageController.text),
                  int.parse(annualIncomeController.text),
                  double.parse(employmentLengthController.text),
                  int.parse(creditHistoryLengthController.text),
                  selectedHomeOwnership,
                  selectedLoanIntent,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text("Next"),
              ),
            ],
          )
        ],
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
    setState(() {
      finalObject['age'] = widget.personalDetails['age'] as int;
      finalObject['income'] = widget.personalDetails['annualIncome'] as int;
      finalObject['ownership'] =
          (widget.personalDetails['homeOwnership'] as String)
              .replaceAll(' ', '')
              .toUpperCase();
      finalObject['employment_len'] =
          widget.personalDetails['employmentLength'] as double;
      finalObject['loan_intent'] =
          (widget.personalDetails['loanIntent'] as String)
              .replaceAll(' ', '')
              .toUpperCase();
      finalObject['loan_amnt'] = widget.loanInfo['loanAmount'] as int;
      finalObject['loan_int_rate'] = widget.loanInfo['interestRate'] as double;
      finalObject['loan_percent_income'] = (widget.loanInfo['loanAmount'] /
          widget.personalDetails['annualIncome']) as double;
      finalObject['cred_hist_len'] =
          widget.personalDetails['creditHistoryLength'] as int;

      getData();
    });
  }

  Future<void> getData() async {
    final Map<String, dynamic> res = await fetch(
      'https://deploy-api-17es.onrender.com/predict',
      finalObject,
      method: "post",
    );
    print("RESULT");
    if (res.isNotEmpty) {
      setState(() {
        result = res;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Loan Information:",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Text("Loan Amount: ${widget.loanInfo['loanAmount']}",
            style: const TextStyle(fontSize: 16)),
        Text("Interest Rate: ${widget.loanInfo['interestRate']}",
            style: const TextStyle(fontSize: 16)),
        const SizedBox(height: 16),
        const Text("Personal Details:",
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        Text("Age: ${widget.personalDetails['age']}",
            style: const TextStyle(fontSize: 16)),
        Text("Annual Income: ${widget.personalDetails['annualIncome']}",
            style: const TextStyle(fontSize: 16)),
        Text(
            "Employment Length: ${widget.personalDetails['employmentLength']} years",
            style: const TextStyle(fontSize: 16)),
        Text(
            "Credit History Length: ${widget.personalDetails['creditHistoryLength']} years",
            style: const TextStyle(fontSize: 16)),
        Text("Home Ownership: ${widget.personalDetails['homeOwnership']}",
            style: const TextStyle(fontSize: 16)),
        Text("Loan Intent: ${widget.personalDetails['loanIntent']}",
            style: const TextStyle(fontSize: 16)),
        if (result.isNotEmpty) ...[
          const SizedBox(height: 16),
          const Text("Eligibility Probability:",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
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
        ],
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            ElevatedButton(
              onPressed: widget.back,
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text("Back"),
            ),
          ],
        )
      ],
    );
  }
}
