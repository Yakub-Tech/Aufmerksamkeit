"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import SectionReveal from "./SectionReveal";

const charDir = "/rive/characters";

const augenFiles: Record<string, string> = {
  maennlich: `${charDir}/Mann Augen.riv`,
  weiblich: `${charDir}/Frau Augen.riv`,
  divers: `${charDir}/Divers Augen.riv`,
};
const mundFiles: Record<string, string> = {
  maennlich: `${charDir}/Mann Mund.riv`,
  weiblich: `${charDir}/Frau Mund.riv`,
  divers: `${charDir}/Divers Mund.riv`,
};
const likeFiles: Record<string, string> = {
  maennlich: `${charDir}/Mann like (3 Animationen).riv`,
  weiblich: `${charDir}/Frau like (3 Animationen).riv`,
  divers: `${charDir}/Divers like (3 Animationen).riv`,
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
    <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#7C4DFF]">
      <span className="font-mono text-xs font-medium text-white">{initial}</span>
    </div>
  );
}

// Vorschaucharakter im Formular - zeigt Augen oder Mund je nach Modus
function CharacterDisplay({ src, isTyping }: { src: string; isTyping: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: encodeURI(src),
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  const eyesInput = useStateMachineInput(rive, "State Machine 1", "playEyes");
  const typingInput = useStateMachineInput(rive, "State Machine 1", "isTyping");

  // Augen-Animation beim ersten Laden auslösen (playEyes ist ein Trigger-Input)
  useEffect(() => {
    if (eyesInput) {
      const t = setTimeout(() => { eyesInput.fire(); }, 150);
      return () => clearTimeout(t);
    }
  }, [eyesInput]);

  // Reden-Animation beim Tippen steuern
  useEffect(() => {
    if (typingInput) {
      typingInput.value = isTyping;
    }
  }, [isTyping, typingInput]);

  return <RiveComponent />;
}

// Avatar in geposteten Beiträgen - zeigt Like-Datei im Idle, beim Liken eine zufällige Animation
function PostCharacter({ src, trigger }: { src: string; trigger: number }) {
  const { rive, RiveComponent } = useRive({
    src: encodeURI(src),
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  const expressionIndexInput = useStateMachineInput(rive, "State Machine 1", "expressionIndex");
  const playExpressionInput = useStateMachineInput(rive, "State Machine 1", "playExpression");

  // playExpression ist ein Trigger-Input, expressionIndex ein Number-Input
  useEffect(() => {
    if (trigger > 0 && expressionIndexInput && playExpressionInput) {
      const idx = Math.floor(Math.random() * 3);
      const t = setTimeout(() => {
        expressionIndexInput.value = idx;
        playExpressionInput.fire();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [trigger, expressionIndexInput, playExpressionInput]);

  return (
    <div className="h-8 w-8 flex-none overflow-hidden rounded-full border border-[#2A3550] bg-[#0D1425]">
      <RiveComponent />
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#2A3550] bg-[#0D1425] p-3 text-sm text-[#F4F5F8] outline-none transition-all duration-150 focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF] placeholder:text-[#6B6860]";

export default function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [text, setText] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTyping() {
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 1200);
  }

  function chooseGender(value: string) {
    setGender(value);
    setGenderError(false);
    // Der Wechsel des Geschlechts remountet den Charakter über den key, Augen starten neu
  }

  const [likeTriggers, setLikeTriggers] = useState<Record<number, number>>({});
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
      // Like-Animation auslösen
      setLikeTriggers((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }

    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => {});
  }

  return (
    <section id="community" className="bg-[#0D1425] text-[#F4F5F8]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <SectionReveal>
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Teile deinen <span className="italic text-[#7C4DFF]">Hack</span>.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EAECF2]/80">
          Was hilft dir, fokussiert zu bleiben? Schreib einen kurzen Erfahrungsbericht, er erscheint sofort oben in der Liste.
        </p>
        </SectionReveal>

        <SectionReveal>
        <div className="mt-10 grid grid-cols-[1fr_1.4fr] items-start gap-8">
          <form onSubmit={send} className="rounded-2xl border border-[#7C4DFF] bg-[#1A2440] p-6">
            <p className="mb-4 text-lg font-bold text-[#F4F5F8]">Dein Beitrag</p>

            {/* Geschlechtsauswahl */}
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">Geschlecht</p>
              {genderError && (
                <p className="font-mono text-[10px] text-[#7C4DFF]">Bitte auswählen</p>
              )}
            </div>
            <div className="mb-3 flex items-start gap-3">
              <motion.div
                initial={false}
                animate={{ opacity: gender ? 1 : 0, scale: gender ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-20 w-20 flex-none overflow-hidden rounded-xl border border-[#2A3550] bg-[#0D1425] pointer-events-none"
              >
                {gender && (
                  <CharacterDisplay
                    key={`${gender}-${typing ? "mund" : "augen"}`}
                    src={typing ? mundFiles[gender] : augenFiles[gender]}
                    isTyping={typing}
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
                        ? "border-[#7C4DFF] bg-[#7C4DFF] text-white font-bold"
                        : "border-[#2A3550] bg-[#0D1425] text-[#6B6860] hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
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
            <div className="mb-3 rounded-xl border border-[#2A3550] bg-[#0D1425] px-3 py-3">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
                <span>Alter</span>
                <span className="text-[#7C4DFF]">Alter: {age}</span>
              </div>
              <input
                type="range"
                min={14}
                max={40}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                aria-label="Alter"
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#D7DAE4] accent-[#7C4DFF] outline-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#0F0F0E] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-[#0F0F0E]"
              />
              <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-[#6B6860]">
                <span>14</span>
                <span>40</span>
              </div>
            </div>
            <textarea
              required
              value={text}
              onChange={(e) => { setText(e.target.value); handleTyping(); }}
              placeholder="Was hat dir geholfen, weniger abgelenkt zu sein?"
              className={`min-h-[140px] resize-y ${inputClass}`}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-full bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-[#F4F5F8] transition-all duration-200 hover:scale-[1.04] hover:bg-[#7C4DFF] disabled:cursor-not-allowed disabled:opacity-60"
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
            <div data-lenis-prevent className="flex h-[540px] flex-col gap-4 overflow-y-auto pr-3">
              {posts.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl border border-[#1A2440] bg-[#1A2440] p-8">
                  <p className="font-serif italic text-[#6B6860]">
                    Noch keine Beiträge. Sei der Erste.
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="rounded-2xl border-2 border-[#7C4DFF] bg-[#1A2440] p-5"
                    >
                      <div className="flex items-center gap-3">
                        {post.gender && likeFiles[post.gender]
                          ? <PostCharacter key={`char-${post.id}`} src={likeFiles[post.gender]} trigger={likeTriggers[post.id] ?? 0} />
                          : <Avatar name={post.name} />
                        }
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#7C4DFF]">
                          {post.name.toUpperCase()}, {post.age}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[#EAECF2] break-words">
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
                              ? "bg-[#5B35CC] text-white"
                              : "bg-[#2A3550] text-[#6B6860] hover:bg-[#5B35CC] hover:text-white"
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
            <div className="pointer-events-none absolute bottom-0 left-0 right-3 h-10 bg-gradient-to-t from-[#0D1425] to-transparent" />
          </div>
        </div>
        </SectionReveal>
      </div>
    </section>
  );
}
