import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing rule name" });
  }

  const templateFile = `${name
    .toLowerCase()
    .replace(/\s+/g, "-")}-template.yaml`;
  const constraintFile = `${name
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

    if (!fs.existsSync(templatePath) || !fs.existsSync(constraintPath)) {
      throw new Error("One or both YAML files not found.");
    }

    // Run `kubectl delete` instead of apply
    const result1 = execSync(`kubectl delete -f "${constraintPath}"`, {
      encoding: "utf-8",
    });
    const result2 = execSync(`kubectl delete -f "${templatePath}"`, {
      encoding: "utf-8",
    });

    console.log("kubectl delete results:", result1, result2);

    res.status(200).json({
      message: `Successfully deleted rule: ${name}`,
      output: [result1, result2],
    });
  } catch (error) {
    console.error("Error deleting rule:", error);
    res.status(500).json({ error: error.message });
  }
}
