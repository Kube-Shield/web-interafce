import path from "path";
import fs from "fs";
import { execSync } from "child_process";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, cpu, memory, namespace } = req.body;

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

    // Check if files exist
    if (!fs.existsSync(templatePath) || !fs.existsSync(constraintPath)) {
      throw new Error("One or both YAML files not found.");
    }

    // Read the template YAML file as a string
    let constraintContent = fs.readFileSync(constraintPath, "utf8");

    // Replace placeholders
    constraintContent = constraintContent
      .replace("${CPU_LIMIT}", cpu)
      .replace("${MEMORY_LIMIT}", memory)
      .replace("${NAMESPACE}", namespace);

    // Write the modified content to a temporary file
    const tmpConstraintPath = path.join(
      process.cwd(),
      "public",
      "templates",
      `tmp-${constraintFile}`
    );
    fs.writeFileSync(tmpConstraintPath, constraintContent, "utf8");

    // Run kubectl apply for each file
    const result1 = execSync(`kubectl apply -f "${templatePath}"`, {
      encoding: "utf-8",
    });
    const result2 = execSync(`kubectl apply -f "${tmpConstraintPath}"`, {
      encoding: "utf-8",
    });

    console.log("kubectl results:", result1, result2);

    res.status(200).json({
      message: `Successfully applied rule: ${name}`,
      output: [result1, result2],
    });
  } catch (error) {
    console.error("Error applying rule:", error);
    res
      .status(500)
      .json({ message: "Failed to apply rule", error: error.message });
  }
}
