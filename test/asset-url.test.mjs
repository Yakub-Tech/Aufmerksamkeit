import test from "node:test";
import assert from "node:assert/strict";
import { assetUrl } from "../lib/asset-url.ts";

test("local animation paths encode plus signs and spaces while retaining path separators", () => {
  assert.equal(assetUrl("/rive/button + icons/enable_button.riv"), "/rive/button%20%2B%20icons/enable_button.riv");
  assert.equal(assetUrl("/rive/characters/Frau Augen.riv"), "/rive/characters/Frau%20Augen.riv");
});
