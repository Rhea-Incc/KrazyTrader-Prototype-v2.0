import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { demoMembership, demoRider, demoSacco } from '@/data/demo';
import type { Membership, MembershipStatus, Rider, VehicleCategory } from '@/types/models';

const STORAGE_KEY = 'krazytrader-demo-state-v2';

export interface NotificationPreferences {
  membershipUpdates: boolean;
  partnerOffers: boolean;
  supportReplies: boolean;
}

export interface DemoAccount {
  rider: Rider | null;
  membership: Membership | null;
  preferences: NotificationPreferences;
  privacyAcceptedAt?: string;
}

export interface RegistrationDraft {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  county: string;
  town: string;
  occupation: string;
  vehicleCategory: VehicleCategory;
  saccoId: string;
  demoIdentityReference: string;
  documentPlaceholder: string;
  termsAccepted: boolean;
  declarationAccepted: boolean;
}

interface StoredDemoState {
  accounts: Record<string, DemoAccount>;
  currentPhone: string | null;
  isAuthenticated: boolean;
  registrationDraft: RegistrationDraft | null;
}

export interface RegistrationSubmission {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  county: string;
  town: string;
  occupation: string;
  vehicleCategory: VehicleCategory;
  saccoId: string;
  demoIdentityReference: string;
  documentPlaceholder: string;
  termsAccepted: boolean;
  declarationAccepted: boolean;
}

interface DemoAppContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  currentPhone: string | null;
  account: DemoAccount | null;
  rider: Rider | null;
  membership: Membership | null;
  registrationDraft: RegistrationDraft | null;
  storageError: string | null;
  login: (phone: string, termsAccepted: boolean) => Promise<void>;
  submitRegistration: (input: RegistrationSubmission) => Promise<string>;
  saveRegistrationDraft: (draft: RegistrationDraft) => Promise<void>;
  updateRider: (patch: Partial<Pick<Rider, 'firstName' | 'lastName' | 'email' | 'dateOfBirth' | 'county' | 'town' | 'occupation' | 'vehicleCategory'>>) => Promise<void>;
  updatePreferences: (patch: Partial<NotificationPreferences>) => Promise<void>;
  setMembershipStatus: (status: MembershipStatus) => Promise<void>;
  logout: () => Promise<void>;
  resetDemo: () => Promise<void>;
}

const emptyStore: StoredDemoState = {
  accounts: {},
  currentPhone: null,
  isAuthenticated: false,
  registrationDraft: null,
};

const defaultPreferences: NotificationPreferences = {
  membershipUpdates: true,
  partnerOffers: true,
  supportReplies: true,
};

const DemoAppContext = createContext<DemoAppContextValue | null>(null);

export function normalizeKenyanPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('254')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `+254${digits}`;
}

export function isValidKenyanPhone(input: string): boolean {
  const normalized = normalizeKenyanPhone(input).replace(/\D/g, '');
  const local = normalized.startsWith('254') ? normalized.slice(3) : normalized;
  return /^[17]\d{8}$/.test(local);
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function demoAccount(phone: string): DemoAccount {
  const normalizedDemoPhone = normalizeKenyanPhone(demoRider.phone);
  if (phone === normalizedDemoPhone) {
    return {
      rider: { ...demoRider },
      membership: { ...demoMembership },
      preferences: { ...defaultPreferences },
      privacyAcceptedAt: new Date().toISOString(),
    };
  }
  return {
    rider: null,
    membership: null,
    preferences: { ...defaultPreferences },
  };
}

function isStoredDemoState(value: unknown): value is StoredDemoState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StoredDemoState>;
  return (
    typeof candidate.accounts === 'object' &&
    candidate.accounts !== null &&
    (candidate.currentPhone === null || typeof candidate.currentPhone === 'string') &&
    typeof candidate.isAuthenticated === 'boolean'
  );
}

export function DemoAppProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredDemoState>(emptyStore);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);
  const storedRef = useRef(stored);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (!isStoredDemoState(parsed)) throw new Error('Saved demo data has an unexpected format.');
          const loaded: StoredDemoState = {
            ...parsed,
            registrationDraft: parsed.registrationDraft ?? null,
          };
          storedRef.current = loaded;
          setStored(loaded);
        }
      } catch {
        if (active) setStorageError('Saved demo data could not be read. Use the demo reset control to start fresh.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const save = async (next: StoredDemoState) => {
    storedRef.current = next;
    setStored(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(null);
    } catch {
      setStorageError('Your change is visible for now but could not be saved on this device.');
      throw new Error('Local demo data could not be saved.');
    }
  };

  const currentPhone = stored.currentPhone;
  const account = currentPhone ? stored.accounts[currentPhone] ?? null : null;
  const rider = account?.rider ?? null;
  const membership = account?.membership ?? null;

  const login = async (phoneInput: string, termsAccepted: boolean) => {
    if (!termsAccepted) throw new Error('Please acknowledge the Terms and Privacy notice to continue.');
    if (!isValidKenyanPhone(phoneInput)) throw new Error('Enter a valid Kenyan mobile number.');
    const phone = normalizeKenyanPhone(phoneInput);
    const previous = storedRef.current;
    const existing = previous.accounts[phone] ?? demoAccount(phone);
    const next: StoredDemoState = {
      accounts: {
        ...previous.accounts,
        [phone]: { ...existing, privacyAcceptedAt: existing.privacyAcceptedAt ?? new Date().toISOString() },
      },
      currentPhone: phone,
      isAuthenticated: true,
      registrationDraft: previous.registrationDraft,
    };
    await save(next);
  };

  const submitRegistration = async (input: RegistrationSubmission) => {
    if (!input.termsAccepted || !input.declarationAccepted) {
      throw new Error('Confirm both statements before submitting your application.');
    }
    const phone = normalizeKenyanPhone(input.phone);
    if (!isValidKenyanPhone(phone)) throw new Error('Enter a valid Kenyan mobile number.');
    const previous = storedRef.current;
    const existing = previous.accounts[phone] ?? demoAccount(phone);
    const riderId = existing.rider?.id ?? createId('rider');
    const now = new Date().toISOString();
    const reference = `KT-APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const rider: Rider = {
      id: riderId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone,
      email: input.email?.trim() || undefined,
      dateOfBirth: input.dateOfBirth,
      county: input.county,
      town: input.town.trim(),
      occupation: input.occupation,
      vehicleCategory: input.vehicleCategory,
      saccoId: input.saccoId,
      joinedAt: existing.rider?.joinedAt ?? now,
    };
    const application: Membership = {
      id: existing.membership?.id ?? createId('membership'),
      riderId,
      saccoId: input.saccoId,
      memberNumber: '',
      applicationReference: reference,
      status: 'Submitted',
      verificationStatus: 'Pending',
      demoIdentityReference: input.demoIdentityReference.trim(),
      documentPlaceholder: input.documentPlaceholder,
      createdAt: existing.membership?.createdAt ?? now,
      submittedAt: now,
      updatedAt: now,
      termsAcceptedAt: now,
      declarationAcceptedAt: now,
    };
    const next: StoredDemoState = {
      accounts: {
        ...previous.accounts,
        [phone]: {
          ...existing,
          rider,
          membership: application,
          privacyAcceptedAt: now,
        },
      },
      currentPhone: phone,
      isAuthenticated: true,
      registrationDraft: null,
    };
    await save(next);
    return reference;
  };

  const saveRegistrationDraft = async (draft: RegistrationDraft) => {
    await save({ ...storedRef.current, registrationDraft: draft });
  };

  const updateRider = async (patch: Partial<Pick<Rider, 'firstName' | 'lastName' | 'email' | 'dateOfBirth' | 'county' | 'town' | 'occupation' | 'vehicleCategory'>>) => {
    const previous = storedRef.current;
    const phone = previous.currentPhone;
    if (!phone) throw new Error('Sign in before editing a rider profile.');
    const current = previous.accounts[phone] ?? demoAccount(phone);
    if (!current.rider) throw new Error('Complete registration before editing rider details.');
    await save({
      ...previous,
      accounts: {
        ...previous.accounts,
        [phone]: { ...current, rider: { ...current.rider, ...patch } },
      },
    });
  };

  const updatePreferences = async (patch: Partial<NotificationPreferences>) => {
    const previous = storedRef.current;
    const phone = previous.currentPhone;
    if (!phone) throw new Error('Sign in before editing notification preferences.');
    const current = previous.accounts[phone] ?? demoAccount(phone);
    await save({
      ...previous,
      accounts: {
        ...previous.accounts,
        [phone]: { ...current, preferences: { ...current.preferences, ...patch } },
      },
    });
  };

  const setMembershipStatus = async (status: MembershipStatus) => {
    const previous = storedRef.current;
    const phone = previous.currentPhone;
    if (!phone) throw new Error('Sign in before changing the demo membership state.');
    const current = previous.accounts[phone] ?? demoAccount(phone);
    const rider = current.rider ?? {
      ...demoRider,
      id: createId('rider'),
      phone,
      saccoId: demoSacco.id,
    };
    const now = new Date().toISOString();
    const existingMembership = current.membership;
    const membership: Membership = {
      id: existingMembership?.id ?? createId('membership'),
      riderId: rider.id,
      saccoId: existingMembership?.saccoId ?? rider.saccoId ?? demoSacco.id,
      memberNumber: status === 'Active'
        ? existingMembership?.memberNumber || `KT-DEMO-${Date.now().toString(36).toUpperCase()}`
        : '',
      applicationReference: existingMembership?.applicationReference ?? `KT-APP-DEMO-${Date.now().toString(36).toUpperCase()}`,
      status,
      verificationStatus: status === 'Active' ? 'Verified' : status === 'Rejected' ? 'Needs update' : 'Pending',
      rejectionReason: status === 'Rejected' ? 'The demonstration application needs updated details.' : undefined,
      createdAt: existingMembership?.createdAt ?? now,
      submittedAt: existingMembership?.submittedAt ?? now,
      updatedAt: now,
      termsAcceptedAt: existingMembership?.termsAcceptedAt,
      declarationAcceptedAt: existingMembership?.declarationAcceptedAt,
    };
    await save({
      ...previous,
      accounts: {
        ...previous.accounts,
        [phone]: { ...current, rider, membership },
      },
    });
  };

  const logout = async () => {
    const previous = storedRef.current;
    await save({ ...previous, isAuthenticated: false });
  };

  const resetDemo = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      storedRef.current = emptyStore;
      setStored(emptyStore);
      setStorageError(null);
    } catch {
      setStorageError('Demo data could not be cleared from this device.');
      throw new Error('Local demo data could not be cleared.');
    }
  };

  const value = useMemo<DemoAppContextValue>(() => ({
    isLoading,
    isAuthenticated: stored.isAuthenticated,
    currentPhone,
    account,
    rider,
    membership,
    registrationDraft: stored.registrationDraft,
    storageError,
    login,
    submitRegistration,
    saveRegistrationDraft,
    updateRider,
    updatePreferences,
    setMembershipStatus,
    logout,
    resetDemo,
  }), [isLoading, stored.isAuthenticated, stored.registrationDraft, currentPhone, account, rider, membership, storageError]);

  return <DemoAppContext.Provider value={value}>{children}</DemoAppContext.Provider>;
}

export function useDemoApp() {
  const context = useContext(DemoAppContext);
  if (!context) throw new Error('useDemoApp must be used inside DemoAppProvider.');
  return context;
}
