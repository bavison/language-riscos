#!/usr/bin/env node
// Converts the YAML grammar sources in src/ into the .tmLanguage.json files
// in grammars/, which are what GitHub Linguist and VS Code consume.
"use strict";
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const root = path.join(__dirname, "..");
for (const file of fs.readdirSync(path.join(root, "src"))) {
	if (!file.endsWith(".yaml")) continue;
	const grammar = yaml.load(fs.readFileSync(path.join(root, "src", file), "utf8"));
	const out = path.join(root, "grammars", file.replace(/\.yaml$/, ".tmLanguage.json"));
	fs.writeFileSync(out, JSON.stringify(grammar, null, "\t") + "\n");
	console.log(`${file} -> ${path.relative(root, out)}`);
}
