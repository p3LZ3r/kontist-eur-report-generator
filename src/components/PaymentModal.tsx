import React, { useState, useEffect } from 'react';
import { X, Heart, Coffee, Download, CreditCard, CheckCircle } from 'lucide-react';
// import { Polar } from '@polar-sh/sdk'; // Commented out for build, uncomment for production
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for payment success URL parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setShowSuccessMessage(true);
      // Clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Auto-trigger success callback after showing message
      setTimeout(() => {
        setShowSuccessMessage(false);
        onPaymentSuccess?.();
      }, 2000);
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

  const handlePolarPayment = async (amount: number) => {
    setIsProcessingPayment(true);
    try {
      // Initialize Polar SDK (for production use)
      // const polar = new Polar({
      //   accessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
      // });

      // Create checkout session for the donation amount
      // Note: In production, you would use polar.checkouts.create() with pre-created products
      // For now, simulate the checkout creation with a simple URL redirect
      const checkoutUrl = `https://polar.sh/checkout?amount=${amount}&description=${encodeURIComponent(`Freiwillige Unterstützung für ${getExportDescription()}`)}&return_url=${encodeURIComponent(window.location.origin + '?payment=success')}`;
      
      const checkoutSession = {
        url: checkoutUrl,
        // Other properties would come from real Polar API
      };

      if (checkoutSession.url) {
        // Open Polar checkout in new window/tab
        const popup = window.open(checkoutSession.url, '_blank', 'width=600,height=700');
        
        // Monitor for window close (user completed or cancelled payment)
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setIsProcessingPayment(false);
            // Don't auto-close modal, let user use skip if payment failed
            // Success will be handled by URL parameter detection
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      // Show user-friendly error message
      alert('Zahlung konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.');
    } finally {
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
              Vielen Dank für Ihre Unterstützung!
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ihr Download startet automatisch in wenigen Sekunden...
            </p>
            <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin mx-auto"></div>
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