# EasyTravel

**EasyTravel** is an AI-powered, Indian-focused travel planner that helps users explore India smartly. It generates **budget-friendly itineraries**, fetches flights, hotels, and attractions, and creates day-wise plans so users can travel hassle-free.

---

## 🌍 Features

- **Indian Destinations Only** – Explore top cities like Delhi, Jaipur, Goa, Manali, Kerala, Rishikesh, Shimla, and more.  
- **Trip Planner** – Users input origin, destination, dates, and budget in ₹. The app finds the cheapest combination of flights, hotels, and activities.  
- **AI Itinerary Generator** – Uses Gemini/OpenAI API to generate personalized day-wise itineraries.  
- **Explore India Page** – Browse top destinations with images, descriptions, average cost, and best time to visit.  
- **Dashboard** – View saved trips, itineraries, and total budget breakdown.  
- **Budget Optimizer** – Automatically divides the budget (40% travel, 35% stay, 15% food, 10% activities).  
- **KAYAK Integration** – Direct access to search flights and hotels on KAYAK, the world's leading travel search engine.  
- **Responsive UI** – Modern, mobile-friendly design using Tailwind CSS with an Indian-themed color palette.  

---

## 🛠 Tech Stack

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Supabase (Functions + Database)  
- **Database:** Supabase PostgreSQL  
- **APIs & Integrations:**  
  - KAYAK → Flight and hotel search integration ([GitHub](https://github.com/kayak))  
  - Gemini/OpenAI API → AI-generated itineraries  
  - Google Places API → Indian attractions  

---

## 🔗 KAYAK Integration

This application integrates with [KAYAK](https://www.kayak.com), a leading travel search engine, to provide users with direct access to search for flights and hotels. The integration includes:

- **Flight Search**: Pre-filled search URLs for flights from origin to destination with selected dates
- **Hotel Search**: Pre-filled search URLs for hotels at the destination with check-in/check-out dates
- **Seamless Experience**: One-click access to KAYAK search results from the trip planning and dashboard pages

The KAYAK integration is powered by their search engine technology, allowing users to compare prices across multiple airlines and hotels to find the best deals for their Indian travel adventures.

---

## 📂 Project Structure

![EasyTravel Banner](https://via.placeholder.com/800x200?text=EasyTravel+%E2%9C%8D%EF%B8%8F+India+Edition)

**EasyTravel** is an AI-powered, Indian-focused travel planner that helps users explore India smartly. It generates **budget-friendly itineraries**, fetches flights, hotels, and attractions, and creates day-wise plans so users can travel hassle-free.

---

## 🌍 Features

- **Indian Destinations Only** – Explore top cities like Delhi, Jaipur, Goa, Manali, Kerala, Rishikesh, Shimla, and more.  
- **Trip Planner** – Users input origin, destination, dates, and budget in ₹. The app finds the cheapest combination of flights, hotels, and activities.  
- **AI Itinerary Generator** – Uses Gemini/OpenAI API to generate personalized day-wise itineraries.  
- **Explore India Page** – Browse top destinations with images, descriptions, average cost, and best time to visit.  
- **Dashboard** – View saved trips, itineraries, and total budget breakdown.  
- **Budget Optimizer** – Automatically divides the budget (40% travel, 35% stay, 15% food, 10% activities).  
- **Responsive UI** – Modern, mobile-friendly design using Tailwind CSS with an Indian-themed color palette.  

---

## 🛠 Tech Stack

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Atlas)  
- **APIs:**  
  - Google Places API → Indian attractions  
  - Skyscanner API → Flights in India  
  - Booking.com API → Hotels in India  
  - Gemini/OpenAI API → AI-generated itineraries  

---

## 📂 Project Structure

- `src/services/kayak.ts` - KAYAK integration service for generating search URLs
- `src/components/KayakSearch.tsx` - Reusable KAYAK search component
- `src/pages/PlanTrip.tsx` - Trip planning page with KAYAK integration
- `src/pages/Dashboard.tsx` - Dashboard with KAYAK search for each trip  
