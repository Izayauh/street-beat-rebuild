
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Music, ArrowRight, Mail, Phone } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // You can extract payment details from URL parameters if Square provides them
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    
    if (paymentId || orderId) {
      setPaymentDetails({ paymentId, orderId });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <section className="pt-24 pb-16 px-4 section-warm relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="card-analog p-12 rounded-2xl warm-glow">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center warm-glow">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-6 text-amber-400 warm-text-glow">
                Payment Successful! 🎉
              </h1>
              
              <p className="text-xl text-amber-200/80 mb-8 text-serif leading-relaxed">
                Thank you for your purchase! Your payment has been processed successfully. 
                We're excited to help you on your musical journey.
              </p>
              
              <div className="space-y-4 text-amber-200/70 text-serif">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>A confirmation email has been sent to your inbox</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>We'll contact you within 24 hours to schedule your sessions</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={() => window.location.href = '/lessons'}
                  className="btn-analog text-black px-6 py-3 transform hover:scale-105 transition-all duration-300"
                >
                  <Music className="w-5 h-5 mr-2" />
                  Book More Lessons
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="glass-effect border-2 border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10 px-6 py-3"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
