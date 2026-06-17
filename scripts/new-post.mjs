// scripts/new-post.mjs
// Cree un nouvel article avec frontmatter pre-rempli et pubDate horodate
// automatiquement a l'heure de Paris (fuseau ete/hiver calcule tout seul).
//
//   npm run post -- "Mon titre d'article"
//   (ou : node scripts/new-post.mjs "Mon titre d'article")

import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = "src/content/posts";

// --- titre depuis la ligne de commande ---
const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage : npm run post -- "Mon titre d\'article"');
  process.exit(1);
}

// --- slug : minuscules, sans accents, tirets ---
function slugify(t) {
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// --- decalage Europe/Paris pour une date donnee, ex "+02:00" ---
function parisOffset(date) {
  const tz = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName").value; // ex "GMT+02:00"
  const m = tz.match(/([+-]\d{2}:\d{2})/);
  return m ? m[1] : "+00:00";
}

// --- pubDate ISO a l'heure murale de Paris + fuseau ---
function parisNowISO() {
  const now = new Date();
  const wall = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
    .format(now)
    .replace(" ", "T"); // "2026-06-17T16:05:00"
  return wall + parisOffset(now);
}

const slug = slugify(title);
if (!slug) {
  console.error("[post] titre invalide (slug vide).");
  process.exit(1);
}

const filePath = path.join(POSTS_DIR, `${slug}.md`);
if (fs.existsSync(filePath)) {
  console.error(`[post] existe deja : ${filePath} (rien ecrit).`);
  process.exit(1);
}

// titre echappe pour le YAML (guillemets doubles)
const yamlTitle = title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const body = `---
title: "${yamlTitle}"
description: ""
pubDate: ${parisNowISO()}
tags: []
draft: true
---

*Sous-titre a completer.*

`;

fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(filePath, body);
console.log(`[post] cree : ${filePath}`);
console.log(`[post] pubDate : ${parisNowISO()}`);
console.log(`[post] draft: true  ->  passe a false quand tu publies.`);
