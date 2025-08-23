# Custom Components

EngineerCV allows you to create custom React-PDF components to extend the built-in functionality. This enables you to add specialized layouts, unique styling, or custom data processing logic.

## Basic Component Structure

Custom components are defined using the `defineComponent` function and must be exported as part of a configuration object:

```typescript
import "engineercv/module-globals";

const myCustomSection = defineComponent({
  name: "myCustomSection",
  schema: z.object({
    myData: z.object({
      title: z.string(),
      items: z.array(z.string()).optional()
    })
  }),
  component: ({ spec, styles, getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    
    return (
      <ReactPdf.View style={styles.container}>
        <Markdown style={styles.title}>{spec.myData.title}</Markdown>
        {spec.myData.items?.map((item, index) => (
          <ReactPdf.Text key={index} style={styles.item}>
            {item}
          </ReactPdf.Text>
        ))}
      </ReactPdf.View>
    );
  },
  defaultStyles: {
    container: {
      marginTop: "12pt",
      marginBottom: "12pt"
    },
    title: {
      fontSize: "16pt",
      fontWeight: "bold",
      marginBottom: "8pt"
    },
    item: {
      fontSize: "12pt",
      marginBottom: "4pt"
    }
  } as const
});

export default {
  config: {
    components: {
      myCustomSection
    }
  }
};
```

## Component Definition API

### Required Properties

#### `name`
Unique identifier for the component:

```typescript
const component = defineComponent({
  name: "uniqueComponentName",
  // ...
});
```

#### `schema`
Zod schema defining the data structure this component expects:

```typescript
schema: z.object({
  mySection: z.object({
    title: z.string(),
    optional: z.string().optional(),
    items: z.array(z.string()),
    metadata: z.record(z.string(), z.any()).optional()
  })
})
```

#### `component`
React component function that renders the PDF content:

```typescript
component: ({ spec, styles, getComponent, globalStyles, resolvePath }) => {
  // Return React-PDF JSX
}
```

#### `defaultStyles`
Default styles for the component:

```typescript
defaultStyles: {
  container: {
    padding: "10pt",
    marginBottom: "8pt"
  },
  text: {
    fontSize: "12pt"
  }
} as const
```

### Optional Properties

#### `overwrites`
Specify which built-in component this replaces:

```typescript
const customBasics = defineComponent({
  name: "customBasics",
  overwrites: "basics",
  // ...
});
```

#### `additionalProps`
Define additional props the component accepts beyond `spec` and `styles`:

```typescript
additionalProps: z.object({
  highlightColor: z.string().optional(),
  showBorder: z.boolean().optional()
}),
component: ({ spec, styles, highlightColor, showBorder }) => {
  // Use additional props
}
```

## Component Function Parameters

### `spec`
The complete configuration object, typed according to your schema:

```typescript
component: ({ spec }) => {
  const title = spec.mySection.title;
  const items = spec.mySection.items || [];
  // ...
}
```

### `styles`
Merged styles object containing default styles + any overrides:

```typescript
component: ({ styles }) => (
  <ReactPdf.View style={styles.container}>
    <ReactPdf.Text style={styles.title}>Title</ReactPdf.Text>
  </ReactPdf.View>
)
```

### `getComponent`
Function to reference other components:

```typescript
component: ({ getComponent }) => {
  const Markdown = getComponent({ name: "markdown" });
  const SectionHeader = getComponent({ name: "sectionHeader" });
  
  return (
    <ReactPdf.View>
      <SectionHeader>My Section</SectionHeader>
      <Markdown>**Bold text**</Markdown>
    </ReactPdf.View>
  );
}
```

### `globalStyles`
Access to global style configuration:

```typescript
component: ({ globalStyles }) => (
  <ReactPdf.Text style={globalStyles.baseText}>
    Text with global styling
  </ReactPdf.Text>
)
```

### `resolvePath`
Function to resolve relative paths:

```typescript
component: ({ resolvePath, spec }) => (
  <ReactPdf.Image 
    src={resolvePath(spec.basics.image)} 
    style={styles.image}
  />
)
```

## Using Components in Configuration

### Import Custom Components

```yaml
imports:
  - ./my-custom-components.tsx

config:
  customComponents: ./my-custom-components.tsx
```

### Reference in Configuration

Once imported, use your custom data structure:

```yaml
myData:
  title: "Custom Section"
  items:
    - "First item"
    - "Second item"
    - "Third item"
```

## Built-in Component Integration

### Extending Existing Components

Create enhanced versions of built-in components:

```typescript
const enhancedWork = defineComponent({
  name: "enhancedWork",
  overwrites: "work",
  schema: z.object({
    work: z.array(z.object({
      position: z.string(),
      company: z.string(),
      highlights: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(), // Custom field
      impact: z.string().optional() // Custom field
    }))
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent({ name: "sectionHeader" });
    const Markdown = getComponent({ name: "markdown" });
    
    return (
      <ReactPdf.View style={styles.container}>
        <SectionHeader>Experience</SectionHeader>
        {spec.work?.map((job, index) => (
          <ReactPdf.View key={index} style={styles.job}>
            <ReactPdf.Text style={styles.position}>
              {job.position} at {job.company}
            </ReactPdf.Text>
            
            {job.impact && (
              <ReactPdf.View style={styles.impact}>
                <ReactPdf.Text style={styles.impactLabel}>Impact: </ReactPdf.Text>
                <Markdown style={styles.impactText}>{job.impact}</Markdown>
              </ReactPdf.View>
            )}
            
            {job.technologies && (
              <ReactPdf.View style={styles.technologies}>
                <ReactPdf.Text style={styles.techLabel}>Technologies: </ReactPdf.Text>
                <ReactPdf.Text style={styles.techList}>
                  {job.technologies.join(", ")}
                </ReactPdf.Text>
              </ReactPdf.View>
            )}
            
            {job.highlights?.map((highlight, i) => (
              <ReactPdf.Text key={i} style={styles.highlight}>
                • {highlight}
              </ReactPdf.Text>
            ))}
          </ReactPdf.View>
        ))}
      </ReactPdf.View>
    );
  },
  defaultStyles: {
    container: { marginBottom: "12pt" },
    job: { marginBottom: "10pt" },
    position: { fontSize: "14pt", fontWeight: "bold" },
    impact: { 
      flexDirection: "row", 
      marginTop: "4pt",
      backgroundColor: "#f0f0f0",
      padding: "4pt"
    },
    impactLabel: { fontWeight: "bold" },
    impactText: {},
    technologies: { flexDirection: "row", marginTop: "4pt" },
    techLabel: { fontWeight: "bold" },
    techList: { fontStyle: "italic" },
    highlight: { marginTop: "2pt", fontSize: "11pt" }
  } as const
});
```

### Reusing Built-in Components

Compose custom components using existing ones:

```typescript
const projectShowcase = defineComponent({
  name: "projectShowcase",
  schema: z.object({
    featuredProjects: z.array(z.object({
      name: z.string(),
      description: z.string(),
      image: z.string().optional(),
      technologies: z.array(z.string())
    }))
  }),
  component: ({ spec, styles, getComponent }) => {
    const SectionHeader = getComponent({ name: "sectionHeader" });
    const Markdown = getComponent({ name: "markdown" });
    const Image = getComponent({ name: "image" });
    
    return (
      <ReactPdf.View style={styles.container}>
        <SectionHeader>Featured Projects</SectionHeader>
        {spec.featuredProjects?.map((project, index) => (
          <ReactPdf.View key={index} style={styles.project}>
            <ReactPdf.View style={styles.projectHeader}>
              <ReactPdf.Text style={styles.projectName}>
                {project.name}
              </ReactPdf.Text>
              {project.image && (
                <Image 
                  src={project.image} 
                  style={styles.projectImage}
                />
              )}
            </ReactPdf.View>
            
            <Markdown style={styles.description}>
              {project.description}
            </Markdown>
            
            <ReactPdf.View style={styles.technologies}>
              {project.technologies.map((tech, i) => (
                <ReactPdf.Text key={i} style={styles.techTag}>
                  {tech}
                </ReactPdf.Text>
              ))}
            </ReactPdf.View>
          </ReactPdf.View>
        ))}
      </ReactPdf.View>
    );
  },
  defaultStyles: {
    container: {},
    project: { 
      marginBottom: "16pt",
      borderBottom: "1pt solid #eee",
      paddingBottom: "12pt"
    },
    projectHeader: { 
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    projectName: { 
      fontSize: "14pt", 
      fontWeight: "bold" 
    },
    projectImage: { 
      width: "60pt", 
      height: "40pt",
      objectFit: "cover"
    },
    description: { 
      marginTop: "6pt",
      marginBottom: "8pt"
    },
    technologies: { 
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "4pt"
    },
    techTag: {
      backgroundColor: "#e0e0e0",
      padding: "2pt 6pt",
      fontSize: "10pt",
      borderRadius: "2pt"
    }
  } as const
});
```

## Advanced Patterns

### Conditional Rendering

```typescript
component: ({ spec, styles }) => {
  if (!spec.myData?.items?.length) {
    return null; // Don't render if no data
  }

  return (
    <ReactPdf.View style={styles.container}>
      {spec.myData.showTitle && (
        <ReactPdf.Text style={styles.title}>
          {spec.myData.title}
        </ReactPdf.Text>
      )}
      {/* ... */}
    </ReactPdf.View>
  );
}
```

### Dynamic Styling

```typescript
component: ({ spec, styles }) => (
  <ReactPdf.View 
    style={[
      styles.container,
      spec.myData.highlighted && styles.highlighted,
      spec.myData.urgent && { backgroundColor: "#ffcccc" }
    ]}
  >
    {/* ... */}
  </ReactPdf.View>
)
```

### Complex Data Processing

```typescript
component: ({ spec, styles }) => {
  const groupedItems = spec.myData.items.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <ReactPdf.View style={styles.container}>
      {Object.entries(groupedItems).map(([category, items]) => (
        <ReactPdf.View key={category} style={styles.category}>
          <ReactPdf.Text style={styles.categoryTitle}>
            {category}
          </ReactPdf.Text>
          {items.map((item, index) => (
            <ReactPdf.Text key={index} style={styles.item}>
              {item.name}
            </ReactPdf.Text>
          ))}
        </ReactPdf.View>
      ))}
    </ReactPdf.View>
  );
}
```

## Best Practices

### 1. Follow Schema-First Design

Always define your schema before implementing the component:

```typescript
// Define expected data structure first
schema: z.object({
  customSection: z.object({
    title: z.string(),
    items: z.array(z.object({
      name: z.string(),
      value: z.number(),
      category: z.enum(["important", "normal", "minor"])
    }))
  })
}),
// Then implement component to match schema
```

### 2. Use Consistent Naming

```typescript
// Good: Clear, descriptive names
const projectGallery = defineComponent({
  name: "projectGallery",
  // ...
});

// Better: Include context
const portfolioProjectGallery = defineComponent({
  name: "portfolioProjectGallery",
  // ...
});
```

### 3. Leverage Built-in Components

```typescript
// Reuse existing components instead of reimplementing
const customSection = defineComponent({
  component: ({ getComponent }) => {
    const Markdown = getComponent({ name: "markdown" });
    const SectionHeader = getComponent({ name: "sectionHeader" });
    // Use these instead of ReactPdf.Text directly
  }
});
```

### 4. Handle Edge Cases

```typescript
component: ({ spec, styles }) => {
  // Handle missing or empty data
  const items = spec.myData?.items || [];
  if (items.length === 0) {
    return (
      <ReactPdf.Text style={styles.empty}>
        No items to display
      </ReactPdf.Text>
    );
  }
  
  // Handle long lists
  const displayItems = items.slice(0, 10); // Limit to prevent overflow
  
  return (
    <ReactPdf.View style={styles.container}>
      {displayItems.map(/* ... */)}
      {items.length > 10 && (
        <ReactPdf.Text style={styles.more}>
          ... and {items.length - 10} more items
        </ReactPdf.Text>
      )}
    </ReactPdf.View>
  );
}
```

### 5. Test with Multiple Data Scenarios

Create test configurations with:
- Empty data
- Minimal data
- Maximum expected data
- Edge cases (very long strings, special characters, etc.)

## Debugging Custom Components

### 1. Use Console Logging

```typescript
component: ({ spec }) => {
  console.log("Component received spec:", spec);
  // ...
}
```

### 2. Validate Props

```typescript
component: ({ spec, styles }) => {
  if (!spec.myData) {
    console.error("myData is missing from spec");
    return <ReactPdf.Text>Error: Missing data</ReactPdf.Text>;
  }
  // ...
}
```

### 3. Test Incrementally

Build components step by step:

```typescript
// Start simple
component: () => (
  <ReactPdf.Text>Component renders</ReactPdf.Text>
);

// Add data
component: ({ spec }) => (
  <ReactPdf.Text>{spec.myData?.title || "No title"}</ReactPdf.Text>
);

// Add styling
component: ({ spec, styles }) => (
  <ReactPdf.Text style={styles.title}>
    {spec.myData?.title}
  </ReactPdf.Text>
);
```
