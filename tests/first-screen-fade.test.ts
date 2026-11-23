// No entrance fade on the first screen of the Project Planner and Brand Pulse (site audit S-11, Step 5b,
// 23 Nov 2026). Their first screen holds the page's largest text, its LCP; a 0.2s fade from transparent
// made Chrome record it 0.2s after the first paint, which Lighthouse's mobile simulation turned into
// about a second (/start 3.21s to 2.26s without it). The root takes data-moved on the first screen
// change, and only then does each new screen fade in. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file: string) => readFileSync(file, "utf8");

// Every rule in a stylesheet that animates the given screen class, with its selector.
function animatedSelectors(css: string, screen: string): string[] {
  const out: string[] = [];
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    if (selector.split(",").some((s) => s.trim().endsWith(screen)) && /\banimation\s*:(?!\s*none\b)/.test(m[2])) out.push(selector);
  }
  return out;
}

const TOOLS = [
  { name: "planner", css: "src/components/project-planner/planner.css", tsx: "src/components/project-planner/ProjectPlanner.tsx", root: ".pp-root", screen: ".pp-screen", go: /function go\(next: Screen, index = stepIndex\) \{\s*setMoved\(true\);/ },
  { name: "Brand Pulse", css: "src/components/brand-pulse/brand-pulse.css", tsx: "src/components/brand-pulse/BrandPulse.tsx", root: ".bp-root", screen: ".bp-screen", go: /setMoved\(true\);\s*setScreen\(next\);/ },
];

for (const tool of TOOLS) {
  test(`${tool.name}: the screen fades in only once the visitor has moved`, () => {
    const css = read(tool.css);
    assert.deepEqual(animatedSelectors(css, tool.screen), [`${tool.root}[data-moved] ${tool.screen}`], "the fade only under data-moved");
    // Reduced motion still turns it off, at the same strength as the rule it overrides.
    assert.match(css, new RegExp(`@media \\(prefers-reduced-motion: reduce\\) \\{[^@]*${tool.root.replace(".", "\\.")}\\[data-moved\\] ${tool.screen.replace(".", "\\.")}[^{]*\\{\\s*animation: none;`));
  });

  test(`${tool.name}: data-moved starts off and turns on with the first screen change`, () => {
    const src = read(tool.tsx);
    assert.match(src, /const \[moved, setMoved\] = useState\(false\);/);
    assert.match(src, /data-moved=\{moved \? "" : undefined\}/);
    assert.match(src, tool.go, "set where the screen changes");
    assert.equal((src.match(/setMoved\(/g) || []).length, 1, "never turned off again");
  });
}
