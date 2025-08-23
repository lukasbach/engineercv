# Icons and Visual Elements

EngineerCV supports icons from popular icon libraries through React Icons, custom SVG icons, and visual elements like profile pictures and logos.

## React Icons Integration

### Available Icon Libraries

EngineerCV includes access to popular icon libraries through `react-icons`:

- **Font Awesome**: `Fa*` icons (FaEnvelope, FaPhone, FaGithub)
- **Material Design**: `Md*` icons (MdEmail, MdPhone, MdWork)  
- **Bootstrap Icons**: `Bs*` icons (BsEnvelope, BsTelephone, BsLinkedin)
- **Heroicons**: `Hi*` icons (HiMail, HiPhone, HiGlobeAlt)
- **Feather**: `Fi*` icons (FiMail, FiPhone, FiGithub)
- **React Icons**: `Ri*` icons (RiMailLine, RiPhoneLine, RiLinkedinFill)

### Basic Icon Usage

Use icons in custom components by importing from the React Icons library:

```typescript
// custom-contact.tsx
import "engineercv/module-globals";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin } from "react-icons/fa";

const contactWithIcons = defineComponent({
  name: "contactWithIcons",
  schema: z.object({
    basics: z.object({
      email: z.string().optional(),
      phone: z.string().optional(),
      profiles: z.array(z.object({
        network: z.string(),
        url: z.string(),
        username: z.string().optional()
      })).optional()
    })
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container}>
      {spec.basics.email && (
        <ReactPdf.View style={styles.contactItem}>
          <FaEnvelope style={styles.icon} />
          <ReactPdf.Text style={styles.text}>
            {spec.basics.email}
          </ReactPdf.Text>
        </ReactPdf.View>
      )}
      
      {spec.basics.phone && (
        <ReactPdf.View style={styles.contactItem}>
          <FaPhone style={styles.icon} />
          <ReactPdf.Text style={styles.text}>
            {spec.basics.phone}
          </ReactPdf.Text>
        </ReactPdf.View>
      )}
      
      {spec.basics.profiles?.map((profile, index) => (
        <ReactPdf.View key={index} style={styles.contactItem}>
          {profile.network === "GitHub" && <FaGithub style={styles.icon} />}
          {profile.network === "LinkedIn" && <FaLinkedin style={styles.icon} />}
          <ReactPdf.Text style={styles.text}>
            {profile.username || profile.url}
          </ReactPdf.Text>
        </ReactPdf.View>
      ))}
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "4pt"
    },
    contactItem: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "6pt"
    },
    icon: {
      width: "12pt",
      height: "12pt",
      color: "#3498db"
    },
    text: {
      fontSize: "10pt",
      color: "#2c3e50"
    }
  } as const
});

export default {
  config: {
    components: { contactWithIcons }
  }
};
```

### Icon Helper Component

Create a reusable icon helper for consistent icon usage:

```typescript
// icon-helper.tsx
import "engineercv/module-globals";
import { 
  FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter, 
  FaGlobe, FaMapMarkerAlt, FaCalendar, FaBriefcase, 
  FaGraduationCap, FaAward, FaCertificate 
} from "react-icons/fa";

const iconMap = {
  email: FaEnvelope,
  phone: FaPhone,
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  website: FaGlobe,
  location: FaMapMarkerAlt,
  date: FaCalendar,
  work: FaBriefcase,
  education: FaGraduationCap,
  award: FaAward,
  certificate: FaCertificate
} as const;

type IconName = keyof typeof iconMap;

const iconComponent = defineComponent({
  name: "icon",
  schema: z.object({
    name: z.enum([
      "email", "phone", "github", "linkedin", "twitter", 
      "website", "location", "date", "work", "education",
      "award", "certificate"
    ] as const),
    size: z.number().optional(),
    color: z.string().optional()
  }),
  component: ({ spec, styles }) => {
    const IconElement = iconMap[spec.name];
    return (
      <IconElement 
        style={{
          width: `${spec.size || 12}pt`,
          height: `${spec.size || 12}pt`,
          color: spec.color || styles.defaultColor,
          ...styles.icon
        }}
      />
    );
  },
  defaultStyles: {
    icon: {},
    defaultColor: "#3498db"
  } as const
});

export default {
  config: {
    components: { icon: iconComponent }
  }
};
```

### Using Icon Helper in YAML

```yaml
imports:
  - ./icon-helper.tsx

sections:
  contact:
    type: custom
    items:
      - icon:
          name: email
          size: 14
          color: "#e74c3c"
        text: "john.doe@example.com"
      - icon:
          name: phone
          size: 14
          color: "#27ae60"
        text: "+1 (555) 123-4567"
      - icon:
          name: github
          size: 14  
          color: "#2c3e50"
        text: "github.com/johndoe"
```

## Profile Pictures and Images

### Adding Profile Pictures

```typescript
// profile-picture.tsx
import "engineercv/module-globals";

const profilePicture = defineComponent({
  name: "profilePicture",
  schema: z.object({
    basics: z.object({
      name: z.string(),
      image: z.string().optional(), // URL or base64 image
      summary: z.string().optional()
    })
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container}>
      {spec.basics.image && (
        <ReactPdf.View style={styles.imageContainer}>
          <ReactPdf.Image
            style={styles.image}
            src={spec.basics.image}
          />
        </ReactPdf.View>
      )}
      
      <ReactPdf.View style={styles.textContainer}>
        <ReactPdf.Text style={styles.name}>
          {spec.basics.name}
        </ReactPdf.Text>
        {spec.basics.summary && (
          <ReactPdf.Text style={styles.summary}>
            {spec.basics.summary}
          </ReactPdf.Text>
        )}
      </ReactPdf.View>
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "16pt",
      marginBottom: "20pt"
    },
    imageContainer: {
      width: "80pt",
      height: "80pt",
      borderRadius: "40pt",
      overflow: "hidden",
      border: "2pt solid #3498db"
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    textContainer: {
      flex: 1
    },
    name: {
      fontSize: "18pt",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "6pt"
    },
    summary: {
      fontSize: "11pt",
      color: "#34495e",
      lineHeight: 1.4
    }
  } as const
});

export default {
  config: {
    components: { profilePicture }
  }
};
```

### Base64 Embedded Images

For portability, embed images as base64 data URIs:

```yaml
basics:
  name: John Doe
  # Convert image to base64: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
```

### External Image URLs

```yaml
basics:
  name: John Doe
  image: "https://example.com/profile.jpg"
  # or local file path
  image: "./assets/profile.jpg"
```

## Custom SVG Icons

### Inline SVG Components

Create custom SVG icons for specific needs:

```typescript
// custom-svg-icons.tsx
import "engineercv/module-globals";

const customIcons = {
  stack: ({ size = 12, color = "#333" }) => (
    <ReactPdf.Svg width={size} height={size}>
      <ReactPdf.Path
        d="M2 6l10 4-10 4zm0-4l10 4-10 4z"
        fill={color}
      />
    </ReactPdf.Svg>
  ),
  
  rocket: ({ size = 12, color = "#333" }) => (
    <ReactPdf.Svg width={size} height={size} viewBox="0 0 24 24">
      <ReactPdf.Path
        d="M12 2l3.09 6.26L22 9l-5.91 5.34L17.18 22 12 19.27 6.82 22l1.09-7.66L2 9l6.91-.74L12 2z"
        fill={color}
      />
    </ReactPdf.Svg>
  ),

  code: ({ size = 12, color = "#333" }) => (
    <ReactPdf.Svg width={size} height={size} viewBox="0 0 24 24">
      <ReactPdf.Path
        d="M8 16l-4-4 4-4M16 8l4 4-4 4"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ReactPdf.Svg>
  )
};

const customIcon = defineComponent({
  name: "customIcon",
  schema: z.object({
    type: z.enum(["stack", "rocket", "code"]),
    size: z.number().optional(),
    color: z.string().optional()
  }),
  component: ({ spec, styles }) => {
    const IconComponent = customIcons[spec.type];
    return (
      <IconComponent
        size={spec.size || 12}
        color={spec.color || "#333"}
      />
    );
  },
  defaultStyles: {} as const
});

export default {
  config: {
    components: { customIcon }
  }
};
```

## Company Logos and Branding

### Company Logo Component

```typescript
// company-logos.tsx
import "engineercv/module-globals";

const companyWithLogo = defineComponent({
  name: "companyWithLogo",
  schema: z.object({
    work: z.array(z.object({
      company: z.string(),
      position: z.string(),
      logo: z.string().optional(), // URL or base64
      startDate: z.string().optional(),
      endDate: z.string().optional()
    }))
  }),
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container}>
      {spec.work.map((job, index) => (
        <ReactPdf.View key={index} style={styles.jobItem}>
          <ReactPdf.View style={styles.headerRow}>
            {job.logo && (
              <ReactPdf.Image
                style={styles.logo}
                src={job.logo}
              />
            )}
            <ReactPdf.View style={styles.jobDetails}>
              <ReactPdf.Text style={styles.position}>
                {job.position}
              </ReactPdf.Text>
              <ReactPdf.Text style={styles.company}>
                {job.company}
              </ReactPdf.Text>
            </ReactPdf.View>
            <ReactPdf.Text style={styles.dates}>
              {job.startDate} - {job.endDate || "Present"}
            </ReactPdf.Text>
          </ReactPdf.View>
        </ReactPdf.View>
      ))}
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "12pt"
    },
    jobItem: {
      marginBottom: "8pt"
    },
    headerRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "12pt"
    },
    logo: {
      width: "24pt",
      height: "24pt",
      objectFit: "contain"
    },
    jobDetails: {
      flex: 1
    },
    position: {
      fontSize: "12pt",
      fontWeight: "bold",
      color: "#2c3e50"
    },
    company: {
      fontSize: "10pt",
      color: "#7f8c8d"
    },
    dates: {
      fontSize: "10pt",
      color: "#95a5a6"
    }
  } as const
});

export default {
  config: {
    components: { companyWithLogo }
  }
};
```

### Using Company Logos in YAML

```yaml
work:
  - company: "Tech Corp"
    position: "Senior Developer"
    logo: "./assets/techcorp-logo.png"
    startDate: "2020-01"
    endDate: "2023-12"
    
  - company: "StartupXYZ" 
    position: "Full Stack Developer"
    logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    startDate: "2018-06"
    endDate: "2019-12"
```

## Icon Styling and Customization

### Responsive Icon Sizes

```yaml
styles:
  icon:
    small:
      width: "10pt"
      height: "10pt"
    medium:
      width: "14pt"
      height: "14pt"
    large:
      width: "18pt"
      height: "18pt"

  # Apply different sizes by context
  contact:
    icons:
      width: "12pt"
      height: "12pt"
      
  section:
    headerIcons:
      width: "16pt"
      height: "16pt"
```

### Themed Icon Colors

```yaml
config:
  theme: professional

themes:
  professional:
    colors:
      iconPrimary: "#2c3e50"
      iconSecondary: "#3498db"
      iconAccent: "#e74c3c"
      
  creative:
    colors:
      iconPrimary: "#e67e22"
      iconSecondary: "#9b59b6"
      iconAccent: "#1abc9c"

styles:
  icons:
    email:
      color: "{{ themes.professional.colors.iconPrimary }}"
    phone:  
      color: "{{ themes.professional.colors.iconSecondary }}"
    social:
      color: "{{ themes.professional.colors.iconAccent }}"
```

### Icon Alignment and Spacing

```yaml
styles:
  contactItem:
    container:
      display: "flex"
      flexDirection: "row"
      alignItems: "center"
      gap: "8pt"
      marginBottom: "4pt"
    
    icon:
      width: "12pt"
      height: "12pt"
      marginRight: "6pt"
      # Align icon to text baseline
      alignSelf: "flex-start"
      marginTop: "2pt"
    
    text:
      flex: 1
      fontSize: "10pt"
      lineHeight: 1.4
```

## Accessibility and Best Practices

### Screen Reader Friendly Icons

```typescript
const accessibleIcon = defineComponent({
  name: "accessibleIcon",
  schema: z.object({
    type: z.string(),
    label: z.string(), // Screen reader description
    decorative: z.boolean().optional()
  }),
  component: ({ spec, styles }) => {
    const IconElement = iconMap[spec.type];
    return (
      <ReactPdf.View style={styles.container}>
        <IconElement 
          style={styles.icon}
          // In PDF, accessibility is limited, but we can include alt text
          title={spec.decorative ? undefined : spec.label}
        />
        {/* Hidden text for screen readers */}
        {!spec.decorative && (
          <ReactPdf.Text style={styles.srOnly}>
            {spec.label}
          </ReactPdf.Text>
        )}
      </ReactPdf.View>
    );
  },
  defaultStyles: {
    container: {
      position: "relative"
    },
    icon: {
      width: "12pt",
      height: "12pt"
    },
    srOnly: {
      position: "absolute",
      width: "1pt",
      height: "1pt",
      padding: 0,
      margin: "-1pt",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap"
    }
  } as const
});
```

### Performance Optimization

```typescript
// Lazy load icons only when needed
const iconRegistry = {
  contact: () => import("react-icons/fa").then(m => ({
    email: m.FaEnvelope,
    phone: m.FaPhone
  })),
  social: () => import("react-icons/fa").then(m => ({
    github: m.FaGithub,
    linkedin: m.FaLinkedin
  }))
};

// Use specific imports instead of importing entire libraries
import { FaEnvelope, FaPhone } from "react-icons/fa"; // Good
// import * as Fa from "react-icons/fa";                 // Avoid
```

### Icon Fallbacks

```typescript
const iconWithFallback = defineComponent({
  component: ({ spec, styles }) => {
    try {
      const IconElement = iconMap[spec.iconType];
      if (!IconElement) {
        throw new Error("Icon not found");
      }
      return <IconElement style={styles.icon} />;
    } catch (error) {
      // Fallback to text when icon fails
      return (
        <ReactPdf.Text style={styles.fallback}>
          [{spec.iconType}]
        </ReactPdf.Text>
      );
    }
  }
});
```

### Print-Friendly Icons

```yaml
styles:
  icons:
    # Use solid colors for better print quality
    color: "#2c3e50"        # Good: solid dark color
    # color: "rgba(44, 62, 80, 0.5)"  # Avoid: transparent colors
    
    # Ensure sufficient contrast
    backgroundColor: "transparent"
    
    # Size appropriately for print resolution
    minWidth: "10pt"        # Don't go too small
    minHeight: "10pt"
```

### Consistent Icon Usage

```yaml
# Define icon standards in config
config:
  iconStandards:
    size: "12pt"
    color: "#3498db" 
    spacing: "8pt"
    
  contactIcons:
    email: "envelope"
    phone: "phone"
    github: "github"
    linkedin: "linkedin"
    website: "globe"

# Apply consistently across sections
sections:
  contact:
    iconSize: "{{ config.iconStandards.size }}"
    iconColor: "{{ config.iconStandards.color }}"
```

## Advanced Icon Techniques

### Animated Icons (Static Export)

While PDFs don't support animation, you can create the impression of motion:

```typescript
const progressIcon = defineComponent({
  component: ({ spec }) => {
    const percentage = spec.percentage || 0;
    return (
      <ReactPdf.Svg width="20" height="20" viewBox="0 0 20 20">
        <ReactPdf.Circle
          cx="10" cy="10" r="8"
          fill="none"
          stroke="#ecf0f1"
          strokeWidth="2"
        />
        <ReactPdf.Circle
          cx="10" cy="10" r="8"
          fill="none"
          stroke="#3498db"
          strokeWidth="2"
          strokeDasharray={`${percentage * 0.5} 50`}
          transform="rotate(-90 10 10)"
        />
      </ReactPdf.Svg>
    );
  }
});
```

### Icon Composition

Combine multiple icons for complex meanings:

```typescript
const stackIcon = defineComponent({
  component: ({ spec, styles }) => (
    <ReactPdf.View style={styles.container}>
      <ReactPdf.View style={styles.iconStack}>
        <FaBriefcase style={styles.backgroundIcon} />
        <FaCode style={styles.foregroundIcon} />
      </ReactPdf.View>
    </ReactPdf.View>
  ),
  defaultStyles: {
    container: {
      position: "relative",
      width: "16pt",
      height: "16pt"
    },
    iconStack: {
      position: "relative",
      width: "100%",
      height: "100%"
    },
    backgroundIcon: {
      position: "absolute",
      width: "16pt",
      height: "16pt",
      color: "#ecf0f1"
    },
    foregroundIcon: {
      position: "absolute",
      top: "4pt",
      left: "4pt",
      width: "8pt",
      height: "8pt",
      color: "#3498db"
    }
  } as const
});
```

This comprehensive icon system allows you to create visually appealing and professional resumes with proper iconography throughout.
