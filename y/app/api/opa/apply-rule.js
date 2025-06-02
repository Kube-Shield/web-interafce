import path from "path";
import fs from "fs";
import YAML from "yaml";
import { KubeConfig, CustomObjectsApi } from "@kubernetes/client-node";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const rule = req.body; // e.g. { name: "RequiredLabel", id: 1, ... }

  const templateFile = `${rule.name.toLowerCase().replace(/\s+/g, "-")}-template.yaml`;
  const constraintFile = `${rule.name.toLowerCase().replace(/\s+/g, "-")}-constraint.yaml`;

  try {
    const templatePath = path.join(process.cwd(), "public", "templates", templateFile);
    const constraintPath = path.join(process.cwd(), "public", "templates", constraintFile);

    const templateContent = fs.readFileSync(templatePath, "utf8");
    const constraintContent = fs.readFileSync(constraintPath, "utf8");

    const constraintTemplate = YAML.parse(templateContent);
    const constraint = YAML.parse(constraintContent);

    const kc = new KubeConfig();
    kc.loadFromDefault(); // or kc.loadFromCluster() if running inside cluster
    const k8sCustomApi = kc.makeApiClient(CustomObjectsApi);

    // Apply ConstraintTemplate
    await k8sCustomApi.createClusterCustomObject(
      "templates.gatekeeper.sh",
      "v1beta1",
      "",
      "constrainttemplates",
      constraintTemplate
    );

    // Apply Constraint
    await k8sCustomApi.createClusterCustomObject(
      "constraints.gatekeeper.sh",
      "v1beta1",
      "",
      constraint.kind.toLowerCase() + "s",
      constraint
    );

    res.status(200).json({ message: `Applied rule: ${rule.name}` });
  } catch (error) {
    console.error("Error applying rule:", error);
    res.status(500).json({ message: "Failed to apply rule", error: error.message });
  }
}
