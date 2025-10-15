import {
	AlertCircle,
	Calculator,
	FileText,
	Info,
	TrendingUp,
	X,
} from "lucide-react";
import type React from "react";
import type { DrillDownData, ElsterFieldValue, Transaction } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface FieldDetailModalProps {
	field?: ElsterFieldValue;
	drillDownData?: DrillDownData;
	transactions?: Transaction[];
	isOpen: boolean;
	onClose: () => void;
}

const FieldDetailModal: React.FC<FieldDetailModalProps> = ({
	field,
	drillDownData,
	transactions = [],
	isOpen,
	onClose,
}) => {
	if (!isOpen || !field) return null;

	const formatValue = (value: number | string) => {
		if (typeof value === "number") {
			return `${value.toFixed(2)} €`;
		}
		return value;
	};

	const getSourceIcon = (source: string) => {
		switch (source) {
			case "user_data":
				return <FileText size={16} className="text-green-600" />;
			case "calculated":
				return <Calculator size={16} className="text-blue-600" />;
			case "transaction":
				return <TrendingUp size={16} className="text-purple-600" />;
			default:
				return <Info size={16} className="text-gray-600" />;
		}
	};

	const getSourceDescription = (source: string) => {
		switch (source) {
			case "user_data":
				return "Aus Ihren persönlichen Daten automatisch ausgefüllt";
			case "calculated":
				return "Automatisch aus Ihren Transaktionen berechnet";
			case "transaction":
				return "Basierend auf kategorisierten Transaktionen";
			default:
				return "Manueller Eintrag erforderlich";
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden p-6">
				<div className="flex items-center justify-between border-b">
					<div>
						<h2 className="text-2xl">
							Feld {field.field}: {field.label}
						</h2>
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline" className="flex items-center gap-1">
								{getSourceIcon(field.source)}
								{field.source === "user_data"
									? "Persönliche Daten"
									: field.source === "calculated"
										? "Berechnet"
										: field.source === "transaction"
											? "Transaktionen"
											: "Manuell"}
							</Badge>
							{field.required && (
								<Badge
									variant="destructive"
									className="flex items-center gap-1"
								>
									<AlertCircle size={12} />
									Pflichtfeld
								</Badge>
							)}
						</div>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						<X size={20} />
					</Button>
				</div>

				<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Field Information */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Feld-Informationen</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<label className="text-sm text-muted-foreground">
										Aktueller Wert
									</label>
									<div className="text-lg mt-1">
										{field.value
											? formatValue(field.value)
											: "Nicht ausgefüllt"}
									</div>
								</div>

								<div>
									<label className="text-sm text-muted-foreground">
										Feldtyp
									</label>
									<div className="mt-1 capitalize">{field.type}</div>
								</div>

								<div>
									<label className="text-sm text-muted-foreground">
										Quelle
									</label>
									<div className="mt-1 flex items-center gap-2">
										{getSourceIcon(field.source)}
										<span>{getSourceDescription(field.source)}</span>
									</div>
								</div>

								{field.required && (
									<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
										<div className="flex items-center gap-2 text-red-800">
											<AlertCircle size={16} />
											<span className="font-medium">Pflichtfeld</span>
										</div>
										<p className="text-sm text-red-700 mt-1">
											Dieses Feld muss für die Steuererklärung ausgefüllt
											werden.
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Contributing Data */}
						{drillDownData && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Beitragende Daten</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label className="text-sm text-muted-foreground">
											Gesamtbetrag
										</label>
										<div className="text-lg mt-1">
											{drillDownData.totalAmount.toFixed(2)} €
										</div>
									</div>

									<div>
										<label className="text-sm text-muted-foreground">
											Kategorie-Aufschlüsselung
										</label>
										<div className="mt-2 space-y-2">
											{Object.entries(drillDownData.categoryBreakdown).map(
												([category, amount]) => (
													<div
														key={category}
														className="flex justify-between text-sm"
													>
														<span>{category}</span>
														<span className="font-medium">
															{amount.toFixed(2)} €
														</span>
													</div>
												),
											)}
										</div>
									</div>

									{drillDownData.vatBreakdown &&
										Object.keys(drillDownData.vatBreakdown).length > 0 && (
											<div>
												<label className="text-sm text-muted-foreground">
													USt-Aufschlüsselung
												</label>
												<div className="mt-2 space-y-2">
													{Object.entries(drillDownData.vatBreakdown).map(
														([rate, amount]) => (
															<div
																key={rate}
																className="flex justify-between text-sm"
															>
																<span>{rate}% USt</span>
																<span className="font-medium">
																	{amount.toFixed(2)} €
																</span>
															</div>
														),
													)}
												</div>
											</div>
										)}
								</CardContent>
							</Card>
						)}
					</div>

					{/* Contributing Transactions */}
					{transactions.length > 0 && (
						<Card className="mt-6">
							<CardHeader>
								<CardTitle className="text-lg">
									Beitragende Transaktionen
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="max-h-96 overflow-y-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Datum</TableHead>
												<TableHead>Gegenpartei</TableHead>
												<TableHead>Betrag</TableHead>
												<TableHead>Verwendungszweck</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{transactions.map((transaction) => (
												<TableRow key={transaction.id}>
													<TableCell>{transaction.dateField}</TableCell>
													<TableCell
														className="max-w-xs truncate"
														title={transaction.counterpartyField}
													>
														{transaction.counterpartyField}
													</TableCell>
													<TableCell
														className={`font-medium ${
															transaction.BetragNumeric > 0
																? "text-green-600"
																: "text-red-600"
														}`}
													>
														{transaction.BetragNumeric.toFixed(2)} €
													</TableCell>
													<TableCell
														className="max-w-xs truncate"
														title={transaction.purposeField}
													>
														{transaction.purposeField}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Help Section */}
					<Card className="mt-6">
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Info size={20} />
								Hilfe & Erklärungen
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<h4 className="font-medium mb-2">
										Was bedeutet dieses Feld?
									</h4>
									<p className="text-sm text-muted-foreground">
										Feld {field.field} ({field.label}) ist ein {field.type}-Feld
										in Ihrer EÜR.
										{field.required
											? " Es handelt sich um ein Pflichtfeld, das für die Steuererklärung ausgefüllt werden muss."
											: " Dieses Feld ist optional."}
									</p>
								</div>

								<div>
									<h4 className="font-medium mb-2">
										Wie wird der Wert bestimmt?
									</h4>
									<p className="text-sm text-muted-foreground">
										{getSourceDescription(field.source)}
									</p>
								</div>

								<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<h4 className="font-medium text-blue-800 mb-2">💡 Tipp</h4>
									<p className="text-sm text-blue-700">
										Überprüfen Sie alle automatisch ausgefüllten Felder auf
										Richtigkeit. Bei Abweichungen können Sie die zugrunde
										liegenden Transaktionen überarbeiten.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default FieldDetailModal;
