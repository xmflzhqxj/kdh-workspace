import { Plane } from "lucide-react";
import { FLIGHTS } from "@/lib/trip-data";

function Barcode() {
  return (
    <div className="flex h-10 items-end gap-0.5" aria-hidden="true">
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          className="block bg-[#33334B]"
          style={{
            width: index % 5 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
            height: `${18 + ((index * 7) % 22)}px`,
            opacity: index % 4 === 0 ? 0.55 : 0.9,
          }}
        />
      ))}
    </div>
  );
}

function BoardingPass({ leg, passengerName, seatNumber }: { leg: typeof FLIGHTS.outbound; passengerName: string; seatNumber: string }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="grid gap-0 sm:grid-cols-[1fr_168px]">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Boarding Pass
              </p>
              <h3 className="mt-1 text-base font-semibold">{passengerName}</h3>
            </div>
            <span className="rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              {leg.date}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-foreground">{leg.from.code}</div>
              <div className="text-sm font-medium">{leg.from.time}</div>
              <div className="text-xs text-muted-foreground">{leg.from.city}</div>
            </div>
            <div className="flex min-w-24 flex-col items-center">
              <Plane className="h-4 w-4 text-primary" />
              <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="text-[11px] text-muted-foreground">{leg.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{leg.to.code}</div>
              <div className="text-sm font-medium">{leg.to.time}</div>
              <div className="text-xs text-muted-foreground">{leg.to.city}</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-md bg-secondary p-3 text-xs">
            <Info label="편명" value={leg.flight} />
            <Info label="좌석 등급" value={leg.cabin} />
            <Info label="탑승 시간" value={leg.boarding} />
            <Info label="좌석 번호" value={seatNumber} />
          </div>
        </div>

        <div className="border-t border-dashed border-border bg-[#F6F5FB] p-4 sm:border-l sm:border-t-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            PNR
          </div>
          <div className="font-mono text-2xl font-bold text-primary">{leg.pnr}</div>
          <div className="mt-4 text-[11px] text-muted-foreground">Passenger</div>
          <div className="text-sm font-semibold">{passengerName}</div>
          <div className="mt-4 border-t border-dashed border-border pt-3">
            <Barcode />
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export function FlightCard() {
  const passengers = ["동현", "민희"] as const;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-2">
        <h2 className="text-lg font-semibold">항공권 · {FLIGHTS.airline}</h2>
        <span className="text-[11px] text-muted-foreground">{FLIGHTS.baggage}</span>
      </div>

      <div className="space-y-3">
        <div className="px-1 text-sm font-bold text-primary">{FLIGHTS.outbound.label}</div>
        {passengers.map((p) => (
          <BoardingPass
            key={`outbound-${p}`}
            leg={FLIGHTS.outbound}
            passengerName={p}
            seatNumber={FLIGHTS.outbound.seats[p]}
          />
        ))}
      </div>

      <div className="space-y-3">
        <div className="px-1 text-sm font-bold text-primary">{FLIGHTS.inbound.label}</div>
        {passengers.map((p) => (
          <BoardingPass
            key={`inbound-${p}`}
            leg={FLIGHTS.inbound}
            passengerName={p}
            seatNumber={FLIGHTS.inbound.seats[p]}
          />
        ))}
      </div>
    </section>
  );
}
