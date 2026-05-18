"use client";
import { useState, useEffect } from "react";

export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const key = ids.join(",");

  useEffect(() => {
    const idList = key.split(",");
    const map = new Map<Element, string>();
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = map.get(entry.target);
          if (!id) return;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });
        const first = idList.find((id) => visible.has(id));
        if (first) setActiveId(first);
      },
      { rootMargin: "-10% 0px -60% 0px" }
    );

    idList.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        map.set(el, id);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
