import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Calendar, DollarSign, MapPin, Plane, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const destinations = [
  "Delhi", "Jaipur", "Goa", "Kerala", "Manali", "Rishikesh", 
  "Shimla", "Udaipur", "Mumbai", "Bangalore", "Kolkata", "Chennai"
];

const tripSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z.number().min(1000, "Budget must be at least ₹1,000"),
});

const PlanTrip = () => {
  const [user, setUser] = useState<any>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetNum = parseFloat(budget);
      
      tripSchema.parse({
        origin,
        destination,
        startDate,
        endDate,
        budget: budgetNum,
      });

      const days = calculateDays();
      
      if (days < 1) {
        toast({
          title: "Invalid dates",
          description: "End date must be after start date",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Generate itinerary using AI
      const { data: itineraryData, error: itineraryError } = await supabase.functions.invoke('generate-itinerary', {
        body: { destination, days, budget: budgetNum }
      });

      if (itineraryError) {
        throw itineraryError;
      }

      // Calculate budget breakdown
      const transportCost = budgetNum * 0.4;
      const stayCost = budgetNum * 0.35;
      const foodCost = budgetNum * 0.15;
      const activitiesCost = budgetNum * 0.1;

      // Save trip to database
      const { error: dbError } = await supabase.from('trips').insert({
        user_id: user.id,
        destination,
        origin,
        start_date: startDate,
        end_date: endDate,
        budget: budgetNum,
        itinerary: itineraryData.itinerary,
        transport_cost: transportCost,
        stay_cost: stayCost,
        food_cost: foodCost,
        activities_cost: activitiesCost,
      });

      if (dbError) throw dbError;

      toast({
        title: "Trip planned successfully!",
        description: "Your itinerary has been generated and saved",
      });

      navigate("/dashboard");

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error planning trip",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar user={user} />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4">
              Plan Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Trip</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Let AI create a perfect itinerary for your Indian adventure
            </p>
          </div>

          <Card className="p-8 animate-slide-up">
            <form onSubmit={handlePlanTrip} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Origin City
                </label>
                <Input
                  placeholder="Enter your city"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Plane className="h-4 w-4 text-accent" />
                  Destination
                </label>
                <Select value={destination} onValueChange={setDestination} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Total Budget (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Enter your budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="1000"
                  step="1000"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Budget will be allocated: 40% transport, 35% stay, 15% food, 10% activities
                </p>
              </div>

              {calculateDays() > 0 && (
                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium">
                    Trip Duration: <span className="text-accent">{calculateDays()} days</span>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Perfect Itinerary...
                  </>
                ) : (
                  "Generate Trip Plan"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PlanTrip;
