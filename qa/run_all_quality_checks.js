require("../modules/u2t2_units/u2t2_bank_quality_audit.js").run();
require("../modules/u2t2_units/u2t2_module_tests.js").run();
console.log("All U2T2 module tests passed.");

require("../modules/volume_prisms/volume_prisms_bank_quality_audit.js").run();
require("../modules/volume_prisms/volume_prisms_module_tests.js").run();

require("../modules/volume_problem_extension/volume_extension_bank_quality_audit.js").run();
require("../modules/volume_problem_extension/volume_extension_module_tests.js").run();

require("../modules/triangle_sides/triangle_sides_bank_quality_audit.js").run();
require("../modules/triangle_sides/triangle_sides_module_tests.js").run();

require("../modules/equal_height_triangles/equal_height_triangles_bank_quality_audit.js").run();
require("../modules/equal_height_triangles/equal_height_triangles_module_tests.js").run();

require("./math_display_quality_check.js").run();
console.log("Math display quality check passed.");

require("../modules/angles/angles_module_tests.js");
require("../modules/consecutive_number_triangles/consecutive_triangles_module_tests.js");

console.log("All app quality checks passed.");
