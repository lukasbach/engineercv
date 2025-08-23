# Styling and Customization

EngineerCV provides comprehensive styling capabilities that allow you to customize the appearance of your resume. Styles are based on React-PDF's styling system and support CSS-like properties.

## Style Override System

### Global Style Configuration

Override styles globally in your YAML configuration:

```yaml
styles:
  document:
    container:
      fontFamily: "Times-Roman"
      fontSize: "11pt"
      lineHeight: "1.3"
  
  basics:
    name:
      fontSize: "28pt"
      color: "#2c3e50"
      textAlign: "center"
    summary:
      fontSize: "12pt"
      color: "#7f8c8d"
      fontStyle: "italic"

  sectionHeader:
    container:
      fontSize: "16pt"
      fontWeight: "bold" 
      color: "#34495e"
      borderBottom: "2pt solid #3498db"
      marginBottom: "8pt"
```

### Component-Specific Styling

Target specific components and their sub-elements:

```yaml
styles:
  work:
    container:
      marginBottom: "16pt"
    item:
      marginBottom: "12pt"
      borderLeft: "3pt solid #e74c3c"
      paddingLeft: "8pt"
    
  skills:
    section:
      display: "flex"
      flexDirection: "row" 
      flexWrap: "wrap"
      gap: "12pt"
    sectionTitle:
      fontWeight: "bold"
      color: "#2980b9"
```

## CSS Properties Reference

### Typography

```yaml
styles:
  component:
    element:
      fontFamily: "Helvetica"           # Font family
      fontSize: "12pt"                  # Font size (pt, px)
      fontWeight: "bold"                # normal, bold, 100-900
      fontStyle: "italic"               # normal, italic
      lineHeight: "1.4"                 # Line spacing multiplier
      textAlign: "center"               # left, center, right, justify
      textDecoration: "underline"       # none, underline
      textTransform: "uppercase"        # none, uppercase, lowercase, capitalize
      letterSpacing: "1pt"              # Character spacing
      color: "#333333"                  # Text color (hex, rgb, named)
```

### Layout and Positioning

```yaml
styles:
  component:
    element:
      # Flexbox
      display: "flex"                   # flex, none
      flexDirection: "row"              # row, column
      flexWrap: "wrap"                  # wrap, nowrap
      justifyContent: "space-between"   # flex-start, center, flex-end, space-between, space-around
      alignItems: "center"              # flex-start, center, flex-end, stretch
      flex: 1                           # Flex grow/shrink
      
      # Dimensions
      width: "100%"                     # Width (pt, px, %)
      height: "50pt"                    # Height (pt, px)
      minWidth: "200pt"                 # Minimum width
      maxWidth: "500pt"                 # Maximum width
      
      # Positioning
      position: "absolute"              # absolute, relative
      top: "10pt"                       # Top offset
      left: "20pt"                      # Left offset
      right: "20pt"                     # Right offset
      bottom: "10pt"                    # Bottom offset
```

### Spacing

```yaml
styles:
  component:
    element:
      # Margin (outside spacing)
      margin: "10pt"                    # All sides
      marginTop: "8pt"                  # Top only
      marginRight: "12pt"               # Right only
      marginBottom: "8pt"               # Bottom only
      marginLeft: "12pt"                # Left only
      marginHorizontal: "16pt"          # Left and right
      marginVertical: "8pt"             # Top and bottom
      
      # Padding (inside spacing)
      padding: "6pt"                    # All sides
      paddingTop: "4pt"                 # Top only
      paddingRight: "8pt"               # Right only
      paddingBottom: "4pt"              # Bottom only
      paddingLeft: "8pt"                # Left only
      paddingHorizontal: "12pt"         # Left and right
      paddingVertical: "6pt"            # Top and bottom
```

### Borders and Backgrounds

```yaml
styles:
  component:
    element:
      # Borders
      border: "1pt solid #000"          # Width style color
      borderTop: "2pt solid #333"       # Top border only
      borderRight: "1pt dotted #666"    # Right border only  
      borderBottom: "3pt double #999"   # Bottom border only
      borderLeft: "1pt dashed #ccc"     # Left border only
      borderRadius: "4pt"               # Rounded corners
      
      # Background
      backgroundColor: "#f8f9fa"        # Background color
      backgroundImage: "url('bg.jpg')"  # Background image (limited support)
```

## Custom Fonts

### Loading Font Files

Define custom fonts in your configuration:

```yaml
config:
  fonts:
    - family: "OpenSans"
      src: "./fonts/OpenSans-Regular.ttf"
    - family: "OpenSans"
      src: "./fonts/OpenSans-Bold.ttf" 
      fontWeight: "bold"
    - family: "OpenSans"
      src: "./fonts/OpenSans-Italic.ttf"
      fontStyle: "italic"

styles:
  document:
    container:
      fontFamily: "OpenSans"
```

### Built-in Fonts

React-PDF includes several built-in fonts:

```yaml
styles:
  document:
    container:
      fontFamily: "Times-Roman"     # Times New Roman
      # fontFamily: "Helvetica"     # Arial-like
      # fontFamily: "Courier"       # Monospace
```

### Font Variants

```yaml
config:
  fonts:
    - family: "CustomFont"
      fonts:
        - src: "./fonts/Custom-Regular.ttf"
          fontWeight: "normal"
          fontStyle: "normal"
        - src: "./fonts/Custom-Bold.ttf"
          fontWeight: "bold"
          fontStyle: "normal"
        - src: "./fonts/Custom-Italic.ttf"
          fontWeight: "normal"
          fontStyle: "italic"
        - src: "./fonts/Custom-BoldItalic.ttf"
          fontWeight: "bold"
          fontStyle: "italic"
```

## Page Layout

### Page Configuration

```yaml
config:
  size: "A4"                # A4, Letter, Legal, A3, A5
  orientation: "portrait"   # portrait, landscape

styles:
  page:
    container:
      paddingHorizontal: "40pt"  # Left and right margins
      paddingVertical: "50pt"    # Top and bottom margins
      fontSize: "11pt"           # Base font size
      lineHeight: "1.3"          # Base line height
```

### Multi-Column Layouts

```yaml
styles:
  skills:
    container:
      display: "flex"
      flexDirection: "row"
      gap: "20pt"
    column:
      flex: 1
      
  # Two-column layout
  leftColumn:
    flex: 2
    paddingRight: "15pt"
  rightColumn:
    flex: 1
    paddingLeft: "15pt"
```

## Theme Development

### Creating Complete Themes

Organize styles into reusable theme files:

**themes/professional.yml**
```yaml
styles:
  document:
    container:
      fontFamily: "Times-Roman"
      fontSize: "11pt"
      color: "#2c3e50"
  
  basics:
    name:
      fontSize: "24pt"
      fontWeight: "bold"
      textAlign: "center"
      color: "#34495e"
      marginBottom: "8pt"
    
  sectionHeader:
    container:
      fontSize: "14pt"
      fontWeight: "bold"
      color: "#2980b9"
      borderBottom: "1pt solid #bdc3c7"
      marginTop: "16pt"
      marginBottom: "8pt"
      paddingBottom: "2pt"

  work:
    item:
      marginBottom: "10pt"
      borderLeft: "2pt solid #3498db"
      paddingLeft: "8pt"
```

**themes/modern.yml**
```yaml
styles:
  document:
    container:
      fontFamily: "Helvetica" 
      fontSize: "10pt"
      color: "#444"
  
  basics:
    name:
      fontSize: "28pt"
      fontWeight: "300"
      textAlign: "left"
      color: "#e74c3c"
    
  sectionHeader:
    container:
      fontSize: "12pt"
      fontWeight: "bold"
      textTransform: "uppercase"
      letterSpacing: "1pt"
      color: "#95a5a6"
      borderBottom: "none"
      marginTop: "20pt"
      marginBottom: "12pt"
```

### Using Themes

```yaml
imports:
  - ./themes/professional.yml

# Override specific elements
styles:
  basics:
    name:
      color: "#c0392b"  # Override theme color
```

## Responsive Elements

### Conditional Styling

```yaml
styles:
  work:
    item:
      # Base styles
      marginBottom: "8pt"
      # Additional styles based on content
      {{#if (gt highlights.length 3)}}
      borderLeft: "3pt solid #e67e22"
      {{else}}
      borderLeft: "1pt solid #bdc3c7"
      {{/if}}
```

### Dynamic Measurements

```yaml
styles:
  skills:
    container:
      # Calculate spacing based on number of skills
      gap: "{{#if (gt skills.length 5)}}8pt{{else}}12pt{{/if}}"
```

## Advanced Styling Techniques

### Nested Style Objects

```yaml
styles:
  complexComponent:
    container:
      display: "flex"
      flexDirection: "column"
    header:
      display: "flex"
      flexDirection: "row"
      justifyContent: "space-between"
      marginBottom: "6pt"
    title:
      fontSize: "14pt"
      fontWeight: "bold"
    date:
      fontSize: "10pt"
      color: "#7f8c8d"
    content:
      marginLeft: "8pt"
    highlight:
      marginTop: "3pt"
      fontSize: "10pt"
      color: "#2c3e50"
```

### Style Merging

Styles are deeply merged, allowing incremental customization:

```yaml
# Base theme defines:
styles:
  work:
    item:
      fontSize: "11pt"
      marginBottom: "8pt"
      color: "#333"

# Your configuration adds to it:
styles:
  work:
    item:
      borderLeft: "2pt solid #e74c3c"  # Added
      paddingLeft: "8pt"               # Added
      # fontSize and other properties preserved
```

## Common Styling Patterns

### Section Separators

```yaml
styles:
  sectionHeader:
    container:
      borderBottom: "2pt solid #3498db"
      marginTop: "16pt"
      marginBottom: "8pt"
      paddingBottom: "4pt"
```

### Highlight Boxes

```yaml
styles:
  summary:
    container:
      backgroundColor: "#f8f9fa"
      border: "1pt solid #dee2e6"
      borderRadius: "4pt"
      padding: "12pt"
      marginTop: "8pt"
      marginBottom: "12pt"
```

### Two-Tone Headers

```yaml
styles:
  basics:
    container:
      backgroundColor: "#34495e"
      padding: "20pt"
      marginBottom: "16pt"
    name:
      color: "#ffffff"
      fontSize: "24pt"
    summary:
      color: "#bdc3c7"
      fontSize: "12pt"
```

### Skills Tags

```yaml
styles:
  skills:
    keyword:
      backgroundColor: "#ecf0f1"
      border: "1pt solid #bdc3c7"
      borderRadius: "3pt"
      padding: "2pt 6pt"
      fontSize: "9pt"
      color: "#2c3e50"
      marginRight: "4pt"
      marginBottom: "3pt"
```

### Professional Lists

```yaml
styles:
  listItem:
    container:
      display: "flex"
      flexDirection: "row"
      marginBottom: "3pt"
    bullet:
      color: "#3498db"
      marginRight: "6pt"
      fontSize: "8pt"
    text:
      flex: 1
      fontSize: "10pt"
```

## Debugging Styles

### Visual Debugging

Add temporary borders to understand layout:

```yaml
styles:
  debugComponent:
    container:
      border: "1pt solid red"    # Temporary debug border
    element:
      border: "1pt dotted blue"  # See element boundaries
```

### Style Validation

Check if styles are applied correctly:

```yaml
styles:
  testElement:
    # These will be visible in the output if working
    backgroundColor: "#ffff00"  # Bright yellow background
    fontSize: "20pt"            # Large text
    color: "#ff0000"            # Red text
```

## Best Practices

### 1. Use Consistent Units

```yaml
# Good: Consistent pt units
styles:
  component:
    marginTop: "12pt"
    fontSize: "11pt"
    lineHeight: "16pt"

# Avoid: Mixed units
styles:
  component:
    marginTop: "12pt"
    fontSize: "11px"      # Different unit
    lineHeight: 1.4       # Unitless
```

### 2. Establish a Color Palette

```yaml
# Define colors as template variables
colors:
  primary: "#3498db"
  secondary: "#2c3e50"
  accent: "#e74c3c"
  text: "#2c3e50"
  muted: "#7f8c8d"

styles:
  sectionHeader:
    container:
      color: "{{ colors.primary }}"
      borderBottom: "1pt solid {{ colors.primary }}"
```

### 3. Mobile-Friendly Sizing

```yaml
styles:
  document:
    container:
      fontSize: "10pt"      # Readable on mobile
      lineHeight: "1.3"     # Comfortable spacing
      
  basics:
    name:
      fontSize: "20pt"      # Large enough but not overwhelming
```

### 4. Test Print Quality

Always test your styles by:
- Generating actual PDFs
- Printing test pages
- Checking readability at different sizes
- Verifying color reproduction

### 5. Progressive Enhancement

Start with basic styles and add enhancements:

```yaml
# Base styles - ensure readability
styles:
  document:
    container:
      fontSize: "11pt"
      color: "#000"
      
# Enhanced styles - add visual interest
styles:
  sectionHeader:
    container:
      color: "#2980b9"
      borderBottom: "1pt solid #bdc3c7"
```
