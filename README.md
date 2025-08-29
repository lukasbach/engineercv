
# EngineerCV

## Basic Usage Examples

EngineerCV lets you create resumes using simple YAML files, split content into reusable chunks, and generate multiple variants for different targets. Here are some basic samples:

**Single Resume Example**

```yaml
basics:
   name: Jane Smith
   email: jane.smith@example.com
   phone: "+1 (555) 123-4567"
   summary: Full-stack developer with expertise in modern web technologies.
output: ./out/jane-smith.pdf
skills:
   - name: Languages
      keywords:
         - JavaScript
         - Python
work:
   - position: Software Engineer
      name: Tech Company
      startDate: 2021/01
      highlights:
         - Built scalable web apps.
```

**Importing Shared Sections**

```yaml
imports:
   - ./shared-skills.yml
   - ./work-experience.yml
basics:
   name: John Doe
output: ./out/john-doe.pdf
```

**Defining Multiple Variants**

```yaml
variants:
   company:
      - name: John Doe
        target: AcmeCorp
        mainLanguage: JavaScript
      - name: John Doe
        target: BetaInc
        mainLanguage: TypeScript
output: ./out/{{ target }}.pdf
basics:
   name: "{{ name }}"

skills:
   - name: Languages
      keywords:
         - "{{ mainLanguage }}"
```

EngineerCV is a powerful, flexible Resume/CV generator built on React-PDF. It enables you to create multiple targeted resume variants (for different companies, roles, or privacy levels) from a single source file. Modular YAML/JSON/TS/JS configs, imports, and advanced merging make it easy to split your resume into reusable chunks and generate tailored PDFs for every application scenario.

**Schema:** The data schema is based on [jsonresume.org](https://jsonresume.org/) and mostly follows its conventions, making it easy to migrate or reuse existing resume data.

## Features

- **Variants:** Effortlessly generate multiple resume versions (e.g., for different companies, privacy levels, or job types) from a single config file.
- **Imports & Reusable Chunks:** Split your resume into modular files and import shared sections, skills, or experience blocks.
- **Component-Based Architecture:** Compose CV sections using reusable React-PDF components.
- **YAML/JSON/TS/JS Config Support:** Write your CV data in YAML, JSON, or TypeScript/JavaScript files, with support for imports and modularization.
- **Strict Schema Validation:** All data is validated using Zod schemas for reliability and error reporting.
- **Custom Components:** Easily add your own components and reference them in your CV config.
- **Themes & Style Merging:** Deep merging of styles and support for complete theme overrides.
- **Hot-Reload Development:** Fast development workflow with auto-rebuilds and watch mode.
- **Sample Library:** Extensive sample configs and docs to help you get started.

## Quick Start

### 1. Install via npm

```powershell
npm install -g engineercv
```

This provides the `engineercv` CLI globally.

### 2. Generate Multiple Resume Variants

```powershell
engineercv generate "./resume-source/**/*.yml"
```

This will generate PDFs for all variants defined in your YAML files.

### 3. Development Mode

```powershell
engineercv watch "./resume-source/**/*.yml"
```

Runs the generator in watch mode for rapid development.

## How It Works

1. **Write your CV in YAML/JSON/TS/JS**
2. **Split sections into reusable files and import them as needed**
3. **Define variants to generate multiple tailored PDFs from one config**
4. **Schema Validation:** Data is validated against Zod schemas defined in each component.
5. **Component Tree:** The config is parsed into a tree of React-PDF components.
6. **PDF Rendering:** The tree is rendered to a PDF using React-PDF.

## Cover Letter Theme

EngineerCV supports a dedicated cover letter theme, allowing you to generate professional cover letters alongside your resume. You can even use variants to create both a resume and cover letter from the same file.

**Sample Cover Letter YAML:**

```yaml
output: ./out/cover-letter.pdf
imports:
   - ./src/themes/coverletter.tsx
basics:
   name: John Doe
   subtitle: Senior Software Engineer
   subject: Application for Software Engineer Position
letterDate: "{{ date 'dddd, MMMM Do YYYY' }}"
toAddress:
   - Hiring Manager
   - Tech Company
   - 1234 Tech Street
   - Karlsruhe, Germany
fromAddress:
   - John Doe
   - 5678 Developer Lane
   - Karlsruhe, Germany
```

## Variants: Target Multiple Companies or Roles

EngineerCV lets you define multiple variants in a single file, so you can generate tailored resumes for different companies, privacy levels, or job types. Each variant can override or extend any part of your resume.

**Example: Defining Variants**

```yaml
variants:
 privacy:
  - name: John Doe
   facing: private
   email: john.doe@outlook.com
   phone: "+11234567890"
  - name: John D.
   facing: public
   email: john.doe+jobsearch@outlook.com
   phone: "+999999999"
 focus:
  - focus: frontend
   skills:
    - name: Languages
     keywords:
      - JavaScript
      - TypeScript
  - focus: backend
   skills:
    - name: Languages
     keywords:
      - Java
      - Python

output: ../out/variants-{{ facing }}-{{ focus }}.pdf
basics:
 name: "{{ name }}"
```

This will generate a PDF for each combination of privacy and focus (e.g., `variants-private-frontend.pdf`, `variants-public-backend.pdf`).

## Imports: Split Your Resume into Reusable Chunks

You can split your resume into multiple files and import shared sections, skills, or experience blocks. This makes it easy to reuse content across variants or different resumes.

**Example: Importing Shared Sections**

```yaml
imports:
 - ./shared-skills.yml
 - ./work-experience.yml


 name: John Doe
```

**shared-skills.yml**

```yaml
skills:
 - name: Languages
  keywords:
   - JavaScript
   - TypeScript
   - Python
```

**work-experience.yml**

```yaml
work:
 - position: Software Engineer
  name: Tech Company
  startDate: 2020/01
  highlights:
   - Developed web applications using React and Node.js.
```

## Advanced Merging & Customization

EngineerCV supports advanced merging helpers for lists and objects, so you can fine-tune how imported or variant data is combined. For example:

```yaml
skills:
 - $id: languages
  keywords:
   - Java
   - Python
   - "{{ remove 'JavaScript' }}"
```

See `samples/src/advanced-merging.yml` for more details.

## Extending EngineerCV

### Adding New Components

1. Create your component in `src/components/sections/` or `src/components/atoms/`.
2. Use `defineComponent()` to specify schema, render logic, and default styles.
3. Register your component in `src/components/default-components.tsx`.
4. Use React-PDF primitives (`View`, `Text`, etc.) for rendering.

### Custom Components (User-Defined)

- Import `engineercv/module-globals` for access to global helpers.
- Export your components via `config.components`.
- Reference them in your YAML config using `config.customComponents`.

### Themes & Style Merging

- Override styles globally or per-component.
- Use the `src/themes/` directory for full theme replacements.

## Documentation & Samples

- **Docs:** See the `docs/` folder for guides on advanced merging, custom components, ordering, fonts, icons, and more.
- **Samples:** Explore `samples/src/` for example CVs, variants, imports, and custom component usage.

## Invoice Theme

EngineerCV also provides an invoice theme, so you can generate invoices using the same modular YAML approach. This is useful for freelancers or anyone needing professional invoices.

**Sample Invoice YAML:**

```yaml
output: ./out/invoice.pdf
imports:
   - ./src/themes/invoice.tsx
basics:
   name: John Doe
date: "2020-01-01"
toAddress:
   - Hiring Manager
   - Tech Company
   - 1234 Tech Street
   - Karlsruhe, Germany
shipAddress: "{{ use toAddress }}"
fromAddress:
   - John Doe
   - 5678 Developer Lane
   - Karlsruhe, Germany
body: |
   Payment is due within 14 days of receipt of this invoice, on {{ dateadd (date) 14 'd' 'MM/DD/YYYY' }}.
items:
   - definition: "{{ use customProducts.hourOfWork }}"
      quantity: 6
```
