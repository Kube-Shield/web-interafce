import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync('ls -a');
    
    return NextResponse.json({
      success: true,
      command: 'ls -a',
      output: stdout,
      error: stderr || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      command: 'ls -a',
      output: null,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { command } = await request.json();
    
    const allowedCommands = ['ls', 'pwd', 'date', 'whoami', 'uname'];
    const baseCommand = command.split(' ')[0];
    
    if (!allowedCommands.includes(baseCommand)) {
      return NextResponse.json({
        success: false,
        command,
        output: null,
        error: 'Command not allowed for security reasons',
        timestamp: new Date().toISOString()
      }, { status: 403 });
    }

    const { stdout, stderr } = await execAsync(command);
    
    return NextResponse.json({
      success: true,
      command,
      output: stdout,
      error: stderr || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      command: request.command || 'unknown',
      output: null,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}