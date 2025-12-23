import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { TrafficGrid, TrafficData } from "@/components/TrafficGrid";
import { StatsBar } from "@/components/StatsBar";
import { AlertTriangle, TrendingUp } from "lucide-react";

// Mock data for demonstration - will be replaced with real DB queries
const mockCongestedData: TrafficData[] = [
  { x: 12, y: 45, yellow: 5, red: 12, dark_red: 3, ts: new Date().toISOString() },
  { x: 8, y: 22, yellow: 8, red: 15, dark_red: 0, ts: new Date().toISOString() },
  { x: 34, y: 67, yellow: 20, red: 8, dark_red: 2, ts: new Date().toISOString() },
  { x: 5, y: 11, yellow: 15, red: 0, dark_red: 0, ts: new Date().toISOString() },
  { x: 28, y: 39, yellow: 3, red: 22, dark_red: 5, ts: new Date().toISOString() },
  { x: 41, y: 55, yellow: 10, red: 5, dark_red: 0, ts: new Date().toISOString() },
];

const mockUnusualData: TrafficData[] = [
  { x: 3, y: 88, yellow: 2, red: 0, dark_red: 8, ts: new Date().toISOString() },
  { x: 56, y: 12, yellow: 0, red: 25, dark_red: 10, ts: new Date().toISOString() },
  { x: 19, y: 73, yellow: 1, red: 3, dark_red: 15, ts: new Date().toISOString() },
  { x: 44, y: 29, yellow: 0, red: 18, dark_red: 7, ts: new Date().toISOString() },
];

export default function Index() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState("congested");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Implement actual data refresh from Neon Postgres
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const currentData = activeTab === "congested" ? mockCongestedData : mockUnusualData;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      <main className="container py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="congested" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Congested Grids
            </TabsTrigger>
            <TabsTrigger value="unusual" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Unusual Traffic
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <StatsBar data={currentData} />
          </div>

          <TabsContent value="congested">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Congested Grids</h2>
                  <p className="text-sm text-muted-foreground">
                    Grids experiencing high traffic volume
                  </p>
                </div>
              </div>
              <TrafficGrid
                data={mockCongestedData}
                isLoading={isRefreshing}
                emptyMessage="No congested grids detected"
              />
            </div>
          </TabsContent>

          <TabsContent value="unusual">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Unusual Traffic Grids</h2>
                  <p className="text-sm text-muted-foreground">
                    Grids with anomalous traffic patterns
                  </p>
                </div>
              </div>
              <TrafficGrid
                data={mockUnusualData}
                isLoading={isRefreshing}
                emptyMessage="No unusual traffic patterns detected"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border py-4 mt-8">
        <div className="container text-center text-xs text-muted-foreground">
          Traffic Dashboard • Connected to Neon Postgres (readonly)
        </div>
      </footer>
    </div>
  );
}
