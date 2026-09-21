import { Car, ExternalLink } from "lucide-react";
import { RENTAL } from "@/lib/trip-data";
import { toGoogleOpenUrl } from "./DayMap";

export function RentalCard() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">렌터카 · {RENTAL.company}</h2>
      <div className="rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">예약번호</div>
            <div className="font-mono text-lg font-semibold text-primary">{RENTAL.code}</div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Car className="h-3.5 w-3.5" />
            {RENTAL.carClass}
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <Row label="수령" value={`${RENTAL.pickupAt} · ${RENTAL.pickup}`} />
          <Row label="반납" value={`${RENTAL.dropoffAt} · ${RENTAL.dropoff}`} />
          <Row label="옵션" value={RENTAL.options.join(" · ")} />
          <Row label="결제" value={RENTAL.price} />
        </div>

        <a
          href={toGoogleOpenUrl(RENTAL.map_location)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          지도에서 열기
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-12 shrink-0 text-muted-foreground">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
