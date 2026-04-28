# TDSA Learner Application Form Specification

**Data Science Academy - Accredited Education & Skills Development**

## Form Header
```
Ndzalama Training - Accredited Education & Skills Development
```

## Section 1: Personal Information

| Field | Label | Type | Required | Validation | Notes |
|-------|-------|------|----------|------------|-------|
| firstName | First Name | text | Yes | - | Name format |
| middleName | Middle Name | text | No | - | - |
| lastName | Last Name | text | Yes | - | Name format |
| gender | Gender | radio | Yes | Male/Female/Other | - |
| race | Race | select | Yes | African/Coloured/Indian/White/Other | - |
| idType | ID Type | radio | Yes | "South African ID"/Passport | - |
| idNumber | ID / Passport Number | text | Yes | ID format validation | - |
| dateOfBirth | Date of Birth | date | Yes | Auto from ID | Read-only if ID provided |
| nationality | Nationality | select | Yes | South Africa/Other | - |
| email | Email | email | Yes | Valid email | - |
| phone | Phone | tel | Yes | ZA format | +27xxxxxxxxx |
| homeAddress | Home Address | textarea | Yes | - | Street, City, Province |
| postalAddress | Postal Address | textarea | No | - | "Same as home" checkbox |
| emergencyContact | Emergency Contact | text | Yes | Name & Phone | "Name & Phone" |
| highestQualification | Highest Qualification | select | Yes | Degree/Diploma/Grade12/etc | - |
| courseProgramme | Course / Programme | select | Yes | "Community Health"/CET/etc | SAQA 78965 default |
| disability | Disability | radio | Yes | Yes/No | If yes → textarea |
| idCopy | ID / Passport Copy | file | No | PDF/Image | Max 5MB |
| qualificationProof | Qualification / Report Card | file | No | PDF/Image | Max 5MB |
| studyPermit | Study Permit | file | Conditional | PDF/Image | Non-SA only |

