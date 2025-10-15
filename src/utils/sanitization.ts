import DOMPurify from "dompurify";

/**
 * Sanitizes a string field from CSV input to prevent XSS and CSV injection attacks.
 *
 * @param field - Raw field value from CSV
 * @returns Sanitized field value safe for rendering
 *
 * @example
 * ```typescript
 * const safeField = sanitizeField('=cmd|"/c calc"!A1'); // Returns '=cmd|"/c calc"!A1 (with formula disabled)
 * const safeField = sanitizeField('<script>alert("xss")</script>'); // Returns ''
 * ```
 */
export const sanitizeField = (field: string): string => {
	if (!field || typeof field !== "string") {
		return "";
	}

	// 1. CSV Formula Injection Prevention
	// Check if field starts with dangerous characters that could trigger formulas
	const dangerousStarts = ["=", "+", "-", "@", "\t", "\r"];
	if (dangerousStarts.some((char) => field.trim().startsWith(char))) {
		// Prefix with single quote to disable formula interpretation
		field = `'${field}`;
	}

	// 2. XSS Prevention using DOMPurify
	// Strip all HTML tags but keep text content
	const sanitized = DOMPurify.sanitize(field, {
		ALLOWED_TAGS: [], // No HTML tags allowed
		KEEP_CONTENT: true, // Keep text content
		ALLOW_DATA_ATTR: false,
	});

	return sanitized.trim();
};

/**
 * Validates CSV content for malicious patterns before parsing.
 *
 * @param csvContent - Raw CSV file content
 * @returns True if CSV appears safe, false if dangerous patterns detected
 *
 * @throws {Error} If dangerous patterns are detected
 */
export const validateCSVContent = (csvContent: string): boolean => {
	if (!csvContent) {
		throw new Error("CSV-Inhalt ist leer");
	}

	// Check for common attack patterns
	const dangerousPatterns = [
		/<script[\s\S]*?>[\s\S]*?<\/script>/gi, // Script tags
		/javascript:/gi, // JavaScript protocol
		/on\w+\s*=/gi, // Event handlers
		/<iframe/gi, // Iframes
		/<object/gi, // Object tags
		/<embed/gi, // Embed tags
	];

	for (const pattern of dangerousPatterns) {
		if (pattern.test(csvContent)) {
			throw new Error(
				"CSV-Datei enthält potenziell gefährlichen Code. " +
					"Bitte stellen Sie sicher, dass die Datei direkt aus Ihrem Banking-Portal exportiert wurde.",
			);
		}
	}

	// Check for excessive line length (potential DoS)
	const lines = csvContent.split("\n");
	const MAX_LINE_LENGTH = 10000; // 10KB per line

	for (let i = 0; i < Math.min(lines.length, 100); i++) {
		if (lines[i].length > MAX_LINE_LENGTH) {
			throw new Error(
				`CSV-Datei enthält ungewöhnlich lange Zeilen (Zeile ${i + 1}). ` +
					"Dies könnte auf ein beschädigtes oder manipuliertes Dateiformat hinweisen.",
			);
		}
	}

	return true;
};
