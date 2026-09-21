// [!IMPORTANT] Supabase Schema Cache 에러 해결 방법
// 테이블을 생성한 직후 앱에서 "Could not find the table 'public.checklist' in the schema cache" 오류가 발생할 수 있습니다.
// 이는 PostgREST의 스키마 캐시 문제이므로, Supabase SQL Editor에서 아래 명령어를 한 줄 실행하시면 즉시 해결됩니다.
// NOTIFY pgrst, 'reload schema';

export type Owner = "동현" | "민희" | "공통";

export type Place = {
  name: string;
  desc: string;
  map_location: string;
  tag?: string;
  addressHint?: string;
};

export type PlanBlock = {
  time: string;
  title: string;
  detail?: string;
  places?: Place[];
};

export type DayPlan = {
  day: number;
  weekday: string;
  date: string;
  title: string;
  subtitle: string;
  hasCar: boolean;
  stay: string;
  map_location: string;
  blocks: PlanBlock[];
};

export type ChecklistSeed = {
  item: string;
  owner: Owner;
  category: "packing" | "souvenir";
  is_completed?: boolean;
  details?: string | null;
};

export const SUPABASE_TABLES = {
  places: "travel_places",
  checklist: "checklist",
} as const;

export const TRIP = {
  title: "HOKKAIDO SUMMER TRIP",
  subtitle: "2026.08.03 - 08.06 | 홋카이도 3박 4일 여름 여행",
};

export const FLIGHTS = {
  airline: "파라타 항공",
  baggage: "무료 위탁 수하물 15kg 포함",
  outbound: {
    label: "예약 1 · 가는 편",
    pnr: "AJA2M7",
    date: "2026.08.03 (월)",
    flight: "WE531",
    cabin: "Economy",
    boarding: "10:20",
    duration: "2h 45m",
    seats: { 동현: "-", 민희: "-" },
    from: { code: "ICN", city: "인천 T1", time: "11:00" },
    to: { code: "CTS", city: "신치토세", time: "13:45" },
  },
  inbound: {
    label: "예약 2 · 오는 편",
    pnr: "C5Y835",
    date: "2026.08.06 (목)",
    flight: "WE532",
    cabin: "Economy",
    boarding: "14:25",
    duration: "3h 05m",
    seats: { 동현: "-", 민희: "-" },
    from: { code: "CTS", city: "신치토세", time: "15:05" },
    to: { code: "ICN", city: "인천 T1", time: "18:10" },
  },
};

export const RENTAL = {
  company: "타임즈 카 렌탈 (Times Car Rental)",
  code: "202601181925",
  carClass: "C-1 소형 오토",
  pickup: "삿포로 오도리 시계탑 앞 지점",
  dropoff: "삿포로 오도리 시계탑 앞 지점",
  pickupAt: "2026.08.04 09:00",
  dropoffAt: "2026.08.05 18:00",
  options: ["ETC 카드 대여", "Hokkaido Expressway Pass (HEP)"],
  price: "JPY 19,443 · 현장 신용카드 결제",
  map_location: "Times Car Rental Sapporo Odori",
};

export const DAYS: DayPlan[] = [
  {
    day: 1,
    weekday: "월",
    date: "8/3 (월)",
    title: "삿포로 시내",
    subtitle: "신치토세공항 도착 및 숙소 이동",
    hasCar: false,
    stay: "LAMP LIGHT BOOKS HOTEL sapporo (체크인 15:00)",
    map_location: "LAMP LIGHT BOOKS HOTEL sapporo",
    blocks: [
      { time: "13:45", title: "신치토세공항 도착", detail: "입국 수속" },
      { time: "15:00 이후", title: "숙소 체크인", detail: "LAMP LIGHT BOOKS HOTEL sapporo (중앙구 미나미 2조 니시 7초메 5-1)" },
    ],
  },
  {
    day: 2,
    weekday: "화",
    date: "8/4 (화)",
    title: "비에이 & 후라노",
    subtitle: "렌터카 수령 후 HEP 고속도로로 여름 풍경 드라이브",
    hasCar: true,
    stay: "Ninguruforet Villa (체크인 15:00)",
    map_location: "Ninguruforet Villa Shirogane Blue Pond Shirahige Falls Farm Tomita",
    blocks: [
      {
        time: "09:00",
        title: "숙소 출발 & 렌터카 수령",
        detail: "아침 9시 숙소 출발 후 Times Car Rental 삿포로 오도리점에서 수령",
        places: [
          { name: "Times Car Rental 삿포로 오도리점", desc: "시계탑 인근 렌터카 지점", map_location: "Times Car Rental Sapporo Odori", tag: "렌트", addressHint: "Sapporo Station" },
        ],
      },
      {
        time: "미정",
        title: "비에이 & 후라노 자연 명소 투어",
        places: [
          { name: "흰수염 폭포", desc: "절벽 사이로 흘러내리는 비에이 대표 폭포", map_location: "Shirahige Falls Biei", tag: "자연", addressHint: "Biei" },
          { name: "청의 호수", desc: "푸른 물빛으로 유명한 비에이 대표 명소", map_location: "Shirogane Blue Pond Biei", tag: "자연", addressHint: "Biei" },
          { name: "팜 도미타", desc: "라벤더 밭과 여름 꽃밭 산책", map_location: "Farm Tomita Furano", tag: "자연", addressHint: "Furano" },
        ],
      },
      { time: "15:00 이후", title: "숙소 체크인", detail: "Ninguruforet Villa (후라노 미사와후타바)" },
    ],
  },
  {
    day: 3,
    weekday: "수",
    date: "8/5 (수)",
    title: "삿포로 시내",
    subtitle: "삿포로로 돌아와 쇼핑과 야경",
    hasCar: true,
    stay: "Hotel Gracery Sapporo (체크인 14:00)",
    map_location: "Hotel Gracery Sapporo Daimaru Sapporo PARCO Nemuro Hanamaru JR Tower Observatory T38",
    blocks: [
      { time: "10:00", title: "호텔 체크아웃 및 삿포로 시내 이동", detail: "Ninguruforet Villa 체크아웃 후 삿포로로 복귀" },
      { time: "14:00 이후", title: "숙소 체크인", detail: "Hotel Gracery Sapporo (중앙구 기타4조 니시4초메)" },
      {
        time: "15:00",
        title: "삿포로 쇼핑",
        places: [
          { name: "다이마루 삿포로점", desc: "삿포로역 바로 앞 백화점", map_location: "Daimaru Sapporo", tag: "쇼핑", addressHint: "Sapporo Station" },
          { name: "삿포로 파르코", desc: "오도리 인근 쇼핑몰", map_location: "PARCO Sapporo", tag: "쇼핑" },
          { name: "삿포로 스텔라 플레이스", desc: "JR 타워와 연결된 쇼핑 공간", map_location: "Sapporo Stellar Place", tag: "쇼핑", addressHint: "Sapporo Station" },
        ],
      },
      {
        time: "18:00",
        title: "렌터카 반납",
        places: [
          { name: "Times Car Rental 오도리점", desc: "수령 지점과 동일", map_location: "Times Car Rental Sapporo Odori", tag: "렌트" },
        ],
      },
      {
        time: "19:30",
        title: "초밥과 야경",
        places: [
          { name: "네무로 하나마루 초밥", desc: "삿포로역 인근 인기 회전초밥", map_location: "Nemuro Hanamaru Sapporo Station", tag: "맛집", addressHint: "Sapporo Station" },
          { name: "JR 타워 전망실 T38", desc: "삿포로 야경 명소", map_location: "JR Tower Observatory T38", tag: "야경", addressHint: "Sapporo Station" },
        ],
      },
    ],
  },
  {
    day: 4,
    weekday: "목",
    date: "8/6 (목)",
    title: "삿포로 시내 & 신치토세 공항",
    subtitle: "삿포로 체크아웃 후 신치토세공항에서 여유롭게 출국",
    hasCar: false,
    stay: "귀국",
    map_location: "New Chitose Airport Domestic Terminal Tokyu Department Store",
    blocks: [
      { time: "08:00", title: "호텔 체크아웃" },
      {
        time: "10:30",
        title: "신치토세공항 쇼핑",
        places: [
          { name: "도큐상점", desc: "스노우 치즈와 류게츠 치즈케이크 구매 후보", map_location: "New Chitose Airport Domestic Terminal Tokyu Department Store", tag: "쇼핑", addressHint: "Airport" },
          { name: "스노우 치즈", desc: "스노우 골드 치즈 판매처 확인", map_location: "SNOW CHEESE New Chitose Airport", tag: "기념품", addressHint: "Airport" },
          { name: "류게츠", desc: "토카치 민예 치즈케이크 구매 후보", map_location: "Ryugetsu New Chitose Airport", tag: "기념품", addressHint: "Airport" },
        ],
      },
      { time: "13:30", title: "국제선 청사 이동 & 체크인" },
      { time: "15:05", title: "WE532 출국 · 인천 18:10 도착" },
    ],
  },
];

export const CLUSTER_RULES = [
  { label: "비에이 지역", keywords: ["biei", "blue pond", "shirahige", "patchwork", "ken and mary", "mild seven", "청의 호수", "흰수염", "비에이"] },
  { label: "후라노 지역", keywords: ["furano", "farm tomita", "후라노", "팜 도미타"] },
  { label: "삿포로역 인근", keywords: ["sapporo station", "jr tower", "daimaru", "stellar", "nemuro", "삿포로역"] },
  { label: "신치토세공항", keywords: ["airport", "chitose", "tokyu", "snow cheese", "ryugetsu", "신치토세", "공항"] },
];

export function clusterPlaces(places: Place[]) {
  const groups = new Map<string, Place[]>();

  for (const place of places) {
    const haystack = `${place.name} ${place.desc} ${place.map_location} ${place.addressHint ?? ""}`.toLowerCase();
    const matched = CLUSTER_RULES.find((rule) =>
      rule.keywords.some((keyword) => haystack.includes(keyword.toLowerCase())),
    );
    const label = matched?.label ?? "기타 동선";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(place);
  }

  return [...groups.entries()];
}

export const CHECKLIST_SEED: ChecklistSeed[] = [
  { category: "packing", owner: "공통", item: "여권" },
  { category: "packing", owner: "공통", item: "항공권 E-Ticket" },
  { category: "packing", owner: "동현", item: "국제운전면허증" },
  { category: "packing", owner: "동현", item: "국내운전면허증 (일반 면허증)" },
  { category: "packing", owner: "공통", item: "렌터카 예약 확인서" },
  { category: "packing", owner: "공통", item: "110V 변환 어댑터" },
  { category: "packing", owner: "공통", item: "보조배터리" },
  { category: "packing", owner: "민희", item: "가벼운 겉옷" },
  { category: "packing", owner: "공통", item: "자외선 차단제" },
  { category: "souvenir", owner: "동현", item: "스노우 치즈 (스노우 골드 치즈) - 신치토세공항 국내선 터미널 도큐상점" },
  { category: "souvenir", owner: "동현", item: "류게츠 토카치 민예 치즈케이크 - 신치토세공항 국내선 터미널 도큐상점" },
  { category: "souvenir", owner: "동현", item: "사케 - 토카치 / 미치자쿠라 / 카미카와 타이세츠 중 택 1", details: "토카치" },
];

export const SAKE_OPTIONS = ["토카치", "미치자쿠라", "카미카와 타이세츠"];
