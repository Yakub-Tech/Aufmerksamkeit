import test from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { assetUrl } from "../lib/asset-url.ts";

// Only point this suite at a disposable test installation: it writes sample data.
const base = process.env.TEST_BASE_URL;
if (!base) throw new Error("Set TEST_BASE_URL to an isolated test installation.");
const json = (body) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("local HTTP demo sessions use browser-compatible cookies", async () => {
  const res = await fetch(`${base}/api/comments`);
  const cookie = res.headers.get("set-cookie");
  assert.ok(cookie);
  assert.doesNotMatch(cookie, /;\s*Secure(?:;|$)/i);
  assert.match(cookie, /;\s*HttpOnly/i);
  assert.match(cookie, /;\s*SameSite=Lax/i);
});

test("all shipped Rive files are served at their encoded paths", async () => {
  const files = await readdir(new URL("../public/rive/", import.meta.url), { recursive: true });
  for (const file of files.filter((file) => file.endsWith(".riv"))) {
    const res = await fetch(base + assetUrl("/rive/" + file));
    assert.equal(res.status, 200, file);
    assert.ok((await res.arrayBuffer()).byteLength > 0, file);
  }
});

test("comments reject malformed JSON and invalid ages without writing", async () => {
  for (const body of ["{", "null", JSON.stringify({ name: "Test", text: "Beispiel", age: -1 }), JSON.stringify({ name: "Test", text: "Beispiel", age: 18.5 }), JSON.stringify({ name: {}, text: "Beispiel", age: 18 })]) {
    const res = await fetch(`${base}/api/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    assert.equal(res.status, 400, body);
  }
});

test("comments reject oversized content", async () => {
  const res = await fetch(`${base}/api/comments`, json({ name: "Test", text: "a".repeat(2001), age: 18 }));
  assert.equal(res.status, 400);
});

test("like identifiers must be positive integers and existing comments", async () => {
  for (const id of ["1junk", "-1", "0", "9999999999999999999999"]) {
    const res = await fetch(`${base}/api/comments/${id}/like`, { method: "POST" });
    assert.equal(res.status, 400, id);
  }
  const missing = await fetch(`${base}/api/comments/2147483647/like`, { method: "POST" });
  assert.equal(missing.status, 404);
});

test("test results reject invalid data without incrementing the counter", async () => {
  const before = await (await fetch(`${base}/api/test-count`)).json();
  for (const data of [null, {}, { elapsed: -1, distractions: 0 }, { elapsed: 1.5, distractions: 0 }, { elapsed: 1, distractions: 25 }, { elapsed: "3", distractions: 0 }]) {
    const res = await fetch(`${base}/api/test-count`, json(data));
    assert.equal(res.status, 400, JSON.stringify(data));
  }
  const after = await (await fetch(`${base}/api/test-count`)).json();
  assert.equal(after.count, before.count);
});

test("a sample comment persists, a session can like it once and undo its like", async () => {
  const created = await fetch(`${base}/api/comments`, json({ name: "API-Test", text: "Fiktiver Testbeitrag", age: 24, gender: "divers" }));
  assert.equal(created.status, 201);
  const comment = await created.json();
  const listRes = await fetch(`${base}/api/comments`);
  const cookie = listRes.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie);
  const list = await listRes.json();
  assert.ok(list.some((c) => c.id === comment.id && c.text === "Fiktiver Testbeitrag"));
  const url = `${base}/api/comments/${comment.id}/like`;
  for (let i = 0; i < 2; i++) {
    const liked = await fetch(url, { method: "POST", headers: { cookie } });
    assert.equal(liked.status, 200);
    assert.equal((await liked.json()).likes, 1);
  }
  const undone = await fetch(url, { method: "DELETE", headers: { cookie } });
  assert.equal((await undone.json()).likes, 0);
});

test("parallel valid results increment the count exactly once per request", async () => {
  const before = await (await fetch(`${base}/api/test-count`)).json();
  const results = await Promise.all(Array.from({ length: 3 }, () => fetch(`${base}/api/test-count`, json({ elapsed: 12, distractions: 0 }))));
  assert.ok(results.every((r) => r.status === 200));
  const after = await (await fetch(`${base}/api/test-count`)).json();
  assert.equal(after.count, before.count + 3);
});
