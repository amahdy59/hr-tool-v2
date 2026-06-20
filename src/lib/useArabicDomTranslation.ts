import { useEffect } from 'react';

const dictionary: Record<string, string> = {
  Dashboard: 'لوحة التحكم',
  Attendance: 'الحضور والانصراف',
  Employees: 'الموظفون',
  'Leaves Management': 'إدارة الإجازات',
  'Missions Management': 'إدارة المأموريات',
  'Roles Management': 'إدارة الصلاحيات',
  Profile: 'الملف الشخصي',
  'My Profile': 'ملفي الشخصي',
  'Log out': 'تسجيل الخروج',
  Home: 'الرئيسية',
  Search: 'بحث',
  'Search...': 'بحث...',
  Accessibility: 'إمكانية الوصول',
  'Keyboard Shortcuts': 'اختصارات لوحة المفاتيح',
  'Toggle language': 'تغيير اللغة',
  'Open navigation menu': 'فتح قائمة التنقل',
  'Close navigation menu': 'إغلاق قائمة التنقل',
  Menu: 'القائمة',
  'Navigation menu': 'قائمة التنقل',
  'Go to my profile': 'الانتقال إلى ملفي الشخصي',
  Welcome: 'مرحباً',
  'Quick Actions': 'إجراءات سريعة',
  'Request Leave': 'طلب إجازة',
  'Request Mission': 'طلب مأمورية',
  'Upcoming Leaves': 'الإجازات القادمة',
  'Missions Pending Approval': 'مأموريات بانتظار الموافقة',
  'Summary View': 'عرض الملخص',
  Category: 'الفئة',
  Hours: 'الساعات',
  Percentage: 'النسبة',
  'Total Hours': 'إجمالي الساعات',
  'In-office': 'داخل المكتب',
  Missions: 'المأموريات',
  Leaves: 'الإجازات',
  'No Show': 'غياب',
  Unfilled: 'غير مكتمل',
  Employee: 'الموظف',
  'Select employee': 'اختر الموظف',
  'Attendance Period': 'فترة الحضور',
  'Select date': 'اختر التاريخ',
  'Annual and Sick Leaves': 'الإجازات السنوية والمرضية',
  'Leave Type': 'نوع الإجازة',
  'Total Balance': 'الرصيد الإجمالي',
  Bridge: 'الجسر',
  'From Last Year': 'من العام السابق',
  'Used Balance': 'الرصيد المستخدم',
  'Remaining Balance': 'الرصيد المتبقي',
  'Annual Leave': 'إجازة سنوية',
  'Sick Leave': 'إجازة مرضية',
  'Casual Leave': 'إجازة عارضة',
  'Maternity': 'أمومة',
  'Paternity': 'أبوة',
  'Family Care': 'رعاية أسرة',
  'Hajj': 'حج',
  'Marriage': 'زواج',
  'Bereavement': 'وفاة',
  'Unpaid': 'غير مدفوعة',
  Approved: 'تمت الموافقة',
  Pending: 'قيد الانتظار',
  Rejected: 'مرفوض',
  Cancelled: 'ملغى',
  'View Request': 'عرض الطلب',
  'Edit Request': 'تعديل الطلب',
  'Cancel request': 'إلغاء الطلب',
  Upload: 'رفع',
  Notes: 'ملاحظات',
  Requested: 'تم الطلب',
  Complete: 'مكتمل',
  'Employee Directory': 'دليل الموظفين',
  'Add Employee': 'إضافة موظف',
  Departments: 'الأقسام',
  'Job Titles': 'المسميات الوظيفية',
  'Access Cards': 'بطاقات الدخول',
  Department: 'القسم',
  'Job Title': 'المسمى الوظيفي',
  Email: 'البريد الإلكتروني',
  Phone: 'الهاتف',
  Gender: 'النوع',
  'Contract Type': 'نوع العقد',
  'Hire Date': 'تاريخ التعيين',
  Actions: 'الإجراءات',
  Active: 'نشط',
  Expired: 'منتهي',
  Suspended: 'موقوف',
  'Basic Information': 'المعلومات الأساسية',
  'Professional Profile': 'الملف المهني',
  'Download Center': 'مركز التنزيل',
  'Personal Information': 'المعلومات الشخصية',
  'Contact Information': 'معلومات التواصل',
  'Work Information': 'معلومات العمل',
  'About Me': 'نبذة عني',
  Certifications: 'الشهادات',
  Skills: 'المهارات',
  Projects: 'المشاريع',
  Employment: 'الخبرات العملية',
  Education: 'التعليم',
  'Download PDF Resume': 'تنزيل السيرة الذاتية PDF',
  'Show Credential': 'عرض الشهادة',
  'View Project': 'عرض المشروع',
  'Core UX & Design': 'تصميم وتجربة المستخدم',
  'Data Analysis & Visualization': 'تحليل البيانات والتصور المرئي',
  'Roles & Permissions': 'الأدوار والصلاحيات',
  Payrolls: 'الرواتب',
  'Under development': 'قيد التطوير',
  'Payrolls are coming soon': 'قسم الرواتب قريباً',
  Submit: 'إرسال',
  Cancel: 'إلغاء',
  Delete: 'حذف',
  Save: 'حفظ',
  Edit: 'تعديل',
  Add: 'إضافة',
  Filter: 'تصفية',
  Download: 'تنزيل',
  Export: 'تصدير',
  Name: 'الاسم',
  Status: 'الحالة',
  Date: 'التاريخ',
  Type: 'النوع',
  Duration: 'المدة',
  'November 2023': 'نوفمبر 2023',
  'Date of Birth': 'تاريخ الميلاد',
  'Marital Status': 'الحالة الاجتماعية',
  Nationality: 'الجنسية',
  LinkedIn: 'لينكد إن',
  Dribbble: 'دريبل',
  Portfolio: 'معرض الأعمال',
  'Working Hours': 'ساعات العمل',
  'Time Zone': 'المنطقة الزمنية',
  'Work Location': 'مكان العمل',
  'Save changes': 'حفظ التغييرات',
  'Selected Projects': 'المشاريع المختارة',
  'UX Design': 'تصميم تجربة المستخدم',
  'Data Visualization': 'تصوير البيانات',
  'Dashboard Design': 'تصميم لوحات التحكم',
  'Print dialog opened. Save as PDF to download your resume.': 'تم فتح نافذة الطباعة. احفظ كملف PDF لتنزيل سيرتك الذاتية.',
  'Failed to generate resume': 'فشل في إنشاء السيرة الذاتية',
  'Generating your resume...': 'جاري إنشاء سيرتك الذاتية...',
  'Accessibility Tools': 'أدوات إمكانية الوصول',
  'Adjust your preferences.': 'تعديل تفضيلاتك.',
  'AAA High Contrast': 'تباين عالي AAA',
  'Force maximum text-to-background contrast ratio (7:1).': 'فرض أقصى نسبة تباين بين النص والخلفية (7:1).',
  'AAA Large Targets': 'أهداف كبيرة AAA',
  'Resize interactive buttons/inputs to minimum 44px.': 'تغيير حجم الأزرار/المدخلات التفاعلية ليكون الحد الأدنى 44 بكسل.',
  'AAA Text Scale': 'تكبير النص AAA',
  'Increase base text sizing by 120% for readability.': 'زيادة حجم النص الأساسي بنسبة 120% لسهولة القراءة.',
  'Dyslexia Font': 'خط عسر القراءة',
  'Change typeface to a more readable font style.': 'تغيير نوع الخط إلى نمط أكثر قابلية للقراءة.',
  'Focus Highlights': 'إبراز التركيز',
  'Apply heavy outlines to key elements when tabbed.': 'تطبيق إطارات سميكة على العناصر الأساسية عند التركيز.',
  'Company': 'الشركة',
  'Role': 'الدور',
  'Employment Type': 'نوع التوظيف',
  'Start Date': 'تاريخ البدء',
  'End Date': 'تاريخ الانتهاء',
  'Currently working here': 'أعمل هنا حالياً',
  'Description': 'الوصف',
  'School/University': 'المدرسة/الجامعة',
  'Degree/Certificate': 'الدرجة العلمية/الشهادة',
  'Field of Study': 'مجال الدراسة',
  'Field of Study (Optional)': 'مجال الدراسة (اختياري)',
  'Start Year': 'سنة البدء',
  'End Year': 'سنة الانتهاء',
  'Project Name': 'اسم المشروع',
  'Project Link': 'رابط المشروع',
  'Tools Used': 'الأدوات المستخدمة',
  'First Name': 'الاسم الأول',
  'Last Name': 'اسم العائلة',
  'Email Address': 'البريد الإلكتروني',
  'Phone Number': 'رقم الهاتف',
  'Employee ID': 'الرقم الوظيفي',
  'Full-time': 'دوام كامل',
  'Part-time': 'دوام جزئي',
  'Contract': 'عقد',
  'Hybrid': 'هجين',
  'Remote': 'عن بُعد',
  'On-site': 'في مقر العمل',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'Single': 'أعزب',
  'Married': 'متزوج',
  'Confirm Delete': 'تأكيد الحذف',
  'Are you sure you want to delete': 'هل أنت متأكد أنك تريد حذف',
  'This action cannot be undone.': 'لا يمكن التراجع عن هذا الإجراء.',
  'Add Skill': 'إضافة مهارة',
  'Search skills...': 'البحث عن المهارات...',
  'Issuing Organization': 'الجهة المانحة',
  'Credential ID': 'رقم الشهادة',
  'Credential URL': 'رابط الشهادة',
  'Issue Month': 'شهر الإصدار',
  'Issue Year': 'سنة الإصدار',
  'Optional': 'اختياري',
  'optional': 'اختياري',
  'Optional...': 'اختياري...',
  'optional...': 'اختياري...',
  'Other': 'أخرى',
  'Divorced': 'مطلق',
  'Widowed': 'أرمل',
  'Design': 'التصميم',
  'Engineering': 'الهندسة',
  'Product': 'المنتج',
  'HR': 'الموارد البشرية',
  'Marketing': 'التسويق',
  'Internship': 'تدريب',
  'Timesheet': 'جدول الأوقات',
  'My Requests': 'طلباتي',
  'Export CSV': 'تصدير CSV',
  'Req Date': 'تاريخ الطلب',
  'Range': 'الفترة',
  'Cancel Request': 'إلغاء الطلب',
  'View Details': 'عرض التفاصيل',
  'Sick': 'مرضي',
  'Vacation': 'إجازة',
  'Fever and flu': 'حمى وأنفلونزا',
  'Annual leave': 'إجازة سنوية',
  'Stomachache': 'ألم في المعدة',
  'Holiday travel': 'سفر لقضاء عطلة',
  'Available': 'متاح',
  'Used': 'مستخدم',
  'Total': 'الإجمالي',
  'Weekend': 'عطلة نهاية الأسبوع',
  'Mission': 'مأمورية',
  'Holiday': 'عطلة',
  'All': 'الكل',
  'Oil and Gas': 'النفط والغاز',
  'IT': 'تقنية المعلومات',
  'Finance': 'المالية',
  'Human Resources': 'الموارد البشرية',
  'Operations': 'العمليات',
  'Engineer': 'مهندس',
  'Lead Engineer': 'مهندس رئيسي',
  'Application Consultant': 'مستشار تطبيقات',
  'Project Manager': 'مدير مشروع',
  'Senior Engineer': 'مهندس أول',
  'Analyst': 'محلل',
  'Day': 'اليوم',
  'Time In': 'وقت الحضور',
  'Time Out': 'وقت الانصراف',
  'Month': 'الشهر',
  'Monday': 'الإثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
  'Friday': 'الجمعة',
  'Saturday': 'السبت',
  'Sunday': 'الأحد',
  'From': 'من',
  'To': 'إلى',
  'Submit Request': 'تقديم الطلب',
  'Continue': 'متابعة',
  'Are you sure?': 'هل أنت متأكد؟',
  'Mission Type': 'نوع المأمورية',
  'Work From Home': 'عمل من المنزل',
  'Client Visit': 'زيارة عميل',
  'Conference': 'مؤتمر',
  'Location': 'الموقع',
  'Leave Details': 'تفاصيل الإجازة',
  'Resubmit Request': 'إعادة تقديم الطلب',
  'Dates': 'التواريخ',
  'Select a date': 'اختر تاريخاً',
  'Pick a date': 'اختر تاريخاً',
  // Employee Names
  'Aleksander Garcia': 'ألكسندر جارسيا',
  'Tanvi Lumari': 'تانفي لوماري',
  'Jack Gray': 'جاك جراي',
  'Saad Jawahir': 'سعد جواهر',
  'Imani Adimbola': 'إيماني أديمبولا',
  'Muhammed Habib': 'محمد حبيب',
  'Mohammed Habib': 'محمد حبيب',
  'Lena Mohamed': 'لينا محمد',
  // Departments
  'Software': 'البرمجيات',
  'Oil & Gas': 'النفط والغاز',
  'Sales': 'المبيعات',
  'SCADA': 'سكادا',
  // Job Titles
  'Cybersecurity Engineer': 'مهندس أمن سيبراني',
  'Software Developer': 'مطور برمجيات',
  'Senior Product Manager': 'مدير منتج أول',
  'Solutions Architect': 'مهندس حلول',
  'Senior Solutions Architect': 'مهندس حلول أول',
  'Global Operations Manager': 'مدير العمليات العالمية',
  'Senior Project Manager': 'مدير مشروع أول',
  'Cybersecurity Specialist': 'أخصائي أمن سيبراني',
  'Director of Supply Chain Optimization': 'مدير تحسين سلسلة التوريد',
  // Types
  'Direct': 'مباشر',
  'InDirect': 'غير مباشر',
  'Full-Time': 'دوام كامل',
  'Part-Time': 'دوام جزئي',
  'Contractor': 'مقاول',
  'Intern': 'متدرب',
  'Freelance': 'عمل حر',
  'Permanent': 'دائم',
  // Basic Info Inputs & Buttons
  'National ID': 'الرقم القومي',
  'Mobile': 'رقم الموبايل',
  'Landline': 'رقم الهاتف الأرضي',
  'Address': 'العنوان',
  'Emergency Contacts': 'جهات اتصال الطوارئ',
  'Relationship': 'صلة القرابة',
  'Bank Accounts': 'الحسابات البنكية',
  'Currency': 'العملة',
  'Account Number': 'رقم الحساب',
  'Bank Name': 'اسم البنك',
  'IBAN': 'رقم الحساب المصرفي الدولي (IBAN)',
  'Edit Personal Info': 'تعديل المعلومات الشخصية',
  'Add contact': 'إضافة جهة اتصال',
  'Add account': 'إضافة حساب',
  'Edit Emergency Contacts': 'تعديل جهات اتصال الطوارئ',
  'Edit Bank Accounts': 'تعديل الحسابات البنكية',
  'Upload Image': 'رفع صورة',
  'Change Picture': 'تغيير الصورة',
  'Remove': 'إزالة',
  // Approvals & Management
  'Leaves Request': 'طلبات الإجازة',
  'Approvals': 'الموافقات',
  'Total Days': 'إجمالي الأيام',
  'View': 'عرض',
  'Reject': 'رفض',
  'Approve': 'موافقة',
  'Requester': 'مقدم الطلب',
  // Filters & General UI
  'All Departments': 'كل الأقسام',
  'All Job Titles': 'كل المسميات الوظيفية',
  'Apply': 'تطبيق',
  'Reset': 'إعادة تعيين',
  'Clear': 'مسح',
  'Employees List': 'قائمة الموظفين',
  'Activity Log': 'سجل النشاط',
  'Upload image': 'رفع صورة',
  'Employee Name': 'اسم الموظف',
  'Employee Number': 'الرقم الوظيفي',
  'Manager?': 'هل هو مدير؟',
  'Yes': 'نعم',
  'No': 'لا',
  'Update': 'تحديث',
  'Card Number': 'رقم البطاقة',
  'Card Type': 'نوع البطاقة',
  'Next': 'التالي',
  'Previous': 'السابق',
  'Manage Employees': 'إدارة الموظفين',
  'Add an Employee': 'إضافة موظف',
  'Add Department': 'إضافة قسم',
  'Download Data': 'تنزيل البيانات',
  'Search Employees': 'البحث عن الموظفين',
  'Search by name, Employee number, or email.': 'ابحث بالاسم أو الرقم الوظيفي أو البريد الإلكتروني.',
  'Enter Employee# or Name...': 'أدخل الرقم الوظيفي أو الاسم...',
  'Search employees': 'البحث عن الموظفين',
  'Open employee filters': 'فتح فلاتر الموظفين',
  'Filter Options': 'خيارات التصفية',
  'Apply Filter': 'تطبيق الفلتر',
  'Clear Filter': 'مسح الفلتر',
  'Search results are based on selected filters.': 'تعتمد نتائج البحث على الفلاتر المحددة.',
  'Search by': 'البحث حسب',
  'name': 'الاسم',
  'email': 'البريد الإلكتروني',
  'or': 'أو',
  'Employee#': 'الرقم الوظيفي',
  'Employee Attendance': 'حضور الموظفين',
  'Filters applied successfully': 'تم تطبيق الفلاتر بنجاح',
  'Filters applied': 'تم تطبيق الفلاتر',
  'Filters cleared': 'تم مسح الفلاتر',
  'Download started': 'بدأ التنزيل',
  'Employee data exported to CSV.': 'تم تصدير بيانات الموظفين إلى ملف CSV.',
  'Go to Dashboard': 'الانتقال إلى لوحة التحكم',
  'Go to Attendance': 'الانتقال إلى الحضور والانصراف',
  'Go to Employees': 'الانتقال إلى الموظفين',
  'Go to Leaves Management': 'الانتقال إلى إدارة الإجازات',
  'Go to Missions Management': 'الانتقال إلى إدارة المأموريات',
  'Go to Roles Management': 'الانتقال إلى إدارة الصلاحيات',
  'Go to Profile': 'الانتقال إلى الملف الشخصي',
  'Logout': 'تسجيل الخروج',
  'Type a command or search...': 'اكتب أمراً أو ابحث...',
  'No results found.': 'لا توجد نتائج.',
  'Navigation': 'التنقل',
  'Command Palette': 'لوحة الأوامر',
  'Shortcut': 'اختصار',
  'Shortcuts': 'الاختصارات',
  'Close': 'إغلاق',
  'Press': 'اضغط',
  'to open': 'للفتح',
  'General': 'عام',
  'Change Profile Picture': 'تغيير صورة الملف الشخصي',
  'Upload a new profile picture or select an avatar.': 'ارفع صورة ملف شخصي جديدة أو اختر صورة رمزية.',
  'Uploading...': 'جاري الرفع...',
  'Upload Bank Statement': 'رفع كشف حساب بنكي',
  'Required: Upload a bank statement or account verification document': 'مطلوب: ارفع كشف حساب بنكي أو مستند تحقق من الحساب',
  'Request Bank Update': 'طلب تحديث بيانات البنك',
  'Role Information': 'معلومات الدور',
  'Design & Analytics': 'التصميم والتحليلات',
  'Department budget allocation code': 'كود تخصيص ميزانية القسم',
  'Profile picture updated successfully': 'تم تحديث صورة الملف الشخصي بنجاح',
  'Edit Profile': 'تعديل الملف الشخصي',
  'Add Experience': 'إضافة خبرة',
  'Edit Experience': 'تعديل الخبرة',
  'Add Education': 'إضافة تعليم',
  'Edit Education': 'تعديل التعليم',
  'Add Project': 'إضافة مشروع',
  'Edit Project': 'تعديل المشروع',
  'Add Certification': 'إضافة شهادة',
  'Edit Certification': 'تعديل الشهادة',
  'Edit Skill': 'تعديل المهارة',
  'Skill Name': 'اسم المهارة',
  'Proficiency Level': 'مستوى الإتقان',
  'Beginner': 'مبتدئ',
  'Intermediate': 'متوسط',
  'Advanced': 'متقدم',
  'Expert': 'خبير',
  'Project Title': 'عنوان المشروع',
  'Project URL': 'رابط المشروع',
  'Your Role': 'دورك',
  'Issue Date': 'تاريخ الإصدار',
  'Feature this project (pin to top)': 'تمييز هذا المشروع (تثبيته في الأعلى)',
  'Certification Title': 'عنوان الشهادة',
  'Issuer': 'الجهة المصدرة',
  'Expiry Date': 'تاريخ الانتهاء',
  'I currently work here': 'أعمل هنا حالياً',
  'I currently study here': 'أدرس هنا حالياً',
  'Grade': 'التقدير',
  'School': 'المدرسة',
  'Degree': 'الدرجة العلمية',
  'Description (Optional)': 'الوصف (اختياري)',
  'Email is hidden from the public profile and PDF export.': 'البريد الإلكتروني مخفي من الملف العام وتصدير PDF.',
  'Your profile is complete!': 'ملفك مكتمل!',
  'Add more details to strengthen your profile': 'أضف المزيد من التفاصيل لتقوية ملفك',
  'Profile Strength': 'قوة الملف الشخصي',
  'Resume downloaded successfully!': 'تم تنزيل السيرة الذاتية بنجاح!',
  'Experience updated successfully': 'تم تحديث الخبرة بنجاح',
  'Experience added successfully': 'تمت إضافة الخبرة بنجاح',
  'Education updated successfully': 'تم تحديث التعليم بنجاح',
  'Education added successfully': 'تمت إضافة التعليم بنجاح',
  'Project updated successfully': 'تم تحديث المشروع بنجاح',
  'Project added successfully': 'تمت إضافة المشروع بنجاح',
  'Certification updated successfully': 'تم تحديث الشهادة بنجاح',
  'Certification added successfully': 'تمت إضافة الشهادة بنجاح',
  'Skill updated successfully': 'تم تحديث المهارة بنجاح',
  'Skill added successfully': 'تمت إضافة المهارة بنجاح',
  'Order updated': 'تم تحديث الترتيب',
  'Deleted successfully': 'تم الحذف بنجاح',
  'Confirm Leave': 'تأكيد طلب الإجازة',
  'Confirm Mission': 'تأكيد المأمورية',
  'Ready to submit?': 'هل أنت جاهز للإرسال؟',
  'You are requesting': 'أنت تطلب',
  "You're requesting": 'أنت تطلب',
  "You're requesting a": 'أنت تطلب',
  'from': 'من',
  'to': 'إلى',
  'submitted successfully.': 'تم إرساله بنجاح.',
  'has been submitted.': 'تم إرساله.',
  'Take care!': 'نتمنى لك السلامة!',
  'Enjoy your time off': 'استمتع بإجازتك',
  'January': 'يناير',
  'February': 'فبراير',
  'March': 'مارس',
  'April': 'أبريل',
  'May': 'مايو',
  'June': 'يونيو',
  'July': 'يوليو',
  'August': 'أغسطس',
  'September': 'سبتمبر',
  'October': 'أكتوبر',
  'November': 'نوفمبر',
  'December': 'ديسمبر',
  'Jan': 'يناير',
  'Feb': 'فبراير',
  'Mar': 'مارس',
  'Apr': 'أبريل',
  'Jun': 'يونيو',
  'Jul': 'يوليو',
  'Aug': 'أغسطس',
  'Sep': 'سبتمبر',
  'Oct': 'أكتوبر',
  'Nov': 'نوفمبر',
  'Dec': 'ديسمبر',
  'day': 'يوم',
  'days': 'أيام',
  'of': 'من',
  'Page': 'صفحة',
  'Rows per page': 'عدد الصفوف لكل صفحة',
  'No data found': 'لا توجد بيانات',
  'No employees found': 'لا يوجد موظفون',
  'Add Role': 'إضافة دور',
  'Edit Role': 'تعديل الدور',
  'Role Name': 'اسم الدور',
  'Permissions': 'الصلاحيات',
  'Permission': 'الصلاحية',
  'Users assigned': 'المستخدمون المعينون',
  'Mission Requests': 'طلبات المأموريات',
  'Leaves Requests': 'طلبات الإجازات',
  'Request Date': 'تاريخ الطلب',
  'Approver': 'الموافق',
  'Comment': 'تعليق',
  'Reason': 'السبب',
  'Attachment': 'مرفق',
  'Attachment(s)': 'المرفقات',
  'Show Details': 'عرض التفاصيل',
  'Hide Details': 'إخفاء التفاصيل',
  'View request': 'عرض الطلب',
};

const phraseDictionary: Array<[RegExp, string]> = [
  [/^Welcome (.*)$/, 'مرحباً $1'],
  [/^(\d+) days?$/, '$1 أيام'],
  [/^(\d+)h (\d+)m$/, '$1س $2د'],
  [/^(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/, '$1 $2 $3'],
  [/Showing attendance for/g, 'عرض الحضور للموظف'],
  [/Last updated:/g, 'آخر تحديث:'],
  [/Search or command palette/g, 'البحث أو لوحة الأوامر'],
  [/Shortcut Control K/g, 'الاختصار Control K'],
  [/Go to Dashboard/g, 'الانتقال إلى لوحة التحكم'],
];

const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ['placeholder', 'title', 'aria-label'];
const arabicPattern = /[\u0600-\u06FF]/;
const sortedDictionaryEntries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const translateValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || arabicPattern.test(trimmed)) return value;

  let translated = dictionary[trimmed] ?? trimmed;

  for (const [pattern, replacement] of phraseDictionary) {
    translated = translated.replace(pattern, replacement);
  }

  for (const [english, arabic] of sortedDictionaryEntries) {
    if (english.length < 4 && !['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(english)) continue; // Avoid replacing very short partial words blindly unless they are specific short abbreviations
    const regex = new RegExp('(?<=\\b|\\s|^)' + escapeRegExp(english) + '(?=\\b|\\s|$)', 'g');
    translated = translated.replace(regex, arabic);
  }

  if (translated === trimmed) return value;
  return value.replace(trimmed, translated);
};

const translateTextNode = (node: Text, enabled: boolean) => {
  const current = node.nodeValue ?? '';
  const cachedSource = originalText.get(node);

  if (!enabled) {
    if (cachedSource && current !== cachedSource) node.nodeValue = cachedSource;
    return;
  }

  if (!cachedSource || (!arabicPattern.test(current) && current !== translateValue(cachedSource))) {
    originalText.set(node, current);
  }

  const source = originalText.get(node) ?? current;
  const translated = translateValue(source);
  if (current !== translated) node.nodeValue = translated;
};

const translateElementAttributes = (element: Element, enabled: boolean) => {
  let originals = originalAttributes.get(element);
  if (!originals) {
    originals = new Map<string, string>();
    originalAttributes.set(element, originals);
  }

  attributes.forEach((attribute) => {
    const current = element.getAttribute(attribute);
    if (current == null) return;

    const cachedSource = originals.get(attribute);
    if (!enabled) {
      if (cachedSource && current !== cachedSource) element.setAttribute(attribute, cachedSource);
      return;
    }

    if (!cachedSource || (!arabicPattern.test(current) && current !== translateValue(cachedSource))) {
      originals.set(attribute, current);
    }

    const source = originals.get(attribute) ?? current;
    const nextValue = translateValue(source);
    if (current !== nextValue) {
      element.setAttribute(attribute, nextValue);
    }
  });
};

const walkAndTranslate = (root: ParentNode, enabled: boolean) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-no-auto-translate]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.nodeValue ?? '';
      if (value.trim()) translateTextNode(node as Text, enabled);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(node as Element, enabled);
    }
    node = walker.nextNode();
  }
};

export const useArabicDomTranslation = (enabled: boolean) => {
  useEffect(() => {
    walkAndTranslate(document.body, enabled);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node as Text, enabled);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            walkAndTranslate(node as Element, enabled);
          }
        });

        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          translateElementAttributes(mutation.target as Element, enabled);
        }

        if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
          translateTextNode(mutation.target as Text, enabled);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: attributes,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [enabled]);
};
