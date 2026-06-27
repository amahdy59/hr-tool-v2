Perfect 👌 — now we shift from **Professional Profile (public-facing / career layer)** to **Personal Information (HR / internal system layer)**.

This page is not LinkedIn-style networking.
This is **enterprise-grade HRIS functionality** — meaning:

* Strict validation
* Role-based permissions
* Data protection
* Audit trail
* Structured workflow

Below is a **clear, UX-oriented and function-oriented specification** you can give directly to your developer.

---

# 🎯 Purpose of the Personal Information Page

This page must function as:

> A secure, structured employee data management module (HRIS standard)

Not just a display page.

---

# 🧠 High-Level System Behavior

The page must support:

* Structured editing
* Role-based access control
* Approval workflows (where required)
* Data validation
* Audit logging
* Secure storage (especially for banking & ID data)

---

# 🧩 Section-by-Section Functional Requirements

---

# 1️⃣ Profile Header Section (Name + Image + Title)

### Fields:

* Profile Picture
* Full Name
* Position Title

---

### Required Functions

### 📷 Profile Image Upload

* Click camera icon
* Upload JPG/PNG
* Max size validation (2MB recommended)
* Auto crop to circle
* Replace old image
* Save immediately or via Save button

---

### ✏️ Edit Name & Title

* Inline edit or modal
* Required validation
* Real-time preview

---

### UX Requirements

* Show success toast after update
* Show loading indicator during upload
* Prevent invalid file types

---

# 2️⃣ Personal Information Section

This is highly sensitive data.

## Fields:

* Birth Date (date picker)
* Personal ID (numeric validation)
* Mobile Number (country format validation)
* Home Phone (optional)
* Gender (dropdown)
* Nationality (dropdown list)
* Address (multi-line)

---

## Functional Requirements

### ✏️ Edit Button

* Opens secure modal form
* All fields editable except Personal ID (if locked after hiring)

---

### 🛑 Field Validation Rules

* Personal ID → numbers only + fixed length
* Mobile → country code format validation
* Birth Date → cannot be future
* Required fields must block save

---

### 💾 Save Behavior

* Save button
* Cancel button
* Dirty-state detection (disable Save if no changes)
* Show success confirmation

---

### 🔐 Security Requirements

* Personal ID masked partially (e.g., 2920******4567)
* Only HR role can view full ID
* Audit log: who changed what & when

---

# 3️⃣ Education Section (HR Version)

Different from Professional Profile education.

This is official HR education record.

---

## Required Functionalities

* Add Education
* Edit Education
* Delete Education (HR only)
* Upload degree certificate (optional)

---

### Fields:

* Institution
* Degree
* Department
* Graduation Year
* Grade
* Certificate Upload

---

### UX

* Display as list (if multiple entries)
* Show most recent first
* Download certificate option

---

# 4️⃣ Emergency Contacts Section

---

## Required Functionalities

### ➕ Add Contact

* Modal form
* Validation required

### ✏️ Edit Contact

* Pre-filled modal

### 🗑 Delete Contact

* Confirmation modal

---

## Fields:

* Contact Name
* Relationship (dropdown)
* Phone Number
* Alternative Phone (optional)

---

### Validation

* Phone format validation
* Cannot save empty contact
* Minimum one emergency contact required (optional rule)

---

# 5️⃣ Job Information Section (Highly Controlled)

⚠️ Important:
This section should NOT be editable by employee directly.

---

## Access Control Logic

| Role     | Can View | Can Edit |
| -------- | -------- | -------- |
| Employee | Yes      | No       |
| HR       | Yes      | Yes      |
| Admin    | Yes      | Yes      |

---

## Fields:

* Employee Number
* Email
* SAP Number
* Local Number
* Job Title
* Department
* Manager
* Department ID
* Cost Center
* Contract Type
* Activity Type
* Access Card #
* Hiring Date

---

## Functional Requirements

* HR can edit via modal
* Field validation
* Manager field dropdown from employee list
* Department dropdown from master table
* Contract Type dropdown
* Automatic email format validation

---

### Advanced UX Option

* Show employment timeline
* Show department history (if changed)
* Show promotion history

---

# 6️⃣ Bank Accounts Section (Critical Security Area)

This requires enterprise-level handling.

---

## Functional Rules

### 👤 Employee Role:

* Cannot directly edit
* Must submit change request

---

### 📝 Change Request Workflow

1. Click “Request Update”
2. Submit new bank info
3. Attach supporting document
4. Submit
5. HR receives approval task
6. HR approves / rejects
7. System updates record

---

## Fields:

* Currency
* Account Number
* Bank Name
* IBAN (optional)
* Swift Code (optional)

---

## Security Requirements

* Mask account numbers (****3456)
* Encrypt in database
* Audit log changes
* Approval workflow mandatory

---

# 🔄 7️⃣ Save & State Management

Important:

* No full page reload after update
* Use modal-based editing
* Optimistic UI updates
* Error state handling
* Loading indicators

---

# 📜 8️⃣ Audit & Compliance Requirements

For HR system integrity:

Every update must log:

* User ID
* Timestamp
* Field changed
* Old value
* New value

This is critical for:

* Legal compliance
* Payroll verification
* Internal audits

---

# 🔐 9️⃣ Role-Based Permission Matrix

Developer must implement:

```
Employee
HR
Admin
```

With permission control at:

* Section level
* Field level
* Action level (Edit / Delete / View)

---

# 🧭 10️⃣ UX Improvements Recommended

* Section completion indicator
* "Profile completeness %"
* Warning if critical info missing
* Sticky Save bar (if inline editing)
* Success animations for confirmation

---

# 🚨 11️⃣ Common System Problems to Avoid

❌ Allowing employee to edit payroll data
❌ No validation on phone or ID
❌ No masking of sensitive data
❌ No audit trail
❌ Full page refresh after edit
❌ Silent save without confirmation
❌ No role-based restrictions

---

# 🧾 What You Can Tell Your Developer (Simple Summary)

You can say:

> “This page must function as a secure HRIS module. Each section should support structured editing with validation, role-based permissions, audit logging, and workflow control where required (especially for bank information). Sensitive data must be masked and encrypted. Updates must not require page reload and should include proper feedback.”

---

If you want, I can now:

* ✅ Create a proper HRIS Feature Specification Document
* ✅ Create a database schema draft
* ✅ Design API endpoints list
* ✅ Create role-permission matrix table
* ✅ Create workflow diagram for bank change approval

You’re thinking like a product owner now 🔥
Let’s build this properly, not just visually.
