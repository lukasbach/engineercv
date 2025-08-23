# Advanced Merging

EngineerCV provides sophisticated merging capabilities that go beyond simple deep merging. This allows fine-grained control over how configuration data is combined from imports, variants, and base configurations.

## Basic Merging Behavior

By default, EngineerCV performs deep merging:


- Objects are merged recursively
- Arrays are concatenated
- Primitive values are overridden

```yaml
# base.yml
skills:
  - name: Languages
    keywords: [JavaScript, Python]

# main.yml  
imports:
  - ./base.yml

skills:
  - name: Frameworks
    keywords: [React, Django]

# Result: Both skill sections are included
```

## Array Merging Control

### Merge Behaviors

Control how arrays are merged using the `merge` helper:

```yaml
skills:
  - "{{merge 'concat'}}"    # Default: concatenate arrays
  - "{{merge 'uniques'}}"   # Remove duplicates after concatenating
  - "{{merge 'replace'}}"   # Replace entire array
  - name: Languages
    keywords: [JavaScript, TypeScript]
```


#### Concat (Default)

```yaml
# Base: [A, B]
# Import: [C, D]
# Result: [A, B, C, D]
```


#### Uniques

```yaml
# Base: [JavaScript, Python, JavaScript]
# Import: [Python, Java]
# Result: [JavaScript, Python, Java]

```

#### Replace

```yaml
# Base: [A, B, C]
# Import: ["{{merge 'replace'}}", X, Y]
# Result: [X, Y]
```

## Object Merging with IDs

Use `$id` to merge specific objects within arrays:

```yaml
# base.yml
work:
  - $id: current-job
    position: Software Engineer
    company: Tech Corp
    highlights:
      - Built web applications
      - Collaborated with teams

# variant.yml
work:
  - $id: current-job
    position: Senior Software Engineer  # Updates position
    highlights:
      - "{{remove 0}}"                  # Removes first highlight
      - Led development teams           # Adds new highlight

      - "{{rest}}"                      # Keeps remaining highlights
```

Result merges the objects with matching `$id`:

```yaml
work:
  - $id: current-job
    position: Senior Software Engineer  # Updated
    company: Tech Corp                  # Preserved
    highlights:
      - Led development teams           # Added first
      - Collaborated with teams         # Remaining from base

```

## Item Removal

### Remove by Value

```yaml
skills:
  - name: Languages
    keywords:

      - JavaScript
      - Python  
      - "{{remove 'PHP'}}"     # Removes PHP if present
```

### Remove by Index

```yaml
work:
  - company: Current Job

    highlights:
      - "{{remove 0}}"         # Removes first highlight
      - New first highlight
      - "{{rest}}"             # Keeps remaining highlights
```

### Remove by ID

```yaml
work:

  - "{{remove 'old-job-id'}}"  # Removes object with $id: old-job-id
  - $id: new-job
    position: Current Role
```

## Insertion Control

### Rest Insertion

Specify where other arrays should be inserted:

```yaml

work:
  - position: Latest Role     # Always first
    company: New Company
  - "{{rest}}"               # Insert other work experiences here
  - position: Oldest Role    # Always last
    company: Old Company
```

### Multiple Rest Points


```yaml
projects:
  - "{{rest}}"               # Featured projects first
  - name: Side Project       # Always in middle
  - "{{rest}}"               # Remaining projects last
```

## Complex Merging Scenarios

### Conditional Merging

```yaml

# Only merge additional skills for senior roles
skills:
  - name: Core
    keywords: [JavaScript, Python]
  {{#if (eq level 'senior')}}
  - name: Leadership  
    keywords: [Team Management, Mentoring]
  {{/if}}
```

### Priority-Based Merging


```yaml
# Higher priority items first
work:
  - "{{merge 'replace'}}"
  {{#each (sortBy work 'priority')}}
  - position: "{{position}}"
    company: "{{company}}"
  {{/each}}
```

### Variant-Specific Removal

```yaml
variants:
  privacy:
    - level: public
      removePersonalProjects: true
    - level: private  

      removePersonalProjects: false

projects:
  - name: Open Source Work
  {{#unless removePersonalProjects}}
  - name: Personal Website
  {{/unless}}
  - "{{remove (if removePersonalProjects 'personal-website')}}"
```

## Advanced ID Matching

### Multiple ID Types

```yaml
work:
  - $id: job-1
    company: First Job
    highlights:

      - $id: highlight-a
        text: Original highlight
      - $id: highlight-b  
        text: Another highlight

# Override specific highlight
work:
  - $id: job-1
    highlights:
      - $id: highlight-a
        text: Updated highlight  # Only this highlight changes
```

### Hierarchical IDs

```yaml
education:
  - $id: university
    institution: University of Technology
    courses:
      - $id: cs-101
        name: Computer Science Fundamentals

      - $id: cs-201
        name: Data Structures

# Update specific course
education:
  - $id: university
    courses:
      - $id: cs-201
        name: Advanced Data Structures  # Only this course updates
        grade: "A+"                     # Add new field
```


## Template-Based Merging

### Dynamic Removal

```yaml
skills:
  - name: Languages
    keywords:
      - JavaScript
      - Python
      - "{{remove (if hideOldTech 'PHP')}}"

      - "{{remove (if hideOldTech 'jQuery')}}"
```

### Computed Merging

```yaml
work:

  - "{{merge (if replaceAllExperience 'replace' 'concat')}}"
  {{#each computedExperience}}
  - position: "{{position}}"
    company: "{{company}}"
  {{/each}}
```

## Debugging Merging

### Merge Tracing


Use descriptive output paths to trace merging:

```yaml
output: ./debug/merged-{{source.name}}-{{date 'HH-mm-ss'}}.pdf
```

### Validation

Add validation helpers:


```yaml
work:
  - $id: validation
    # This will show in output if merging fails
    debug: "Merged {{work.length}} work experiences"
```

### Step-by-Step Testing

Test merging incrementally:

1. Start with base configuration only
2. Add one import at a time
3. Add variants one dimension at a time
4. Verify each step produces expected output

## Performance Considerations


### Efficient Array Operations

```yaml
# Efficient: Specific removals
skills:
  - "{{remove 'outdated-skill'}}"

# Less efficient: Multiple operations
skills:
  - "{{remove 'skill1'}}"
  - "{{remove 'skill2'}}"
  - "{{remove 'skill3'}}"

# Better: Single replace operation
skills:
  - "{{merge 'replace'}}"
  - name: Current Skills

    keywords: [modern, relevant, skills]
```

### Minimize Deep Nesting

```yaml
# Avoid deeply nested ID matching
deep:
  level1:
    level2:
      level3:
        - $id: deep-item  # Hard to debug and slow

# Prefer flatter structures
items:

  - $id: item-1
    category: level1.level2.level3
```

## Best Practices

### 1. Use Consistent ID Naming

```yaml
# Good: Descriptive IDs
work:
  - $id: current-position-2024

  - $id: previous-role-startup
  - $id: internship-university

# Better: Structured naming
work:
  - $id: work.current.senior-dev
  - $id: work.previous.startup-lead  

  - $id: work.early.internship
```

### 2. Document Complex Merging

```yaml
# Complex merging with explanation
skills:
  # Base technical skills from base.yml

  - "{{rest}}"
  # Role-specific skills override
  - "{{merge 'replace'}}"
  - name: "{{role}} Specific"
    keywords: "{{roleSkills}}"
```

### 3. Test Edge Cases

- Empty arrays
- Missing IDs

- Circular references
- Very large arrays
- Special characters in IDs

### 4. Use Meaningful Merge Points

```yaml
# Clear intention
experience:
  - name: Recent Experience
  - "{{rest}}"          # All imported experience
  - name: Early Career  # Separated for clarity
```


### 5. Validate Merged Results

```yaml
# Add validation sections
_validation:
  totalWorkExperience: "{{work.length}}"
  hasRequiredSkills: "{{#if skills}}true{{else}}false{{/if}}"
  # Remove this section before final output

```

## Common Pitfalls

### 1. Forgetting Rest Placement

```yaml
# Wrong: Rest at end means imports come last
work:
  - position: Current Job
  - "{{rest}}"  # Imports appear after current job

# Right: Rest at beginning for chronological order  
work:
  - "{{rest}}"  # Imports (older jobs) first
  - position: Current Job  # Most recent last
```

### 2. ID Conflicts

```yaml
# Problematic: Same ID in different contexts
work:
  - $id: main-role
projects:
  - $id: main-role  # Conflicts can cause unexpected merging
```

### 3. Over-Complex Merging

```yaml
# Too complex - hard to debug
items:
  - "{{merge (if (and showAll (not hidePersonal)) 'concat' 'replace')}}"
  - "{{remove (unless showArchived 'archived-item')}}"
  - "{{#each (filter items (lambda item (gt item.priority 5))))}}"
    - "{{this}}"
  - "{{/each}}"

# Better: Break into steps
items:
  - "{{merge 'concat'}}"
  {{#unless hidePersonal}}
  - "{{rest}}"
  {{/unless}}
```
