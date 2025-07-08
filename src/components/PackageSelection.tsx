import React from 'react';

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface PackageSelectionProps {
  selectedPackage: Package | null;
  handlePackageSelect: (packageId: string) => void;
}

const packages: Package[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    features: ['Feature 1', 'Feature 2'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 25,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 50,
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
];

const PackageSelection: React.FC<PackageSelectionProps> = ({ selectedPackage, handlePackageSelect }) => {
  return (
    <div className="package-selection">
      <h2>Select a Package</h2>
      <div className="package-options">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
          >
            <h3>{pkg.name}</h3>
            <p>${pkg.price}/month</p>
            <ul>
              {pkg.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handlePackageSelect(pkg.id)}>
              {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageSelection;