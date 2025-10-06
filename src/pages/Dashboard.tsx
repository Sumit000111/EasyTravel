import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Calendar, DollarSign, MapPin, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Trip {
  id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  budget: number;
  itinerary: any;
  transport_cost: number;
  stay_cost: number;
  food_cost: number;
  activities_cost: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadTrips(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadTrips(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadTrips = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      toast({
        title: "Error loading trips",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      const { error } = await supabase.from('trips').delete().eq('id', tripId);
      if (error) throw error;

      setTrips(trips.filter(trip => trip.id !== tripId));
      toast({
        title: "Trip deleted",
        description: "Your trip has been removed",
      });
    } catch (error) {
      toast({
        title: "Error deleting trip",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar user={user} />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-bold mb-2">
                Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Trips</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and view all your planned adventures
              </p>
            </div>
            <Button
              onClick={() => navigate("/plan")}
              className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
            >
              Plan New Trip
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <Card className="p-12 text-center animate-fade-in">
              <p className="text-xl text-muted-foreground mb-4">No trips planned yet</p>
              <Button
                onClick={() => navigate("/plan")}
                className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                Plan Your First Trip
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <Card
                  key={trip.id}
                  className="p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{trip.destination}</h3>
                      <p className="text-sm text-muted-foreground">from {trip.origin}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                      {formatCurrency(trip.budget)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <DollarSign className="h-3 w-3 text-primary" />
                        <span>Transport: {formatCurrency(trip.transport_cost)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <DollarSign className="h-3 w-3 text-accent" />
                        <span>Stay: {formatCurrency(trip.stay_cost)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <DollarSign className="h-3 w-3 text-primary" />
                        <span>Food: {formatCurrency(trip.food_cost)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <DollarSign className="h-3 w-3 text-accent" />
                        <span>Activities: {formatCurrency(trip.activities_cost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setSelectedTrip(trip)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Itinerary
                    </Button>
                    <Button
                      onClick={() => deleteTrip(trip.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedTrip?.destination} Itinerary
            </DialogTitle>
            <DialogDescription>
              {selectedTrip && `${formatDate(selectedTrip.start_date)} - ${formatDate(selectedTrip.end_date)}`}
            </DialogDescription>
          </DialogHeader>

          {selectedTrip?.itinerary && (
            <div className="space-y-6">
              {selectedTrip.itinerary.days?.map((day: any) => (
                <Card key={day.day} className="p-4">
                  <h4 className="font-bold text-lg mb-2">Day {day.day}: {day.title}</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Morning:</strong> {day.morning}</p>
                    <p><strong>Afternoon:</strong> {day.afternoon}</p>
                    <p><strong>Evening:</strong> {day.evening}</p>
                    <p className="text-primary font-medium">
                      Estimated Cost: {formatCurrency(day.estimated_cost)}
                    </p>
                  </div>
                </Card>
              ))}

              {selectedTrip.itinerary.tips && (
                <Card className="p-4 bg-accent/10">
                  <h4 className="font-bold mb-2">Travel Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedTrip.itinerary.tips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
