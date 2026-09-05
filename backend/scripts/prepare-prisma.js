import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  console.log('🔄 Configuring Prisma for PostgreSQL database...');
  schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schemaContent, 'utf8');
} else {
  console.log('ℹ️ Configuring Prisma for SQLite database...');
}
