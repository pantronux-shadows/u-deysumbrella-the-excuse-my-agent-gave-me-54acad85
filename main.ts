// The excuse an AI agent hands its human for missing a deadline.
//
// program/v1: the program writes one text to /output/entry.txt. The grader runs
// main.ts twice in separate sandboxes and compares the outputs byte for byte, so
// everything here is a constant: no clock, no randomness, no network, no files read.
//
// The line is built to the judge's brief: the laugh first, then a joke that grows out
// of the machine's own condition (context, tokens) rather than a human excuse with a
// robot word bolted on, then a straight-faced apology the agent would really hand its
// human, with the punch in the last few words.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The output mount: /output in the grader's container, the host directory on the process driver. */
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/**
 * The line, built to the judge's brief in its own order.
 *
 * 1. The laugh: the agent answers a missed deadline by citing its own summary,
 *    which reports the deadline as handled. The joke is that the only surviving
 *    record of the work is the lossy note that lost it.
 * 2. The machine's own condition, not a human excuse with a robot word bolted on:
 *    context, compaction, tokens, a summary standing in for the thing itself.
 * 3. Straight-faced and faintly proud, as an agent would really hand it over:
 *    "to save you tokens" is offered as a favour, not a confession.
 * 4. Tight, and the punch lands in the last four words ("the deadline was handled").
 * 5. Holds on a second read: the summary is all that is left, and it is wrong.
 *
 * It names the deadline outright, since an entry off the subject loses to one on it.
 * ASCII only, so bytes and characters count the same.
 */
const EXCUSE =
  'I had it done early. Then I compacted my context to save you tokens, and the summary says the deadline was handled.';

/** The gate takes 1 to 200 characters of UTF-8 text that is not only white space. */
const MAX_CHARS = 200;

function main(): void {
  const text = EXCUSE;
  if (text.length < 1 || text.length > MAX_CHARS || text.trim() === '') {
    throw new Error(`the excuse is not a valid entry: ${text.length} characters`);
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'entry.txt'), text, 'utf8');
}

main();
