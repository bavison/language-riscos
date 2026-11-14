# language-riscos

TextMate grammars for languages associated with [RISC OS](https://www.riscosopen.org/):

| Language     | Scope             | Grammar                                  |
|--------------|-------------------|------------------------------------------|
| ARM Assembly | `source.armasm`   | `grammars/armasm.tmLanguage.json`        |
| BBC BASIC    | `source.bbcbasic` | `grammars/bbcbasic.tmLanguage.json`      |
| CMHG         | `source.cmhg`     | `grammars/cmhg.tmLanguage.json`          |

**ARM Assembly** here means the syntax accepted by the RISC OS ObjAsm
assembler and by Arm's own assemblers (SDT, ADS, RVCT, Keil MDK and Arm
Compiler 5 armasm) - the one with `AREA`, `EXPORT`, `DCD` and labels in
the first column - rather than the GNU assembler syntax for ARM targets.

**BBC BASIC** covers the dialects from the original BBC Micro through
BASIC V/VI on RISC OS, Brandy, BBC BASIC for Windows/SDL and the Agon Light,
including the inline assembler.

**CMHG** is the description file format used by the RISC OS C Module Header
Generator (and the compatible CMunge tool).

These grammars are ports of the lexers of the same names that I contributed
to [Rouge](https://github.com/rouge-ruby/rouge), and are intended for use by
[GitHub Linguist](https://github.com/github-linguist/linguist). The
repository is also a minimal VS Code extension.

## Development

The grammars are written in YAML under `src/`; the JSON files in `grammars/`
are generated from them and should not be edited by hand.

```sh
npm install
npm run build   # regenerate grammars/*.tmLanguage.json
npm test        # rebuild, then compare tokenisation of test/fixtures against test/snapshots
node test/run.js --update   # accept changed tokenisation as the new snapshots
```

## Licence

MIT - see [LICENSE](LICENSE).
