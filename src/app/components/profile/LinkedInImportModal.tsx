import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { ExperienceData, EducationData, ProjectData, CertificationData, SkillData, LanguageData } from './Types';

type ProfileImport = {
  about: string;
  experiences: ExperienceData[];
  educations: EducationData[];
  projects: ProjectData[];
  certifications: CertificationData[];
  skills: SkillData[];
  languages: LanguageData[];
};
interface LinkedInImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: Partial<ProfileImport>) => void;
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({ open, onOpenChange, onImport }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(false);
  const close = (value: boolean) => { setPreview(false); onOpenChange(value); };
  const sample: ProfileImport = {
    about: t('reliability.sampleAbout'),
    experiences: [], educations: [], projects: [], certifications: [], languages: [],
    skills: [{ id: 'demo-skill', name: 'Figma', category: 'Design', level: 'Advanced', createdAt: new Date().toISOString() }],
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('reliability.sampleProfile')}</DialogTitle>
          <DialogDescription>{t('reliability.linkedinDemo')}</DialogDescription>
        </DialogHeader>
        {preview && (
          <section aria-label={t('reliability.sampleProfile')} className="space-y-3 rounded-xl border border-border bg-muted p-4">
            <p>{sample.about}</p>
            <p>Figma</p>
            <p className="text-sm text-muted-foreground">{t('reliability.sampleReplace')}</p>
          </section>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => close(false)}>{t('common.cancel')}</Button>
          {preview ? (
            <Button onClick={() => { onImport({ about: sample.about, skills: sample.skills }); toast.success(t('reliability.sampleAdded')); close(false); }}>
              {t('reliability.addSample')}
            </Button>
          ) : <Button onClick={() => setPreview(true)}>{t('reliability.previewSample')}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
