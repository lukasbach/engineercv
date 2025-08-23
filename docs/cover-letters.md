# Cover Letters

EngineerCV includes a specialized cover letter theme that allows you to create professional cover letters using the same YAML-based approach as resumes. Cover letters can be generated independently or combined with resume variants.

## Basic Cover Letter Structure

A cover letter requires specific data fields and uses the cover letter theme:

```yaml
imports:
  - ./src/themes/coverletter.tsx

output: ./out/cover-letter.pdf

basics:
  name: John Doe
  subtitle: Senior Software Engineer
  subject: Application for Software Engineer Position

letterDate: "{{ date 'dddd, MMMM Do YYYY' }}"

fromAddress:
  - John Doe
  - 123 Developer Street
  - Tech City, TC 12345
  - john.doe@email.com

toAddress:
  - Hiring Manager
  - Tech Company
  - 456 Business Ave
  - Corporate City, CC 67890

body: |
  Dear Hiring Manager,

  I am writing to express my strong interest in the Software Engineer position at Tech Company. With over 5 years of experience in full-stack development and a passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

  In my current role at Previous Company, I have successfully:
  • Led development of scalable web applications serving 100,000+ users
  • Mentored junior developers and improved team productivity by 30%
  • Implemented CI/CD pipelines that reduced deployment time by 50%

  I am particularly drawn to Tech Company's mission of democratizing technology access. Your recent work on the open-source initiative aligns perfectly with my values and experience contributing to community projects.

  Thank you for considering my application. I look forward to discussing how my experience can contribute to Tech Company's continued success.

  Sincerely,
  John Doe
```

## Required Fields

### Header Information

#### `basics.name`
Your full name as it appears at the top of the letter:

```yaml
basics:
  name: John Doe
```

#### `basics.subtitle`
Your professional title or role:

```yaml
basics:
  subtitle: Senior Software Engineer
```

#### `basics.subject`
The subject line of your cover letter:

```yaml
basics:
  subject: Application for Software Engineer Position
```

### Date

#### `letterDate`
The date the letter was written, typically using dynamic date formatting:

```yaml
letterDate: "{{ date 'dddd, MMMM Do YYYY' }}"
# Output: Friday, March 15th 2024
```

Common date formats:
- `"{{ date 'MMMM Do, YYYY' }}"` → March 15th, 2024
- `"{{ date 'MM/DD/YYYY' }}"` → 03/15/2024
- `"{{ date 'YYYY-MM-DD' }}"` → 2024-03-15

### Addresses

#### `fromAddress`
Your address information as an array:

```yaml
fromAddress:
  - John Doe
  - 123 Developer Street
  - Tech City, TC 12345
  - john.doe@email.com
  - "+1 (555) 123-4567"
```

#### `toAddress`
Recipient's address information:

```yaml
toAddress:
  - Ms. Jane Smith
  - Hiring Manager
  - Tech Company
  - 456 Business Ave
  - Corporate City, CC 67890
```

### Letter Body

#### `body`
The main content of your cover letter using Markdown formatting:

```yaml
body: |
  Dear Hiring Manager,

  **Opening paragraph** - Express interest and briefly state your qualifications.

  **Body paragraphs** - Provide specific examples and achievements:
  • Accomplishment 1 with metrics
  • Accomplishment 2 with impact
  • Relevant skills and experience

  **Closing paragraph** - Reiterate interest and suggest next steps.

  Sincerely,
  {{ basics.name }}
```

## Dynamic Content with Variants

### Company-Specific Letters

Generate targeted cover letters for different companies:

```yaml
variants:
  application:
    - company: TechCorp
      position: Senior Developer
      companyMission: "innovative software solutions"
      specificProject: "your recent AI integration platform"
    - company: StartupXYZ
      position: Full Stack Engineer  
      companyMission: "disrupting the fintech space"
      specificProject: "your mobile payment application"

basics:
  subject: Application for {{ position }} Position

toAddress:
  - Hiring Manager
  - "{{ company }}"
  - "{{ company }} Headquarters"

body: |
  Dear {{ company }} Hiring Team,

  I am excited to apply for the {{ position }} role at {{ company }}. Your commitment to {{ companyMission }} aligns perfectly with my career goals.

  I am particularly impressed by {{ specificProject }} and would love to contribute my experience in similar technologies.

  Best regards,
  {{ basics.name }}

output: ./out/cover-letter-{{ pathsafe company }}.pdf
```

### Role-Specific Customization

Tailor content based on the specific role:

```yaml
variants:
  role:
    - position: Frontend Developer
      skills: "React, Vue.js, and modern CSS frameworks"
      experience: "user interface design and responsive development"
    - position: Backend Developer
      skills: "Node.js, Python, and database optimization"
      experience: "scalable server architecture and API design"

body: |
  Dear Hiring Manager,

  As an experienced developer with expertise in {{ skills }}, I am excited about the {{ position }} opportunity.

  My background in {{ experience }} has prepared me to make immediate contributions to your team.

  Thank you for your consideration.

  Sincerely,
  {{ basics.name }}
```

## Advanced Formatting

### Paragraph Spacing

Control spacing between paragraphs:

```yaml
config:
  paragraphSpacing: "18pt"  # Default is 14pt

body: |
  First paragraph.

  Second paragraph with custom spacing.

  Third paragraph.
```

### Conditional Content

Include content based on conditions:

```yaml
body: |
  Dear {{ toAddress.0 | default "Hiring Manager" }},

  I am writing regarding the {{ basics.subject }}.

  {{#if hasPortfolio}}
  Please find my portfolio at {{ portfolioUrl }}.
  {{/if}}

  {{#if referralSource}}
  {{ referralSource }} recommended I reach out regarding this position.
  {{/if}}

  Best regards,
  {{ basics.name }}
```

### Rich Text Formatting

Use Markdown for formatting within the body:

```yaml
body: |
  Dear Hiring Manager,

  I am excited to apply for this position because:

  **Technical Expertise:**
  • 5+ years of JavaScript development
  • Experience with *React*, *Vue.js*, and *Angular*
  • Proficiency in `Node.js` and `Python`

  **Leadership Experience:**
  - Led teams of 3-5 developers
  - Mentored junior developers
  - Managed project timelines and deliverables

  You can view my work at [github.com/johndoe](https://github.com/johndoe).

  Sincerely,
  John Doe
```

## Combining with Resumes

### Shared Configuration

Create shared configuration for both resumes and cover letters:

**shared-info.yml**
```yaml
basics:
  name: John Doe
  email: john.doe@email.com

fromAddress:
  - John Doe  
  - 123 Developer Street
  - Tech City, TC 12345
  - john.doe@email.com
```

**cover-letter.yml**
```yaml
imports:
  - ./shared-info.yml
  - ./src/themes/coverletter.tsx

basics:
  subtitle: Senior Software Engineer
  subject: Application for Software Engineer Position

# Cover letter specific content
toAddress:
  - Hiring Manager
  - Tech Company

body: |
  Dear Hiring Manager,
  
  I am writing to apply for the Software Engineer position...
```

**resume.yml**
```yaml
imports:
  - ./shared-info.yml

# Resume specific content
work:
  - position: Software Engineer
    company: Current Company
```

### Variant-Based Generation

Generate both documents from a single file:

```yaml
imports:
  - ./shared-data.yml

variants:
  document:
    - type: resume
      imports: ["./resume-sections.yml"]
    - type: cover-letter
      imports: ["./src/themes/coverletter.tsx"]
      basics:
        subject: Application for Software Engineer

output: ./out/{{ type }}.pdf

{{#if (eq type 'cover-letter')}}
toAddress:
  - Hiring Manager
  - Tech Company

body: |
  Cover letter content here...
{{/if}}
```

## Styling Customization

### Custom Styles

Override default cover letter styles:

```yaml
styles:
  header:
    title:
      fontSize: "32pt"
      color: "#333"
    subtitle:
      fontSize: "18pt"
      fontStyle: "italic"
  body:
    fontSize: "11pt"
    lineHeight: "1.4"
```

### Page Layout

Customize page margins and layout:

```yaml
styles:
  page:
    container:
      paddingHorizontal: "40pt"
      paddingVertical: "35pt"
```

## Template Examples

### Conservative Professional

```yaml
basics:
  name: John Doe
  subtitle: Senior Software Engineer

body: |
  Dear Hiring Manager,

  I am writing to express my interest in the Software Engineer position at your company. With eight years of experience in software development and a proven track record of delivering high-quality solutions, I am confident I would be a valuable addition to your team.

  In my current role, I have successfully led multiple projects from conception to deployment, consistently meeting deadlines and exceeding performance expectations. My expertise includes full-stack development, database design, and team leadership.

  I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for your time and consideration.

  Sincerely,
  John Doe
```

### Modern Creative

```yaml
basics:
  name: Alex Chen
  subtitle: Creative Full-Stack Developer

body: |
  Hello {{ company }} Team! 👋

  I'm **Alex Chen**, a passionate full-stack developer who loves turning creative ideas into functional, beautiful applications. When I saw your {{ position }} opening, I knew I had to reach out!

  **What I bring to the table:**
  • 🎨 **Design-focused development** - I bridge the gap between design and code
  • ⚡ **Performance optimization** - I've improved load times by up to 60%  
  • 🚀 **Modern tech stack** - React, Node.js, TypeScript, and more

  I'm particularly excited about {{ company }}'s {{ specificProject }} - the user experience is fantastic! I'd love to contribute my skills to create even more amazing experiences.

  Let's chat about how I can help {{ company }} continue to innovate!

  Cheers,
  Alex Chen

  P.S. Check out my latest project at [alexchen.dev](https://alexchen.dev) 🌟
```

### Technical Focus

```yaml
basics:
  name: Dr. Sarah Williams
  subtitle: Senior Backend Engineer

body: |
  Dear Technical Hiring Manager,

  I am writing regarding the Senior Backend Engineer position at {{ company }}. As a computer science PhD with 10+ years of industry experience, I specialize in distributed systems and high-performance computing.

  **Technical Achievements:**
  • Architected microservices handling 1M+ requests/day
  • Reduced database query times by 75% through optimization
  • Led migration to Kubernetes, improving deployment reliability by 90%

  **Relevant Technologies:**
  - Languages: Go, Python, Rust, Java
  - Systems: Kubernetes, Docker, AWS, PostgreSQL
  - Patterns: Event-driven architecture, CQRS, Domain modeling

  I am particularly interested in {{ company }}'s work on {{ specificTechnology }} and would welcome the opportunity to discuss how my expertise can contribute to your team's success.

  Best regards,
  Dr. Sarah Williams
```

## Best Practices

### 1. Keep It Concise
- Limit to one page
- Use clear, direct language
- Focus on most relevant achievements

### 2. Customize for Each Application
```yaml
# Use variants for different applications
variants:
  company:
    - name: TechCorp
      focus: "scalability and performance"
    - name: StartupXYZ  
      focus: "rapid iteration and user experience"
```

### 3. Use Metrics and Specifics
```yaml
body: |
  I increased user engagement by 40% and reduced load times by 2.3 seconds.
```

### 4. Proofread Generated Content
Always review the final PDF for:
- Correct company names and positions
- Proper formatting and spacing
- No template artifacts or errors

### 5. Maintain Professional Tone
Even with dynamic content, ensure consistency in tone and professionalism across all variants.
