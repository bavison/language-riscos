#!/usr/bin/env node
// Tokenises each file in test/fixtures and compares the result against the
// snapshot in test/snapshots. Run with --update to rewrite the snapshots.
"use strict";
const fs = require("fs");
const path = require("path");
const { tokenize } = require("./tokenize");

const scopes = { ".s": "source.armasm", ".bas": "source.bbcbasic", ".cmhg": "source.cmhg" };
const update = process.argv.includes("--update");
const fixtures = path.join(__dirname, "fixtures");
const snapshots = path.join(__dirname, "snapshots");

(async () => {
	let failed = 0;
	for (const file of fs.readdirSync(fixtures).sort()) {
		const scope = scopes[path.extname(file)];
		if (!scope) continue;
		const lines = await tokenize(scope, fs.readFileSync(path.join(fixtures, file), "utf8"));
		const actual = lines.map((toks, i) => [`--- ${i + 1}`, ...toks
			.filter(([text, s]) => !(/^\s*$/.test(text) && s.length === 0))
			.map(([text, s]) => `  ${JSON.stringify(text).padEnd(24)} ${s.join(" ")}`)].join("\n")).join("\n") + "\n";
		const snap = path.join(snapshots, file + ".txt");
		if (update || !fs.existsSync(snap)) {
			fs.writeFileSync(snap, actual);
			console.log(`updated ${file}`);
		} else if (fs.readFileSync(snap, "utf8") !== actual) {
			console.error(`FAIL ${file}: tokens differ from snapshot`);
			failed++;
		} else {
			console.log(`ok   ${file}`);
		}
	}
	process.exit(failed ? 1 : 0);
})();
