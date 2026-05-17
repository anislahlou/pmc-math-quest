const assert = require("assert");
const fs = require("fs");
const path = require("path");

const u2t2 = require("../modules/u2t2_units/u2t2_module.js");
const consecutive = require("../modules/consecutive_number_triangles/consecutive_triangles_module.js");
const volume = require("../modules/volume_prisms/volume_prisms_module.js");
const volumeExtension = require("../modules/volume_problem_extension/volume_extension_module.js");
const triangleSides = require("../modules/triangle_sides/triangle_sides_module.js");
const equalHeight = require("../modules/equal_height_triangles/equal_height_triangles_module.js");

function run() {
  assert.strictEqual(volume.formatMathText("cm^2, cm^3, 5^2"), "cm\u00b2, cm\u00b3, 5\u00b2");
  assert.strictEqual(volumeExtension.formatMathText("cm^2, cm^3, 12^3"), "cm\u00b2, cm\u00b3, 12\u00b3");
  assert.strictEqual(u2t2.formatMathText("5^1, x^2, cm^3"), "5\u00b9, x\u00b2, cm\u00b3");
  assert.strictEqual(consecutive.formatMathText("9^2 and last row r = r^2"), "9\u00b2 and last row r = r\u00b2");
  assert.strictEqual(triangleSides.formatMathText("a^2 + b^2 = c^2"), "a\u00b2 + b\u00b2 = c\u00b2");
  assert.strictEqual(equalHeight.formatMathText("area 24 cm^2 and 5^2"), "area 24 cm\u00b2 and 5\u00b2");

  const pascal = fs.readFileSync(path.join(__dirname, "../modules/pascal/pascal_triangle_practice_share.html"), "utf8");
  assert.ok(pascal.includes("function formatMathText"), "Pascal app should include math display formatting");
  assert.ok(pascal.includes("escapeMathHtml(option.label)"), "Pascal choice labels should display superscript powers");
  assert.ok(pascal.includes("plainMathText(text).trim().toLowerCase()"), "Pascal power answers should accept superscript input");

  const dashboard = fs.readFileSync(path.join(__dirname, "../dashboard/math_skill_command_center.html"), "utf8");
  assert.ok(dashboard.includes("Agent Orchestration Dashboard"), "Dashboard should describe the agent command center");
  assert.ok(dashboard.includes("data-agent="), "Dashboard should identify agent steps");
  assert.ok(dashboard.includes("../agents/"), "Dashboard should link to agent protocols");
  assert.ok(dashboard.includes("../modules/"), "Dashboard should link to module folders");
}

if (require.main === module) {
  run();
  console.log("Math display quality check passed.");
}

module.exports = { run };
