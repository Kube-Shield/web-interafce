import { NextResponse } from 'next/server';
import db from '../../../lib/db.js';

export async function GET() {
  try {
    // Test basic connection
    const timeResult = await db.raw('SELECT NOW()');
    
    // Check current database
    const dbName = await db.raw('SELECT current_database()');
    
    // List all tables
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Check if users table exists
    const userTableExists = await db.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `);

    return NextResponse.json({
      status: 'connected',
      currentTime: timeResult.rows[0],
      database: dbName.rows[0].current_database,
      tables: tables.rows.map(t => t.table_name),
      usersTableExists: userTableExists.rows[0].exists,
      connectionString: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      connectionString: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  }
}