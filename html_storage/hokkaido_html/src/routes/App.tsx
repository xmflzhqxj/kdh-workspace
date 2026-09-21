import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { FlightCard } from "@/components/FlightCard";
import { RentalCard } from "@/components/RentalCard";
import { PackingChecklist } from "@/components/PackingChecklist";
import { DayCard } from "@/components/DayCard";
import { DayMap } from "@/components/DayMap";
import { DAYS, TRIP } from "@/lib/trip-data";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background pb-24 pt-10 text-foreground">
          <main className="container mx-auto max-w-3xl space-y-12 px-4 sm:px-6">
            {/* 헤더 섹션 */}
            <header className="space-y-2 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                {TRIP.title}
              </h1>
              <p className="text-sm font-medium text-muted-foreground sm:text-base">
                {TRIP.subtitle}
              </p>
            </header>

            {/* 메인 콘텐츠 컴포넌트들 */}
            <FlightCard />
            <RentalCard />
            
            <section className="space-y-6">
              <h2 className="border-b border-border pb-2 text-2xl font-bold">일정 및 지도</h2>
              {DAYS.map((day) => (
                <div key={day.day} className="space-y-6">
                  <DayCard day={day} onPlaceSelect={() => {}} />
                  <DayMap title={day.title} mapLocation={day.map_location} />
                </div>
              ))}
            </section>

            <PackingChecklist />
          </main>
        </div>
        <Toaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}