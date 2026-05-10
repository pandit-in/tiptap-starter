import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory (where the user is installing the package)
// INIT_CWD is set by npm/yarn/pnpm/bun during postinstall
const targetDir = process.env.INIT_CWD || process.cwd();

console.log(`[tiptap-starter] Initializing in ${targetDir}`);

const sourceEditorDir = path.join(__dirname, '../components/editor');

// Detect if target project uses src directory
const hasSrc = fs.existsSync(path.join(targetDir, 'src'));
const baseTargetDir = hasSrc ? path.join(targetDir, 'src') : targetDir;

const targetEditorDir = path.join(baseTargetDir, 'components/editor');

// Function to copy files
function copyFile(src, dest) {
  if (fs.existsSync(dest)) {
    console.log(`[tiptap-starter] ${path.basename(dest)} already exists, skipping.`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[tiptap-starter] Created ${dest}`);
}

// Files to copy
const files = [
  'index.tsx',
  'menu-bar.tsx',
  'menubar-state.tsx',
  'styles.css'
];

try {
  // Check if source files exist
  files.forEach(file => {
    const src = path.join(sourceEditorDir, file);
    const dest = path.join(targetEditorDir, file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    } else {
      console.error(`[tiptap-starter] Source file missing: ${src}`);
    }
  });

  // Update globals.css
  const possiblePaths = [
    path.join(targetDir, 'app/globals.css'),
    path.join(targetDir, 'src/app/globals.css'),
    path.join(targetDir, 'styles/globals.css')
  ];

  let globalsCssPath = possiblePaths.find(p => fs.existsSync(p));

  if (globalsCssPath) {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    const importStatement = `@import "../components/editor/styles.css";`;
    
    if (!content.includes(importStatement)) {
      const lines = content.split('\n');
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('@import')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() !== '') {
          break;
        }
      }
      lines.splice(insertIndex, 0, importStatement);
      fs.writeFileSync(globalsCssPath, lines.join('\n'));
      console.log(`[tiptap-starter] Referenced styles in ${globalsCssPath}`);
    } else {
      console.log(`[tiptap-starter] Styles already referenced in ${globalsCssPath}`);
    }
  } else {
    console.warn(`[tiptap-starter] globals.css not found. Please add \`@import "../components/editor/styles.css";\` manually to your CSS file.`);
  }

} catch (error) {
  console.error(`[tiptap-starter] Error during initialization:`, error);
}
