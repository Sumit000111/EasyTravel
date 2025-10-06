import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const destinations = [
  {
    name: "Delhi",
    description: "India's capital - a blend of ancient monuments and modern culture",
    avgCost: "₹15,000 - ₹25,000",
    bestTime: "October - March",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
    highlights: ["Red Fort", "India Gate", "Qutub Minar"],
  },
  {
    name: "Jaipur",
    description: "The Pink City - magnificent forts and royal palaces",
    avgCost: "₹12,000 - ₹20,000",
    bestTime: "November - February",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    highlights: ["Hawa Mahal", "Amber Fort", "City Palace"],
  },
  {
    name: "Goa",
    description: "Beach paradise - Portuguese heritage and vibrant nightlife",
    avgCost: "₹20,000 - ₹35,000",
    bestTime: "November - February",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    highlights: ["Beaches", "Dudhsagar Falls", "Old Goa Churches"],
  },
  {
    name: "Kerala",
    description: "God's Own Country - backwaters, beaches, and hill stations",
    avgCost: "₹18,000 - ₹30,000",
    bestTime: "September - March",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    highlights: ["Backwaters", "Munnar", "Kovalam Beach"],
  },
  {
    name: "Manali",
    description: "Mountain retreat - adventure sports and scenic beauty",
    avgCost: "₹15,000 - ₹28,000",
    bestTime: "March - June, September - January",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    highlights: ["Rohtang Pass", "Solang Valley", "Hidimba Temple"],
  },
  {
    name: "Rishikesh",
    description: "Yoga capital - spiritual retreat and adventure hub",
    avgCost: "₹10,000 - ₹18,000",
    bestTime: "September - November, March - May",
    image: "https://images.unsplash.com/photo-1591995930744-d92b1e80b0c3?w=800",
    highlights: ["Laxman Jhula", "River Rafting", "Beatles Ashram"],
  },
  {
    name: "Shimla",
    description: "Queen of Hills - colonial charm and pine forests",
    avgCost: "₹12,000 - ₹22,000",
    bestTime: "March - June, December - January",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
    highlights: ["The Ridge", "Mall Road", "Jakhu Temple"],
  },
  {
    name: "Udaipur",
    description: "City of Lakes - romantic palaces and heritage",
    avgCost: "₹14,000 - ₹24,000",
    bestTime: "September - March",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    highlights: ["Lake Palace", "City Palace", "Fateh Sagar Lake"],
  },
];

const Explore = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar user={user} />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">
              Explore <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">India</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most beautiful destinations across India - from mountains to beaches, heritage to adventure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <Card 
                key={destination.name} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={`${destination.name} - ${destination.description}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {destination.name}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground">{destination.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium">Average Cost:</span>
                      <span className="text-muted-foreground">{destination.avgCost}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="font-medium">Best Time:</span>
                      <span className="text-muted-foreground">{destination.bestTime}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary mt-1" />
                      <div className="flex-1">
                        <span className="font-medium">Top Attractions:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {destination.highlights.map((highlight) => (
                            <Badge key={highlight} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
