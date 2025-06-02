import { NextResponse } from 'next/server';
import db from '../../../lib/db.js';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    // Check if migration files exist
    const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
    const migrationFiles = fs.existsSync(migrationsDir) ? fs.readdirSync(migrationsDir) : [];
    
    // Check current migration status
    let migrationStatus = [];
    try {
      migrationStatus = await db.migrate.status();
    } catch (error) {
      migrationStatus = `Error getting status: ${error.message}`;
    }

    // Check if knex_migrations table exists
    const migrationTableExists = await db.schema.hasTable('knex_migrations');
    
    // Get migration config
    const config = db.client.config;
    
    return NextResponse.json({
      migrationsDirectory: migrationsDir,
      migrationFiles,
      migrationStatus,
      migrationTableExists,
      knexConfig: {
        client: config.client,
        connection: config.connection?.database || 'connection info hidden',
        migrationsDirectory: config.migrations?.directory
      },
      currentWorkingDirectory: process.cwd()
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}