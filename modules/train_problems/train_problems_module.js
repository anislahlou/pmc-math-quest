(function (root) {
  "use strict";

  const ROUND_LENGTH = 6;
  const INTRO_SCENE_MS = 9000;

  // Source: Year 6 "M" workbook, Lesson 22 "Train Problems".
  // Printed pages 46-58 (PDF pages 56-68). The lesson teaches that the
  // distance a train travels is measured from its front, so the train's own
  // length must be added to whatever it crosses.
  const SRC = "Book 46-58 / PDF 56-68";

  const CLASSICS = [
    { id: "pass-marker", nickname: "Pass the Marker", skill: "Passing a pole, tree or signpost, the train travels a distance equal to its own length.", sourcePages: SRC },
    { id: "clear-bridge", nickname: "Clear the Bridge", skill: "To completely cross a bridge or tunnel the train travels its own length plus the structure length.", sourcePages: SRC },
    { id: "bridge-speed", nickname: "Bridge Speed", skill: "Find the speed by dividing the train-plus-bridge distance by the crossing time.", sourcePages: SRC },
    { id: "find-train", nickname: "Find the Train", skill: "Find the train length by taking speed times time and subtracting the bridge length.", sourcePages: SRC },
    { id: "two-bridge", nickname: "Two-Bridge Solve", skill: "Subtract two same-speed crossings to cancel the train length and reveal the speed.", sourcePages: SRC },
    { id: "double-speed", nickname: "Double-Speed Crossing", skill: "When the speed doubles for a second crossing, build two equations to find the train length.", sourcePages: SRC }
  ];

  const CLASSIC_IDS = CLASSICS.map((classic) => classic.id);
  const CLASSIC_BY_ID = Object.fromEntries(CLASSICS.map((classic) => [classic.id, classic]));

  // Maps each classic to a registry skill so the skill-coverage gate can
  // verify the bank covers every skill the registry promises.
  // Registry skills: ["Pass the marker", "Clear the bridge", "Bridge speed",
  // "Find the train", "Two-bridge solve", "Double-speed crossing"].
  const CLASSIC_SKILLS = {
    "pass-marker": "Pass the marker",
    "clear-bridge": "Clear the bridge",
    "bridge-speed": "Bridge speed",
    "find-train": "Find the train",
    "two-bridge": "Two-bridge solve",
    "double-speed": "Double-speed crossing"
  };

  const SOURCE_COVERAGE = {
    "pass-marker": ["Learn and Discover telegraph pole", "Exploration 1 train length", "Further exercise signal pole / signpost"],
    "clear-bridge": ["Exploration 2 freight train and bridge", "Homework 2600 m bridge", "Further exercise toy train tunnel"],
    "bridge-speed": ["Exploration 2 speed from crossing", "Practice 460 m and 766 m bridges", "Reasoning Pip's bridge crossing"],
    "find-train": ["Exploration 3 Colne Valley Viaduct", "Homework 1790 m bridge length", "Further exercise 1160 m bridge"],
    "two-bridge": ["Exploration 4 two tunnels", "Homework two-bridge speed and length", "Further exercise two bridges"],
    "double-speed": ["Challenge double-speed bridge", "Extensive exercise tunnel then bridge", "Extensive exercise bullet train"]
  };

  const INTRO_SCENES = [
    {
      title: "Pass the marker",
      purpose: "See that a train passing a point only travels its own length.",
      classicId: "pass-marker",
      kind: "pole",
      durationMs: 12000,
      caption: "A pole, tree or signpost has no width, so the train clears it the instant its tail goes by. Distance travelled equals the train length.",
      voiceover: "Start with the simplest case. When a train passes a pole, a tree or a signpost, the marker has no width. The train is clear the moment its back end goes past, so the distance it travels is exactly its own length."
    },
    {
      title: "Clear the bridge",
      purpose: "Add the bridge length to the train length to cross fully.",
      classicId: "clear-bridge",
      kind: "bridge",
      durationMs: 12500,
      caption: "A bridge has its own length. The train is only fully across when its tail leaves the far end, so it travels its length plus the bridge length.",
      voiceover: "Now give the obstacle a length. To completely cross a bridge or a tunnel, the front goes all the way over and then the tail still has to leave the far end. So the train travels its own length plus the whole bridge length before it is clear."
    },
    {
      title: "Bridge speed",
      purpose: "Divide the total distance by the time to find the speed.",
      classicId: "bridge-speed",
      kind: "bridge",
      durationMs: 12200,
      caption: "Once you know the train plus bridge distance and the time, speed is just distance divided by time, the same rule as always.",
      voiceover: "Speed problems use the same total distance. Add the train length to the bridge length to get the distance the train covers, then divide that distance by the crossing time. Distance divided by time gives the speed in metres per second."
    },
    {
      title: "Find the train",
      purpose: "Work backwards from speed and time to the train length.",
      classicId: "find-train",
      kind: "bridge",
      durationMs: 12300,
      caption: "Speed times time gives the whole distance. Subtract the bridge length and what remains is the hidden train length.",
      voiceover: "Sometimes the train length is the mystery. Multiply the speed by the time to get the total distance the train travelled. That total is the train plus the bridge, so subtract the bridge length and the number left over is the length of the train itself."
    },
    {
      title: "Two-bridge solve",
      purpose: "Subtract two same-speed crossings to cancel the train length.",
      classicId: "two-bridge",
      kind: "two",
      durationMs: 13000,
      caption: "The same train crosses two bridges at the same speed. Subtracting the two crossings makes the unknown train length disappear.",
      voiceover: "Here is the clever step. The same train crosses two different bridges at the same speed. Write distance equals speed times time for each crossing. When you subtract one from the other, the train length cancels out, and you are left with just the speed."
    },
    {
      title: "Double-speed crossing",
      purpose: "Use two equations when the second crossing doubles the speed.",
      classicId: "double-speed",
      kind: "two",
      durationMs: 13200,
      caption: "The second crossing is at double the speed. Two equations, one with speed and one with double speed, pin down the train length.",
      voiceover: "The hardest case changes the speed. The first crossing uses one speed and the second crossing uses double that speed. Write an equation for each, remembering to double the speed in the second one, then combine them to find the speed first and the train length second."
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatMathText(value) {
    return String(value)
      .replace(/\^1/g, "¹")
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³");
  }

  function parseNumber(value) {
    const text = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return text ? Number(text[0]) : NaN;
  }

  function trainChoice(choices, correct, variantIndex) {
    const unique = [...new Set(choices.map(String))];
    const without = unique.filter((choice) => choice !== String(correct));
    const ordered = [String(correct), ...without].slice(0, 4);
    const offset = variantIndex % ordered.length;
    const rotated = ordered.slice(offset).concat(ordered.slice(0, offset));
    return rotated.map((label) => ({ label, isCorrect: label === String(correct) }));
  }

  function problemBase(classicId, variantIndex, answerType) {
    const classic = CLASSIC_BY_ID[classicId];
    return {
      id: `${classicId}-${variantIndex}`,
      classicId,
      classic: classic.nickname,
      skill: classic.skill,
      sourcePages: classic.sourcePages,
      variantIndex,
      answerType,
      answerMode: answerType === "choice" ? "choice" : "filled"
    };
  }

  function finishChoice(p, correct, distractors, variantIndex) {
    p.expected = correct;
    p.correctInput = p.answerType === "choice" ? { choice: String(correct) } : { value: String(correct) };
    p.choices = p.answerType === "choice" ? trainChoice([correct, ...distractors], correct, variantIndex) : [];
    return p;
  }

  // ---- generators ------------------------------------------------------------

  function passMarkerProblem(variantIndex) {
    const cases = [
      { length: 120, speed: 24, marker: "pole" },
      { length: 180, speed: 15, marker: "signpost" },
      { length: 400, speed: 40, marker: "tree" },
      { length: 360, speed: 30, marker: "telegraph pole" },
      { length: 250, speed: 25, marker: "signal post" },
      { length: 300, speed: 20, marker: "lamp post" }
    ];
    const data = cases[variantIndex % cases.length];
    const time = data.length / data.speed;
    const p = problemBase("pass-marker", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train ${data.length} m long passes a ${data.marker} at a constant speed of ${data.speed} m/s. How many seconds does it take to pass the ${data.marker} completely?`;
    p.expectedDisplay = `${time} s`;
    p.hint1 = "A pole, tree or signpost has no width, so the train only has to travel its own length.";
    p.hint2 = `time = train length ÷ speed = ${data.length} ÷ ${data.speed}.`;
    p.solution = `The train travels its own length: ${data.length} ÷ ${data.speed} = ${time} seconds.`;
    p.visual = { type: "pole", length: data.length, markerLabel: data.marker, note: "distance = train length" };
    return finishChoice(p, time, [time + 3, time + 7, Math.max(1, Math.round(time / 2))], variantIndex);
  }

  function clearBridgeProblem(variantIndex) {
    const cases = [
      { train: 150, bridge: 350, speed: 25, structure: "bridge" },
      { train: 400, bridge: 2600, speed: 20, structure: "bridge" },
      { train: 300, bridge: 1200, speed: 20, structure: "viaduct" },
      { train: 180, bridge: 420, speed: 20, structure: "bridge" },
      { train: 120, bridge: 720, speed: 21, structure: "tunnel" },
      { train: 450, bridge: 1350, speed: 18, structure: "bridge" }
    ];
    const data = cases[variantIndex % cases.length];
    const distance = data.train + data.bridge;
    const time = distance / data.speed;
    const p = problemBase("clear-bridge", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train ${data.train} m long travels at ${data.speed} m/s and must completely cross a ${data.structure} that is ${data.bridge} m long. How many seconds does this take?`;
    p.expectedDisplay = `${time} s`;
    p.hint1 = "To clear a bridge or tunnel the train travels its own length PLUS the whole structure length.";
    p.hint2 = `time = (train + ${data.structure}) ÷ speed = (${data.train} + ${data.bridge}) ÷ ${data.speed}.`;
    p.solution = `Distance = ${data.train} + ${data.bridge} = ${distance} m. Time = ${distance} ÷ ${data.speed} = ${time} s.`;
    p.visual = { type: "bridge", train: data.train, bridge: data.bridge, structureLabel: data.structure, note: "distance = train + bridge" };
    return finishChoice(p, time, [data.bridge / data.speed, time + 10, Math.round(distance / (data.speed * 2))], variantIndex);
  }

  function bridgeSpeedProblem(variantIndex) {
    const cases = [
      { train: 120, bridge: 720, time: 40, structure: "bridge" },
      { train: 170, bridge: 460, time: 35, structure: "bridge" },
      { train: 180, bridge: 420, time: 30, structure: "tunnel" },
      { train: 400, bridge: 2600, time: 150, structure: "bridge" },
      { train: 300, bridge: 1200, time: 75, structure: "viaduct" },
      { train: 150, bridge: 350, time: 20, structure: "bridge" }
    ];
    const data = cases[variantIndex % cases.length];
    const distance = data.train + data.bridge;
    const speed = distance / data.time;
    const p = problemBase("bridge-speed", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train ${data.train} m long takes ${data.time} s to completely cross a ${data.structure} ${data.bridge} m long. What is its speed in m/s?`;
    p.expectedDisplay = `${speed} m/s`;
    p.hint1 = "First find the total distance: the train length added to the structure length.";
    p.hint2 = `speed = (${data.train} + ${data.bridge}) ÷ ${data.time}.`;
    p.solution = `Distance = ${data.train} + ${data.bridge} = ${distance} m. Speed = ${distance} ÷ ${data.time} = ${speed} m/s.`;
    p.visual = { type: "bridge", train: data.train, bridge: data.bridge, structureLabel: data.structure, note: "speed = (train + bridge) ÷ time" };
    return finishChoice(p, speed, [Math.round(data.bridge / data.time), speed + 3, Math.round(distance / (data.time / 2))], variantIndex);
  }

  function findTrainProblem(variantIndex) {
    const cases = [
      { speed: 20, time: 60, bridge: 1160, structure: "bridge" },
      { speed: 100, time: 20, bridge: 1790, structure: "bridge" },
      { speed: 20, time: 150, bridge: 2600, structure: "bridge" },
      { speed: 73, time: 50, bridge: 3400, structure: "viaduct" },
      { speed: 20, time: 30, bridge: 440, structure: "tunnel" },
      { speed: 15, time: 30, bridge: 210, structure: "bridge" }
    ];
    const data = cases[variantIndex % cases.length];
    const distance = data.speed * data.time;
    const train = distance - data.bridge;
    const p = problemBase("find-train", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train crosses a ${data.structure} ${data.bridge} m long at ${data.speed} m/s, taking ${data.time} s to pass it completely. How long is the train, in metres?`;
    p.expectedDisplay = `${train} m`;
    p.hint1 = "Speed times time gives the whole distance the train travels, which is the train plus the structure.";
    p.hint2 = `train = speed × time − ${data.structure} = ${data.speed} × ${data.time} − ${data.bridge}.`;
    p.solution = `Distance = ${data.speed} × ${data.time} = ${distance} m. Train = ${distance} − ${data.bridge} = ${train} m.`;
    p.visual = { type: "bridge", train, bridge: data.bridge, structureLabel: data.structure, note: "train = speed × time − bridge", hideTrain: true };
    return finishChoice(p, train, [distance, data.bridge - train, train + 50], variantIndex);
  }

  function twoBridgeProblem(variantIndex) {
    const cases = [
      { b1: 480, t1: 30, b2: 810, t2: 45, s1: "bridge", s2: "bridge" },
      { b1: 460, t1: 35, b2: 766, t2: 52, s1: "bridge", s2: "bridge" },
      { b1: 600, t1: 39, b2: 840, t2: 51, s1: "tunnel", s2: "tunnel" },
      { b1: 1200, t1: 65, b2: 1600, t2: 85, s1: "bridge", s2: "tunnel" },
      { b1: 400, t1: 30, b2: 560, t2: 40, s1: "bridge", s2: "bridge" },
      { b1: 780, t1: 38, b2: 1730, t2: 76, s1: "bridge", s2: "bridge" }
    ];
    const data = cases[variantIndex % cases.length];
    const speed = (data.b2 - data.b1) / (data.t2 - data.t1);
    const train = speed * data.t1 - data.b1;
    const p = problemBase("two-bridge", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train passes a ${data.s1} ${data.b1} m long in ${data.t1} s, and a ${data.s2} ${data.b2} m long in ${data.t2} s, both at the same constant speed. What is the train's speed in m/s?`;
    p.expectedDisplay = `${speed} m/s`;
    p.hint1 = "Same train, same speed: subtract the two crossings so the unknown train length cancels out.";
    p.hint2 = `speed = (${data.b2} − ${data.b1}) ÷ (${data.t2} − ${data.t1}).`;
    p.solution = `Subtracting removes the train length: speed = (${data.b2} − ${data.b1}) ÷ (${data.t2} − ${data.t1}) = ${data.b2 - data.b1} ÷ ${data.t2 - data.t1} = ${speed} m/s.`;
    p.visual = { type: "two", train, bridge1: data.b1, bridge2: data.b2, note: "subtract to cancel train length", hideTrain: true };
    return finishChoice(p, speed, [Math.round(data.b2 / data.t2), speed + 4, Math.round((data.b2 - data.b1) / data.t2)], variantIndex);
  }

  function doubleSpeedProblem(variantIndex) {
    const cases = [
      { b1: 400, t1: 40, b2: 700, t2: 30, s1: "tunnel", s2: "bridge" },
      { b1: 100, t1: 15, b2: 150, t2: 10, s1: "bridge", s2: "bridge" },
      { b1: 500, t1: 30, b2: 800, t2: 20, s1: "bridge", s2: "bridge" },
      { b1: 300, t1: 25, b2: 500, t2: 15, s1: "tunnel", s2: "tunnel" },
      { b1: 360, t1: 24, b2: 560, t2: 16, s1: "bridge", s2: "tunnel" },
      { b1: 200, t1: 20, b2: 360, t2: 12, s1: "bridge", s2: "bridge" }
    ];
    const data = cases[variantIndex % cases.length];
    const speed = (data.b2 - data.b1) / (2 * data.t2 - data.t1);
    const train = speed * data.t1 - data.b1;
    const p = problemBase("double-speed", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A train crosses a ${data.s1} ${data.b1} m long in ${data.t1} s. Then, travelling at DOUBLE the speed, it crosses a ${data.s2} ${data.b2} m long in ${data.t2} s. How long is the train, in metres?`;
    p.expectedDisplay = `${train} m`;
    p.hint1 = "Write two equations: length + first = speed × time, and length + second = double speed × time.";
    p.hint2 = `The first speed is (${data.b2} − ${data.b1}) ÷ (2×${data.t2} − ${data.t1}).`;
    p.solution = `Speed = (${data.b2} − ${data.b1}) ÷ (2×${data.t2} − ${data.t1}) = ${speed} m/s. Train = ${speed} × ${data.t1} − ${data.b1} = ${train} m.`;
    p.visual = { type: "two", train, bridge1: data.b1, bridge2: data.b2, note: "double the second speed, then solve", hideTrain: true };
    return finishChoice(p, train, [speed, data.b2 - data.b1, train + 50], variantIndex);
  }

  function generateProblem(classicId, variantIndex = 0) {
    const generators = {
      "pass-marker": passMarkerProblem,
      "clear-bridge": clearBridgeProblem,
      "bridge-speed": bridgeSpeedProblem,
      "find-train": findTrainProblem,
      "two-bridge": twoBridgeProblem,
      "double-speed": doubleSpeedProblem
    };
    const generator = generators[classicId];
    if (!generator) return null;
    const problem = generator(variantIndex);
    if (problem && CLASSIC_SKILLS[classicId]) problem.skillTag = CLASSIC_SKILLS[classicId];
    return problem;
  }

  function validateProblemMath(problem) {
    return Number.isFinite(Number(problem.expected)) || typeof problem.expected === "string";
  }

  function checkAnswer(problem, input) {
    if (problem.answerType === "choice") {
      const value = String(input.choice ?? "");
      const correct = value === String(problem.expected);
      return { isCorrect: correct, errorClass: correct ? null : "choice_mismatch" };
    }
    const value = parseNumber(input.value);
    const correct = Math.abs(value - Number(problem.expected)) < 1e-8;
    return { isCorrect: correct, errorClass: correct ? null : "number_mismatch" };
  }

  function svgShell(inner) {
    return `<svg viewBox="0 0 560 330" role="img" aria-label="Train problems visual">${inner}</svg>`;
  }

  function renderProblemVisual(problem, state = "initial") {
    const v = problem.visual;
    const isRevealed = state === "solution" || state === "worked";
    const answer = isRevealed
      ? `<text x="280" y="316" text-anchor="middle" class="formula-note">Answer: ${escapeHtml(problem.expectedDisplay)}</text>`
      : "";
    let html = "";
    let text = problem.skill;
    if (v.type === "pole") {
      html = svgShell(`
        <line x1="40" y1="252" x2="520" y2="252" stroke="#16345d" stroke-width="6" data-label-for="track"/>
        <rect x="110" y="206" width="220" height="44" rx="8" fill="#ff7654" stroke="#16345d" stroke-width="4"/>
        <line x1="470" y1="150" x2="470" y2="252" stroke="#0b8993" stroke-width="6" data-label-for="marker"/>
        <text x="220" y="234" text-anchor="middle" class="side-label">train ${v.length}</text>
        <text x="470" y="140" text-anchor="middle" class="side-label">${escapeHtml(v.markerLabel)}</text>
        <text x="280" y="64" text-anchor="middle" class="formula-note">${escapeHtml(v.note)}</text>
        ${answer}
      `);
      text = "A train passing a point marker travels a distance equal to its own length.";
    } else if (v.type === "bridge") {
      html = svgShell(`
        <line x1="40" y1="252" x2="520" y2="252" stroke="#16345d" stroke-width="6" data-label-for="track"/>
        <rect x="90" y="206" width="170" height="44" rx="8" fill="#ff7654" stroke="#16345d" stroke-width="4"/>
        <rect x="300" y="190" width="200" height="62" fill="#fff8dc" stroke="#16345d" stroke-width="4" data-label-for="structure"/>
        <text x="175" y="234" text-anchor="middle" class="side-label">train ${(v.hideTrain && !isRevealed) ? "?" : v.train}</text>
        <text x="400" y="226" text-anchor="middle" class="side-label">${escapeHtml(v.structureLabel)} ${v.bridge}</text>
        <text x="280" y="64" text-anchor="middle" class="formula-note">${escapeHtml(v.note)}</text>
        ${answer}
      `);
      text = "To clear a bridge or tunnel the train travels its own length plus the structure length.";
    } else {
      html = svgShell(`
        <line x1="40" y1="252" x2="520" y2="252" stroke="#16345d" stroke-width="6" data-label-for="track"/>
        <rect x="70" y="208" width="130" height="42" rx="8" fill="#ff7654" stroke="#16345d" stroke-width="4"/>
        <rect x="230" y="196" width="120" height="56" fill="#fff8dc" stroke="#16345d" stroke-width="4" data-label-for="structure-one"/>
        <rect x="380" y="184" width="140" height="68" fill="#fdeecf" stroke="#16345d" stroke-width="4" data-label-for="structure-two"/>
        <text x="135" y="234" text-anchor="middle" class="side-label">train ${(v.hideTrain && !isRevealed) ? "?" : v.train}</text>
        <text x="290" y="228" text-anchor="middle" class="side-label">first ${v.bridge1}</text>
        <text x="450" y="222" text-anchor="middle" class="side-label">second ${v.bridge2}</text>
        <text x="280" y="64" text-anchor="middle" class="formula-note">${escapeHtml(v.note)}</text>
        ${answer}
      `);
      text = "Two crossings by the same train let you subtract to cancel the train length.";
    }
    return { html, text };
  }

  function renderIntroScene(index) {
    const scene = INTRO_SCENES[index % INTRO_SCENES.length];
    const fakeProblem = generateProblem(scene.classicId || CLASSIC_IDS[index % CLASSIC_IDS.length], index);
    return renderProblemVisual({ ...fakeProblem, expectedDisplay: scene.title }, "initial").html;
  }

  function createRound(offset = 0) {
    return CLASSIC_IDS.map((classicId, index) => generateProblem(classicId, offset + index));
  }

  const api = {
    CLASSICS,
    CLASSIC_IDS,
    CLASSIC_SKILLS,
    SOURCE_COVERAGE,
    INTRO_SCENES,
    INTRO_SCENE_MS,
    ROUND_LENGTH,
    formatMathText,
    parseNumber,
    generateProblem,
    validateProblemMath,
    checkAnswer,
    renderProblemVisual,
    renderIntroScene,
    createRound
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
    return;
  }

  root.TrainProblemsModule = api;

  // ---- browser UI driver -----------------------------------------------------

  const state = {
    introIndex: 0,
    introPlaying: false,
    introStartedAt: 0,
    introTimer: null,
    audioEnabled: true,
    currentUtterance: null,
    roundOffset: 0,
    round: createRound(0),
    current: 0,
    answers: [],
    hintCount: 0
  };

  const $ = (id) => document.getElementById(id);

  function speechEngine() {
    return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  }

  function chooseNarrationVoice() {
    const synth = speechEngine();
    if (!synth) return null;
    const voices = synth.getVoices();
    const englishVoices = voices.filter((voice) => /^en/i.test(voice.lang || ""));
    return englishVoices.find((voice) => /natural|online|neural|jenny|aria|sonia|libby/i.test(voice.name))
      || englishVoices.find((voice) => /microsoft|google/i.test(voice.name))
      || englishVoices[0]
      || voices[0]
      || null;
  }

  function updateAudioStatus(message) {
    const status = $("intro-audio-status");
    if (status) status.textContent = message;
    const button = $("intro-audio");
    if (button) button.textContent = state.audioEnabled ? "Audio on" : "Audio off";
  }

  function cancelIntroSpeech() {
    const synth = speechEngine();
    if (synth) synth.cancel();
    const audio = $("intro-audio-player");
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (error) {
        // Some browsers cannot reset currentTime until metadata has loaded.
      }
    }
    state.currentUtterance = null;
  }

  function speakIntroSceneFallback() {
    const synth = speechEngine();
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      updateAudioStatus("Audio is not available in this browser, but the narration text is shown below the animation.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(INTRO_SCENES[state.introIndex].voiceover);
    const voice = chooseNarrationVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 1;
    utterance.onstart = () => updateAudioStatus("Audio playing.");
    utterance.onend = () => {
      state.currentUtterance = null;
      updateAudioStatus(state.introPlaying ? "Audio ready for the next scene." : "Audio ready.");
    };
    utterance.onerror = () => {
      state.currentUtterance = null;
      updateAudioStatus("Audio was blocked by the browser. Press Play intro video again to restart it.");
    };
    state.currentUtterance = utterance;
    updateAudioStatus("Audio starting.");
    synth.speak(utterance);
  }

  function speakIntroScene() {
    if (!state.audioEnabled) {
      updateAudioStatus("Audio off. Turn it on to hear the narration.");
      return;
    }
    cancelIntroSpeech();
    const scene = INTRO_SCENES[state.introIndex];
    const audio = $("intro-audio-player");
    if (!audio || !scene.audio) {
      speakIntroSceneFallback();
      return;
    }
    let fallbackStarted = false;
    const startFallback = () => {
      if (fallbackStarted) return;
      fallbackStarted = true;
      updateAudioStatus("Audio file was blocked, so I am trying the browser narration instead.");
      speakIntroSceneFallback();
    };
    audio.src = scene.audio;
    try {
      audio.currentTime = 0;
    } catch (error) {
      // The browser may need metadata before accepting a seek.
    }
    audio.onplay = () => updateAudioStatus("Audio playing.");
    audio.onended = () => updateAudioStatus(state.introPlaying ? "Audio ready for the next scene." : "Audio ready.");
    audio.onerror = startFallback;
    updateAudioStatus("Audio starting.");
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(startFallback);
  }

  function currentIntroDurationMs() {
    const scene = INTRO_SCENES[state.introIndex];
    return scene.durationMs || INTRO_SCENE_MS;
  }

  function toggleIntroAudio() {
    state.audioEnabled = !state.audioEnabled;
    if (!state.audioEnabled) {
      cancelIntroSpeech();
      updateAudioStatus("Audio off. The narration text remains visible.");
      return;
    }
    updateAudioStatus("Audio on. Press Play intro video to hear the narration.");
    if (state.introPlaying) speakIntroScene();
  }

  function renderIntro() {
    const scene = INTRO_SCENES[state.introIndex];
    $("intro-title").textContent = scene.title;
    $("intro-count").textContent = `${state.introIndex + 1} of ${INTRO_SCENES.length}`;
    $("intro-frame").innerHTML = renderIntroScene(state.introIndex);
    $("intro-frame").classList.toggle("playing", state.introPlaying);
    $("intro-voiceover").textContent = scene.voiceover;
    $("intro-caption").textContent = scene.caption;
    $("intro-storyboard").innerHTML = INTRO_SCENES.map((item, index) => `<li class="${index === state.introIndex ? "active" : ""}"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.purpose)}</li>`).join("");
    $("intro-play").textContent = state.introPlaying ? "Pause intro" : (state.introIndex === INTRO_SCENES.length - 1 ? "Replay intro" : "Play intro video");
    updateAudioStatus(state.audioEnabled ? "Audio ready. Press Play intro video to hear the narration." : "Audio off. The narration text remains visible.");
  }

  function clearIntroTimer() {
    if (state.introTimer) {
      clearInterval(state.introTimer);
      state.introTimer = null;
    }
  }

  function setIntroProgress(percent) {
    const fill = $("intro-progress-fill");
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }

  function stopIntroPlayback(progress = 0) {
    clearIntroTimer();
    cancelIntroSpeech();
    state.introPlaying = false;
    setIntroProgress(progress);
    renderIntro();
  }

  function advanceIntro(keepPlaying = false) {
    const atEnd = state.introIndex >= INTRO_SCENES.length - 1;
    if (atEnd && keepPlaying) {
      stopIntroPlayback(100);
      return;
    }
    state.introIndex = atEnd ? 0 : state.introIndex + 1;
    if (keepPlaying) startIntroPlayback();
    else {
      cancelIntroSpeech();
      state.introPlaying = false;
      setIntroProgress(0);
      renderIntro();
    }
  }

  function startIntroPlayback() {
    clearIntroTimer();
    if (state.introIndex >= INTRO_SCENES.length - 1 && !state.introPlaying) state.introIndex = 0;
    state.introPlaying = true;
    state.introStartedAt = Date.now();
    setIntroProgress(0);
    renderIntro();
    speakIntroScene();
    state.introTimer = setInterval(() => {
      const percent = ((Date.now() - state.introStartedAt) / currentIntroDurationMs()) * 100;
      setIntroProgress(percent);
      if (percent >= 100) advanceIntro(true);
    }, 80);
  }

  function toggleIntroPlayback() {
    if (state.introPlaying) stopIntroPlayback(Number($("intro-progress-fill").style.width.replace("%", "")) || 0);
    else startIntroPlayback();
  }

  function renderSkills() {
    $("intro-skill-grid").innerHTML = CLASSICS.map((classic) => `<div class="skill-tile"><strong>${escapeHtml(classic.nickname)}</strong><span>${escapeHtml(classic.skill)}</span></div>`).join("");
    $("mastery-chips").innerHTML = CLASSICS.map((classic) => `<div class="classic-chip"><strong>${escapeHtml(classic.nickname)}</strong></div>`).join("");
  }

  function showIntro() {
    $("intro-screen").hidden = false;
    $("practice-grid").hidden = true;
    $("round-recap").hidden = true;
    renderIntro();
  }

  function showPractice() {
    stopIntroPlayback(0);
    $("intro-screen").hidden = true;
    $("practice-grid").hidden = false;
    $("round-recap").hidden = true;
    renderProblem();
  }

  function currentProblem() {
    return state.round[state.current];
  }

  function renderAnswerHost(problem) {
    if (problem.answerType === "choice") {
      return `<div class="choice-grid">${problem.choices.map((choice) => `<label class="choice-card"><input type="radio" name="choice" value="${escapeHtml(choice.label)}"><span>${escapeHtml(formatMathText(choice.label))}</span></label>`).join("")}</div>`;
    }
    return `<input class="filled-answer" name="value" autocomplete="off" inputmode="decimal" placeholder="Type the number">`;
  }

  function renderProblem() {
    const problem = currentProblem();
    state.hintCount = 0;
    $("classic-label").textContent = problem.classic;
    $("session-count").textContent = `${state.current + 1} of ${state.round.length}`;
    $("problem-prompt").textContent = problem.prompt;
    $("answer-host").innerHTML = renderAnswerHost(problem);
    $("hint-ladder").innerHTML = "";
    $("feedback").className = "feedback-card muted";
    $("feedback").textContent = "Choose or type an answer, then check it.";
    $("similar-button").hidden = true;
    renderVisual("initial");
    renderScore();
  }

  function renderVisual(mode) {
    const rendered = renderProblemVisual(currentProblem(), mode);
    $("visual-frame").innerHTML = rendered.html;
    $("visual-text").textContent = rendered.text;
    $("visual-state").textContent = mode;
  }

  function renderScore() {
    const attempted = state.answers.filter(Boolean).length;
    const correct = state.answers.filter((answer) => answer && answer.isCorrect).length;
    $("live-score").textContent = `Score ${correct} / ${attempted} · Unanswered ${state.round.length - attempted}`;
  }

  function collectInput() {
    const form = new FormData($("answer-form"));
    return { choice: form.get("choice"), value: form.get("value") };
  }

  function checkCurrent(event) {
    event.preventDefault();
    const problem = currentProblem();
    const result = checkAnswer(problem, collectInput());
    state.answers[state.current] = result;
    $("feedback").className = `feedback-card ${result.isCorrect ? "correct" : "wrong"}`;
    $("feedback").textContent = result.isCorrect ? `Correct. ${problem.solution}` : `Not quite. ${problem.hint1}`;
    $("similar-button").hidden = result.isCorrect;
    renderVisual(result.isCorrect ? "solution" : "hint");
    renderScore();
  }

  function showHint() {
    const problem = currentProblem();
    state.hintCount += 1;
    const hint = state.hintCount === 1 ? problem.hint1 : problem.hint2;
    $("hint-ladder").insertAdjacentHTML("beforeend", `<div>${escapeHtml(formatMathText(hint))}</div>`);
    renderVisual("hint");
  }

  function showWhy() {
    $("feedback").className = "feedback-card";
    $("feedback").textContent = currentProblem().solution;
    renderVisual("solution");
  }

  function nextProblem() {
    if (state.current < state.round.length - 1) {
      state.current += 1;
      renderProblem();
    } else {
      showRecap();
    }
  }

  function showRecap() {
    $("practice-grid").hidden = true;
    $("round-recap").hidden = false;
    const missed = state.round.filter((_, index) => !state.answers[index]?.isCorrect);
    $("recap-content").innerHTML = missed.length
      ? missed.map((problem) => `<div><strong>${escapeHtml(problem.classic)}</strong><br>${escapeHtml(problem.skill)}</div>`).join("")
      : "<div><strong>Clean round.</strong><br>You added the train length, cleared the bridges, and subtracted two crossings accurately.</div>";
  }

  function freshRound() {
    // Advance by 1 (coprime with every generator's case-list length) so a
    // fresh round shifts each classic to a genuinely different variant rather
    // than landing on the same case via variantIndex % cases.length.
    state.roundOffset += 1;
    state.round = createRound(state.roundOffset);
    state.current = 0;
    state.answers = [];
    showPractice();
  }

  function boot() {
    renderSkills();
    renderIntro();
    $("show-intro").addEventListener("click", showIntro);
    $("show-practice").addEventListener("click", showPractice);
    $("intro-start").addEventListener("click", showPractice);
    $("intro-audio").addEventListener("click", toggleIntroAudio);
    $("intro-next").addEventListener("click", () => advanceIntro(false));
    $("intro-play").addEventListener("click", toggleIntroPlayback);
    $("answer-form").addEventListener("submit", checkCurrent);
    $("hint-button").addEventListener("click", showHint);
    $("why-button").addEventListener("click", showWhy);
    $("next-button").addEventListener("click", nextProblem);
    $("similar-button").addEventListener("click", () => {
      state.round[state.current] = generateProblem(currentProblem().classicId, currentProblem().variantIndex + 1);
      state.answers[state.current] = undefined;
      renderProblem();
    });
    $("fresh-round-button").addEventListener("click", freshRound);
    $("review-intro-button").addEventListener("click", showIntro);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : globalThis);
