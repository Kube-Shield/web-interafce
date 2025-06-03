import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const rule = req.body;

  const templateFile = `${rule.name
    .toLowerCase()
    .replace(/\s+/g, "-")}-template.yaml`;
  const constraintFile = `${rule.name
    .toLowerCase()
    .replace(/\s+/g, "-")}-constraint.yaml`;

  try {
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      templateFile
    );
    const constraintPath = path.join(
      process.cwd(),
      "public",
      "templates",
      constraintFile
    );

    // Check if files exist
    if (!fs.existsSync(templatePath) || !fs.existsSync(constraintPath)) {
      throw new Error("One or both YAML files not found.");
    }

    // Run kubectl apply for each file
    const result1 = execSync(`kubectl apply -f "${templatePath}"`, {
      encoding: "utf-8",
    });
    const result2 = execSync(`kubectl apply -f "${constraintPath}"`, {
      encoding: "utf-8",
    });

    console.log("kubectl results:", result1, result2);

    res.status(200).json({
      message: `Successfully applied rule: ${rule.name}`,
      output: [result1, result2],
    });
  } catch (error) {
    console.error("Error applying rule:", error);
    res
      .status(500)
      .json({ message: "Failed to apply rule", error: error.message });
  }
}
