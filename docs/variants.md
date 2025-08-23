# Variants

Variants allow you to generate multiple PDF versions from a single configuration file. This is particularly useful for creating targeted resumes for different companies, roles, or privacy levels without maintaining separate files.

## Basic Variant Structure

Variants are defined using the `variants` key at the root level of your YAML file:

```yaml
variants:
  dimensionName:
    - key: value1
      anotherKey: data1
    - key: value2
      anotherKey: data2

output: ./out/resume-{{ key }}.pdf
basics:
  name: "{{ name }}"
```

## Cartesian Product Generation

EngineerCV generates a Cartesian product of all variant dimensions, creating one PDF for each combination:

```yaml
variants:
  privacy:
    - facing: private
      email: john.doe@personal.com
      phone: "+1-555-0123"
    - facing: public
      email: john.doe+jobs@gmail.com
      phone: "+1-555-XXXX"
  focus:
    - role: frontend
      skills:
        - name: Frontend
          keywords: [JavaScript, React, Vue.js]
    - role: backend
      skills:
        - name: Backend
          keywords: [Python, Node.js, PostgreSQL]

output: ./out/{{ facing }}-{{ role }}.pdf
basics:
  name: John Doe
  email: "{{ email }}"
  phone: "{{ phone }}"
```

This generates 4 PDFs:
- `private-frontend.pdf`
- `private-backend.pdf`
- `public-frontend.pdf`
- `public-backend.pdf`

## Variable Interpolation

Variant values are available as Handlebars variables throughout the entire configuration:

```yaml
variants:
  company:
    - target: AcmeCorp
      companyFocus: "enterprise software solutions"
    - target: StartupXYZ
      companyFocus: "cutting-edge mobile applications"

basics:
  name: John Doe
  summary: |
    Software engineer passionate about {{ companyFocus }}.
    Excited to contribute to {{ target }}'s mission.

work:
  - position: Software Engineer
    highlights:
      - "Built scalable systems relevant to {{ companyFocus }}"
```

## Conditional Content

Use Handlebars conditionals to include or exclude content based on variants:

```yaml
variants:
  level:
    - experience: junior
      showGPA: true
    - experience: senior
      showGPA: false

education:
  - institution: University of Technology
    degree: Computer Science
    {{#if showGPA}}
    score: "3.8"
    {{/if}}

work:
  - position: "{{#if (eq experience 'senior')}}Senior{{/if}} Software Engineer"
```

## Advanced Variant Merging

Variants support deep merging with the base configuration. Arrays are merged intelligently:

```yaml
# Base skills
skills:
  - name: Core
    keywords: [JavaScript, Python]

variants:
  specialization:
    - focus: frontend
      skills:
        - name: Core
          keywords: [React, Vue.js]  # Merges with base keywords
        - name: Design
          keywords: [CSS, Figma]    # Adds new skill category
    - focus: backend
      skills:
        - name: Core
          keywords: [Node.js, Django]
        - name: Database
          keywords: [PostgreSQL, MongoDB]
```

## Source Variables

Every variant automatically includes source file information:

```yaml
output: ./out/{{ source.name }}-{{ timestamp }}.pdf

variants:
  timestamp:
    - timestamp: "{{ date 'YYYY-MM-DD' }}"

basics:
  name: John Doe
  # source.path - Full file path
  # source.name - Filename without extension
  # source.dir  - Directory containing the file
  # source.extension - File extension
```

## Environment Variables

Access environment variables in variants:

```yaml
variants:
  deployment:
    - env: development
      contact: "{{ env.DEV_EMAIL }}"
    - env: production
      contact: "{{ env.PROD_EMAIL }}"
```

## Best Practices

### 1. Use Meaningful Dimension Names
```yaml
# Good
variants:
  targetCompany:
    - company: google
    - company: microsoft

# Better
variants:
  application:
    - company: google
      role: swe
      emphasis: algorithms
    - company: microsoft
      role: pm
      emphasis: product
```

### 2. Template Output Paths
```yaml
# Organize outputs by variant
output: ./applications/{{ company }}/{{ role }}-resume.pdf
```

### 3. Combine with Imports
```yaml
imports:
  - ./shared-skills.yml
  - ./work-experience-{{ company }}.yml

variants:
  company:
    - company: tech
    - company: finance
```

### 4. Use Conditional Sections
```yaml
{{#if (eq company 'tech')}}
projects:
  - name: Open Source Contributions
{{/if}}

{{#if (eq company 'finance')}}
certificates:
  - name: Financial Risk Manager (FRM)
{{/if}}
```

## Debugging Variants

Use descriptive output names to track which variant generated which file:

```yaml
output: ./debug/{{ company }}-{{ role }}-{{ privacy }}-debug.pdf
```

The generated files will clearly show which variant combination was used, making it easy to verify your configuration is working as expected.
