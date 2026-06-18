import React, { useState } from 'react';
import {
  Pencil, Camera, Plus, Trash2, Lock, AlertCircle, Upload, Shield, Clock, ChevronRight, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from './ui/select';
import { toast } from 'sonner';

// ── Shared styles ──
const inputClass = 'w-full h-10 px-3 border border-border rounded-[var(--radius-input)] bg-input-background text-foreground text-[var(--text-sm)] focus:ring-2 focus:ring-ring/50 focus:border-ring outline-none transition-shadow';
const labelClass = 'text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground';

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Helper to mask sensitive data
const maskPersonalId = (id: string): string => {
  if (id.length <= 8) return id;
  return id.substring(0, 4) + '******' + id.substring(id.length - 4);
};

const maskAccountNumber = (account: string): string => {
  if (account.length <= 4) return account;
  return '****' + account.substring(account.length - 4);
};

const maskPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  return phone.replace(/(\+?\d{2,3}|0\d{2})(\d+)(\d{3})$/, '$1 *** $3');
};

interface PersonalInfoData {
  dateOfBirth: string;
  nationalId: string;
  email: string;
  mobile: string;
  landline: string;
  gender: string;
  nationality: string;
  address: string;
}

interface EmergencyContactData {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

interface BankAccountData {
  id: string;
  currency: string;
  accountNumber: string;
  bankName: string;
  iban: string;
}

interface BasicInfoProps {
  currentUser: {
    name: string;
    email: string;
    position: string;
    image: string;
  } | null;
  onUpdateImage: (newImage: string) => void;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ currentUser, onUpdateImage }) => {
  // State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    dateOfBirth: '1990-01-01',
    nationalId: '00000000000000',
    email: 'amahdy59@gmail.com',
    mobile: '0150***0111',
    landline: 'Not provided',
    gender: 'Male',
    nationality: 'Egyptian',
    address: 'Cairo, Egypt',
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactData[]>([]);

  const [bankAccounts, setBankAccounts] = useState<BankAccountData[]>([
    { id: '1', currency: 'EGP', accountNumber: '0000000012345678', bankName: 'Example Bank', iban: '' },
  ]);

  // Modal states
  const [editPersonalOpen, setEditPersonalOpen] = useState(false);
  const [editEmergencyOpen, setEditEmergencyOpen] = useState(false);
  const [changeImageOpen, setChangeImageOpen] = useState(false);
  const [bankRequestOpen, setBankRequestOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [employmentUpdateOpen, setEmploymentUpdateOpen] = useState(false);

  // Selected items
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyContactData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  // Mock current user role (in real app, this comes from auth)
  const [userRole] = useState<'employee' | 'hr' | 'admin'>('employee');

  // Handlers - Personal Info
  const handleSavePersonalInfo = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setEditPersonalOpen(false);
    toast.success('Personal information updated successfully');
  };

  // Handlers - Emergency Contacts
  const handleEditEmergency = (contact: EmergencyContactData) => {
    setSelectedEmergency(contact);
    setEditEmergencyOpen(true);
  };

  const handleAddEmergency = () => {
    setSelectedEmergency({
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
    });
    setEditEmergencyOpen(true);
  };

  const handleSaveEmergency = (data: EmergencyContactData) => {
    if (emergencyContacts.find(e => e.id === data.id)) {
      setEmergencyContacts(emergencyContacts.map(e => e.id === data.id ? data : e));
      toast.success('Emergency contact updated successfully');
    } else {
      setEmergencyContacts([...emergencyContacts, data]);
      toast.success('Emergency contact added successfully');
    }
    setEditEmergencyOpen(false);
  };

  const handleDeleteEmergency = (id: string) => {
    const contact = emergencyContacts.find(e => e.id === id);
    if (contact) {
      setDeleteTarget({ type: 'emergency', id, name: contact.name });
      setDeleteConfirmOpen(true);
    }
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'emergency':
        setEmergencyContacts(emergencyContacts.filter(e => e.id !== deleteTarget.id));
        toast.success('Emergency contact deleted');
        break;
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-card shadow-[var(--elevation-sm)] mb-3">
            {currentUser?.image ? (
              <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div 
                className="w-full h-full bg-primary/10 flex items-center justify-center"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                <span className="text-primary">
                  {currentUser ? getInitials(currentUser.name) : 'U'}
                </span>
              </div>
            )}
          </div>
          {/* Change Image Button */}
          <button
            onClick={() => setChangeImageOpen(true)}
            className="absolute bottom-3 right-0 w-9 h-9 rounded-full bg-chart-3 hover:bg-chart-3/90 text-white flex items-center justify-center shadow-[var(--elevation-md)] transition-all cursor-pointer border-2 border-card"
            aria-label="Change profile picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'var(--section-heading-size)', fontWeight: 'var(--section-heading-weight)' }} className="text-foreground">{currentUser?.name || 'User'}</h3>
        <p className="text-[var(--text-sm)] text-muted-foreground font-[var(--font-weight-medium)]" style={{ fontFamily: "'Inter', sans-serif" }}>{currentUser?.position || 'Employee'}</p>
      </div>

      {/* Personal Information */}
      <ProfileCard title="Personal Information" onEdit={() => setEditPersonalOpen(true)} icon={<Shield className="w-4 h-4 text-muted-foreground" />}>
        <div className="grid grid-cols-1 gap-y-3">
          <InfoItem label="Date of Birth" value={new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          <InfoItem label="Gender" value={personalInfo.gender} />
          <InfoItem label="Email" value={personalInfo.email} />
          <InfoItem label="Mobile" value={maskPhoneNumber(personalInfo.mobile)} sensitive />
          <InfoItem label="Landline" value={personalInfo.landline} />
          <InfoItem label="National ID" value={maskPersonalId(personalInfo.nationalId)} sensitive />
          <InfoItem label="Nationality" value={personalInfo.nationality} />
          <InfoItem label="Address" value={personalInfo.address} />
        </div>
      </ProfileCard>

      {/* Emergency Contacts */}
      <ProfileCard title="Emergency Contacts" showAdd onAdd={handleAddEmergency}>
        {emergencyContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-[var(--text-sm)] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              No emergency contacts added.
            </p>
            <p className="text-muted-foreground text-[var(--text-xs)] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Add a contact so HR can reach someone in case of emergency.
            </p>
            <Button onClick={handleAddEmergency} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-foreground font-[var(--font-weight-semibold)] text-[var(--text-sm)]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {contact.name}
                  </h4>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEditEmergency(contact)}
                      className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmergency(contact.id)}
                      className="p-1.5 hover:bg-destructive/10 rounded-[var(--radius-sm)] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-[35%_1fr] gap-3 items-start">
                    <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Relationship
                    </span>
                    <span className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="grid grid-cols-[35%_1fr] gap-3 items-start">
                    <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Phone
                    </span>
                    <span className="text-[var(--text-sm)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {maskPhoneNumber(contact.phone)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ProfileCard>

      {/* Employment Details - Read Only */}
      <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)]">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-border pb-2.5 mb-6">
          <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>Employment Details</span>
        </div>

        {/* Role Information Section */}
        <div className="space-y-4">
          <h5 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Role Information
          </h5>
          <div className="space-y-4">
            <EmploymentInfoItem label="Job Title" value="UX Designer & Data Analyst" badge="Full-Time" />
            <EmploymentInfoItem label="Department" value="Design & Analytics" />
            <EmploymentInfoItem 
              label="Manager" 
              value="Manager name hidden"
              clickable 
              onClick={() => toast.info('Manager profile coming soon')}
            />
            <EmploymentInfoItem label="Activity Type" value="UX Designer" />
            <EmploymentInfoItem label="Employment Type" value="Full-Time" />
            <EmploymentInfoItem label="Hiring Date" value="Jan 15, 2023" />
          </div>
        </div>

        {/* System Identifiers Section */}
        <div className="space-y-4 mt-8 pt-6 border-t border-border">
          <h5 className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            System Identifiers
          </h5>
          <div className="space-y-4">
            <SystemIdentifierItem 
              label="Employee ID" 
              value="EMP-2023-0142" 
              tooltip="Your unique employee identification number"
            />
            <SystemIdentifierItem 
              label="SAP Number" 
              value="100234561" 
              tooltip="Internal system identifier used for payroll and HR processes"
            />
            <SystemIdentifierItem 
              label="Access Card" 
              value="AC-2023-0142" 
              tooltip="Physical access card identifier for building entry"
            />
            <SystemIdentifierItem 
              label="Cost Center" 
              value="CC-4200" 
              tooltip="Department budget allocation code"
            />
          </div>
        </div>

        {/* HR Notice Section */}
        <div className="mt-8 pt-6 border-t border-border space-y-3">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Managed by HR
              </p>
              <p className="text-[var(--text-xs)] text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                This information is maintained by HR. If something needs correction, you can request an update.
              </p>
            </div>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => setEmploymentUpdateOpen(true)}
          >
            Request Update
          </Button>
        </div>
      </div>

      {/* Bank Accounts - Controlled Access */}
      <ProfileCard title="Bank Accounts" locked icon={<Shield className="w-4 h-4 text-muted-foreground" />}>
        <div className="space-y-3">
          {bankAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-[var(--radius-sm)] border border-border">
              <div className="flex-1">
                <p className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {account.currency} Account
                </p>
                <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {maskAccountNumber(account.accountNumber)} ({account.bankName})
                </p>
              </div>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 mt-4 p-3 bg-primary/5 rounded-[var(--radius-sm)] border border-primary/20">
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[var(--text-xs)] text-foreground font-[var(--font-weight-medium)] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Bank information is encrypted and protected
            </p>
            <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              To update your bank details, you must submit a change request with supporting documents for HR approval.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-3 rounded-[var(--radius-button)] border-border"
          onClick={() => setBankRequestOpen(true)}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Upload className="w-4 h-4 mr-2" /> Request Bank Update
        </Button>
      </ProfileCard>

      {/* Audit Trail Notice */}
      <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-[var(--radius-card)] border border-border">
        <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            All changes to personal information are logged for security and compliance purposes. Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Modals */}
      <EditPersonalInfoModal open={editPersonalOpen} onOpenChange={setEditPersonalOpen} data={personalInfo} onSave={handleSavePersonalInfo} />
      {selectedEmergency && <EditEmergencyModal open={editEmergencyOpen} onOpenChange={setEditEmergencyOpen} data={selectedEmergency} onSave={handleSaveEmergency} />}
      <ChangeImageModal open={changeImageOpen} onOpenChange={setChangeImageOpen} onUpdateImage={onUpdateImage} currentUser={currentUser} />
      <BankRequestModal open={bankRequestOpen} onOpenChange={setBankRequestOpen} />
      <EmploymentUpdateModal open={employmentUpdateOpen} onOpenChange={setEmploymentUpdateOpen} />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Confirm Delete</DialogTitle>
            <DialogDescription className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Are you sure you want to delete <span className="font-[var(--font-weight-semibold)] text-foreground">"{deleteTarget?.name}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
            <Button className="rounded-[var(--radius-button)] bg-destructive hover:bg-destructive/90 text-white" onClick={confirmDelete} style={{ fontFamily: "'Inter', sans-serif" }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ════════════════════════════════════
// ── Reusable Components ──
// ════════════════════════════════════

const ProfileCard: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  onEdit?: () => void; 
  showAdd?: boolean; 
  onAdd?: () => void;
  locked?: boolean;
  icon?: React.ReactNode;
}> = ({ title, children, onEdit, showAdd, onAdd, locked, icon }) => (
  <div className="bg-card border border-border rounded-[var(--radius-card)] p-5 shadow-[var(--elevation-sm)] space-y-4">
    <div className="flex items-center justify-between border-b border-border pb-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{title}</span>
        {icon}
      </div>
      <div className="flex gap-1">
        {showAdd && <button onClick={onAdd} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Plus className="w-4 h-4" /></button>}
        {onEdit && !locked && <button onClick={onEdit} className="p-1.5 hover:bg-muted rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>}
      </div>
    </div>
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string; value: string; sensitive?: boolean; inline?: boolean }> = ({ label, value, sensitive, inline }) => (
  <div className={cn("flex gap-3 text-[var(--text-sm)]", inline ? "flex-col" : "flex-row items-start")} style={{ fontFamily: "'Inter', sans-serif" }}>
    <span className={cn("text-muted-foreground font-[var(--font-weight-medium)] shrink-0", inline ? "" : "w-28")}>{label}</span>
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <span className={cn(
        'text-foreground min-w-0',
        sensitive
          ? 'inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-muted/40 px-2 py-0.5 font-mono tracking-wide max-w-full truncate'
          : 'break-all'
      )}>
        {value}
      </span>
      {sensitive && <Shield className="w-3 h-3 text-muted-foreground shrink-0" />}
    </div>
  </div>
);

// ════════════════════════════════════
// ── Edit Modals ──
// ════════════════════════════════════

const EditPersonalInfoModal: React.FC<{ 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  data: PersonalInfoData; 
  onSave: (v: PersonalInfoData) => void 
}> = ({ open, onOpenChange, data, onSave }) => {
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth);
  const [nationalId, setNationalId] = useState(data.nationalId);
  const [email, setEmail] = useState(data.email);
  const [mobile, setMobile] = useState(data.mobile);
  const [landline, setLandline] = useState(data.landline);
  const [gender, setGender] = useState(data.gender);
  const [nationality, setNationality] = useState(data.nationality);
  const [address, setAddress] = useState(data.address);

  const handleSave = () => {
    if (!dateOfBirth || !nationalId || !mobile || !gender || !nationality) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate birth date is not in future
    if (new Date(dateOfBirth) > new Date()) {
      toast.error('Date of birth cannot be in the future');
      return;
    }

    // Validate national ID format (14 digits)
    if (!/^\d{14}$/.test(nationalId)) {
      toast.error('National ID must be 14 digits');
      return;
    }

    // Validate mobile number format
    if (!/^01[0-9]{9}$/.test(mobile) && !mobile.includes('*')) {
      toast.error('Please enter a valid Egyptian mobile number');
      return;
    }

    onSave({ dateOfBirth, nationalId, email, mobile, landline, gender, nationality, address });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Edit Personal Information</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-2 p-2 bg-primary/5 rounded border border-primary/10">
          <Shield className="w-3 h-3 text-primary shrink-0 mt-0.5" />
          <span className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>This information is encrypted and protected. All changes are logged for security.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Date of Birth *" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
          <FormField label="National ID * (14 digits)" value={nationalId} onChange={setNationalId} maxLength={14} />
          <FormField label="Email" value={email} onChange={setEmail} />
          <FormField label="Mobile *" value={mobile} onChange={setMobile} placeholder="01XXXXXXXXX" />
          <FormField label="Landline" value={landline} onChange={setLandline} />
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Gender *</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Nationality *</label>
            <Select value={nationality} onValueChange={setNationality}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Egyptian">Egyptian</SelectItem>
                <SelectItem value="Saudi">Saudi</SelectItem>
                <SelectItem value="Emirati">Emirati</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className={cn(inputClass, 'h-auto py-2')} style={{ fontFamily: "'Inter', sans-serif" }} />
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditEmergencyModal: React.FC<{ 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  data: EmergencyContactData; 
  onSave: (v: EmergencyContactData) => void 
}> = ({ open, onOpenChange, data, onSave }) => {
  const [name, setName] = useState(data.name);
  const [relationship, setRelationship] = useState(data.relationship);
  const [phone, setPhone] = useState(data.phone);

  const handleSave = () => {
    if (!name || !relationship || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone format
    if (!/^01[0-9]{9}$/.test(phone)) {
      toast.error('Please enter a valid Egyptian mobile number');
      return;
    }

    onSave({ ...data, name, relationship, phone });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>{data.name ? 'Edit' : 'Add'} Emergency Contact</DialogTitle>
          <DialogDescription className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Provide contact details for someone to reach in case of emergency.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormField label="Contact Name *" value={name} onChange={setName} />
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Relationship *</label>
            <Select value={relationship} onValueChange={setRelationship}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Spouse">Spouse</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Child">Child</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Phone Number *" value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" />
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSave} style={{ fontFamily: "'Inter', sans-serif" }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeImageModal: React.FC<{ 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  onUpdateImage: (url: string) => void;
  currentUser: BasicInfoProps['currentUser'];
}> = ({ open, onOpenChange, onUpdateImage, currentUser }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload JPG or PNG files only');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateImage(event.target.result as string);
          toast.success('Profile picture updated successfully');
          onOpenChange(false);
        }
      };
      reader.readAsDataURL(file);
      setUploading(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Change Profile Picture</DialogTitle>
          <DialogDescription className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Upload a new profile picture or select an avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card shadow-[var(--elevation-sm)]">
              {currentUser?.image ? (
                <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif", fontSize: '2.5rem', fontWeight: 'var(--font-weight-bold)' }}>
                  <span className="text-primary">{currentUser ? getInitials(currentUser.name) : 'U'}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block">
              <input 
                type="file" 
                accept="image/jpeg,image/png" 
                onChange={handleFileChange}
                className="block w-full text-[var(--text-sm)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-button)] file:border-0 file:text-[var(--text-sm)] file:font-[var(--font-weight-medium)] file:bg-chart-3 file:text-white hover:file:bg-chart-3/90 file:cursor-pointer cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
                disabled={uploading}
              />
            </label>
            <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              JPG or PNG. Max size 2MB.
            </p>
          </div>
          {uploading && <p className="text-[var(--text-sm)] text-primary text-center" style={{ fontFamily: "'Inter', sans-serif" }}>Uploading...</p>}
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BankRequestModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [currency, setCurrency] = useState('EGP');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    if (!accountNumber || !bankName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      toast.success('Bank update request submitted successfully. HR will review your request.');
      onOpenChange(false);
      setUploading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Request Bank Update</DialogTitle>
        </DialogHeader>
        <div className="flex items-start gap-2 p-2 bg-primary/5 rounded border border-primary/10">
          <Shield className="w-3 h-3 text-primary shrink-0 mt-0.5" />
          <span className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>This request will be reviewed and approved by HR before the changes take effect.</span>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Currency *</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-10 rounded-[var(--radius-input)] border-border" style={{ fontFamily: "'Inter', sans-serif" }}><SelectValue /></SelectTrigger>
              <SelectContent style={{ fontFamily: "'Inter', sans-serif" }}>
                <SelectItem value="EGP">EGP</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <FormField label="Account Number *" value={accountNumber} onChange={setAccountNumber} />
          <FormField label="Bank Name *" value={bankName} onChange={setBankName} />
          <FormField label="IBAN (Optional)" value={iban} onChange={setIban} />
          <div className="space-y-2">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Upload Bank Statement</label>
            <input 
              type="file" 
              accept="application/pdf,image/*"
              className="block w-full text-[var(--text-sm)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-button)] file:border-0 file:text-[var(--text-sm)] file:font-[var(--font-weight-medium)] file:bg-muted file:text-foreground hover:file:bg-muted/80 file:cursor-pointer cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Required: Upload a bank statement or account verification document
            </p>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }} disabled={uploading}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSubmit} style={{ fontFamily: "'Inter', sans-serif" }} disabled={uploading}>
            {uploading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmploymentUpdateModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => {
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!issue.trim()) {
      toast.error('Please describe the issue or correction needed');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success('Request submitted successfully. HR will review and respond via email within 5 business days.');
      onOpenChange(false);
      setSubmitting(false);
      setIssue('');
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-lg)] font-[var(--font-weight-semibold)]" style={{ fontFamily: "'Inter', sans-serif" }}>Request Employment Update</DialogTitle>
          <DialogDescription className="text-[var(--text-sm)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            Describe the issue or correction needed in your employment details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>Issue Description *</label>
            <textarea 
              value={issue} 
              onChange={e => setIssue(e.target.value)} 
              rows={5} 
              className={cn(inputClass, 'h-auto py-2')} 
              style={{ fontFamily: "'Inter', sans-serif" }}
              placeholder="Example: My job title should be 'Senior UX Designer' instead of 'UX Designer'"
            />
          </div>
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-[var(--radius-sm)] border border-border">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[var(--text-xs)] text-foreground font-[var(--font-weight-medium)] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Review Timeline
              </p>
              <p className="text-[var(--text-xs)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                HR will review your request and respond via email within 5 business days.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-[var(--radius-button)] border-border" style={{ fontFamily: "'Inter', sans-serif" }} disabled={submitting}>Cancel</Button>
          <Button className="rounded-[var(--radius-button)] bg-chart-3 hover:bg-chart-3/90 text-white" onClick={handleSubmit} style={{ fontFamily: "'Inter', sans-serif" }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Request Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Form field helper
const FormField: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  type?: string; 
  placeholder?: string;
  maxLength?: number;
}> = ({ label, value, onChange, type = 'text', placeholder, maxLength }) => (
  <div className="space-y-1.5">
    <label className={labelClass} style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className={inputClass} 
      placeholder={placeholder} 
      maxLength={maxLength}
      style={{ fontFamily: "'Inter', sans-serif" }} 
    />
  </div>
);

// Employment Info Item
const EmploymentInfoItem: React.FC<{ 
  label: string; 
  value: string; 
  badge?: string; 
  clickable?: boolean; 
  onClick?: () => void;
}> = ({ label, value, badge, clickable, onClick }) => (
  <div className="grid grid-cols-[35%_1fr] gap-3 items-start">
    <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      {label}
    </span>
    <div className="flex items-start justify-between gap-2 min-w-0">
      <span className="text-[15px] font-[var(--font-weight-semibold)] text-foreground break-words min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
        {value}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="rounded-[var(--radius-sm)] border border-[#2563EB] bg-[#EAF2FF] px-2 py-0.5 text-[var(--text-xs)] font-[var(--font-weight-semibold)] text-[#1E3A8A] whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
            {badge}
          </span>
        )}
        {clickable && (
          <button
            onClick={onClick}
            className="p-1 hover:bg-muted rounded-[var(--radius-sm)] text-primary hover:text-primary/80 transition-colors cursor-pointer"
            title="View manager profile"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

// System Identifier Item
const SystemIdentifierItem: React.FC<{ 
  label: string; 
  value: string; 
  tooltip: string; 
}> = ({ label, value, tooltip }) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          {label}
        </span>
        <button
          type="button"
          className="group relative"
          title={tooltip}
          aria-label={tooltip}
        >
          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
        </button>
      </div>
      <p className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground" style={{ fontFamily: "'Inter', 'SF Mono', 'Monaco', 'Courier New', monospace" }}>
        {value}
      </p>
    </div>
  </div>
);
