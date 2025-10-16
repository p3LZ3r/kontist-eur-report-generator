import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

async function generateFavicon() {
  console.log('🔷 Generating favicon.ico from PNG files...\n');

  const files = [
    readFileSync(join(publicDir, 'favicon-16x16.png')),
    readFileSync(join(publicDir, 'favicon-32x32.png')),
    readFileSync(join(publicDir, 'favicon-48x48.png'))
  ];

  const ico = await toIco(files);
  writeFileSync(join(publicDir, 'favicon.ico'), ico);

  console.log('✅ favicon.ico created successfully!\n');
}

generateFavicon().catch(console.error);
