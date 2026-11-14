#!/usr/bin/env node
// Usage: node test/tokenize.js <scope> <file>
// Prints each token with the innermost scope, one per line.
"use strict";
const fs = require("fs");
const path = require("path");
const vsctm = require("vscode-textmate");
const oniguruma = require("vscode-oniguruma");

const root = path.join(__dirname, "..");
const wasm = fs.readFileSync(require.resolve("vscode-oniguruma/release/onig.wasm")).buffer;
const onigLib = oniguruma.loadWASM(wasm).then(() => ({
	createOnigScanner: (p) => new oniguruma.OnigScanner(p),
	createOnigString: (s) => new oniguruma.OnigString(s),
}));
const files = {
	"source.armasm": "armasm", "source.bbcbasic": "bbcbasic", "source.cmhg": "cmhg",
};
const registry = new vsctm.Registry({
	onigLib,
	loadGrammar: async (scope) => {
		if (!files[scope]) return null;
		const p = path.join(root, "grammars", files[scope] + ".tmLanguage.json");
		return vsctm.parseRawGrammar(fs.readFileSync(p, "utf8"), p);
	},
});

async function tokenize(scope, text) {
	const grammar = await registry.loadGrammar(scope);
	let state = vsctm.INITIAL;
	const out = [];
	for (const line of text.split(/\r?\n/)) {
		const r = grammar.tokenizeLine(line, state);
		const toks = r.tokens.map((t) => [line.slice(t.startIndex, t.endIndex), t.scopes.slice(1)]);
		out.push(toks);
		state = r.ruleStack;
	}
	return out;
}
module.exports = { tokenize };

if (require.main === module) {
	const [scope, file] = process.argv.slice(2);
	tokenize(scope, fs.readFileSync(file, "utf8")).then((lines) => {
		lines.forEach((toks, i) => {
			console.log(`--- ${i + 1}`);
			for (const [text, scopes] of toks) {
				if (/^\s*$/.test(text) && scopes.length === 0) continue;
				console.log(`  ${JSON.stringify(text).padEnd(24)} ${scopes.join(" ")}`);
			}
		});
	});
}
