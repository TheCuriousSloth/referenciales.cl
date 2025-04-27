// scripts/backup.js
import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const backupDir = path.resolve(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

const dbUrl = process.env.POSTGRES_PRISMA_URL;

const command = `pg_dump ${dbUrl} -F c -b -v -f ${backupFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al realizar el respaldo: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Respaldo completado: ${backupFile}`);
});