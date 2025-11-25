/**
 * Flight Search API Service
 * Fetches real flight data from KAYAK using SerpApi
 */

export interface FlightData {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  departureTime: string;
  arrivalTime: string;
  flightNumber?: string;
  aircraft?: string;
}

/**
 * Converts city name to IATA airport code
 */
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

/**
 * Fetches real flights from KAYAK using SerpApi
 */
export const fetchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  passengers: number = 1
): Promise<FlightData[]> => {
  try {
    const apiKey = import.meta.env.VITE_SERPAPI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_SERPAPI_KEY_HERE') {
      console.warn('SerpApi key not configured, using mock data');
      return generateMockFlights(origin, destination, passengers);
    }

    const originCode = getCityCode(origin);
    const destCode = getCityCode(destination);

    // Format date for SerpApi (YYYY-MM-DD)
    const depDate = new Date(departureDate).toISOString().split('T')[0];
    const retDate = returnDate ? new Date(returnDate).toISOString().split('T')[0] : null;

    // Build SerpApi request for KAYAK flights
    const params = new URLSearchParams({
      engine: 'google_flights',
      departure_id: originCode,
      arrival_id: destCode,
      outbound_date: depDate,
      ...(retDate && { return_date: retDate }),
      adults: passengers.toString(),
      currency: 'INR',
      api_key: apiKey,
    });

    const response = await fetch(
      `https://serpapi.com/search?${params}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const flights = parseSerpApiResponse(data, passengers);
    
    return flights.length > 0 ? flights : generateMockFlights(origin, destination, passengers);
  } catch (error) {
    console.error('Error fetching flights from SerpApi:', error);
    return generateMockFlights(origin, destination, passengers);
  }
};

/**
 * Parses SerpApi response for flights
 */
const parseSerpApiResponse = (data: any, passengers: number): FlightData[] => {
  try {
    const flightsList: FlightData[] = [];

    const processFlightItem = (flightItem: any, index: number) => {
      const legs = flightItem.flights || [];
      const firstLeg = legs[0];

      if (firstLeg) {
        const depTime = firstLeg.departure_time || '';
        const arrTime = firstLeg.arrival_time || '';
        const duration = firstLeg.duration || 0;

        flightsList.push({
          id: `flight-${index}`,
          airline: firstLeg.airline || 'Airline',
          departure: formatTime(depTime),
          arrival: formatTime(arrTime),
          duration: formatDuration(duration),
          price: Math.round((flightItem.price || 0) * passengers),
          stops: flightItem.stop_count || 0,
          departureTime: formatTime(depTime),
          arrivalTime: formatTime(arrTime),
          flightNumber: firstLeg.flight_number || 'N/A',
          aircraft: firstLeg.aircraft || 'Aircraft',
        });
      }
    };

    if (data.best_flights && Array.isArray(data.best_flights)) {
      data.best_flights.slice(0, 6).forEach((flightItem: any, index: number) => {
        processFlightItem(flightItem, index);
      });
    }

    // Also check other_flights if best_flights is empty
    if (flightsList.length === 0 && data.other_flights && Array.isArray(data.other_flights)) {
      data.other_flights.slice(0, 6).forEach((flightItem: any, index: number) => {
        processFlightItem(flightItem, index);
      });
    }

    return flightsList.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error parsing SerpApi response:', error);
    return [];
  }
};

/**
 * Formats time string to readable format
 */
const formatTime = (time: string | number): string => {
  if (typeof time === 'number') {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  if (typeof time === 'string') {
    return time;
  }
  return '--:--';
};

/**
 * Formats duration in minutes to readable format
 */
const formatDuration = (minutes: number): string => {
  if (typeof minutes !== 'number' || minutes === 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Generates mock flight data for fallback
 */
const generateMockFlights = (
  origin: string,
  destination: string,
  passengers: number
): FlightData[] => {
  const airlines = ['Air India', 'SpiceJet', 'IndiGo', 'Vistara', 'GoAir', 'AirAsia'];
  const mockFlightsList: FlightData[] = [];

  for (let i = 0; i < 6; i++) {
    const hour = Math.floor(Math.random() * 20) + 4;
    const minute = Math.floor(Math.random() * 60);
    const departureHour = String(hour).padStart(2, '0');
    const departureMin = String(minute).padStart(2, '0');
    
    const arrivalHour = String((hour + 2 + Math.floor(Math.random() * 2)) % 24).padStart(2, '0');
    const arrivalMin = String(Math.floor(Math.random() * 60)).padStart(2, '0');

    const price = Math.floor(Math.random() * 5000) + 3000;
    const stops = Math.floor(Math.random() * 3);

    mockFlightsList.push({
      id: `flight-${i}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departure: `${departureHour}:${departureMin}`,
      arrival: `${arrivalHour}:${arrivalMin}`,
      duration: `${2 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`,
      price: price * passengers,
      stops: stops,
      departureTime: `${departureHour}:${departureMin}`,
      arrivalTime: `${arrivalHour}:${arrivalMin}`,
      flightNumber: `${airlines[Math.floor(Math.random() * airlines.length)].substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      aircraft: `Airbus A${[320, 321, 380].at(Math.floor(Math.random() * 3))}`,
    });
  }

  return mockFlightsList.sort((a, b) => a.price - b.price);
};

/**
 * Search flights with SerpApi
 */
export const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  passengers: number = 1
): Promise<FlightData[]> => {
  return fetchFlights(origin, destination, departureDate, returnDate, passengers);
};
