---
imports:
 - sidelinks
 - ./config/base.yml
 - ./config/with-letter.yml

toAddress:
  - Hiring Manager
  - Tech Company
  - 1234 Tech Street
  - Karlsruhe, Germany

# You can overwrite company-specific resume details:
volunteer:
  # - "{{ merge 'replace' }}"
  - organization: Bay Area Python Meetup
    position: Co-organizer
    url: https://www.meetup.com/bay-area-py/
    startDate: 2022/01
    highlights:
      - Organizing monthly Python and web development meetups
      - Coordinating with speakers and managing event logistics for 40-60 attendees
---

Dear Hiring Manager,


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat.


{{ var.berkeleyStudyDetails }}


{{ var.startupHubDetails }}


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
ea commodo consequat.


{{ var.regards }}
