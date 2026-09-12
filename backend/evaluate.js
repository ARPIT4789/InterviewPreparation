import fs from "fs/promises";

function getArguments() {
  const args = process.argv.slice(2);

  // Normal format:
  // node evaluate.js --input cases.json --output kits.json

  const inputIndex = args.indexOf("--input");
  const outputIndex = args.indexOf("--output");

  if (inputIndex !== -1 && outputIndex !== -1) {
    return {
      inputPath: args[inputIndex + 1],
      outputPath: args[outputIndex + 1]
    };
  }

  // npm 11 may pass the arguments as positional values:
  // node evaluate.js cases.json kits.json

  if (args.length >= 2 && !args[0].startsWith("--")) {
    return {
      inputPath: args[0],
      outputPath: args[1]
    };
  }

  throw new Error(
    "Usage: npm run evaluate -- --input <cases.json> --output <kits.json>"
  );
}


async function main() {
  try {
    const { inputPath, outputPath } = getArguments();

    console.log(`Input:  ${inputPath}`);
    console.log(`Output: ${outputPath}`);

    const cases = JSON.parse(
      await fs.readFile(inputPath, "utf-8")
    );

    if (!Array.isArray(cases)) {
      throw new Error("Input file must contain an array of cases.");
    }

    const results = [];

    for (const testCase of cases) {
      try {
        console.log(`Processing ${testCase.id}...`);

        // Temporary placeholder.
        // Real pipeline will be connected here later.

        results.push({
          id: testCase.id,
          status: "failed",
          kit: null,
          error: {
            code: "PIPELINE_NOT_IMPLEMENTED",
            message:
              "Interview preparation pipeline is not implemented yet."
          }
        });

      } catch (error) {
        results.push({
          id: testCase.id,
          status: "failed",
          kit: null,
          error: {
            code: "PIPELINE_ERROR",
            message: error.message
          }
        });
      }
    }

    const output = {
      version: "1.0",
      generated_at: new Date().toISOString(),
      kits: results
    };

    await fs.writeFile(
      outputPath,
      JSON.stringify(output, null, 2),
      "utf-8"
    );

    console.log(`\nResults written to ${outputPath}`);

  } catch (error) {
    console.error("\nEvaluation failed:", error.message);
    process.exit(1);
  }
}

main();