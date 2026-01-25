# Section Wrapping

Control whether sections can break across multiple pages using the `config.wrap` property.

## Configuration

The `config.wrap` property allows you to control page breaking behavior for each section. When set to `false`, a section will not break across pages and will stay together on the same page.

```yaml
config:
  wrap:
    skills: false      # Skills section stays on one page
    languages: false   # Languages section stays on one page
    interests: false   # Interests section stays on one page
```

## Available Sections

You can configure wrap behavior for all section components:

| Section | Description |
|---------|-------------|
| `basics` | Contact information and summary |
| `work` | Work experience |
| `education` | Education history |
| `volunteer` | Volunteer experience |
| `projects` | Projects |
| `skills` | Skills |
| `awards` | Awards and achievements |
| `certificates` | Certifications |
| `publications` | Publications |
| `languages` | Language proficiencies |
| `interests` | Interests and hobbies |
| `references` | References |

## Default Behavior

All sections have `wrap: true` by default, meaning they can break across pages if they don't fit on a single page.

## Examples

### Example 1: Prevent Short Sections from Breaking

For sections that are typically short (like Skills, Languages, or Interests), you might want to keep them together on one page:

```yaml
basics:
  name: Jane Smith
  email: jane.smith@example.com
  summary: Full-stack developer with expertise in modern web technologies.

config:
  wrap:
    skills: false
    languages: false
    interests: false

output: ./out/resume.pdf

skills:
  - name: Frontend
    keywords: [React, Vue.js, TypeScript]
  - name: Backend
    keywords: [Node.js, Python, PostgreSQL]

languages:
  - language: English
    fluency: Native
  - language: Spanish
    fluency: Professional

interests:
  - name: Open Source
    keywords: [Contributing to community projects]
```

### Example 2: All Sections Non-Breaking

If your CV is short enough, you can disable wrapping for all sections to ensure each section stays on the same page:

```yaml
config:
  wrap:
    basics: false
    work: false
    education: false
    skills: false
    projects: false
    awards: false
    certificates: false
    publications: false
    languages: false
    interests: false
    references: false
    volunteer: false

output: ./out/resume.pdf
```

### Example 3: Mixed Approach

You can allow longer sections (like Work or Education) to wrap while keeping shorter sections together:

```yaml
config:
  wrap:
    # Allow these to span multiple pages
    work: true
    education: true
    projects: true
    
    # Keep these sections together
    skills: false
    languages: false
    interests: false
    awards: false
    certificates: false

output: ./out/resume.pdf
```

## Use Cases

### One-Page Resume

For a one-page resume, disable wrapping for all sections:

```yaml
config:
  wrap:
    basics: false
    work: false
    education: false
    skills: false
```

### Multi-Page Resume with Section Integrity

Allow the resume to span multiple pages but keep each section on a single page:

```yaml
config:
  wrap:
    work: false       # Each work section stays together
    education: false  # Education section stays together
    projects: false   # Projects section stays together
```

### Professional Layout Control

Control which sections should flow naturally and which should stay intact:

```yaml
config:
  wrap:
    basics: true      # Can break if summary is very long
    work: true        # Work experience can span pages
    education: true   # Education can span pages
    skills: false     # Skills grid stays together
    languages: false  # Language list stays together
    interests: false  # Interests stay together
```

## Complete Examples

See these sample files for complete working examples:

- [`wrap-demo.yml`](samples/wrap-demo.md) - Selective wrap control
- [`wrap-no-breaking.yml`](samples/wrap-demo.md) - All sections with wrap disabled

## Technical Details

The `wrap` property maps to React-PDF's [`wrap` prop](https://react-pdf.org/components#view) on the View component that wraps each section. When set to `false`, it prevents the section from breaking across pages using the PDF layout engine.

## Related

- [Styling](styling.md) - Custom styles for sections
- [Custom Components](custom-components.md) - Creating custom sections
