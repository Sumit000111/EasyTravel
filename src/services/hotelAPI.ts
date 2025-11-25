/**
 * Hotel Search API Service
 * Fetches real hotel data from KAYAK using SerpApi
 */

export interface HotelData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  originalPrice?: number;
  image?: string;
  amenities: string[];
}

/**
 * Fetches real hotels from KAYAK using SerpApi
 */
export const fetchHotels = async (
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number = 2
): Promise<HotelData[]> => {
  try {
    const apiKey = import.meta.env.VITE_SERPAPI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_SERPAPI_KEY_HERE') {
      console.warn('SerpApi key not configured, using mock data');
      return generateMockHotels(destination, guests);
    }

    // Format dates for SerpApi
    const checkInDate = new Date(checkIn).toISOString().split('T')[0];
    const checkOutDate = new Date(checkOut).toISOString().split('T')[0];

    // Build SerpApi request for hotel search
    const params = new URLSearchParams({
      engine: 'google_hotels',
      q: destination,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adults: guests.toString(),
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
    const hotels = parseSerpApiHotelResponse(data);
    
    return hotels.length > 0 ? hotels : generateMockHotels(destination, guests);
  } catch (error) {
    console.error('Error fetching hotels from SerpApi:', error);
    return generateMockHotels(destination, guests);
  }
};

/**
 * Parses SerpApi hotel response
 */
const parseSerpApiHotelResponse = (data: any): HotelData[] => {
  try {
    const hotels: HotelData[] = [];

    if (data.properties && Array.isArray(data.properties)) {
      data.properties.slice(0, 8).forEach((hotel: any, index: number) => {
        if (hotel.title && hotel.price) {
          const priceText = hotel.price || '₹0';
          const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

          hotels.push({
            id: `hotel-${index}`,
            name: hotel.title || 'Hotel',
            rating: parseFloat(hotel.rating) || 4.0,
            reviews: parseInt(hotel.review_count) || 0,
            location: hotel.location || 'India',
            price: price || 0,
            originalPrice: hotel.serpapi_pagination?.original_price ? parseFloat(hotel.serpapi_pagination.original_price) : undefined,
            image: hotel.image || '',
            amenities: hotel.amenities || [],
          });
        }
      });
    }

    return hotels.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error('Error parsing SerpApi hotel response:', error);
    return [];
  }
};

/**
 * Generates mock hotel data for fallback
 */
const generateMockHotels = (destination: string, guests: number): HotelData[] => {
  const hotels: HotelData[] = [
    {
      id: 'hotel-1',
      name: 'The Grand Palace',
      rating: 4.8,
      reviews: 1250,
      location: destination,
      price: 4500,
      originalPrice: 5500,
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'AC'],
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    },
    {
      id: 'hotel-2',
      name: 'Sunset Resort',
      rating: 4.6,
      reviews: 892,
      location: destination,
      price: 3200,
      originalPrice: 4000,
      amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Spa', 'AC'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: 'hotel-3',
      name: 'Royal Heritage Hotel',
      rating: 4.5,
      reviews: 756,
      location: destination,
      price: 2800,
      amenities: ['WiFi', 'Gym', 'Restaurant', 'AC', 'Parking'],
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
    },
    {
      id: 'hotel-4',
      name: 'Budget Stay Inn',
      rating: 4.2,
      reviews: 543,
      location: destination,
      price: 1500,
      amenities: ['WiFi', 'Restaurant', 'AC', 'Parking'],
      image: 'https://images.unsplash.com/photo-1570129477492-45f003313e78?w=400',
    },
    {
      id: 'hotel-5',
      name: 'Luxury Towers',
      rating: 4.9,
      reviews: 2100,
      location: destination,
      price: 7500,
      originalPrice: 9000,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Valet'],
      image: 'https://images.unsplash.com/photo-1561501900-d3fee871d55e?w=400',
    },
    {
      id: 'hotel-6',
      name: 'Comfort Plaza',
      rating: 4.4,
      reviews: 634,
      location: destination,
      price: 2200,
      amenities: ['WiFi', 'Restaurant', 'AC', 'TV'],
      image: 'https://images.unsplash.com/photo-1578898657097-f4ae319b0359?w=400',
    },
    {
      id: 'hotel-7',
      name: 'Mountain View Resort',
      rating: 4.7,
      reviews: 1456,
      location: destination,
      price: 5800,
      originalPrice: 7200,
      amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Gym', 'AC'],
      image: 'https://images.unsplash.com/photo-1582719508461-905a9c344e3b?w=400',
    },
    {
      id: 'hotel-8',
      name: 'City Central Hotel',
      rating: 4.3,
      reviews: 789,
      location: destination,
      price: 2600,
      amenities: ['WiFi', 'Restaurant', 'AC', 'Business Center'],
      image: 'https://images.unsplash.com/photo-1515877152452-18e92d2b26b2?w=400',
    },
  ];

  return hotels.sort((a, b) => a.price - b.price);
};

/**
 * Search hotels with SerpApi
 */
export const searchHotels = async (
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number = 2
): Promise<HotelData[]> => {
  return fetchHotels(destination, checkIn, checkOut, guests);
};
