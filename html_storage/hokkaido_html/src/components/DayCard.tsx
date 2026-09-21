import { Car, MapPin, Moon } from "lucide-react";
import { clusterPlaces, type DayPlan, type Place } from "@/lib/trip-data";

export function DayCard({
  day,
  onPlaceSelect,
}: {
  day: DayPlan;
  onPlaceSelect: (place: Place) => void;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Day {day.day} · {day.date}
          </div>
          <h3 className="mt-1 text-xl font-semibold">{day.title}</h3>
          <p className="text-sm text-muted-foreground">{day.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-[11px] sm:justify-end">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
              day.hasCar ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            <Car className="h-3 w-3" />
            {day.hasCar ? "렌터카" : "차량 없음"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-accent-foreground">
            <Moon className="h-3 w-3" />
            {day.stay}
          </span>
        </div>
      </header>

      <ol className="relative space-y-4 border-l border-border pl-5">
        {day.blocks.map((block, index) => (
          <li key={`${block.time}-${index}`} className="relative">
            <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-[var(--shadow-glow)]" />
            <div className="font-mono text-xs font-semibold text-primary">{block.time}</div>
            <div className="text-sm font-medium">{block.title}</div>
            {block.detail && (
              <div className="mt-0.5 text-xs text-muted-foreground">{block.detail}</div>
            )}
            {block.places && (
              <div className="mt-3 space-y-3">
                {clusterPlaces(block.places).map(([region, places]) => (
                  <div key={region} className="rounded-md border border-border bg-background/70 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                      <MapPin className="h-3 w-3" />
                      {region}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {places.map((place) => (
                        <button
                          key={place.name}
                          type="button"
                          onClick={() => onPlaceSelect(place)}
                          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-left text-xs transition hover:border-primary hover:bg-accent active:scale-95"
                        >
                          <span className="mr-1.5 text-[10px] text-muted-foreground">{place.tag}</span>
                          {place.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}
