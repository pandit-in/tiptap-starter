# @shadospace/editor

A beautiful, feature-rich Tiptap editor scaffolding for Next.js projects using shadcn/ui.

This is not just a component library; it's a CLI scaffolding tool that places the editor source files directly into your project so you can customize them fully.

## Features

- **Tiptap Starter Kit** fully integrated.
- **Dynamic Menu Bar** with essential formatting tools.
- **Tailwind CSS** styling pre-configured.
- **Interactive States** and clean UI.

## Prerequisites

Before installing, ensure your project meets the following requirements:

1. **Next.js** project.
2. **shadcn/ui** initialized (requires a `components.json` file in the root).

## Installation

Install the package as a dependency. The installation will automatically trigger the setup script.

```bash
bun add @shadospace/editor
# or
npm install @shadospace/editor
```

## Configuration

The package automatically detects your project structure (with or without a `src` folder) and places files in `components/editor/`. It also references the stylesheet in your global CSS file.

## Usage

After installation, the component files will be copied into your project. You can import and use the editor like this (adjust the path if you use a different alias):

```tsx
import Editor from "@/components/editor";

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <Editor />
    </div>
  );
}
```

## Customization

Since the editor files are copied directly into your project, you can edit them anytime to add new features or change the styling.
