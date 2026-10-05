import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const pkg = JSON.parse(read("package.json"));

const effects = {
  gradient: ["motion-gradient"],
  shimmer: ["motion-shimmer"],
  glow: ["motion-glow"],
  border: ["motion-border"],
  buttons: ["motion-button-lift", "motion-button-shine"],
  pulse: ["motion-pulse"],
  underline: ["motion-underline"],
};
const classes = Object.values(effects).flat();
const keyframes = ["motion-gradient", "motion-shimmer", "motion-glow", "motion-border", "motion-pulse"];
const distFiles = ["index.css", "index.min.css", ...Object.keys(effects).map((name) => `${name}.css`)];

const hasClass = (css, name) => new RegExp(`\\.${name}(?![\\w-])`).test(css);
const reducedMotionBlocks = (css) =>
  css.split(/@media\s*\(prefers-reduced-motion:\s*reduce\)/).slice(1).join("\n");

test("build emits every entry file", () => {
  for (const file of distFiles) {
    assert.ok(existsSync(new URL(`dist/${file}`, root)), `dist/${file} is missing`);
  }
});

test("package entry points resolve to built files", () => {
  const targets = [pkg.main, pkg.style, pkg.exports["."].style, pkg.exports["."].default, pkg.exports["./min"]];
  for (const target of targets) {
    assert.ok(existsSync(new URL(target, root)), `${target} is missing`);
  }
});

test("bundles are self-contained and define every class", () => {
  for (const file of ["index.css", "index.min.css"]) {
    const css = read(`dist/${file}`);
    assert.doesNotMatch(css, /@import/, `${file} still has @import`);
    for (const name of classes) {
      assert.ok(hasClass(css, name), `${file} is missing .${name}`);
    }
  }
});

test("bundles define every keyframe animation", () => {
  for (const file of ["index.css", "index.min.css"]) {
    const css = read(`dist/${file}`);
    for (const name of keyframes) {
      assert.match(css, new RegExp(`@keyframes ${name}\\s*\\{`), `${file} is missing @keyframes ${name}`);
    }
  }
});

test("each effect file works standalone and handles reduced motion", () => {
  for (const [file, names] of Object.entries(effects)) {
    const css = read(`dist/${file}.css`);
    const reduced = reducedMotionBlocks(css);
    for (const name of names) {
      assert.ok(hasClass(css, name), `${file}.css is missing .${name}`);
      assert.ok(hasClass(reduced, name), `${file}.css has no reduced-motion rule for .${name}`);
    }
  }
});

test("every selector stays inside the motion- namespace", () => {
  const css = read("dist/index.min.css");
  const found = css.match(/\.[a-zA-Z][\w-]*(?=[^{}]*\{)/g) ?? [];
  const foreign = found.filter((selector) => !selector.startsWith(".motion-"));
  assert.deepEqual(foreign, []);
});

test("published tarball contains only the built CSS and package metadata", () => {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const output = execFileSync(npm, ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  const packed = JSON.parse(output)[0].files.map((file) => file.path).sort();
  const expected = ["LICENSE", "README.md", "package.json", ...distFiles.map((file) => `dist/${file}`)].sort();
  assert.deepEqual(packed, expected);
});
