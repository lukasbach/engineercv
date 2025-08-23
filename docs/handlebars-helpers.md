# Handlebars Helpers

EngineerCV provides a comprehensive set of Handlebars helpers for dynamic content generation, formatting, and data manipulation. These helpers are available throughout your configuration files and enable powerful templating capabilities.

## Template Context

All Handlebars templates have access to the complete configuration object as their context. This means you can reference any part of your configuration from anywhere:

```yaml
basics:
  name: John Doe
  email: john.doe@example.com

work:
  - company: "{{basics.name}}'s Favorite Company"
    highlights:
      - "Contact me at {{basics.email}}"
```

## Built-in Helpers

### String Formatting Helpers

#### `pathsafe`
Converts strings to filesystem-safe names:

```yaml
output: ./out/{{pathsafe basics.name}}.pdf
# "John Doe" becomes "john-doe"
```

### Contact Information Helpers

#### `email`
Formats email addresses as clickable links:

```yaml
basics:
  highlights:
    - "{{email 'john.doe@example.com'}}"
# Output: [john.doe@example.com](mailto:john.doe@example.com)
```

#### `phone`
Formats phone numbers as clickable tel: links:

```yaml
basics:
  highlights:
    - "{{phone '+1 (555) 123-4567'}}"
# Output: [+1 (555) 123-4567](tel:+15551234567)
```

#### `github`
Creates GitHub profile links:

```yaml
basics:
  highlights:
    - "{{github 'username'}}"
# Output: [github.com/username](https://github.com/username)
```

#### `linkedin`
Creates LinkedIn profile links:

```yaml
basics:
  highlights:
    - "{{linkedin 'username'}}"
# Output: [linkedin.com/in/username](https://linkedin.com/in/username)
```

### Date and Time Helpers

#### `date`
Formats dates using Moment.js patterns:

```yaml
basics:
  highlights:
    - "Resume updated: {{date 'MMMM Do, YYYY'}}"
    - "Generated on: {{date 'dddd, MMMM Do YYYY'}}"

# Using with custom date
work:
  - company: Tech Corp
    summary: "Employed since {{date 'MM/YYYY' startDate}}"
```

Common date patterns:
- `YYYY-MM-DD` → 2024-03-15
- `MM/DD/YYYY` → 03/15/2024
- `MMMM Do, YYYY` → March 15th, 2024
- `dddd, MMMM Do YYYY` → Friday, March 15th 2024

#### `dateadd`
Adds time to a date:

```yaml
work:
  - company: Future Corp
    summary: "Contract ending {{dateadd (date) 6 'months' 'MMMM YYYY'}}"
```

Parameters: `originalDate`, `count`, `unit`, `format`
Units: `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`

#### `datesub`
Subtracts time from a date:

```yaml
education:
  - institution: University
    summary: "Started {{datesub (date) 4 'years' 'YYYY'}}"
```

### Data Manipulation Helpers

#### `use`
Includes complex objects or arrays in templates:

```yaml
customProducts:
  standardHour:
    description: "Software Development Hour"
    unitPrice: 150

items:
  - definition: "{{use customProducts.standardHour}}"
    quantity: 8
```

#### `number`
Ensures numeric values are treated as numbers:

```yaml
invoice:
  total: "{{number '1250.50'}}"
```

### Path Helpers

#### `pathjoin`
Joins path segments safely across operating systems:

```yaml
output: "{{pathjoin 'projects' company 'resumes' (pathsafe basics.name)}}.pdf"
# Creates: projects/acme/resumes/john-doe.pdf
```

## Advanced Merging Helpers

These helpers work with the advanced merging system:

### `remove`
Removes items from arrays during merging:

```yaml
skills:
  - name: Languages
    keywords:
      - JavaScript
      - Python
      - "{{remove 'PHP'}}"  # Removes PHP if it exists in merged arrays
```

### `rest`
Specifies insertion point for other arrays during merging:

```yaml
work:
  - "{{rest}}"  # Other work experiences inserted here
  - position: Current Role
    company: New Company
```

### `merge`
Controls array merging behavior:

```yaml
skills:
  - name: Languages
    keywords:
      - "{{merge 'replace'}}"  # Replaces instead of merging
      - JavaScript
      - Python
```

Options: `concat`, `uniques`, `replace`

## Context Variables

### Source File Information

Available in all templates:

```yaml
output: ./out/{{source.name}}-{{date 'YYYY-MM-DD'}}.pdf

basics:
  summary: |
    Resume generated from {{source.file}} 
    located in {{source.dir}}
```

- `source.path` - Full file path
- `source.name` - Filename without extension  
- `source.file` - Filename with extension
- `source.dir` - Directory containing the file
- `source.extension` - File extension

### Environment Variables

Access environment variables:

```yaml
basics:
  email: "{{env.CONTACT_EMAIL}}"
  
output: ./out/{{env.BUILD_ENV}}/resume.pdf
```

### Current Working Directory

```yaml
output: "{{cwd}}/dist/resume.pdf"
```

## Conditional Logic

### Basic Conditionals

```yaml
{{#if showPersonalProjects}}
projects:
  - name: Personal Website
{{/if}}

{{#unless hideContactInfo}}
basics:
  email: john@example.com
{{/unless}}
```

### Comparison Helpers

```yaml
{{#eq experience 'senior'}}
work:
  - position: Senior Software Engineer
{{/eq}}

{{#gt yearsExperience 5}}
achievements:
  - name: Leadership Award
{{/gt}}
```

### Nested Conditions

```yaml
{{#if (and (eq role 'frontend') (gt experience 3))}}
skills:
  - name: Advanced Frontend
    keywords: [React, Vue.js, Angular]
{{/if}}
```

## Loops and Iteration

### Each Helper

```yaml
{{#each companies}}
work:
  - company: {{this.name}}
    role: {{this.position}}
{{/each}}
```

### With Helper

```yaml
{{#with basics}}
title:
  items:
    - "{{email}}"
    - "{{phone}}"
{{/with}}
```

## Custom Context

Create custom template contexts:

```yaml
templateData:
  currentYear: 2024
  skills:
    primary: [JavaScript, Python]
    secondary: [Docker, AWS]

education:
  - year: "{{templateData.currentYear}}"
    courses: "{{#each templateData.skills.primary}}{{this}}{{/each}}"
```

## Escaping and Raw Content

### HTML/Markdown Escaping

```yaml
basics:
  summary: |
    Expert in {{language}} & web development.
    # The & is automatically escaped in output
```

### Raw Content

```yaml
work:
  - highlights:
    - "{{{rawMarkdown}}}"  # Triple braces prevent escaping
```

## Error Handling

### Safe Property Access

```yaml
# Safe - won't error if property doesn't exist
work:
  - company: "{{company.name}}"
    
# Safer - with fallback
work:
  - company: "{{company.name 'Unknown Company'}}"
```

### Debugging Templates

Use descriptive output paths to debug template resolution:

```yaml
output: ./debug/{{company}}-{{role}}-{{date 'YYYY-MM-DD-HH-mm'}}.pdf
```

## Best Practices

### 1. Use Descriptive Variable Names

```yaml
# Good
variants:
  applicationTarget:
    - company: acme
      role: senior-developer

# Better  
variants:
  position:
    - targetCompany: acme
      targetRole: senior-developer
      emphasis: leadership
```

### 2. Combine Helpers

```yaml
output: ./applications/{{pathsafe company}}/{{date 'YYYY-MM-DD'}}-{{pathsafe role}}.pdf
```

### 3. Document Complex Templates

```yaml
# Generate filename: company-role-YYYY-MM-DD.pdf
output: "{{pathsafe company}}-{{pathsafe role}}-{{date 'YYYY-MM-DD'}}.pdf"

work:
  - position: "{{role}}"  # From variant
    company: "{{company}}"  # From variant
```

### 4. Use Consistent Formatting

```yaml
# Consistent date format across all sections
work:
  - startDate: "{{date 'YYYY-MM-DD' startDateRaw}}"
    
education:
  - graduationDate: "{{date 'YYYY-MM-DD' graduationRaw}}"
```

### 5. Validate Template Output

Always verify that your templates generate the expected output by checking the produced PDF filenames and content.
