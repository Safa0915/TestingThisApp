import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; city: string }) => void;
  onClose: () => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Popular cities with coordinates for prayer times
  const popularCities = [
    { name: 'Mecca, Saudi Arabia', lat: 21.4225, lng: 39.8262, country: 'Saudi Arabia' },
    { name: 'Medina, Saudi Arabia', lat: 24.4539, lng: 39.5775, country: 'Saudi Arabia' },
    { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, country: 'UAE' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, country: 'Turkey' },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
    { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, country: 'USA' },
    { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany' },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
    { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, country: 'Malaysia' },
    { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, country: 'Pakistan' },
    { name: 'Lahore, Pakistan', lat: 31.5204, lng: 74.3587, country: 'Pakistan' },
    { name: 'Islamabad, Pakistan', lat: 33.6844, lng: 73.0479, country: 'Pakistan' },
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'Delhi, India', lat: 28.7041, lng: 77.1025, country: 'India' },
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, country: 'Bangladesh' },
    { name: 'Tehran, Iran', lat: 35.6892, lng: 51.3890, country: 'Iran' },
    { name: 'Baghdad, Iraq', lat: 33.3152, lng: 44.3661, country: 'Iraq' },
    { name: 'Amman, Jordan', lat: 31.9454, lng: 35.9284, country: 'Jordan' },
    { name: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018, country: 'Lebanon' },
    { name: 'Casablanca, Morocco', lat: 33.5731, lng: -7.5898, country: 'Morocco' },
    { name: 'Tunis, Tunisia', lat: 36.8065, lng: 10.1815, country: 'Tunisia' },
    { name: 'Algiers, Algeria', lat: 36.7538, lng: 3.0588, country: 'Algeria' },
    { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
    { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, country: 'Kenya' }
  ];

  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (city: any) => {
    setSelectedLocation(city);
    onLocationSelect({
      lat: city.lat,
      lng: city.lng,
      city: city.name
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Select Your City</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100">Choose your location for accurate prayer times</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for your city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800"
            />
          </div>
        </div>

        {/* Cities List */}
        <div className="overflow-y-auto max-h-96">
          {filteredCities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No cities found matching "{searchTerm}"</p>
              <p className="text-sm mt-2">Try searching for a major city near you</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(city)}
                  className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-teal-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">
                        {city.name.split(',')[0]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {city.country}
                      </div>
                    </div>
                    <div className="text-teal-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Can't find your city? Select the nearest major city for approximate prayer times.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;