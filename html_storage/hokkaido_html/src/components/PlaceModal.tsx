import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin } from "lucide-react";
import type { Place } from "@/lib/trip-data";
import { toGoogleOpenUrl } from "./DayMap";

export function PlaceModal({
  place,
  open,
  onOpenChange,
}: {
  place: Place | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!place) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <MapPin className="h-3.5 w-3.5" />
            {place.tag ?? "장소"}
          </div>
          <DialogTitle className="text-2xl">{place.name}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {place.desc}
          </DialogDescription>
        </DialogHeader>
        <Button asChild className="w-full">
          <a href={toGoogleOpenUrl(place.map_location)} target="_blank" rel="noreferrer">
            Google Maps에서 열기
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
