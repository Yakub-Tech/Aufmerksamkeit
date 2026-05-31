"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import SectionReveal from "./SectionReveal";

// Sobald echte separate .riv-Dateien pro Geschlecht vorliegen, hier die Pfade tauschen
const characterFiles: Record<string, string> = {
  maennlich: "/rive/character_+_like.riv",
  weiblich: "/rive/character_+_like.riv",
  divers: "/rive/character_+_like.riv",
};

type Post = {
  id: number;
  name: string;
  age: number;
  text: string;
  gender?: string;
  likes: number;
};

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#0F0F0E]">
      <span className="font-mono text-xs font-medium text-[#F5F1EA]">{initial}</span>
    </div>
  );
}

function CharacterDisplay({ src, triggerEyes }: { src: string; triggerEyes?: boolean }) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  const eyesInput = useStateMachineInput(rive, "State Machine 1", "playEyes");

  useEffect(() => {
    if (triggerEyes) {
      const t = setTimeout(() => eyesInput?.fire(), 100);
      return () => clearTimeout(t);
    }
  }, [triggerEyes, eyesInput]);

  return <RiveComponent />;
}

function PostCharacter({ src }: { src: string }) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  return (
    <div className="h-8 w-8 flex-none overflow-hidden rounded-full border border-[#D9D2C3] bg-[#F5F1EA]">
      <RiveComponent />
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#D9D2C3] bg-[#F5F1EA] p-3 text-sm text-[#0F0F0E] outline-none transition-all duration-150 focus:border-[#D64D1E] focus:ring-1 focus:ring-[#D64D1E]";

export default function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [text, setText] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eyesTrigger, setEyesTrigger] = useState(false);

  // Drosselung damit die Augen-Animation beim Tippen nicht zu schnell feuert
  const lastEyesFired = useRef(0);
  function fireEyes() {
    const now = Date.now();
    if (now - lastEyesFired.current > 800) {
      setEyesTrigger((v) => !v);
      lastEyesFired.current = now;
    }
  }

  function chooseGender(value: string) {
    setGender(value);
    setGenderError(false);
    setEyesTrigger((v) => !v);
  }
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("liked_comments") || "[]");
    } catch {
      return [];
    }
  });
  const [wobbleId, setWobbleId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/comments")
        .then((res) => res.json())
        .then((data) => setPosts(data))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!gender) {
      setGenderError(true);
      return;
    }
    if (!trimmedName || !trimmedText) return;

    setIsSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, age, text: trimmedText, gender: gender || null }),
    });

    if (!res.ok) {
      setIsSubmitting(false);
      return;
    }

    const newPost: Post = await res.json();
    setPosts((prev) => [newPost, ...prev]);
    setName("");
    setText("");
    setAge(18);
    setGender("");
    setGenderError(false);
    setIsSubmitting(false);
  }

  async function handleLike(id: number) {
    const isLiked = likedIds.includes(id);

    setWobbleId(id);
    setTimeout(() => setWobbleId(null), 450);

    if (isLiked) {
      await fetch(`/api/comments/${id}/like`, { method: "DELETE" });
      const updated = likedIds.filter((i) => i !== id);
      setLikedIds(updated);
      localStorage.setItem("liked_comments", JSON.stringify(updated));
    } else {
      await fetch(`/api/comments/${id}/like`, { method: "POST" });
      const updated = [...likedIds, id];
      setLikedIds(updated);
      localStorage.setItem("liked_comments", JSON.stringify(updated));
    }

    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => {});
  }

  return (
    <section id="community">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <SectionReveal>
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Teile deinen <span className="italic text-[#D64D1E]">Hack</span>.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Was hilft dir, fokussiert zu bleiben? Schreib einen kurzen Erfahrungsbericht, er erscheint sofort oben in der Liste.
        </p>
        </SectionReveal>

        <SectionReveal>
        <div className="mt-10 grid grid-cols-[1fr_1.4fr] items-start gap-8">
          <form onSubmit={send} className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
            <p className="mb-4 text-lg font-bold text-[#0F0F0E]">Dein Beitrag</p>

            {/* Geschlechtsauswahl */}
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">Geschlecht</p>
              {genderError && (
                <p className="font-mono text-[10px] text-[#D64D1E]">Bitte auswählen</p>
              )}
            </div>
            <div className="mb-3 flex items-start gap-3">
              <motion.div
                initial={false}
                animate={{ opacity: gender ? 1 : 0, scale: gender ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-20 w-20 flex-none overflow-hidden rounded-xl border border-[#D9D2C3] bg-[#F5F1EA] pointer-events-none"
              >
                {gender && (
                  <CharacterDisplay
                    key={gender}
                    src={characterFiles[gender]}
                    triggerEyes={eyesTrigger}
                  />
                )}
              </motion.div>
              <div className="flex flex-1 flex-col gap-2">
              {(["maennlich", "weiblich", "divers"] as const).map((val) => {
                const labels: Record<string, string> = {
                  maennlich: "Männlich",
                  weiblich: "Weiblich",
                  divers: "Divers",
                };
                const active = gender === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => chooseGender(val)}
                    className={`flex-1 rounded-xl border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-150 ${
                      active
                        ? "border-[#0F0F0E] bg-[#0F0F0E] text-[#F5F1EA] font-bold"
                        : "border-[#D9D2C3] bg-[#F5F1EA] text-[#6B6860] hover:border-[#D64D1E] hover:text-[#D64D1E]"
                    }`}
                  >
                    {labels[val]}
                  </button>
                );
              })}
              </div>
            </div>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className={`mb-3 ${inputClass}`}
            />
            <div className="mb-3 rounded-xl border border-[#D9D2C3] bg-[#F5F1EA] px-3 py-3">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                <span>Alter</span>
                <span className="text-[#D64D1E]">Alter: {age}</span>
              </div>
              <input
                type="range"
                min={14}
                max={40}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                aria-label="Alter"
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#D9D2C3] accent-[#D64D1E] outline-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0F0F0E] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[#0F0F0E]"
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-[#6B6860]">
                <span>14</span>
                <span>40</span>
              </div>
            </div>
            {/* fireEyes ist ein Platzhalter – ersetzt durch eine Reden-Animation, sobald die .riv-Datei diese enthält */}
            <textarea
              required
              value={text}
              onChange={(e) => { setText(e.target.value); fireEyes(); }}
              placeholder="Was hat dir geholfen, weniger abgelenkt zu sein?"
              className={`min-h-[140px] resize-y ${inputClass}`}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-full bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition-all duration-200 hover:scale-[1.04] hover:bg-[#D64D1E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Wird gespeichert…
                  </span>
                ) : (
                  "Beitrag absenden"
                )}
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="flex h-[540px] flex-col gap-4 overflow-y-auto pr-3">
              {posts.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-[#D9D2C3] bg-[#F5F1EA] p-8">
                  <p className="font-serif italic text-[#6B6860]">
                    Noch keine Beiträge. Sei der Erste.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="rounded-2xl border border-[#D9D2C3] bg-[#F5F1EA] p-5"
                    >
                      <div className="flex items-center gap-3">
                        {post.gender
                          ? <PostCharacter key={`char-${post.id}-${index}`} src={characterFiles[post.gender] ?? "/rive/character_+_like.riv"} />
                          : <Avatar name={post.name} />
                        }
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D64D1E]">
                          {post.name.toUpperCase()}, {post.age}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[#2A2A28] break-words">
                        {post.text}
                      </p>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        {(post.likes ?? 0) > 0 && (
                          <span className="font-mono text-xs text-[#6B6860]">{post.likes}</span>
                        )}
                        <motion.button
                          animate={wobbleId === post.id ? { rotate: [0, -14, 14, -9, 9, 0] } : { rotate: 0 }}
                          transition={{ duration: 0.45 }}
                          onClick={() => handleLike(post.id)}
                          className={`flex cursor-pointer items-center justify-center rounded-full p-1.5 transition-colors duration-150 ${
                            likedIds.includes(post.id)
                              ? "bg-[#3D7262] text-white"
                              : "bg-[#EEE7DB] text-[#6B6860] hover:bg-[#3D7262] hover:text-white"
                          }`}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={likedIds.includes(post.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 10v12" />
                            <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-3 h-10 rounded-b-2xl bg-gradient-to-t from-[#F5F1EA] to-transparent" />
          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
