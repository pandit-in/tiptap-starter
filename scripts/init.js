#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Target directory (where the user is installing the package)
// INIT_CWD is set by npm/yarn/pnpm/bun during postinstall
const targetDir = process.env.INIT_CWD || process.cwd()

console.log(`[tiptap-starter] Initializing in ${targetDir}`)

// Verify that the target directory is a Next.js project with shadcn installed
const targetPackageJsonPath = path.join(targetDir, "package.json")

if (!fs.existsSync(targetPackageJsonPath)) {
  console.error(
    `[tiptap-starter] Error: package.json not found in ${targetDir}. Please run this in the root of your project.`
  )
  process.exit(1)
}

let pkg
try {
  pkg = JSON.parse(fs.readFileSync(targetPackageJsonPath, "utf8"))
} catch {
  console.error(
    `[tiptap-starter] Error: Failed to parse package.json in ${targetDir}`
  )
  process.exit(1)
}

const hasNext = pkg.dependencies?.next || pkg.devDependencies?.next
const hasShadcn = fs.existsSync(path.join(targetDir, "components.json"))

if (!hasNext) {
  console.error(
    `[tiptap-starter] Error: Next.js is not detected. This package is designed for Next.js projects.`
  )
  process.exit(1)
}

if (!hasShadcn) {
  console.error(
    `[tiptap-starter] Error: shadcn/ui is not detected (components.json not found). Please initialize shadcn first.`
  )
  process.exit(1)
}

const sourceEditorDir = path.join(__dirname, "../components/editor")

// Detect if target project uses src directory
const hasSrc = fs.existsSync(path.join(targetDir, "src"))
const baseTargetDir = hasSrc ? path.join(targetDir, "src") : targetDir

const targetEditorDir = path.join(baseTargetDir, "components/editor")

// Function to copy files
function copyFile(src, dest) {
  if (fs.existsSync(dest)) {
    console.log(
      `[tiptap-starter] ${path.basename(dest)} already exists, skipping.`
    )
    return
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
  console.log(`[tiptap-starter] Created ${dest}`)
}

// Files to copy
const files = ["index.tsx", "menu-bar.tsx", "menubar-state.tsx", "styles.css"]

try {
  // Check if source files exist
  files.forEach((file) => {
    const src = path.join(sourceEditorDir, file)
    const dest = path.join(targetEditorDir, file)
    if (fs.existsSync(src)) {
      copyFile(src, dest)
    } else {
      console.error(`[tiptap-starter] Source file missing: ${src}`)
    }
  })

  // Copy UploadThing setup files
  const coreDest = path.join(baseTargetDir, "app/api/uploadthing/core.ts")
  
  if (fs.existsSync(coreDest)) {
    console.log(`[tiptap-starter] ${coreDest} already exists, checking for missing routes.`)
    let content = fs.readFileSync(coreDest, "utf8")
    let modified = false

    const hasImageUploader = content.includes("imageUploader")
    const hasCoverImageUploader = content.includes("coverImageUploader")

    if (!hasImageUploader || !hasCoverImageUploader) {
      let routesToInsert = ""
      if (!hasImageUploader) {
        routesToInsert += `
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req)
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),`
      }

      if (!hasCoverImageUploader) {
        routesToInsert += `
  coverImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req)
      if (!user) throw new UploadThingError("Unauthorized")
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.ufsUrl)
      return { uploadedBy: metadata.userId }
    }),`
      }

      if (content.includes("} satisfies FileRouter")) {
        content = content.replace("} satisfies FileRouter", routesToInsert + "\n} satisfies FileRouter")
        modified = true
      } else {
        console.warn(`[tiptap-starter] Could not find \`} satisfies FileRouter\` in ${coreDest}. Please add the routes manually.`)
      }
    }

    if (modified) {
      fs.writeFileSync(coreDest, content)
      console.log(`[tiptap-starter] Inserted missing routes into ${coreDest}`)
    } else {
      console.log(`[tiptap-starter] All required routes already present in ${coreDest}`)
    }
  } else {
    // File doesn't exist, copy the default one
    copyFile(path.join(__dirname, "../app/api/uploadthing/core.ts"), coreDest)
  }

  // Copy other uploadthing files if they don't exist
  const otherUploadthingFiles = [
    {
      src: path.join(__dirname, "../lib/uploadthing.ts"),
      dest: path.join(baseTargetDir, "lib/uploadthing.ts"),
    },
    {
      src: path.join(__dirname, "../app/api/uploadthing/route.ts"),
      dest: path.join(baseTargetDir, "app/api/uploadthing/route.ts"),
    },
  ]

  otherUploadthingFiles.forEach((file) => {
    if (fs.existsSync(file.src)) {
      copyFile(file.src, file.dest)
    } else {
      console.error(`[tiptap-starter] Source file missing: ${file.src}`)
    }
  })

  // Update globals.css
  const possiblePaths = [
    path.join(targetDir, "app/globals.css"),
    path.join(targetDir, "src/app/globals.css"),
    path.join(targetDir, "styles/globals.css"),
  ]

  let globalsCssPath = possiblePaths.find((p) => fs.existsSync(p))

  if (globalsCssPath) {
    const content = fs.readFileSync(globalsCssPath, "utf8")
    const importStatement = `@import "../components/editor/styles.css";`

    if (!content.includes(importStatement)) {
      const lines = content.split("\n")
      let insertIndex = 0
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("@import")) {
          insertIndex = i + 1
        } else if (lines[i].trim() !== "") {
          break
        }
      }
      lines.splice(insertIndex, 0, importStatement)
      fs.writeFileSync(globalsCssPath, lines.join("\n"))
      console.log(`[tiptap-starter] Referenced styles in ${globalsCssPath}`)
    } else {
      console.log(
        `[tiptap-starter] Styles already referenced in ${globalsCssPath}`
      )
    }
  } else {
    console.warn(
      `[tiptap-starter] globals.css not found. Please add \`@import "../components/editor/styles.css";\` manually to your CSS file.`
    )
  }
} catch (error) {
  console.error(`[tiptap-starter] Error during initialization:`, error)
}
