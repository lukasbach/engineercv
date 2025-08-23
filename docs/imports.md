# Imports and Modular Configuration

EngineerCV supports importing and merging configuration from multiple files, enabling you to split your resume into reusable, maintainable chunks. This is especially powerful when combined with variants.

## Basic Import Syntax

Use the `imports` key to include other configuration files:

```yaml
imports:
  - ./shared-skills.yml
  - ./work-experience.yml
  - ./education.yml

basics:
  name: John Doe
output: ./out/resume.pdf
```

## Supported File Types

EngineerCV supports importing from various file formats:

### YAML Files
```yaml
# skills.yml
skills:
  - name: Programming Languages
    keywords: [JavaScript, Python, Java]
```

### JSON Files
```json
// experience.json
{
  "work": [
    {
      "position": "Software Engineer",
      "company": "Tech Corp",
      "startDate": "2022-01"
    }
  ]
}
```

### TypeScript/JavaScript Files
```typescript
// custom-data.ts
export default {
  projects: [
    {
      name: "Open Source Library",
      highlights: ["1000+ GitHub stars"]
    }
  ]
};
```

## Deep Merging Behavior

Imported configurations are deeply merged with the main file. Objects are merged, arrays are concatenated by default:

**main.yml**
```yaml
imports:
  - ./base-skills.yml
  - ./additional-skills.yml

skills:
  - name: Tools
    keywords: [Git, Docker]
```

**base-skills.yml**
```yaml
skills:
  - name: Languages
    keywords: [JavaScript, Python]
```

**additional-skills.yml**
```yaml
skills:
  - name: Frameworks
    keywords: [React, Django]
```

**Result**: All three skill categories are included in the final output.

## Relative Path Resolution

Import paths are resolved relative to the importing file:

```
project/
├── main.yml
├── sections/
│   ├── skills.yml
│   └── work.yml
└── shared/
    └── contact.yml
```

```yaml
# main.yml
imports:
  - ./sections/skills.yml
  - ./sections/work.yml

# sections/skills.yml
imports:
  - ../shared/contact.yml  # Relative to skills.yml
```

## Conditional Imports

Combine imports with variants for dynamic configuration loading:

```yaml
imports:
  - ./base-config.yml
  - ./skills-{{ role }}.yml
  - ./experience-{{ company }}.yml

variants:
  application:
    - role: frontend
      company: startup
    - role: backend
      company: enterprise
```

This loads different skill and experience files based on the variant.

## Shared Component Libraries

Create reusable component libraries that can be imported across multiple resumes:

**shared/tech-skills.yml**
```yaml
skills:
  - name: Frontend
    keywords: [React, Vue.js, Angular, TypeScript]
  - name: Backend
    keywords: [Node.js, Python, Java, PostgreSQL]
  - name: DevOps
    keywords: [Docker, Kubernetes, AWS, CI/CD]
```

**shared/soft-skills.yml**
```yaml
skills:
  - name: Soft Skills
    keywords: [Leadership, Communication, Problem Solving]
```

**resumes/frontend-resume.yml**
```yaml
imports:
  - ../shared/tech-skills.yml
  - ../shared/soft-skills.yml

# Override or extend specific sections
skills:
  - name: Frontend  # This will merge with the imported Frontend skills
    keywords: [Svelte]  # Adds Svelte to the existing list
```

## Environment-Specific Configurations

Organize configurations by environment or context:

```yaml
imports:
  - ./base-resume.yml
  - ./contact-{{ privacy }}.yml
  - ./projects-{{ detail-level }}.yml

variants:
  application:
    - privacy: public
      detail-level: brief
    - privacy: private
      detail-level: detailed
```

**contact-public.yml**
```yaml
basics:
  email: john.doe+jobs@gmail.com
  phone: "+1-XXX-XXX-XXXX"
```

**contact-private.yml**
```yaml
basics:
  email: john.doe@personal.com
  phone: "+1-555-123-4567"
```

## Import Order and Priority

Later imports and the main file take priority over earlier imports:

```yaml
imports:
  - ./default-config.yml    # Lowest priority
  - ./role-specific.yml     # Medium priority
  - ./company-specific.yml  # Highest priority

# Main file content has highest priority
basics:
  name: John Doe  # This will override any name from imports
```

## Dynamic Import Paths

Use Handlebars templates in import paths:

```yaml
imports:
  - ./base.yml
  - ./{{ role }}/skills.yml
  - ./companies/{{ company }}.yml

variants:
  position:
    - role: developer
      company: startup
    - role: manager
      company: enterprise
```

This creates a flexible file structure where each role and company can have their own configuration files.

## Modular Architecture Patterns

### 1. Layer-Based Organization
```
resume/
├── base/
│   ├── personal-info.yml
│   └── education.yml
├── skills/
│   ├── technical.yml
│   └── soft-skills.yml
├── experience/
│   ├── current-job.yml
│   └── previous-jobs.yml
└── variants/
    ├── senior-dev.yml
    └── tech-lead.yml
```

### 2. Company-Specific Structure
```
applications/
├── shared/
│   ├── base-resume.yml
│   ├── core-skills.yml
│   └── education.yml
├── google/
│   ├── google-specific.yml
│   └── projects.yml
├── microsoft/
│   ├── microsoft-specific.yml
│   └── experience.yml
└── templates/
    └── main.yml
```

### 3. Role-Based Structure
```
roles/
├── common/
│   ├── personal.yml
│   └── education.yml
├── frontend/
│   ├── skills.yml
│   └── projects.yml
├── backend/
│   ├── skills.yml
│   └── projects.yml
└── fullstack/
    └── combined-skills.yml
```

## Best Practices

### 1. Use Descriptive File Names
```yaml
imports:
  - ./personal-information.yml
  - ./technical-skills-2024.yml
  - ./work-experience-senior-roles.yml
```

### 2. Keep Imports Focused
Each imported file should have a single responsibility:

```yaml
# Good: Each file has a clear purpose
imports:
  - ./contact-info.yml
  - ./education.yml  
  - ./certifications.yml

# Avoid: Mixed content in single files
imports:
  - ./everything.yml
```

### 3. Document Import Dependencies
Add comments to clarify import relationships:

```yaml
imports:
  # Core personal information
  - ./base/personal.yml
  # Technical skills updated monthly
  - ./skills/current-tech-stack.yml
  # Experience excluding confidential projects
  - ./work/public-experience.yml
```

### 4. Version Control Imports
Keep imported files in version control and use meaningful commit messages when updating shared configurations.

### 5. Test Import Resolution
Use descriptive output paths to verify imports are working:

```yaml
output: ./debug/{{ source.name }}-with-imports.pdf
```

## Error Handling

EngineerCV will throw clear errors for common import issues:

- **File not found**: Shows the exact path that couldn't be resolved
- **Invalid YAML/JSON**: Shows parsing errors with line numbers
- **Circular imports**: Detects and prevents infinite import loops
- **Schema validation**: Validates merged configuration against component schemas

These error messages include the import chain, making it easy to trace issues back to specific files.
