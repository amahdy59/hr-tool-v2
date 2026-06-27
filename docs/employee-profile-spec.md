Below is a **developer-ready specification** you can hand directly to your team. It translates UX improvements into **clear commands, rules, and UI behaviors** so implementation remains consistent across the system. I organized it the way product teams typically document features for engineering.

---

# Employee Profile Page – UX & UI Implementation Specification

## 1. Page Architecture

### Command

Restructure the profile page into a **tab-based layout** to reduce vertical scrolling and improve content discoverability.

### Tabs

Implement the following tabs in this exact order:

```
Overview
Personal Information
Employment
Bank Accounts
Emergency Contacts
Documents
Activity
```

### Behavior

* Default tab = **Overview**
* Tabs must load content **without refreshing the page**
* Only load tab content when opened (lazy loading)

### UX Reason

Reduces cognitive overload and improves navigation speed.

---

# 2. Page Header Structure

### Command

Replace the current header with a **profile header section**.

### Layout

```
[Profile Photo]   Ahmed Mahdy
                  UX Designer & Data Analyst
                  Design & Analytics • Employee ID: EMP-2023-0142
```

### Header Actions (Right Side)

Buttons:

```
Edit Profile
Download Profile
Request HR Update
```

### Behavior

**Edit Profile**

* Enables edit mode in editable sections.

**Download Profile**

* Exports employee profile as PDF.

**Request HR Update**

* Opens HR update request form.

---

# 3. Profile Photo

### Command

Allow employees to manage their profile picture.

### Interaction

Hover on profile photo → show actions:

```
Upload Photo
Change Photo
Remove Photo
```

### Requirements

* Supported formats: JPG, PNG
* Max size: 2MB
* Auto crop to circle

---

# 4. Card System

### Command

All profile content must use **consistent card components**.

### Card Design

```
Border radius: 8px
Padding: 24px
Border color: #E6E8EB
Shadow: subtle
Background: white
```

### Card Layout

```
Card Title
Card Description (optional)
Divider
Card Content
Card Actions (optional)
```

### Example

```
Personal Information
Manage your personal contact information

-------------------------------------

Fields
```

---

# 5. Personal Information Section

### Command

Use a **two-column responsive form layout**.

### Layout

Desktop:

```
Date of Birth      March 15, 1992
Gender             Male

Email              ahmed@email.com
Mobile             01500590111

Nationality        Egyptian
Address            Nasr City, Cairo
```

Mobile:

Single column.

### Actions

Top right button:

```
Edit Personal Information
```

### Behavior

Click **Edit**

* Fields become editable
* Show buttons:

```
Save
Cancel
```

---

# 6. Emergency Contacts

### Command

Replace table layout with **contact cards**.

### Layout

```
Fatma Mahdy
Mother

Phone: 01223456789
Alternative: —

Edit | Delete
```

### Button

Top right:

```
+ Add Emergency Contact
```

### Form Fields

```
Full Name
Relationship
Primary Phone
Alternative Phone
Address (optional)
```

### Behavior

Delete → confirmation modal:

```
Delete contact?

Cancel | Delete
```

---

# 7. Employment Section

### Command

Divide employment information into **two groups**.

### Group 1 – Employment Details

```
Job Title
Department
Manager
Activity Type
Employment Type
Hiring Date
```

### Group 2 – System Identifiers (collapsible)

```
Employee ID
SAP Number
Access Card
Cost Center
```

### Lock Behavior

This section must be **read-only**.

Add label:

```
🔒 Managed by HR
```

Add button:

```
Request Update
```

### Behavior

Click → open HR update request.

---

# 8. Bank Accounts

### Command

Display bank accounts as **account cards**.

### Layout

```
EGP Salary Account
CIB Bank
•••• 3456

Request Change
```

### Security Message

```
🔒 Your bank information is encrypted and protected.
```

### Change Flow

User clicks **Request Change**

→ Opens request form:

Fields:

```
Account Type
Bank Name
Account Number
Upload Supporting Document
```

Request requires **HR approval**.

---

# 9. Documents Section

### Command

Add employee document management.

### Document Types

```
Employment Contract
Certificates
Identification Documents
Other Files
```

### Layout

List view:

```
Contract.pdf
Uploaded Jan 15 2023
Download | Delete
```

### Upload

Button:

```
Upload Document
```

Allowed formats:

```
PDF
JPG
PNG
DOCX
```

Max size: **10MB**

---

# 10. Activity Log

### Command

Add employee activity history.

### Layout

Timeline style:

```
Feb 10
Bank account update requested

Jan 18
Mobile number updated

Dec 02
Emergency contact added
```

### Behavior

Only show **last 20 actions**.

---

# 11. Navigation Cleanup

### Command

Fix the left sidebar duplication.

Replace repeated **Profile** links with:

```
Dashboard
Attendance
Payroll
Employees
Leave Management
Mission Management
Roles Management

---------------------

My Profile
Settings
Help
```

---

# 12. Field Label Standardization

### Command

Apply consistent UX writing.

Replace labels as follows:

| Old Label       | New Label          |
| --------------- | ------------------ |
| Birth Date      | Date of Birth      |
| Home Phone      | Landline           |
| Personal ID     | National ID        |
| Mobile Number   | Mobile             |
| Job Information | Employment Details |

---

# 13. Spacing System

### Command

Adopt an **8-point spacing system**.

```
8px  = small spacing
16px = field spacing
24px = card padding
32px = section spacing
48px = major section spacing
```

This keeps UI visually balanced.

---

# 14. Icons

### Command

Add icons to improve scanability.

Suggested icons:

```
🧍 Personal Information
🏢 Employment
🏦 Bank Accounts
📞 Emergency Contacts
📄 Documents
🕓 Activity
```

Use **outline icons** only.

---

# 15. Buttons

### Command

Standardize button types.

Primary button

```
Blue
Used for Save / Submit
```

Secondary button

```
Grey outline
Used for Cancel / Edit
```

Danger button

```
Red
Used for Delete
```

---

# 16. Empty States

### Command

Add empty states where no data exists.

Example:

Emergency Contacts empty:

```
No emergency contacts added.

Add a contact so HR can reach someone in case of emergency.

[ Add Contact ]
```

---

# 17. Search Field

### Command

Move **employee search** out of profile page.

Search belongs only in:

```
Employees directory page
```

---

# 18. Mobile Responsiveness

### Command

Ensure responsive behavior.

Rules:

```
Cards stack vertically
Forms switch to single column
Buttons become full width
Tables convert to cards
```

---

# 19. Accessibility

### Command

Ensure accessibility compliance.

Requirements:

```
All inputs must have labels
Keyboard navigation supported
Color contrast minimum 4.5:1
ARIA labels for actions
```

Example:

```
aria-label="Edit Personal Information"
```

---

# 20. Performance Rules

### Command

Improve loading performance.

Implement:

```
Lazy loading for tabs
Skeleton loaders
API caching for employee data
```

---

# Final Page Structure

Developers must follow this hierarchy:

```
Employee Profile

Header
 ├ Profile photo
 ├ Name
 ├ Role
 └ Department

Tabs
 ├ Overview
 ├ Personal Information
 ├ Employment
 ├ Bank Accounts
 ├ Emergency Contacts
 ├ Documents
 └ Activity
```

---

✅ If you'd like, I can also create **3 extremely useful things for your developers**:

1️⃣ **A complete UX wireframe redesign of this page**
2️⃣ **A UI component system for the entire HR platform**
3️⃣ **A developer handoff checklist (like a mini design system)**

These will make your HR tool feel closer to **modern HR systems used by companies like BambooHR or Workday.
