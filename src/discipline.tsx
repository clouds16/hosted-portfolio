import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Discipline, DisciplineFilter } from "./types";

type DisciplineContextValue = {
  discipline: DisciplineFilter;
  setDiscipline: (d: DisciplineFilter) => void;
};

const DisciplineContext = createContext<DisciplineContextValue | null>(null);

export function DisciplineProvider({ children }: { children: ReactNode }) {
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");
  const value = useMemo(() => ({ discipline, setDiscipline }), [discipline]);
  return <DisciplineContext.Provider value={value}>{children}</DisciplineContext.Provider>;
}

export function useDiscipline() {
  const ctx = useContext(DisciplineContext);
  if (!ctx) throw new Error("useDiscipline must be used inside DisciplineProvider");
  return ctx;
}

export function filterByDiscipline<T extends { disciplines: Discipline[] }>(
  items: T[],
  discipline: DisciplineFilter,
): T[] {
  if (discipline === "all") return items;
  return items.filter((item) => item.disciplines.includes(discipline));
}
