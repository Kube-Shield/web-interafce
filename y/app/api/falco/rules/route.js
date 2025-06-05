import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import yaml from 'yaml';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // First, get the Falco pod name
    const { stdout: podOutput } = await execAsync('kubectl get -n falco pod -l app.kubernetes.io/name=falco -o jsonpath="{.items[0].metadata.name}"');
    const podName = podOutput.trim();

    if (!podName) {
      throw new Error('No Falco pod found in the cluster');
    }

    // Then, get the rules file content
    const { stdout: rulesContent } = await execAsync(`kubectl exec -n falco ${podName} -- cat /etc/falco/falco_rules.yaml`);
    
    // Parse the YAML content
    const parsedYaml = yaml.parse(rulesContent);
    

    console.log(parsedYaml);
    // Check if we have the expected structure
    if (!parsedYaml || !Array.isArray(parsedYaml)) {
      throw new Error('Invalid YAML format in Falco rules file');
    }

    // Filter only the rule entries from the list
    const rules = parsedYaml.filter(item => item.rule);

    if (rules.length === 0) {
      throw new Error('No rules found in Falco configuration');
    }

    // Transform the rules into a more frontend-friendly format
    const transformedRules = rules.map((rule, index) => ({
      id: index + 1,
      name: rule.rule,
      description: rule.desc || 'No description available',
      condition: rule.condition || '',
      output: rule.output || '',
      priority: rule.priority || 'INFO',
      tags: rule.tags || [],
      source: 'syscall',
      created_at: new Date().toISOString(),
      status: 'active'
    }));

    return NextResponse.json({
      rules: transformedRules,
      total: transformedRules.length
    });

  } catch (error) {
    console.error('Error fetching Falco rules:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch Falco rules',
        details: error.stack
      },
      { status: 500 }
    );
  }
} 