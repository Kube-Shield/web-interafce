import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '../../../../lib/db.js';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          // Test database connection first
          try {
            await db.raw('SELECT 1');
          } catch (dbError) {
            console.error('Database connection error:', dbError);
            throw new Error('Database connection failed. Please check your database configuration.');
          }

          const user = await db('users')
            .where('email', credentials.email)
            .first();

          if (!user) {
            throw new Error('No user found with this email address');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          
          // Handle specific database errors
          if (error.code === 'ECONNREFUSED') {
            throw new Error('Database connection refused. Please check if the database server is running.');
          }
          
          if (error.code === '42P01') {
            throw new Error('Database table not found. Please run database migrations.');
          }

          // If it's our custom error, throw it directly
          if (error.message && !error.code) {
            throw error;
          }

          // For any other unexpected errors
          throw new Error('An unexpected error occurred during authentication. Please try again later.');
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
});

export { handler as GET, handler as POST };