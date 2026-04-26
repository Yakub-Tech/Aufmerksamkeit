"use client";

import { useEffect, useState, type FormEvent } from "react";

type Post = {
  id: number;
  name: string;
  age: number;
  text: string;
};

export default function CommunitySection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(18);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, age, text: trimmedText }),
    });

    if (!res.ok) return;

    const newPost: Post = await res.json();
    setPosts([newPost, ...posts]);
    setName("");
    setText("");
    setAge(18);
  }

  return (
    <section id="community" className="border-t border-[#D9D2C3]">
      <div className="mx-auto max-w-7xl px-12 py-24">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-[#6B6860]">
          Community
        </div>
        <h2 className="font-serif text-6xl leading-tight tracking-tight">
          Teile deinen <span className="italic text-[#D64D1E]">Hack</span>.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#2A2A28]">
          Was hilft dir, fokussiert zu bleiben? Schreib einen kurzen Erfahrungsbericht, er erscheint sofort oben in der Liste.
        </p>

        <div className="mt-10 grid grid-cols-[1fr_1.4fr] items-start gap-8">
          <form onSubmit={send} className="rounded-2xl border border-[#D9D2C3] bg-[#EEE7DB] p-6">
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#6B6860]">
              Dein Beitrag
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="mb-3 w-full rounded-xl border border-[#D9D2C3] bg-[#F5F1EA] p-3 text-sm text-[#0F0F0E] outline-none focus:border-[#0F0F0E]"
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
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Was hat dir geholfen, weniger abgelenkt zu sein?"
              className="min-h-[120px] w-full resize-y rounded-xl border border-[#D9D2C3] bg-[#F5F1EA] p-3 text-sm leading-relaxed text-[#0F0F0E] outline-none focus:border-[#0F0F0E]"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-[#0F0F0E] px-6 py-3 text-sm font-medium text-[#F5F1EA] transition-colors hover:bg-[#D64D1E]"
              >
                Beitrag absenden
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="flex h-[540px] flex-col gap-4 overflow-y-scroll pr-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-[#D9D2C3] bg-[#F5F1EA] p-5"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#D64D1E]">
                    {post.name.toUpperCase()}, {post.age}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#2A2A28] break-words">{post.text}</p>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-3 h-10 rounded-b-2xl bg-gradient-to-t from-[#F5F1EA] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
