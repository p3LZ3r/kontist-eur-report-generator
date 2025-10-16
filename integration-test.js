// Quick integration test to verify the data flow

import {
  calculateEuer,
  populateAllElsterFields,
} from "./src/utils/euerCalculations.js";
import {
  categorizeTransaction,
  parseKontistCSV,
} from "./src/utils/transactionUtils.js";

// Test data
const csvData = `Buchungsdatum;Empfänger;Verwendungszweck;Betrag;Transaktionstyp
2024-01-15;Kundenaufrag GmbH;Beratungsleistung;"2.380,00";Zahlungseingang
2024-01-20;Büromaterial AG;Büroausstattung;"-89,25";Kartenzahlung`;

console.log("🧪 Testing integration workflow...");

try {
  // 1. Parse CSV
  const transactions = parseKontistCSV(csvData);
  console.log(
    "✅ CSV parsing successful:",
    transactions.length,
    "transactions"
  );

  // 2. Auto-categorize
  transactions.forEach((t) => {
    t.euerCategory = categorizeTransaction(t);
  });

  // 3. Create categories mapping
  const categories = {};
  transactions.forEach((t) => {
    categories[t.id] = t.euerCategory || "";
  });

  // 4. Calculate EÜR
  const euerResult = calculateEuer(transactions, categories, false);
  console.log("✅ EÜR calculation successful");
  console.log(
    "   Income total:",
    Object.values(euerResult.income).reduce((a, b) => a + b, 0)
  );
  console.log(
    "   Expense total:",
    Object.values(euerResult.expenses).reduce((a, b) => a + b, 0)
  );

  // 5. Populate ELSTER fields
  const { fieldValues } = populateAllElsterFields(
    transactions,
    categories,
    false
  );
  console.log(
    "✅ ELSTER field population successful:",
    fieldValues.length,
    "fields"
  );

  console.log("🎉 Integration test PASSED - All systems working!");
} catch (error) {
  console.error("❌ Integration test FAILED:", error.message);
}
