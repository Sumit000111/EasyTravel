import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, Hotel, ExternalLink, BookOpen, Clock, Users, X, Loader, Star } from "lucide-react";
import { generateKayakFlightUrl, generateKayakHotelUrl, openKayakSearch } from "@/services/kayak";
import { fetchFlights, FlightData } from "@/services/flightAPI";
import { fetchHotels, HotelData } from "@/services/hotelAPI";

// Fixed duplicate handleHotelSearch - v2
// Helper function to get city code from city name
const getCityCode = (city: string): string => {
  const cityMap: Record<string, string> = {
    'delhi': 'DEL',
    'mumbai': 'BOM',
    'bangalore': 'BLR',
    'kolkata': 'CCU',
    'chennai': 'MAA',
    'hyderabad': 'HYD',
    'pune': 'PNQ',
    'goa': 'GOI',
    'jaipur': 'JAI',
    'kerala': 'COK',
    'manali': 'KUU',
    'rishikesh': 'DED',
    'shimla': 'SLV',
    'udaipur': 'UDR',
  };
  const normalizedCity = city.toLowerCase().trim();
  return cityMap[normalizedCity] || city.toUpperCase().substring(0, 3);
};

// Helper function to format date for KAYAK URL
const formatDateForURL = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * KAYAK Search Component
 * 
 * Provides quick access to search flights and hotels on KAYAK
 * Powered by KAYAK - the world's leading travel search engine
 * 
 * Reference: https://github.com/kayak
 */
const KayakSearch = ({
  origin,
  destination,
  startDate,
  endDate,
  passengers = 1,
  className = "",
}: KayakSearchProps) => {
  const [showFlights, setShowFlights] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');

  const handleFlightSearch = async () => {
    setShowFlights(true);
    setActiveTab('flights');
    setLoading(true);
    try {
      const flightData = await fetchFlights(
        origin,
        destination,
        startDate,
        endDate,
        passengers
      );
      setFlights(flightData);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSearch = async () => {
    setShowFlights(true);
    setActiveTab('hotels');
    setLoading(true);
    try {
      const hotelData = await fetchHotels(
        destination,
        startDate,
        endDate,
        passengers
      );
      setHotels(hotelData);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flight: FlightData) => {
    // Redirect to KAYAK for flight booking
    const originCode = getCityCode(origin);
    const destCode = getCityCode(destination);
    const depDate = formatDateForURL(startDate);
    const retDate = formatDateForURL(endDate);

    // Use KAYAK flight search URL
    const kayakUrl = `https://www.kayak.com/flights/${originCode}-${destCode}/${depDate}/${retDate}?passengers=${passengers}`;
    
    window.open(kayakUrl, '_blank', 'noopener,noreferrer');
  };

  const handleHotelBooking = (hotel: HotelData) => {
    // Redirect to KAYAK hotels page
    const url = generateKayakHotelUrl({
      destination,
      checkIn: startDate,
      checkOut: endDate,
      guests: passengers,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Card className={`p-4 space-y-3 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-muted-foreground">
            Search on KAYAK
          </span>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleFlightSearch}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Plane className="h-4 w-4 mr-2" />
            Flights
          </Button>
          <Button
            onClick={handleHotelSearch}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Hotel className="h-4 w-4 mr-2" />
            Hotels
          </Button>
          <Button
            onClick={handleFlightSearch}
            variant="default"
            className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Book Now
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Powered by{" "}
          <a
            href="https://www.kayak.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            KAYAK
          </a>
        </p>
      </Card>

      {/* Flights & Hotels Results Display */}
      {showFlights && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header with Tabs */}
            <div className="sticky top-0 bg-white border-b">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {activeTab === 'flights' ? (
                    <>
                      <Plane className="h-6 w-6 text-primary" />
                      Flights: {origin} → {destination}
                    </>
                  ) : (
                    <>
                      <Hotel className="h-6 w-6 text-primary" />
                      Hotels in {destination}
                    </>
                  )}
                </h2>
                <button
                  onClick={() => setShowFlights(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-4 p-4 border-b">
                <button
                  onClick={() => setActiveTab('flights')}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                    activeTab === 'flights'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground'
                  }`}
                >
                  <Plane className="h-4 w-4" />
                  Flights
                </button>
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                    activeTab === 'hotels'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground'
                  }`}
                >
                  <Hotel className="h-4 w-4" />
                  Hotels
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'flights' ? (
                // Flights Tab
                <>
                  {loading && activeTab === 'flights' ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Fetching flights...</p>
                      </div>
                    </div>
                  ) : flights.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">No flights found</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {flights.map((flight) => (
                        <div
                          key={flight.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            {/* Airline */}
                            <div>
                              <p className="font-semibold text-lg text-primary">
                                {flight.airline}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {flight.flightNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}
                              </p>
                            </div>

                            {/* Time & Duration */}
                            <div>
                              <p className="font-bold text-lg">{flight.departure}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {flight.duration}
                              </p>
                            </div>

                            {/* Arrow */}
                            <div className="text-center">
                              <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {flight.duration}
                              </p>
                            </div>

                            {/* Arrival */}
                            <div>
                              <p className="font-bold text-lg">{flight.arrival}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {passengers} passenger{passengers > 1 ? "s" : ""}
                              </p>
                            </div>

                            {/* Price & Book Button */}
                            <div className="flex flex-col items-end gap-2">
                              <div>
                                <p className="text-2xl font-bold text-accent">
                                  ₹{flight.price.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  total
                                </p>
                              </div>
                              <Button
                                onClick={() => handleBookNow(flight)}
                                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                                size="sm"
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Hotels Tab
                <>
                  {loading && activeTab === 'hotels' ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Fetching hotels...</p>
                      </div>
                    </div>
                  ) : hotels.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">No hotels found</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {hotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow flex gap-4"
                        >
                          {/* Hotel Image */}
                          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Hotel Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{hotel.name}</h3>
                                <p className="text-sm text-muted-foreground">{hotel.location}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold">{hotel.rating}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({hotel.reviews} reviews)
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Price & Book */}
                              <div className="text-right flex flex-col gap-2">
                                <div>
                                  {hotel.originalPrice && (
                                    <p className="text-xs line-through text-muted-foreground">
                                      ₹{hotel.originalPrice.toLocaleString()}
                                    </p>
                                  )}
                                  <p className="text-2xl font-bold text-accent">
                                    ₹{hotel.price.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">per night</p>
                                </div>
                                <Button
                                  onClick={() => handleHotelBooking(hotel)}
                                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                                  size="sm"
                                >
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KayakSearch;

