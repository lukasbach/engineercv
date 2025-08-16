---
output: ../out/test/{{ source.name }}.pdf

imports:
  - ../../src/themes/coverletter.tsx

basics:
  name: John Doe
  subtitle: Senior Software Engineer
  subject: Application for Software Engineer Position

letterDate: "{{ date 'dddd, MMMM Do YYYY' }}"

toAddress:
  - Hiring Manager
  - Tech Company
  - 1234 Tech Street
  - Karlsruhe, Germany

fromAddress:
  - John Doe
  - 5678 Developer Lane
  - Karlsruhe, Germany
  
var:
  regards: |
    Best regards,

    John Doe

body: "{{ content }}"
---

Dear Hiring Manager,


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat.


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat.


{{ var.regards }}
