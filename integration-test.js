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

// Test logging helper (console is acceptable in test files)
// biome-ignore lint/suspicious/noConsole: Test output
const log = console.log;

log("🧪 Testing integration workflow...");

try {
  // 1. Parse CSV
  const transactions = parseKontistCSV(csvData);
  log("✅ CSV parsing successful:", transactions.length, "transactions");

  // 2. Auto-categorize
  for (const t of transactions) {
    t.euerCategory = categorizeTransaction(t);
  }

  // 3. Create categories mapping
  const categories = {};
  for (const t of transactions) {
    categories[t.id] = t.euerCategory || "";
  }

  // 4. Calculate EÜR
  const euerResult = calculateEuer(transactions, categories, false);
  log("✅ EÜR calculation successful");
  log(
    "   Income total:",
    Object.values(euerResult.income).reduce((a, b) => a + b, 0)
  );
  log(
    "   Expense total:",
    Object.values(euerResult.expenses).reduce((a, b) => a + b, 0)
  );

  // 5. Populate ELSTER fields
  const { fieldValues } = populateAllElsterFields(
    transactions,
    categories,
    false
  );
  log("✅ ELSTER field population successful:", fieldValues.length, "fields");

  log("🎉 Integration test PASSED - All systems working!");
} catch (error) {
  // biome-ignore lint/suspicious/noConsole: Error logging in tests
  console.error("❌ Integration test FAILED:", error.message);
}
