CREATE TABLE public.travel_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day integer NOT NULL,
  name text NOT NULL,
  desc text NOT NULL DEFAULT '',
  map_location text NOT NULL,
  tag text,
  address_hint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner text NOT NULL DEFAULT '공통' CHECK (owner IN ('동현', '민희', '공통')),
  section text NOT NULL DEFAULT '준비물' CHECK (section IN ('준비물', '기념품')),
  category text NOT NULL DEFAULT '기타',
  checked boolean NOT NULL DEFAULT false,
  sake_choice text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner text NOT NULL DEFAULT 'shared',
  category text NOT NULL DEFAULT '기타',
  checked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.travel_places TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packing_items TO anon, authenticated;
GRANT ALL ON public.travel_places TO service_role;
GRANT ALL ON public.checklist TO service_role;
GRANT ALL ON public.packing_items TO service_role;

ALTER TABLE public.travel_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read travel_places" ON public.travel_places FOR SELECT USING (true);
CREATE POLICY "Public insert travel_places" ON public.travel_places FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update travel_places" ON public.travel_places FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete travel_places" ON public.travel_places FOR DELETE USING (true);

CREATE POLICY "Public read checklist" ON public.checklist FOR SELECT USING (true);
CREATE POLICY "Public insert checklist" ON public.checklist FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update checklist" ON public.checklist FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete checklist" ON public.checklist FOR DELETE USING (true);

CREATE POLICY "Public read packing_items" ON public.packing_items FOR SELECT USING (true);
CREATE POLICY "Public insert packing_items" ON public.packing_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update packing_items" ON public.packing_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete packing_items" ON public.packing_items FOR DELETE USING (true);

ALTER TABLE public.travel_places REPLICA IDENTITY FULL;
ALTER TABLE public.checklist REPLICA IDENTITY FULL;
ALTER TABLE public.packing_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.travel_places;
ALTER PUBLICATION supabase_realtime ADD TABLE public.checklist;
ALTER PUBLICATION supabase_realtime ADD TABLE public.packing_items;

INSERT INTO public.travel_places (day, name, desc, map_location, tag, address_hint) VALUES
(2, '흰수염 폭포', '절벽 사이로 흘러내리는 비에이 대표 폭포', 'Shirahige Falls Biei', '자연', 'Biei'),
(2, '청의 호수', '푸른 물빛으로 유명한 비에이 대표 명소', 'Shirogane Blue Pond Biei', '자연', 'Biei'),
(2, '팜 도미타', '라벤더 밭과 여름 꽃밭 산책', 'Farm Tomita Furano', '자연', 'Furano'),
(3, '네무로 하나마루 초밥', '삿포로역 인근 인기 회전초밥', 'Nemuro Hanamaru Sapporo Station', '맛집', 'Sapporo Station');

INSERT INTO public.checklist (name, owner, section, category, sake_choice) VALUES
('여권', '공통', '준비물', '필수 서류', null),
('항공권 E-Ticket', '공통', '준비물', '필수 서류', null),
('국제운전면허증', '동현', '준비물', '필수 서류', null),
('렌터카 예약 확인서', '공통', '준비물', '필수 서류', null),
('110V 변환 어댑터', '공통', '준비물', '전자기기', null),
('보조배터리', '공통', '준비물', '전자기기', null),
('스노우 치즈 (스노우 골드 치즈) - 신치토세공항 국내선 터미널 도큐상점', '공통', '기념품', '공항 쇼핑', null),
('류게츠 토카치 민예 치즈케이크 - 신치토세공항 국내선 터미널 도큐상점', '공통', '기념품', '공항 쇼핑', null),
('사케 (토카치 / 미치자쿠라 / 카미카와 타이세츠 중 택 1)', '공통', '기념품', '사케', '토카치');
