import prisma from '../config/prisma.js';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // This will create tables if they don't exist
    await prisma.$executeRaw`SELECT 1`;
    
    // Try to query a table to see if schema exists
    try {
      await prisma.customer.findMany({ take: 1 });
      console.log('✅ Database schema already exists');
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('⚠️  Database schema not found, pushing schema...');
        // Import and run prisma db push programmatically
        const { execSync } = await import('child_process');
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('✅ Database schema created successfully');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};
