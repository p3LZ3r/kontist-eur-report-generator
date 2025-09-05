import React, { useState } from 'react';
import { X, Heart, Coffee, Download, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

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

  const handlePolarPayment = async (amount: number) => {
    setIsProcessingPayment(true);
    try {
      // TODO: Integrate with Polar.sh SDK
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onPaymentSuccess?.();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
              Unterstützen Sie das Projekt
            </h2>
            <p className="text-sm text-muted-foreground">
              Sie sind dabei, einen <strong>{getExportDescription()}</strong> herunterzuladen.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Coffee className="text-primary flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    100% kostenfrei & quelloffen
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Diese Anwendung ist vollständig kostenfrei nutzbar. Eine freiwillige 
                    Unterstützung hilft bei der Weiterentwicklung.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground text-center">
                Freiwillige Unterstützung
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePolarPayment(2)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Coffee size={16} />
                  <span className="text-xs">2€</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePolarPayment(5)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Heart size={16} />
                  <span className="text-xs">5€</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePolarPayment(10)}
                  disabled={isProcessingPayment}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <CreditCard size={16} />
                  <span className="text-xs">10€</span>
                </Button>
              </div>
            </div>

            {isProcessingPayment && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">
                    Zahlung wird verarbeitet...
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
              Kostenlos herunterladen
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Sie können jederzeit herunterladen, auch ohne Spende
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentModal;