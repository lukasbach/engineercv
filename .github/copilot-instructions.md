# EngineerCV - AI Assistant Guide

This project is a **React-PDF based Resume/CV generator** that creates professional PDFs from YAML configuration files using a component-based architecture.

## Quick Start
- **Test generation**: `yarn start generate "./samples/**/*.yml"`
- **Development mode**: `yarn dev` (auto-rebuilds on changes)
- **Build**: `yarn build` (generates lib/ and schema.json)

## Architecture Overview

### Component System
The project uses a **typed component definition system** centered around `defineComponent()`:
- Components are defined in `src/components/` with strict Zod schemas
- Each component has `schema`, `component` (React-PDF JSX), and `defaultStyles`
- Global component registry in `src/components/default-components.tsx`
- Components can reference other components via `getComponent()`

### Key Patterns
1. **Global Module System**: `src/module-globals.ts` exposes `z`, `ReactPdf`, `defineComponent` globally for custom components
2. **File Resolution**: Supports YAML, JSON, JS/TS files with imports system
3. **Style Merging**: Deep merging of styles across imports and variants
4. **Schema Generation**: Post-build script generates `lib/schema.json` from all component schemas

### Data Flow
```
YAML/JS Config → Schema Validation → Component Tree → PDF Rendering
```

## Development Patterns

### Adding New Components
1. Create in `src/components/sections/` or `src/components/atoms/`
2. Use `defineComponent()` with proper schema and styles
3. Register in `src/components/default-components.tsx`
4. Components render using React-PDF primitives (`View`, `Text`, etc.)

### Custom Components (User-Defined)
- Import `"engineercv/module-globals"` for global access
- Export default object with `config.components` property
- Reference in YAML via `config.customComponents`

### Schema & Validation
- All data validated via Zod schemas defined in components
- Base schema in `src/domain/generate/base-spec-schema.ts`
- Variants support for multiple CV versions from same data

### File Structure Conventions
- `src/components/atoms/`: Reusable UI primitives
- `src/components/sections/`: CV section components
- `src/themes/`: Complete theme overrides
- `samples/test/`: Development examples
- Build outputs to `lib/` with TypeScript declarations

## Testing & Debugging
- Use `yarn dev` for hot-reload development
- To verify that generation works correctly, run `yarn start generate "./samples/**/*.yml"` in the terminal.
- Sample files in `samples/test/` demonstrate all features
- Errors show file paths and Zod validation details
- Watch mode tracks all imported files for changes

## Key Files to Understand
- `src/components/define-component.ts`: Component definition system
- `src/domain/generate/generate.ts`: Main PDF generation logic
- `src/components/sections/basics-section-component.tsx`: Example section component
- `samples/test/cv.yml`: Standard CV example
- `samples/test/custom-components.tsx`: Custom component example