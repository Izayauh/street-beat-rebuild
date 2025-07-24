import React from 'react';

interface OrderSummaryProps {
  selectedPackage: { id: number; name: string; price: number } | null;
 packageDetails: {
    id: string;
    name: string;
    price: number;
 originalPrice?: number;
    description: string;
    features: string[];
    popular: boolean;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ packageDetails }) => {
  return (
    <div className="card-analog p-8 rounded-2xl warm-glow">
      <h3 className="text-amber-400 text-2xl font-display warm-text-glow mb-6">Order Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
          {/* Changed wrapping <p> to <div> */}
          <div>
              <h4 className="text-amber-300 text-lg font-display">
                {packageDetails.name}
              </h4>
              <p className="text-amber-200/70 text-sm text-serif">
                {packageDetails.description}
              </p>
          </div>
          </div>
          <div className="text-right">
            {packageDetails.originalPrice && (
              <span className="text-amber-200/50 text-sm line-through block">
                ${packageDetails.originalPrice}
              </span>
            )}
            <p>
              <span className="text-amber-300 text-xl font-bold">
                ${packageDetails.price}
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-amber-500/20 pt-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-amber-400 font-display">Total</span>
            <span className="text-amber-300 font-bold">
              ${packageDetails.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;