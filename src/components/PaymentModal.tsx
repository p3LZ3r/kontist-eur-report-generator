import React, { useState, useEffect } from 'react';
import { X, Heart, Coffee, Download, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onPaymentSuccess?: () => void;
  exportType: 'txt' | 'csv' | 'json' | 'pdf';
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onPaymentSuccess,
  exportType
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showCancelledMessage, setShowCancelledMessage] = useState(false);

  // Check for purchase outcome URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const purchaseStatus = urlParams.get('purchase');
    
    if (purchaseStatus === 'success') {
      setShowSuccessMessage(true);
      setPaymentError(null);
      setShowCancelledMessage(false);
      
      // Auto-trigger success callback after showing message
      setTimeout(() => {
        setShowSuccessMessage(false);
        onPaymentSuccess?.();
      }, 2000);
    } else if (purchaseStatus === 'cancelled') {
      setShowCancelledMessage(true);
      setPaymentError(null);
      setShowSuccessMessage(false);
      
      // Auto-hide cancelled message after 3 seconds
      setTimeout(() => {
        setShowCancelledMessage(false);
      }, 3000);
    } else if (purchaseStatus === 'failed') {
      setPaymentError('Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
      setShowSuccessMessage(false);
      setShowCancelledMessage(false);
    }
    
    // Clear the URL parameter
    if (purchaseStatus) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [onPaymentSuccess]);

  if (!isOpen) return null;

  const getExportDescription = () => {
    switch (exportType) {
      case 'txt': return 'EÜR Textbericht';
      case 'csv': return 'ELSTER CSV-Export';
      case 'json': return 'ELSTER JSON-Export';
      case 'pdf': return 'Detaillierter PDF-Bericht';
      default: return 'Export';
    }
  };

  const calculateVAT = (grossAmount: number) => {
    const vatRate = 0.19; // 19% German VAT
    const netAmount = grossAmount / (1 + vatRate);
    const vatAmount = grossAmount - netAmount;
    return { netAmount, vatAmount, grossAmount };
  };

  const MIN_PRICE = 1; // Minimum 1€

  const isValidCustomAmount = (amount: string): boolean => {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= MIN_PRICE && num <= 999;
  };

  const handleCustomPurchase = () => {
    const amount = parseFloat(customAmount);
    if (isValidCustomAmount(customAmount)) {
      handlePurchase(amount);
    }
  };

  const handlePurchase = async (grossAmount: number) => {
    // Clear any existing error states
    setPaymentError(null);
    setShowCancelledMessage(false);
    setShowSuccessMessage(false);
    setIsProcessingPayment(true);
    
    try {
      const { netAmount, vatAmount } = calculateVAT(grossAmount);
      
      // Create purchase session with compliant terminology (using Polar.sh checkout URL)
      const successUrl = encodeURIComponent(window.location.origin + '?purchase=success');
      const cancelUrl = encodeURIComponent(window.location.origin + '?purchase=cancelled');
      
      const checkoutUrl = `https://polar.sh/checkout?amount=${Math.round(grossAmount * 100)}&description=${encodeURIComponent(`ELSTER-Export Zugang - ${getExportDescription()}`)}&metadata=${encodeURIComponent(`net:${netAmount.toFixed(2)},vat:${vatAmount.toFixed(2)},service:elster_export`)}&return_url=${successUrl}&cancel_url=${cancelUrl}`;
      
      const checkoutSession = {
        url: checkoutUrl,
      };

      if (checkoutSession.url) {
        // Open Polar checkout for service purchase
        const popup = window.open(checkoutSession.url, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          // Popup blocked
          setPaymentError('Popup-Blocker verhindert die Zahlung. Bitte erlauben Sie Popups und versuchen Sie es erneut.');
          setIsProcessingPayment(false);
          return;
        }
        
        // Monitor for window close with timeout
        // eslint-disable-next-line prefer-const
        let timeoutId: NodeJS.Timeout;
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            clearTimeout(timeoutId);
            setIsProcessingPayment(false);

            // Check if we have a success parameter in current URL
            // If not, assume cancellation after a short delay to allow URL updates
            setTimeout(() => {
              const currentParams = new URLSearchParams(window.location.search);
              if (!currentParams.get('purchase')) {
                setShowCancelledMessage(true);
              }
            }, 500);
          }
        }, 1000);

        // Set a timeout for extremely long-running processes
        timeoutId = setTimeout(() => {
          clearInterval(checkClosed);
          if (!popup?.closed) {
            popup?.close();
          }
          setPaymentError('Zahlung dauerte zu lange. Bitte versuchen Sie es erneut.');
          setIsProcessingPayment(false);
        }, 600000); // 10 minutes timeout
        
      } else {
        throw new Error('Checkout URL konnte nicht erstellt werden');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setPaymentError(`Kauf konnte nicht initialisiert werden: ${errorMessage}. Bitte versuchen Sie es später erneut.`);
      setIsProcessingPayment(false);
    }
  };

  // Show success message if payment completed
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
        <Card className="w-full max-w-md mx-4 relative">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Kauf erfolgreich!
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vielen Dank für Ihren Kauf! Ihr {getExportDescription()} ist jetzt verfügbar und der Download startet automatisch.
            </p>
            <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show cancellation message if payment was cancelled
  if (showCancelledMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
        <Card className="w-full max-w-md mx-4 relative">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="text-orange-600" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Kauf abgebrochen
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Sie haben den Kaufvorgang abgebrochen. Sie können jederzeit einen neuen Kauf starten.
            </p>
            <Button onClick={() => setShowCancelledMessage(false)} className="mt-2">
              Verstanden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <Card className="w-full max-w-md mx-4 relative">
        <CardContent className="p-6">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
            aria-label="Modal schließen"
          >
            <X size={16} />
          </Button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              ELSTER-Export freischalten
            </h2>
            <p className="text-sm text-muted-foreground">
              Erwerben Sie Zugang zum <strong>{getExportDescription()}</strong>.
            </p>
          </div>

          {/* Error Message */}
          {paymentError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <X className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">Fehler bei der Zahlung</h4>
                  <p className="text-xs text-red-700">{paymentError}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaymentError(null)}
                    className="mt-2 h-6 text-xs text-red-700 hover:text-red-800"
                  >
                    Schließen
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Coffee className="text-primary flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Flexible Preisgestaltung
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Wählen Sie einen Preis, der für Sie angemessen ist. 
                    Ihr Kauf unterstützt die Weiterentwicklung des Tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground text-center">
                Preis wählen
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePurchase(2)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Coffee size={16} />
                  <span className="text-xs">2€</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePurchase(5)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Heart size={16} />
                  <span className="text-xs">5€</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePurchase(10)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <CreditCard size={16} />
                  <span className="text-xs">10€</span>
                </Button>
              </div>

              {/* Custom Amount Option */}
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  Eigenen Betrag wählen (min. {MIN_PRICE}€)
                </Button>
                
                {showCustomInput && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Min. ${MIN_PRICE}€`}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        min={MIN_PRICE}
                        max={999}
                        step="0.01"
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={handleCustomPurchase}
                        disabled={!isValidCustomAmount(customAmount) || isProcessingPayment}
                        className="whitespace-nowrap"
                      >
                        Kaufen
                      </Button>
                    </div>
                    {customAmount && !isValidCustomAmount(customAmount) && (
                      <p className="text-xs text-red-500">
                        Bitte geben Sie einen Betrag zwischen {MIN_PRICE}€ und 999€ ein.
                      </p>
                    )}
                    {isValidCustomAmount(customAmount) && (
                      <div className="text-xs text-muted-foreground">
                        {(() => {
                          const { netAmount, vatAmount } = calculateVAT(parseFloat(customAmount));
                          return (
                            <div>
                              <div>Netto: {netAmount.toFixed(2)}€</div>
                              <div>MwSt. (19%): {vatAmount.toFixed(2)}€</div>
                              <div className="font-medium">Gesamt: {parseFloat(customAmount).toFixed(2)}€</div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isProcessingPayment && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">
                    Kauf wird verarbeitet...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={onSkip} 
              className="w-full"
              disabled={isProcessingPayment}
            >
              <Download size={16} className="mr-2" />
              Kostenlosen Zugang wählen
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Sie können auch ohne Kauf herunterladen
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;