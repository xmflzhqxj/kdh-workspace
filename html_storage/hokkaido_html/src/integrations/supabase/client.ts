import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// ============================================================================
// [!IMPORTANT] Supabase 연결 정보 및 보안 지침 (영구 보관용)
// - Supabase URL: https://lmidifxhrfksypgndlak.supabase.co
// - 프로젝트 ID: lmidifxhrfksypgndlak
// - DB 개발 마스터 비밀번호: $5jU#h5wHDgepY
// *주의: 위 비밀번호는 데이터베이스 직접 접속(PostgreSQL) 시에만 사용하며, 
// 프론트엔드 클라이언트(React) 코드 로직 내에서 직접 사용해서는 절대 안 됩니다!
// ============================================================================

// Supabase 연결 위치:
// 1) Vercel 환경변수에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY를 넣는 것을 권장합니다.
// 2) 빠른 테스트용으로 아래 SUPABASE_URL, SUPABASE_ANON_KEY에 직접 붙여 넣을 수도 있습니다.
const SUPABASE_URL = "https://lmidifxhrfksypgndlak.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtaWRpZnhocmZrc3lwZ25kbGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzQ5ODYsImV4cCI6MjA5NjQxMDk4Nn0.faDoqy-DwagdW5gEnxuRGtyuKwFjTFw8YFHZCVE9RtU";

const resolvedUrl =
  SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_PROJECT_URL ||
  process.env.SUPABASE_URL;

const resolvedAnonKey =
  SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(resolvedUrl && resolvedAnonKey);

function createSupabaseClient() {
  if (!resolvedUrl || !resolvedAnonKey) {
    throw new Error(
      "Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or paste values into src/integrations/supabase/client.ts.",
    );
  }

  return createClient<Database>(resolvedUrl, resolvedAnonKey, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

let cachedClient: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!cachedClient) cachedClient = createSupabaseClient();
    return Reflect.get(cachedClient, prop, receiver);
  },
});
