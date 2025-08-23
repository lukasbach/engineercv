# Page Numbers and Headers

EngineerCV supports page numbers and custom headers/footers for multi-page documents. These elements are positioned absolutely and appear on every page of your resume.

## Page Numbers

### Basic Page Number Configuration

Enable page numbers with the `usePageNumbers` configuration:

```yaml
config:
  usePageNumbers: true

strings:
  pageTemplate: "Page {{pageNumber}} of {{totalPages}}"
```

### Automatic Page Number Behavior

Page numbers have intelligent display logic:
- **Single page documents**: Page numbers are hidden by default
- **Multi-page documents**: Page numbers appear automatically
- **Explicit control**: Use `usePageNumbers: true` to force display even on single pages

### Custom Page Number Templates

The `pageTemplate` string supports Handlebars templating with page variables:

```yaml
strings:
  pageTemplate: "{{pageNumber}}/{{totalPages}}"
  # Output: "1/3", "2/3", "3/3"
  
  pageTemplate: "Page {{pageNumber}}"
  # Output: "Page 1", "Page 2", "Page 3"
  
  pageTemplate: "{{pageNumber}} of {{totalPages}} pages"
  # Output: "1 of 3 pages", "2 of 3 pages", "3 of 3 pages"
  
  pageTemplate: "— {{pageNumber}} —"
  # Output: "— 1 —", "— 2 —", "— 3 —"
```

### Page Number Positioning

Customize page number placement through styles:

```yaml
styles:
  pageNumbers:
    container:
      position: "absolute"
      bottom: "20pt"          # Distance from bottom
      right: "30pt"           # Distance from right edge
      fontSize: "10pt"
      color: "#666"
      
  # Alternative: Center bottom
  pageNumbers:
    container:
      position: "absolute"
      bottom: "20pt"
      left: "50%"
      transform: "translateX(-50%)"
      textAlign: "center"
      
  # Alternative: Top right
  pageNumbers:
    container:
      position: "absolute"
      top: "20pt"
      right: "30pt"
```

## Page Headers

### Custom Header Component

Create a custom header that appears on every page:

```typescript
// custom-header.tsx
import "engineercv/module-globals";

const pageHeader = defineComponent({
  name: "pageHeader",
  schema: z.object({
    basics: z.object({
      name: z.string(),
      email: z.string().optional()
    })
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container} fixed>
      <ReactPdf.Text style={styles.name}>
        {spec.basics.name}
      </ReactPdf.Text>
      {spec.basics.email && (
        <ReactPdf.Text style={styles.email}>
          {spec.basics.email}
        </ReactPdf.Text>
      )}
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      position: "absolute",
      top: "15pt",
      left: "30pt",
      right: "30pt",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: "0.5pt solid #ccc",
      paddingBottom: "8pt"
    },
    name: {
      fontSize: "12pt",
      fontWeight: "bold",
      color: "#333"
    },
    email: {
      fontSize: "10pt",
      color: "#666"
    }
  } as const
});

export default {
  config: {
    components: { pageHeader }
  },
  order: ["pageHeader", "{{ rest }}"]
};
```

### Using Custom Headers

```yaml
imports:
  - ./custom-header.tsx

config:
  usePageNumbers: true

basics:
  name: John Doe
  email: john.doe@example.com
```

## Page Footers

### Custom Footer Component

```typescript
// custom-footer.tsx
import "engineercv/module-globals";

const pageFooter = defineComponent({
  name: "pageFooter", 
  schema: z.object({
    basics: z.object({
      name: z.string(),
      phone: z.string().optional(),
      url: z.string().optional()
    })
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container} fixed>
      <ReactPdf.Text style={styles.text}>
        {spec.basics.name}
      </ReactPdf.Text>
      {spec.basics.phone && (
        <ReactPdf.Text style={styles.text}>
          {spec.basics.phone}
        </ReactPdf.Text>
      )}
      {spec.basics.url && (
        <ReactPdf.Text style={styles.text}>
          {spec.basics.url}
        </ReactPdf.Text>
      )}
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      position: "absolute",
      bottom: "15pt",
      left: "30pt", 
      right: "30pt",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderTop: "0.5pt solid #ccc",
      paddingTop: "8pt"
    },
    text: {
      fontSize: "9pt",
      color: "#666"
    }
  } as const
});

export default {
  config: {
    components: { pageFooter }
  },
  order: ["{{ rest }}", "pageFooter"]
};
```

## Combined Header/Footer with Page Numbers

### Comprehensive Page Layout

```typescript
// page-layout.tsx
import "engineercv/module-globals";

const pageLayout = defineComponent({
  name: "pageLayout",
  schema: z.object({
    basics: z.object({
      name: z.string(),
      email: z.string().optional(),
      phone: z.string().optional()
    }),
    config: z.object({
      usePageNumbers: z.boolean().optional()
    }).optional(),
    strings: z.object({
      pageTemplate: z.string().optional()
    }).optional()
  }),
  component: ({ spec, styles }) => (
    <>
      {/* Header */}
      <ReactPdf.View style={styles.header} fixed>
        <ReactPdf.Text style={styles.headerName}>
          {spec.basics.name}
        </ReactPdf.Text>
        <ReactPdf.Text style={styles.headerDate}>
          {new Date().toLocaleDateString()}
        </ReactPdf.Text>
      </ReactPdf.View>

      {/* Footer */}
      <ReactPdf.View style={styles.footer} fixed>
        <ReactPdf.View style={styles.footerContent}>
          {spec.basics.email && (
            <ReactPdf.Text style={styles.footerText}>
              {spec.basics.email}
            </ReactPdf.Text>
          )}
          {spec.basics.phone && (
            <ReactPdf.Text style={styles.footerText}>
              {spec.basics.phone}
            </ReactPdf.Text>
          )}
        </ReactPdf.View>
        
        {/* Custom page numbers */}
        {spec.config?.usePageNumbers !== false && (
          <ReactPdf.Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => {
              if (totalPages <= 1 && !spec.config?.usePageNumbers) return null;
              const template = spec.strings?.pageTemplate || "{{pageNumber}}/{{totalPages}}";
              return template
                .replace("{{pageNumber}}", pageNumber.toString())
                .replace("{{totalPages}}", totalPages.toString());
            }}
          />
        )}
      </ReactPdf.View>
    </>
  ),
  defaultStyles: {
    header: {
      position: "absolute",
      top: "15pt",
      left: "30pt",
      right: "30pt",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottom: "0.5pt solid #ddd",
      paddingBottom: "6pt"
    },
    headerName: {
      fontSize: "11pt",
      fontWeight: "bold",
      color: "#2c3e50"
    },
    headerDate: {
      fontSize: "9pt",
      color: "#7f8c8d"
    },
    footer: {
      position: "absolute",
      bottom: "15pt",
      left: "30pt",
      right: "30pt",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "0.5pt solid #ddd",
      paddingTop: "6pt"
    },
    footerContent: {
      display: "flex",
      flexDirection: "row",
      gap: "12pt"
    },
    footerText: {
      fontSize: "9pt",
      color: "#7f8c8d"
    },
    pageNumber: {
      fontSize: "9pt",
      color: "#7f8c8d"
    }
  } as const
});

export default {
  config: {
    components: { pageLayout }
  },
  order: ["pageLayout", "{{ rest }}"]
};
```

## Advanced Page Number Features

### Conditional Page Numbers

Only show page numbers after the first page:

```typescript
const conditionalPageNumbers = defineComponent({
  name: "conditionalPageNumbers",
  schema: z.object({}),
  component: ({ styles }) => (
    <ReactPdf.Text 
      style={styles.container}
      fixed
      render={({ pageNumber, totalPages }) => {
        // Only show on pages 2 and beyond
        if (pageNumber === 1) return null;
        return `Page ${pageNumber} of ${totalPages}`;
      }}
    />
  ),
  defaultStyles: {
    container: {
      position: "absolute",
      bottom: "20pt",
      right: "30pt",
      fontSize: "10pt",
      color: "#666"
    }
  } as const
});
```

### Page-Specific Content

Show different content based on page number:

```typescript
const pageSpecificHeader = defineComponent({
  name: "pageSpecificHeader",
  schema: z.object({
    basics: z.object({
      name: z.string()
    })
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.Text 
      style={styles.container}
      fixed
      render={({ pageNumber }) => {
        if (pageNumber === 1) {
          return spec.basics.name; // Show name on first page
        } else {
          return `${spec.basics.name} - Resume (continued)`; // Show "continued" on other pages
        }
      }}
    />
  ),
  defaultStyles: {
    container: {
      position: "absolute",
      top: "15pt",
      left: "30pt",
      fontSize: "11pt",
      fontWeight: "bold"
    }
  } as const
});
```

## Page Break Control

### Manual Page Breaks

Force page breaks at specific points:

```yaml
work:
  - position: Senior Developer
    company: Current Company
    # ... job details

  # Force page break before next job
  - pageBreak: true
    position: Previous Developer  
    company: Previous Company
```

### Preventing Breaks

Keep related content together:

```yaml
styles:
  work:
    item:
      # Prevent breaking work items across pages
      breakInside: "avoid"
      
  education:
    container:
      # Keep entire education section together
      breakInside: "avoid"
```

## Responsive Headers/Footers

### Mobile-Friendly Headers

```yaml
styles:
  pageHeader:
    container:
      # Adjust header size for smaller pages
      paddingHorizontal: "20pt"  # Smaller margins on mobile
    name:
      fontSize: "10pt"           # Smaller font for mobile
```

### Content-Aware Footers

```typescript
const smartFooter = defineComponent({
  component: ({ spec, styles }) => {
    const hasContact = spec.basics.email || spec.basics.phone;
    
    return (
      <ReactPdf.View style={styles.container} fixed>
        {hasContact && (
          <ReactPdf.View style={styles.contact}>
            {spec.basics.email && (
              <ReactPdf.Text>{spec.basics.email}</ReactPdf.Text>
            )}
            {spec.basics.phone && (
              <ReactPdf.Text>{spec.basics.phone}</ReactPdf.Text>
            )}
          </ReactPdf.View>
        )}
        
        <ReactPdf.Text 
          render={({ pageNumber, totalPages }) => 
            totalPages > 1 ? `${pageNumber}/${totalPages}` : null
          }
        />
      </ReactPdf.View>
    );
  }
  // ... rest of component
});
```

## Best Practices

### 1. Keep Headers/Footers Minimal

```yaml
# Good: Essential information only
pageHeader:
  content:
    - name
    - email

# Avoid: Too much information
pageHeader:
  content:
    - name
    - email  
    - phone
    - address
    - linkedin
    - github
```

### 2. Consistent Positioning

```yaml
styles:
  pageHeader:
    container:
      top: "20pt"      # Consistent across all pages
  pageNumbers:
    container:
      bottom: "20pt"   # Match header spacing
```

### 3. Readable Fonts

```yaml
styles:
  pageNumbers:
    container:
      fontSize: "10pt"    # Large enough to read
      color: "#666"       # Subtle but visible
```

### 4. Test Multi-Page Documents

Always test with content that spans multiple pages to ensure:
- Headers/footers appear correctly
- Page numbers increment properly
- Content doesn't overlap with fixed elements
- Page breaks occur at logical points

### 5. Consider Print Margins

```yaml
styles:
  pageNumbers:
    container:
      bottom: "25pt"  # Account for printer margins
      right: "25pt"   # Stay within printable area
```
