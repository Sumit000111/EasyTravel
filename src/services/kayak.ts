/**
 * KAYAK Integration Service
 * 
 * KAYAK is a leading travel search engine that helps users find flights, hotels, and more.
 * This service generates KAYAK search URLs with pre-filled parameters for seamless integration.
 * 
 * Reference: https://github.com/kayak
 */

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  cabin?: 'economy' | 'business' | 'first';
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  rooms?: number;
}

/**
 * Converts city name to IATA airport code (simplified mapping for Indian cities)
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
    'kerala': 'COK', // Cochin
    'manali': 'KUU', // Kullu-Manali
    'rishikesh': 'DED', // Dehradun (nearest)
    'shimla': 'SLV', // Shimla
    'udaipur': 'UDR',
  };

  const normalizedCity = city.toLowerCase().trim();
  return cityMap[normalizedCity] || city.toUpperCase().substring(0, 3);
};

/**
 * Formats date for KAYAK URL (YYYY-MM-DD)
 */
const formatDateForKayak = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generates KAYAK flight search URL
 * 
 * @param params Flight search parameters
 * @returns KAYAK flight search URL
 */
export const generateKayakFlightUrl = (params: FlightSearchParams): string => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers = 1,
    cabin = 'economy'
  } = params;

  const originCode = getCityCode(origin);
  const destCode = getCityCode(destination);
  const depDate = formatDateForKayak(departureDate);
  const retDate = returnDate ? formatDateForKayak(returnDate) : '';

  // KAYAK flight search URL structure
  const baseUrl = 'https://www.kayak.com/flights';
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    origin: originCode,
    destination: destCode,
    departdate: depDate,
    ...(retDate && { returndate: retDate }),
    passengers: passengers.toString(),
    cabin: cabin,
    sort: 'bestflight_a', // Sort by best flights
  });

  return `${baseUrl}/${originCode}-${destCode}/${depDate}${retDate ? `/${retDate}` : ''}?${queryParams.toString()}`;
};

/**
 * Generates KAYAK hotel search URL
 * 
 * @param params Hotel search parameters
 * @returns KAYAK hotel search URL
 */
export const generateKayakHotelUrl = (params: HotelSearchParams): string => {
  const {
    destination,
    checkIn,
    checkOut,
    guests = 2,
    rooms = 1
  } = params;

  const checkInDate = formatDateForKayak(checkIn);
  const checkOutDate = formatDateForKayak(checkOut);

  // KAYAK hotel search URL structure
  const baseUrl = 'https://www.kayak.com/hotels';
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    destination: destination,
    checkin: checkInDate,
    checkout: checkOutDate,
    guests: guests.toString(),
    rooms: rooms.toString(),
    sort: 'rank_a', // Sort by best value
  });

  return `${baseUrl}/${encodeURIComponent(destination)}/${checkInDate}/${checkOutDate}?${queryParams.toString()}`;
};

/**
 * Opens KAYAK search in a new window
 */
export const openKayakSearch = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Generates both flight and hotel URLs for a complete trip
 */
export const generateTripSearchUrls = (
  origin: string,
  destination: string,
  startDate: string,
  endDate: string,
  passengers: number = 1
) => {
  return {
    flights: generateKayakFlightUrl({
      origin,
      destination,
      departureDate: startDate,
      returnDate: endDate,
      passengers,
    }),
    hotels: generateKayakHotelUrl({
      destination,
      checkIn: startDate,
      checkOut: endDate,
      guests: passengers,
    }),
  };
};

