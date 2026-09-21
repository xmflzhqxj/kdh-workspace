import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

function extractMapQuery(mapLocation: string) {
  const value = mapLocation.trim();
  if (!/^https?:\/\//i.test(value)) return value;

  try {
    const url = new URL(value);
    const query = url.searchParams.get("q") ?? url.searchParams.get("query");
    if (query) return query;

    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));

    return decodeURIComponent(url.pathname.split("/").filter(Boolean).pop()?.replace(/\+/g, " ") ?? value);
  } catch {
    return value;
  }
}

export function toGoogleEmbedUrl(mapLocation: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(extractMapQuery(mapLocation))}&output=embed`;
}

export function toGoogleOpenUrl(mapLocation: string) {
  if (/^https?:\/\//i.test(mapLocation)) return mapLocation;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation)}`;
}

export function DayMap({
  title,
  mapLocation,
}: {
  title: string;
  mapLocation: string;
}) {
  const embedUrl = toGoogleEmbedUrl(mapLocation);
  const openUrl = toGoogleOpenUrl(mapLocation);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white/88 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <MapPin className="h-3.5 w-3.5" />
            Live Map
          </div>
          <h2 className="mt-1 text-lg font-semibold text-foreground">{title}</h2>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={openUrl} target="_blank" rel="noreferrer">
            Google Maps
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
      <iframe
        key={embedUrl}
        title={`${title} Google Map`}
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[320px] w-full border-0 sm:h-[420px]"
      />
    </section>
  );
}
