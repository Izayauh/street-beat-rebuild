import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SquarePaymentForm from '@/components/SquarePaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Check, Star, Gift } from 'lucide-react';

const PAYMENT_PACKAGES = [
  {
    id: 'single-session',
    name: 'Single Session',
    price: 75,
    description: 'One-on-one music lesson with our experienced instructors',
    features: [
      '60-minute lesson',
      'Personalized instruction',
      'All skill levels welcome',
      'Instrument provided if needed'
    ],
    popular: false
  },
  {
    id: 'lesson-package-4',
    name: '4-Lesson Package',
    price: 280,
    originalPrice: 300,
    description: 'Four lessons with 7% savings - perfect for getting started',
    features: [
      '4 x 60-minute lessons',
      'Flexible scheduling',
      'Progress tracking',
      'Practice materials included',
      'Save $20'
    ],
    popular: true
  },
  {
    id: 'lesson-package-8',
    name: '8-Lesson Package',
    price: 540,
    originalPrice: 600,
    description: 'Eight lessons with 10% savings - ideal for skill development',
    features: [
      '8 x 60-minute lessons',
      'Priority scheduling',
      'Detailed progress reports',
      'Bonus practice session',
      'Save $60'
    ],
    popular: false
  },
  {
    id: 'studio-rental',
    name: 'Studio Rental',
    price: 45,
    description: 'Hourly studio rental for practice or recording',
    features: [
      'Professional equipment',
      'Soundproof environment',
      'Flexible booking',
      'Recording capabilities'
    ],
    popular: false
  }
];

// Updated with your actual Square location ID
const SQUARE_LOCATION_ID = "C1DTABC9HCV46";
const SQUARE_APP_ID = "sq0idp-Udsxxarqi-r8qlF6rGMy6g";

const Payments = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const { user } = useAuth();

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    const paymentSection = document.getElementById('payment-section');
    paymentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSelectedPackageDetails = () => {
    return PAYMENT_PACKAGES.find(pkg => pkg.id === selectedPackage);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 section-warm relative overflow-hidden">
        <div className="absolute inset-0 texture-grain opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Music className="w-16 h-16 text-amber-400 animate-warm-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 analog-gradient bg-clip-text text-transparent warm-text-glow">
            Book Your Musical Journey
          </h1>
          <p className="text-xl text-amber-200/80 mb-8 max-w-3xl mx-auto text-serif leading-relaxed">
            Choose from our flexible lesson packages or studio rental options. 
            Secure payment processing with Square and no hidden fees.
          </p>
        </div>
      </section>

      {/* Payment Packages */}
      <section className="py-16 px-4 analog-gradient-dark relative">
        <div className="absolute inset-0 texture-grain opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-400 mb-6 warm-text-glow">Choose Your Package</h2>
            <p className="text-amber-200/80 text-lg max-w-2xl mx-auto text-serif leading-relaxed">
              Select the perfect option for your musical goals. All packages include professional instruction 
              and access to our state-of-the-art facilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {PAYMENT_PACKAGES.map((pkg, index) => (
              <Card 
                key={pkg.id} 
                className={`card-analog hover:warm-glow transition-all duration-500 transform hover:-translate-y-2 animate-float relative ${
                  pkg.popular ? 'ring-2 ring-amber-400' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 text-black px-3 py-1 text-sm font-bold">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-amber-400 text-xl warm-text-glow">{pkg.name}</CardTitle>
                  <div className="text-center">
                    {pkg.originalPrice && (
                      <span className="text-amber-200/50 text-lg line-through mr-2">
                        ${pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-amber-300">${pkg.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  <p className="text-amber-200/70 text-sm text-serif leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  <div className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-amber-200/80 text-sm">
                        <Check className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
                        <span className="text-serif">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handlePackageSelect(pkg.id)}
                    className={`w-full mt-6 transform hover:scale-105 transition-all duration-300 ${
                      selectedPackage === pkg.id 
                        ? 'btn-analog text-black' 
                        : 'glass-effect border-2 border-amber-500/40 text-amber-100 hover:border-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Form Section */}
      {selectedPackage && (
        <section id="payment-section" className="py-16 px-4 section-warm relative">
          <div className="absolute inset-0 texture-grain opacity-20"></div>
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-amber-400 mb-6 warm-text-glow">Complete Your Purchase</h2>
              <p className="text-amber-200/80 text-lg max-w-2xl mx-auto text-serif leading-relaxed">
                Secure payment processing powered by Square. Your payment information is encrypted and secure.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="card-analog p-8 rounded-2xl warm-glow">
                <h3 className="text-amber-400 text-2xl font-display warm-text-glow mb-6">Order Summary</h3>
                {getSelectedPackageDetails() && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-amber-300 text-lg font-display">
                          {getSelectedPackageDetails()!.name}
                        </h4>
                        <p className="text-amber-200/70 text-sm text-serif">
                          {getSelectedPackageDetails()!.description}
                        </p>
                      </div>
                      <div className="text-right">
                        {getSelectedPackageDetails()!.originalPrice && (
                          <span className="text-amber-200/50 text-sm line-through block">
                            ${getSelectedPackageDetails()!.originalPrice}
                          </span>
                        )}
                        <span className="text-amber-300 text-xl font-bold">
                          ${getSelectedPackageDetails()!.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-amber-500/20 pt-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-amber-400 font-display">Total</span>
                        <span className="text-amber-300 font-bold">
                          ${getSelectedPackageDetails()!.price}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment Form */}
              <div className="card-analog p-8 rounded-2xl warm-glow">
                <SquarePaymentForm 
                  packageDetails={getSelectedPackageDetails()!}
                  userEmail={user?.email || ''}
                  locationId={SQUARE_LOCATION_ID}
                  amount={getSelectedPackageDetails()!.price * 100}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Indicators */}
      <section className="py-12 px-4 analog-gradient-dark relative">
        <div className="absolute inset-0 texture-grain opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex flex-wrap justify-center items-center gap-8 text-amber-200/60">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="text-serif">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span className="text-serif">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              <span className="text-serif">Professional Instruction</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payments;
