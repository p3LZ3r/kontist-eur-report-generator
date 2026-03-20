import { readFileSync } from "fs";
import { dirname, join } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");
const logoPath = join(publicDir, "EUR-Generator-Logo.svg");

// Read the SVG file
const svgBuffer = readFileSync(logoPath);

async function generateImages() {
  console.log("🎨 Generating images from EUR-Generator-Logo.svg...\n");

  // 1. OG Image (1200x630) - Social media preview
  console.log("📱 Creating og-image.png (1200x630)...");
  await sharp(svgBuffer)
    .resize(400, 300, {
      fit: "contain",
      background: { r: 37, g: 99, b: 235, alpha: 1 },
    })
    .extend({
      top: 165,
      bottom: 165,
      left: 400,
      right: 400,
      background: { r: 37, g: 99, b: 235, alpha: 1 },
    })
    .png()
    .toFile(join(publicDir, "og-image.png"));
  console.log("✅ og-image.png created\n");

  // 2. PWA Icon 192x192
  console.log("📱 Creating icon-192.png...");
  await sharp(svgBuffer)
    .resize(192, 192, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(join(publicDir, "icon-192.png"));
  console.log("✅ icon-192.png created\n");

  // 3. PWA Icon 512x512
  console.log("📱 Creating icon-512.png...");
  await sharp(svgBuffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(join(publicDir, "icon-512.png"));
  console.log("✅ icon-512.png created\n");

  // 4. Favicon 16x16
  console.log("🔷 Creating favicon-16x16.png...");
  await sharp(svgBuffer)
    .resize(16, 16, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(join(publicDir, "favicon-16x16.png"));
  console.log("✅ favicon-16x16.png created\n");

  // 5. Favicon 32x32
  console.log("🔷 Creating favicon-32x32.png...");
  await sharp(svgBuffer)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(join(publicDir, "favicon-32x32.png"));
  console.log("✅ favicon-32x32.png created\n");

  // 6. Apple Touch Icon 180x180
  console.log("🍎 Creating apple-touch-icon.png (180x180)...");
  await sharp(svgBuffer)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(join(publicDir, "apple-touch-icon.png"));
  console.log("✅ apple-touch-icon.png created\n");

  // 7. Favicon 48x48 (for .ico)
  console.log("🔷 Creating favicon-48x48.png (for .ico)...");
  await sharp(svgBuffer)
    .resize(48, 48, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(join(publicDir, "favicon-48x48.png"));
  console.log("✅ favicon-48x48.png created\n");

  console.log("🎉 All images generated successfully!");
  console.log("\n📝 Note: For favicon.ico, please use an online tool like:");
  console.log("   https://realfavicongenerator.net/");
  console.log("   Upload the generated PNG files to create a multi-resolution .ico file\n");
}

generateImages().catch(console.error);
