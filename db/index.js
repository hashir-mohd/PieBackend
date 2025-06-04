import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('\n PostgreSQL Connected with Prisma !!');
  } catch (error) {
    console.log("PostgreSQL could not be connected :", error);
    process.exit(1);
  }
};

export { prisma };
export default connectDB;