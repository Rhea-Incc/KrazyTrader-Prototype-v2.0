import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AppButton,
  Card,
  CheckboxRow,
  DropdownField,
  KenyanPhoneField,
  MetaRow,
  Page,
  PageTitle,
  TextField,
} from '@/components/ui';
import { demoSaccos } from '@/data/demo';
import {
  isValidKenyanPhone,
  useDemoApp,
  type RegistrationDraft,
} from '@/context/DemoAppContext';
import type { VehicleCategory } from '@/types/models';
import { useColors } from '@/hooks/useColors';

const counties = ['Nakuru', 'Nairobi', 'Kiambu', 'Mombasa', 'Uasin Gishu', 'Kisumu', 'Machakos'];
const occupations = ['Boda-boda rider', 'Delivery rider', 'Three-wheeler operator', 'Other'];
const vehicleCategories: VehicleCategory[] = ['Two-wheeler', 'Three-wheeler'];
const steps = ['Personal', 'Rider details', 'SACCO', 'Identity demo', 'Review'];

function emptyDraft(phone = ''): RegistrationDraft {
  return {
    fullName: '',
    phone,
    email: '',
    dateOfBirth: '',
    county: '',
    town: '',
    occupation: '',
    vehicleCategory: 'Two-wheeler',
    saccoId: '',
    demoIdentityReference: '',
    documentPlaceholder: '',
    termsAccepted: false,
    declarationAccepted: false,
  };
}

function localPhone(phone: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('254') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date < new Date();
}

export default function RegistrationScreen() {
  const colors = useColors();
  const router = useRouter();
  const {
    currentPhone,
    isLoading,
    registrationDraft,
    saveRegistrationDraft,
    submitRegistration,
    storageError,
  } = useDemoApp();
  const [form, setForm] = useState<RegistrationDraft>(() => emptyDraft(localPhone(currentPhone)));
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [saccoQuery, setSaccoQuery] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const saveDraftRef = useRef(saveRegistrationDraft);

  useEffect(() => {
    saveDraftRef.current = saveRegistrationDraft;
  }, [saveRegistrationDraft]);

  useEffect(() => {
    if (isLoading || ready) return;
    setForm(registrationDraft ?? emptyDraft(localPhone(currentPhone)));
    setReady(true);
  }, [isLoading, ready, registrationDraft, currentPhone]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      void saveDraftRef.current(form).catch(() => undefined);
    }, 350);
    return () => clearTimeout(timer);
  }, [form, ready]);

  const selectedSacco = demoSaccos.find((sacco) => sacco.id === form.saccoId);
  const filteredSaccos = useMemo(() => {
    const query = saccoQuery.trim().toLowerCase();
    if (!query) return demoSaccos;
    return demoSaccos.filter((sacco) =>
      `${sacco.name} ${sacco.town} ${sacco.county}`.toLowerCase().includes(query),
    );
  }, [saccoQuery]);

  const updateForm = <K extends keyof RegistrationDraft,>(key: K, value: RegistrationDraft[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setError('');
  };

  const validationMessage = (): string => {
    if (step === 0) {
      const nameParts = form.fullName.trim().split(/\s+/).filter(Boolean);
      if (nameParts.length < 2) return 'Enter your first and last name.';
      if (!isValidKenyanPhone(form.phone)) return 'Enter a valid 9-digit Kenyan mobile number.';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address or leave it blank.';
      if (!validDate(form.dateOfBirth)) return 'Enter a valid past date in YYYY-MM-DD format.';
    }
    if (step === 1) {
      if (!form.county || !form.town.trim() || !form.occupation || !form.vehicleCategory) {
        return 'Complete your county, operating area, occupation and vehicle type.';
      }
    }
    if (step === 2 && !form.saccoId) return 'Choose a SACCO to continue.';
    if (step === 3) {
      if (!/^DEMO[-_ ]/i.test(form.demoIdentityReference.trim())) return 'Use a fictional reference starting with DEMO, such as DEMO-ID-0001.';
      if (!form.documentPlaceholder) return 'Choose the demonstration document placeholder.';
    }
    if (step === 4 && (!form.termsAccepted || !form.declarationAccepted)) {
      return 'Confirm both statements before submitting.';
    }
    return '';
  };

  const advance = async () => {
    const message = validationMessage();
    if (message) {
      setError(message);
      return;
    }
    setError('');
    if (step < steps.length - 1) {
      try {
        await saveRegistrationDraft(form);
        setStep((current) => current + 1);
      } catch {
        setError('This step could not be saved on your device. Please try again.');
      }
      return;
    }
    const [firstName, ...lastNameParts] = form.fullName.trim().split(/\s+/);
    if (!firstName || lastNameParts.length === 0) {
      setError('Enter your first and last name.');
      return;
    }
    setSubmitting(true);
    try {
      await submitRegistration({
        firstName,
        lastName: lastNameParts.join(' '),
        phone: form.phone,
        email: form.email || undefined,
        dateOfBirth: form.dateOfBirth,
        county: form.county,
        town: form.town,
        occupation: form.occupation,
        vehicleCategory: form.vehicleCategory,
        saccoId: form.saccoId,
        demoIdentityReference: form.demoIdentityReference,
        documentPlaceholder: form.documentPlaceholder,
        termsAccepted: form.termsAccepted,
        declarationAccepted: form.declarationAccepted,
      });
      router.replace('/');
      return;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The sample application could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = async () => {
    if (step === 0) {
      router.back();
      return;
    }
    try {
      await saveRegistrationDraft(form);
      setError('');
      setStep((current) => Math.max(0, current - 1));
    } catch {
      setError('This step could not be saved on your device. Please try again.');
    }
  };

  if (isLoading || !ready) {
    return <Page><Text style={{ color: colors.mutedForeground }}>Loading your saved registration…</Text></Page>;
  }

  return (
    <Page>
      <PageTitle eyebrow="RIDER ONBOARDING" title="Join your network" subtitle="A short, five-step demonstration application. Use fictional test information only." />
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, { color: colors.foreground }]}>Step {step + 1} of {steps.length}</Text>
        <Text style={[styles.progressLabel, { color: colors.primary }]}>{steps[step]}</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <View style={[styles.progressFill, { width: `${((step + 1) / steps.length) * 100}%`, backgroundColor: colors.lime }]} />
      </View>

      {storageError ? <InlineNotice message={storageError} tone="warning" /> : null}
      {error ? <InlineNotice message={error} tone="error" /> : null}

      {step === 0 ? (
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>Personal information</Text>
          <TextField label="Full name" value={form.fullName} onChangeText={(value) => updateForm('fullName', value)} placeholder="e.g. Amani Mwangi" autoCapitalize="words" returnKeyType="next" />
          <KenyanPhoneField value={form.phone} onChangeText={(value) => updateForm('phone', value)} />
          <TextField label="Email address (optional)" value={form.email} onChangeText={(value) => updateForm('email', value)} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
          <TextField
            label="Date of birth (fictional demo date)"
            value={form.dateOfBirth}
            onChangeText={(value) => updateForm('dateOfBirth', formatDateInput(value))}
            placeholder="YYYY-MM-DD"
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            maxLength={10}
          />
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>Rider information</Text>
          <DropdownField label="County" value={form.county} options={counties} onChange={(value) => updateForm('county', value)} />
          <TextField label="Town or operating area" value={form.town} onChangeText={(value) => updateForm('town', value)} placeholder="e.g. Nakuru Town" autoCapitalize="words" />
          <DropdownField label="Occupation" value={form.occupation} options={occupations} onChange={(value) => updateForm('occupation', value)} />
          <DropdownField label="Vehicle category" value={form.vehicleCategory} options={vehicleCategories} onChange={(value) => updateForm('vehicleCategory', value as VehicleCategory)} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>Choose a SACCO</Text>
          <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>Search fictional cooperatives by name, town or county.</Text>
          <TextField label="Search SACCOs" value={saccoQuery} onChangeText={setSaccoQuery} placeholder="Type a name or location" autoCapitalize="none" />
          {filteredSaccos.length ? filteredSaccos.map((sacco) => (
            <Pressable key={sacco.id} onPress={() => updateForm('saccoId', sacco.id)} accessibilityRole="radio" accessibilityState={{ selected: form.saccoId === sacco.id }} style={({ pressed }) => [pressed && styles.pressed]}>
              <Card style={[styles.saccoOption, form.saccoId === sacco.id && { borderColor: colors.primary, borderWidth: 2 }]}>
                <View style={[styles.saccoIcon, { backgroundColor: colors.secondary }]}><Feather name="users" size={18} color={colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.saccoName, { color: colors.foreground }]}>{sacco.name}</Text>
                  <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>{sacco.town}, {sacco.county} · {sacco.memberCount.toLocaleString('en-KE')} sample members</Text>
                </View>
                <Feather name={form.saccoId === sacco.id ? 'check-circle' : 'circle'} size={20} color={form.saccoId === sacco.id ? colors.primary : colors.mutedForeground} />
              </Card>
            </Pressable>
          )) : <Card><Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>No sample SACCOs match that search.</Text></Card>}
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>Demonstration identity details</Text>
          <InlineNotice message="Use made-up test values only. No identity check is performed and no document is uploaded." tone="info" />
          <TextField label="Fictional identity reference" value={form.demoIdentityReference} onChangeText={(value) => updateForm('demoIdentityReference', value.toUpperCase())} placeholder="DEMO-ID-0001" autoCapitalize="characters" />
          <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>The reference must start with DEMO, for example DEMO-ID-0001.</Text>
          <Card style={styles.documentCard}>
            <View style={[styles.documentIcon, { backgroundColor: colors.limeSoft }]}><Feather name="file-text" size={19} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.saccoName, { color: colors.foreground }]}>Identity document placeholder</Text>
              <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>Select a label only; no file is needed.</Text>
              <Text style={[styles.selectedDocument, { color: colors.primary }]}>{form.documentPlaceholder || 'No placeholder selected'}</Text>
            </View>
          </Card>
          <AppButton label={form.documentPlaceholder ? 'Change demo placeholder' : 'Choose demo placeholder'} icon="file-plus" variant="secondary" onPress={() => updateForm('documentPlaceholder', form.documentPlaceholder ? '' : 'National ID placeholder (demo)')} />
        </View>
      ) : null}

      {step === 4 ? (
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, { color: colors.foreground }]}>Review your application</Text>
          <ReviewSection title="Personal details" onEdit={() => setStep(0)}>
            <MetaRow label="Name" value={form.fullName || '—'} />
            <MetaRow label="Mobile" value={`+254 ${form.phone || '—'}`} />
            <MetaRow label="Email" value={form.email || 'Not provided'} />
            <MetaRow label="Date of birth" value={form.dateOfBirth || '—'} />
          </ReviewSection>
          <ReviewSection title="Rider details" onEdit={() => setStep(1)}>
            <MetaRow label="Operating area" value={[form.town, form.county].filter(Boolean).join(', ') || '—'} />
            <MetaRow label="Occupation" value={form.occupation || '—'} />
            <MetaRow label="Vehicle category" value={form.vehicleCategory} />
          </ReviewSection>
          <ReviewSection title="SACCO and demo identity" onEdit={() => setStep(2)}>
            <MetaRow label="SACCO" value={selectedSacco?.name ?? 'Choose a SACCO'} />
            <MetaRow label="Identity reference" value={form.demoIdentityReference || '—'} />
            <MetaRow label="Document" value={form.documentPlaceholder || '—'} />
          </ReviewSection>
          <CheckboxRow checked={form.termsAccepted} onPress={() => updateForm('termsAccepted', !form.termsAccepted)}>
            I acknowledge the demonstration Terms and Privacy notice.
          </CheckboxRow>
          <CheckboxRow checked={form.declarationAccepted} onPress={() => updateForm('declarationAccepted', !form.declarationAccepted)}>
            I confirm I used fictional test information and understand this is not verified.
          </CheckboxRow>
        </View>
      ) : null}

      <View style={styles.actions}>
        {step > 0 ? <AppButton label="Back" icon="arrow-left" onPress={() => void goBack()} variant="secondary" style={styles.actionButton} /> : <AppButton label="Back to welcome" icon="arrow-left" onPress={() => router.replace('/welcome')} variant="secondary" style={styles.actionButton} />}
        <AppButton
          label={step === steps.length - 1 ? (submitting ? 'Submitting…' : 'Submit demo application') : 'Continue'}
          icon={step === steps.length - 1 ? 'check' : 'arrow-right'}
          onPress={() => void advance()}
          disabled={!ready || submitting}
          style={styles.actionButton}
        />
      </View>
      <Text style={[styles.footerNote, { color: colors.mutedForeground }]}>Your draft saves locally on this device. No SMS, KYC, or live SACCO request is used.</Text>
    </Page>
  );
}

function InlineNotice({ message, tone }: { message: string; tone: 'info' | 'warning' | 'error' }) {
  const colors = useColors();
  const color = tone === 'error' ? colors.destructive : tone === 'warning' ? colors.warning : colors.primary;
  const backgroundColor = tone === 'error' ? colors.warningSoft : tone === 'warning' ? colors.warningSoft : colors.secondary;
  return (
    <View style={[styles.notice, { backgroundColor }]}>
      <Feather name={tone === 'error' ? 'alert-circle' : 'info'} size={16} color={color} />
      <Text style={[styles.noticeText, { color }]}>{message}</Text>
    </View>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  const colors = useColors();
  return (
    <Card style={styles.reviewCard}>
      <View style={styles.reviewHeading}>
        <Text style={[styles.saccoName, { color: colors.foreground }]}>{title}</Text>
        <Pressable onPress={onEdit} accessibilityRole="button" hitSlop={8}>
          <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
        </Pressable>
      </View>
      {children}
      <View style={{ height: 2 }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  progressLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  progressTrack: { height: 6, borderRadius: 4, overflow: 'hidden', marginTop: 8, marginBottom: 20 },
  progressFill: { height: '100%', borderRadius: 4 },
  stepContent: { gap: 2 },
  stepTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  stepDescription: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  fieldHint: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: -6, marginBottom: 11 },
  saccoOption: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 10, padding: 13 },
  saccoIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  saccoName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.85 },
  documentCard: { flexDirection: 'row', gap: 11, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  documentIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  selectedDocument: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 5 },
  notice: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', padding: 11, borderRadius: 13, marginBottom: 12 },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
  reviewCard: { marginBottom: 9, paddingHorizontal: 13, paddingVertical: 12 },
  reviewHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  editText: { fontSize: 11, fontFamily: 'Inter_700Bold', padding: 5 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionButton: { flex: 1, paddingHorizontal: 10 },
  footerNote: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 14, marginBottom: 5 },
});
