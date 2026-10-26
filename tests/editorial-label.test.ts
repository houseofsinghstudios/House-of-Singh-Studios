// Editorial labels add their own brackets, so the text passed in must not include them.
// Every literal label in src is rendered here and checked for doubled brackets. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Children, isValidElement, type ReactNode } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";
import { HERO } from "@/lib/constants/homepage-data";

const text = (node: ReactNode): string =>
  Children.toArray(node).map((c) => (isValidElement<{ children?: ReactNode }>(c) ? text(c.props.children) : String(c))).join("");

const rendered = (label: string, number?: string) => text(EditorialLabel({ text: label, number }));

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? sourceFiles(p) : /\.tsx$/.test(e.name) ? [p] : [];
  });
}

test("a label renders one pair of brackets: around the text, or around the number before it", () => {
  assert.equal(rendered("02"), "(02)");
  assert.equal(rendered("Featured Work", "01"), "(01) Featured Work");
});

test("no label in src renders doubled brackets", () => {
  const labels: { file: string; label: string; number?: string }[] = [];
  for (const file of sourceFiles(path.join(process.cwd(), "src"))) {
    for (const m of fs.readFileSync(file, "utf8").matchAll(/<EditorialLabel\b([^>]*)>/g)) {
      const text = m[1].match(/\btext="([^"]*)"/)?.[1];
      const number = m[1].match(/\bnumber="([^"]*)"/)?.[1];
      if (text !== undefined) labels.push({ file, label: text, number });
    }
  }
  labels.push({ file: "HERO.label", label: HERO.label });
  assert.ok(labels.length > 5, "found the labels");
  for (const { file, label, number } of labels) {
    const out = rendered(label, number);
    assert.ok(!out.includes("((") && !out.includes("))"), `${path.relative(process.cwd(), file)}: "${out}"`);
  }
});
