import { readFileSync } from "fs";
import { z } from "zod";

const requirementSchema = z.object({
  id: z.string().regex(/^REQ-[A-Z]+-\d{3}$/, "ID must match REQ-{CATEGORY}-{NNN}"),
  category: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  passes: z.literal(false),
});

const requirementsSchema = z.array(requirementSchema).min(1);

const raw = readFileSync("requirements.json", "utf-8");
const json = JSON.parse(raw);
const result = requirementsSchema.safeParse(json);

if (!result.success) {
  console.error("Schema validation failed:\n");
  for (const issue of result.error.issues) {
    console.error(`  [${issue.path.join(".")}] ${issue.message}`);
  }
  process.exit(1);
}

const requirements = result.data;

// Check for duplicate IDs
const seen = new Set<string>();
const dupes = new Set<string>();
for (const r of requirements) {
  if (seen.has(r.id)) {
    dupes.add(r.id);
  }
  seen.add(r.id);
}

if (dupes.size > 0) {
  console.error(`DUPLICATE IDs: ${[...dupes].join(", ")}`);
  process.exit(1);
} else {
  console.log("All IDs unique: OK");
}

console.log("Schema valid: OK");
