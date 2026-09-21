import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Loader2, Plus, Trash2, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHECKLIST_SEED, SAKE_OPTIONS, type Owner } from "@/lib/trip-data";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

type ChecklistItem = {
  id: number | string;
  item: string;
  owner: Owner;
  category: "packing" | "souvenir";
  is_completed: boolean;
  details: string | null;
  created_at: string;
};

const OWNER_STYLES: Record<Owner, string> = {
  동현: "bg-blue-100 text-blue-700 border-blue-200",
  민희: "bg-pink-100 text-pink-700 border-pink-200",
  공통: "bg-[#EBEAFA] text-primary border-[#D8D5F2]",
};

const fallbackItems: ChecklistItem[] = CHECKLIST_SEED.map((item, index) => ({
  id: `seed-${index}`,
  item: item.item,
  owner: item.owner,
  category: item.category,
  is_completed: item.is_completed ?? false,
  details: item.details ?? null,
  created_at: new Date().toISOString(),
}));

export function PackingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(isSupabaseConfigured ? [] : fallbackItems);
  const [itemName, setItemName] = useState("");
  const [owner, setOwner] = useState<Owner>("공통");
  const [category, setCategory] = useState<"packing" | "souvenir">("packing");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let mounted = true;

    async function loadItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from("checklist")
        .select("*")
        .order("created_at", { ascending: true });

      if (!mounted) return;
      if (error) {
        toast.error(error.message);
        setItems(fallbackItems);
      } else {
        setItems(((data ?? []) as ChecklistItem[]).length ? (data as ChecklistItem[]) : fallbackItems);
      }
      setLoading(false);
    }

    void loadItems();

    const channel = supabase
      .channel("checklist_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checklist" },
        (payload) => {
          setItems((current) => {
            if (payload.eventType === "INSERT") {
              const next = payload.new as ChecklistItem;
              if (current.some((item) => item.id === next.id)) return current;
              return [...current.filter((item) => typeof item.id !== "string" || !item.id.startsWith("seed-")), next];
            }

            if (payload.eventType === "UPDATE") {
              const next = payload.new as ChecklistItem;
              return current.map((item) => (item.id === next.id ? next : item));
            }

            if (payload.eventType === "DELETE") {
              const deleted = payload.old as Pick<ChecklistItem, "id">;
              return current.filter((item) => item.id !== deleted.id);
            }

            return current;
          });
        },
      )
      .subscribe((status) => setSubscribed(status === "SUBSCRIBED"));

    return () => {
      mounted = false;
      setSubscribed(false);
      void supabase.removeChannel(channel);
    };
  }, []);

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = itemName.trim();
    if (!trimmed || saving) return;

    if (trimmed.length > 110) {
      toast.error("항목은 110자 이내로 입력해 주세요.");
      return;
    }

    if (!isSupabaseConfigured) {
      setItems((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          item: trimmed,
          owner,
          category,
          is_completed: false,
          details: null,
          created_at: new Date().toISOString(),
        },
      ]);
      setItemName("");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("checklist").insert({
      item: trimmed,
      owner,
      category,
      is_completed: false,
      details: null,
    });

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    setItemName("");
  }

  async function updateItem(item: ChecklistItem, patch: Partial<ChecklistItem>) {
    if (!isSupabaseConfigured || typeof item.id === "string") {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, ...patch } : currentItem,
        ),
      );
      return;
    }

    const { error } = await supabase.from("checklist").update(patch).eq("id", item.id);
    if (error) toast.error(error.message);
  }

  async function deleteItem(item: ChecklistItem) {
    if (!isSupabaseConfigured || typeof item.id === "string") {
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      return;
    }

    const { error } = await supabase.from("checklist").delete().eq("id", item.id);
    if (error) toast.error(error.message);
  }

  const stats = useMemo(() => {
    const done = items.filter((item) => item.is_completed).length;
    return { done, percent: items.length ? Math.round((done / items.length) * 100) : 0 };
  }, [items]);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">여행 체크리스트</h2>
            <p className="text-xs text-muted-foreground">
              준비물과 기념품을 분리해서 관리합니다. {stats.done}/{items.length} 완료 ({stats.percent}%)
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
              subscribed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {subscribed ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {subscribed ? "실시간 연결" : isSupabaseConfigured ? "연결 대기" : "로컬 모드"}
          </span>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all" style={{ width: `${stats.percent}%` }} />
        </div>

        <form onSubmit={addItem} className="mt-4 grid gap-2 lg:grid-cols-[1fr_104px_104px_auto]">
          <Input
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            maxLength={110}
            placeholder="항목 추가"
          />
          <Select value={owner} onChange={(value) => setOwner(value as Owner)} options={["공통", "동현", "민희"]} />
          <Select
            value={category}
            onChange={(value) => setCategory(value as "packing" | "souvenir")}
            options={[{ label: "준비물", value: "packing" }, { label: "기념품", value: "souvenir" }]}
          />
          <Button type="submit" disabled={saving || !itemName.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            추가
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          체크리스트를 불러오는 중
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            { id: "packing" as const, label: "준비물" },
            { id: "souvenir" as const, label: "기념품" }
          ].map(({ id: catId, label }) => {
            const sectionItems = items.filter((item) => item.category === catId);
            const commonItems = sectionItems.filter((i) => i.owner === "공통");
            const donghyunItems = sectionItems.filter((i) => i.owner === "동현");
            const minheeItems = sectionItems.filter((i) => i.owner === "민희");

            return (
              <section
                key={catId}
                className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="mb-5 text-lg font-bold text-foreground">[{label}]</h3>

                <div className="flex flex-1 flex-col gap-5">
                  <ChecklistOwnerGroup title="👨‍👩‍👧‍👦 공통" items={commonItems} onUpdate={updateItem} onDelete={deleteItem} />

                  {(donghyunItems.length > 0 || minheeItems.length > 0) && (
                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
                      <ChecklistOwnerGroup title="👦 동현" items={donghyunItems} onUpdate={updateItem} onDelete={deleteItem} />
                      <ChecklistOwnerGroup title="👧 민희" items={minheeItems} onUpdate={updateItem} onDelete={deleteItem} />
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ChecklistOwnerGroup({
  title,
  items,
  onUpdate,
  onDelete,
}: {
  title: string;
  items: ChecklistItem[];
  onUpdate: (item: ChecklistItem, patch: Partial<ChecklistItem>) => void;
  onDelete: (item: ChecklistItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-foreground/90">{title}</div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <ChecklistRow key={item.id} rowItem={item} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </ul>
    </div>
  );
}

function ChecklistRow({
  rowItem,
  onUpdate,
  onDelete,
}: {
  rowItem: ChecklistItem;
  onUpdate: (item: ChecklistItem, patch: Partial<ChecklistItem>) => void;
  onDelete: (item: ChecklistItem) => void;
}) {
  const isSake = rowItem.category === "souvenir" && rowItem.item.includes("사케");
  const parts = rowItem.item.split(" - ");
  const mainText = parts[0].trim();
  const subText = parts.length > 1 ? parts.slice(1).join(" - ").trim() : null;

  return (
    <li className="group rounded-md border border-border bg-background px-3 py-2.5 transition hover:border-primary">
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
        <button
          type="button"
          onClick={() => onUpdate(rowItem, { is_completed: !rowItem.is_completed })}
          aria-label={`${rowItem.item} 체크 전환`}
          className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border transition ${
            rowItem.is_completed ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"
          }`}
        >
          {rowItem.is_completed && <Check className="h-3.5 w-3.5" />}
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm ${rowItem.is_completed ? "text-muted-foreground line-through" : "font-medium"}`}>
              {mainText}
            </span>
            <select
              value={rowItem.owner}
              onChange={(e) => onUpdate(rowItem, { owner: e.target.value as Owner })}
              className={`cursor-pointer appearance-none rounded-full border px-2 py-0.5 text-[10px] font-semibold outline-none transition-colors ${OWNER_STYLES[rowItem.owner]}`}
            >
              <option value="공통" className="bg-background text-foreground">공통</option>
              <option value="동현" className="bg-background text-foreground">동현</option>
              <option value="민희" className="bg-background text-foreground">민희</option>
            </select>
          </div>
          {subText && (
            <div className={`mt-0.5 text-[11px] ${rowItem.is_completed ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
              {subText}
            </div>
          )}
          {isSake && (
            <div className="mt-2 flex flex-wrap gap-2">
              {SAKE_OPTIONS.map((option) => (
                <label key={option} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="radio"
                    name={`sake-${rowItem.id}`}
                    value={option}
                    checked={(rowItem.details ?? SAKE_OPTIONS[0]) === option}
                    onChange={() => onUpdate(rowItem, { details: option })}
                    className="accent-[#7A77B9]"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete(rowItem)}
          aria-label={`${rowItem.item} 삭제`}
          className="rounded p-1 text-muted-foreground opacity-100 transition hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[] | string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map((option) => {
        const isString = typeof option === "string";
        const val = isString ? option : option.value;
        const label = isString ? option : option.label;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
