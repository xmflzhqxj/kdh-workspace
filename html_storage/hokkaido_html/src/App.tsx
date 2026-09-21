import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarDays, CheckSquare, Info, MapPinned } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlightCard } from "@/components/FlightCard";
import { RentalCard } from "@/components/RentalCard";
import { PackingChecklist } from "@/components/PackingChecklist";
import { DayCard } from "@/components/DayCard";
import { DayMap } from "@/components/DayMap";
import { DAYS, TRIP, type DayPlan } from "@/lib/trip-data";

const queryClient = new QueryClient();

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DayPlan>(DAYS[0]);
  const [selectedMapLocation, setSelectedMapLocation] = useState(DAYS[0].map_location);
  const [mapTitle, setMapTitle] = useState(DAYS[0].title);

  function chooseDay(day: DayPlan) {
    setSelectedDay(day);
    setSelectedMapLocation(day.map_location);
    setMapTitle(day.title);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen pb-20 bg-background text-foreground">
          <header className="border-b border-border bg-[image:var(--gradient-hero)]">
            <div className="mx-auto max-w-5xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                <MapPinned className="h-3.5 w-3.5" />
                Summer 2026
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {TRIP.title} <span aria-hidden="true">💜</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {TRIP.subtitle}
              </p>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 pt-5 sm:px-6">
            <DayMap title={mapTitle} mapLocation={selectedMapLocation} />

            <Tabs defaultValue="schedule" className="mt-5 w-full">
              <TabsList className="sticky top-2 z-20 grid h-auto w-full grid-cols-3 border border-border bg-white/90 p-1 shadow-sm backdrop-blur">
                <TabsTrigger value="schedule" className="gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  일정
                </TabsTrigger>
                <TabsTrigger value="info" className="gap-1.5">
                  <Info className="h-4 w-4" />
                  예약 정보
                </TabsTrigger>
                <TabsTrigger value="packing" className="gap-1.5">
                  <CheckSquare className="h-4 w-4" />
                  체크리스트
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="mt-5 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map((day) => {
                    const active = day.day === selectedDay.day;
                    return (
                      <button
                        key={day.day}
                        type="button"
                        onClick={() => chooseDay(day)}
                        className={`rounded-lg border px-2 py-3 text-center transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                            : "border-border bg-card text-foreground hover:border-primary hover:bg-accent"
                        }`}
                        aria-pressed={active}
                      >
                        <div className="text-xs font-semibold">Day {day.day}</div>
                        <div className="mt-0.5 text-sm font-bold">{day.weekday}</div>
                      </button>
                    );
                  })}
                </div>

                <DayCard
                  day={selectedDay}
                  onPlaceSelect={(place) => {
                    setSelectedMapLocation(place.map_location);
                    setMapTitle(place.name);
                  }}
                />
              </TabsContent>

              <TabsContent value="info" className="mt-5 space-y-6">
                <FlightCard />
                <RentalCard />
              </TabsContent>

              <TabsContent value="packing" className="mt-5">
                <PackingChecklist />
              </TabsContent>
            </Tabs>
          </main>

          <Toaster theme="light" position="top-center" richColors />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}