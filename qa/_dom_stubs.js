/*
 * qa/_dom_stubs.js
 *
 * Minimal browser stubs so we can `require()` module JS that runs UI code
 * at module-load time. Returned elements swallow innerHTML/textContent
 * writes and any appendChild traffic without throwing. We never simulate
 * actual DOM behaviour — we only stop the modules from crashing on import
 * so we can inspect their function exports.
 */

"use strict";

function makeStubElement() {
  const el = {
    style: {},
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    children: [],
    innerHTML: "",
    textContent: "",
    value: "",
    href: "",
    className: "",
    setAttribute() {},
    getAttribute() { return null; },
    appendChild(child) { el.children.push(child); return child; },
    removeChild() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
    querySelector() { return makeStubElement(); },
    querySelectorAll() { return []; },
    focus() {},
    blur() {},
    click() {},
    closest() { return null; },
    insertBefore(node) { return node; }
  };
  return el;
}

function ensureDomStubs() {
  if (typeof global.document === "undefined") {
    global.document = {
      readyState: "complete",
      body: makeStubElement(),
      documentElement: makeStubElement(),
      addEventListener() {},
      removeEventListener() {},
      getElementById() { return makeStubElement(); },
      querySelector() { return makeStubElement(); },
      querySelectorAll() { return []; },
      createElement() { return makeStubElement(); },
      createTextNode(t) { return { nodeValue: t, textContent: t }; }
    };
  }
  if (typeof global.window === "undefined") global.window = global;
  if (typeof global.location === "undefined") global.location = { hash: "", search: "", pathname: "/" };
  if (typeof global.addEventListener === "undefined") global.addEventListener = function () {};
  if (typeof global.removeEventListener === "undefined") global.removeEventListener = function () {};
  if (typeof global.SpeechSynthesisUtterance === "undefined") global.SpeechSynthesisUtterance = function () {};
  if (typeof global.speechSynthesis === "undefined") global.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] };
  if (typeof global.localStorage === "undefined") global.localStorage = { getItem: () => null, setItem() {}, removeItem() {}, clear() {} };
}

function requireModuleSafe(absPath) {
  ensureDomStubs();
  delete require.cache[require.resolve(absPath)];
  return require(absPath);
}

module.exports = { ensureDomStubs, requireModuleSafe, makeStubElement };
