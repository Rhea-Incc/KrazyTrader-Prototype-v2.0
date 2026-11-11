import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, type ComponentProps } from 'react-native';
import {
  AppButton,
  Card,
  ConfirmDialog,
  MetaRow,
  Page,
  PageTitle,
  StatusBadge,
} from '@/components/ui';
import { demoSaccos } from '@/data/demo';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';
import { getInitials } from '@/utils/format';

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { account, currentPhone, rider, membership, storageError, updatePreferences, logout } = useDemoApp();
  const [showLogout, setShowLogout] = useState(false);
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);

  const confirmLogout = async () => {
    await logout();
    setShowLogout(false);
    router.replace('/welcome');
  };

  return (
    <Page isTab>
      <PageTitle eyebrow="YOUR DETAILS" title="Profile" subtitle="Manage your local demonstration rider profile and preferences." />
      {storageError ? (
        <Card style={{ borderColor: colors.warning, marginBottom: 12 }}>
          <Text style={{ color: colors.warning, fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' }}>{storageError}</Text>
        </Card>
      ) : null}
      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{rider ? getInitials(rider.firstName, rider.lastName) : 'KT'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.foreground }]}>{rider ? `${rider.firstName} ${rider.lastName}` : 'New KrazyTrader rider'}</Text>
          <Text style={[styles.phone, { color: colors.mutedForeground }]}>{rider?.phone ?? currentPhone ?? 'Mobile number not set'}</Text>
          <Text style={[styles.location, { color: colors.mutedForeground }]}>{rider?.town ? `${rider.town}, ${rider.county}` : 'Complete registration to add rider details'}</Text>
        </View>
        <StatusBadge status={membership?.status ?? 'No application'} />
      </Card>

      <SectionLabel text="RIDER INFORMATION" />
      <Card style={styles.infoCard}>
        <MetaRow label="Occupation" value={rider?.occupation || 'Not added'} />
        <MetaRow label="Vehicle category" value={rider?.vehicleCategory || 'Not added'} />
        <MetaRow label="Email" value={rider?.email || 'Not provided'} />
        <MetaRow label="SACCO" value={sacco?.name || 'Not selected'} />
        <MetaRow label="Member number" value={membership?.memberNumber || membership?.applicationReference || 'Not assigned'} />
        <View style={{ height: 2 }} />
      </Card>
      {rider ? (
        <View style={styles.editButton}>
          <AppButton label="Edit rider information" icon="edit-2" onPress={() => router.push('/profile-edit')} variant="secondary" />
        </View>
      ) : (
        <View style={styles.editButton}>
          <AppButton label="Complete rider registration" icon="user-plus" onPress={() => router.push('/register')} variant="secondary" />
        </View>
      )}

      <SectionLabel text="NOTIFICATION PREFERENCES" />
      <Card style={styles.preferencesCard}>
        <PreferenceRow
          title="Membership updates"
          subtitle="Application and SACCO status notices"
          value={account?.preferences.membershipUpdates ?? true}
          onValueChange={(value) => void updatePreferences({ membershipUpdates: value })}
        />
        <PreferenceRow
          title="Partner announcements"
          subtitle="Sample offers and rider network news"
          value={account?.preferences.partnerOffers ?? true}
          onValueChange={(value) => void updatePreferences({ partnerOffers: value })}
        />
        <PreferenceRow
          title="Support replies"
          subtitle="Updates on demonstration support requests"
          value={account?.preferences.supportReplies ?? true}
          onValueChange={(value) => void updatePreferences({ supportReplies: value })}
          last
        />
      </Card>

      <SectionLabel text="PRIVACY & SUPPORT" />
      <Card style={styles.linksCard}>
        <View style={styles.privacyRow}>
          <View style={[styles.linkIcon, { backgroundColor: colors.secondary }]}><Feather name="lock" size={18} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.linkTitle, { color: colors.foreground }]}>Demo data stays on this device</Text>
            <Text style={[styles.linkSubtitle, { color: colors.mutedForeground }]}>No live KYC, document upload, SMS, or production login is used.</Text>
          </View>
        </View>
        <ProfileLink icon="bell" title="Notifications" subtitle="View sample membership updates" onPress={() => router.push('/notifications')} />
        <ProfileLink icon="shield" title="Insurance & assistance" subtitle="A future service route" onPress={() => router.push('/insurance')} />
        <ProfileLink icon="help-circle" title="Rider support" subtitle="The support route is a non-live preview" onPress={() => router.push('/support')} last />
      </Card>

      {__DEV__ ? (
        <View style={styles.developerButton}>
          <AppButton label="Development-only demo controls" icon="tool" onPress={() => router.push('/developer')} variant="secondary" />
        </View>
      ) : null}
      <View style={styles.logoutButton}>
        <AppButton label="Log out" icon="log-out" onPress={() => setShowLogout(true)} variant="secondary" />
      </View>
      <View style={styles.attribution}>
        <Text style={[styles.attributionText, { color: colors.mutedForeground }]}>KrazyTrader · Phase 02 prototype</Text>
        <Text style={[styles.attributionText, { color: colors.mutedForeground }]}>By Rhea Technologies</Text>
      </View>
      <ConfirmDialog
        visible={showLogout}
        title="Log out of KrazyTrader?"
        message="Your saved demonstration profile and membership state will remain on this device. You can sign in again with the same number and demo code."
        confirmLabel="Log out"
        onConfirm={() => void confirmLogout()}
        onCancel={() => setShowLogout(false)}
      />
    </Page>
  );
}

function SectionLabel({ text }: { text: string }) {
  const colors = useColors();
  return <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{text}</Text>;
}

function PreferenceRow({
  title,
  subtitle,
  value,
  onValueChange,
  last = false,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={[styles.preferenceRow, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.linkTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.linkSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={colors.card} />
    </View>
  );
}

function ProfileLink({ icon, title, subtitle, onPress, last = false }: { icon: ComponentProps<typeof Feather>['name']; title: string; subtitle: string; onPress: () => void; last?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.profileLink, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.linkIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={18} color={colors.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.linkTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.linkSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  phone: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  location: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  sectionLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginTop: 22, marginBottom: 9, marginLeft: 2 },
  infoCard: { paddingHorizontal: 13, paddingVertical: 1 },
  editButton: { marginTop: 10 },
  preferencesCard: { paddingHorizontal: 13, paddingVertical: 0 },
  preferenceRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 10 },
  linksCard: { paddingVertical: 0, paddingHorizontal: 13 },
  privacyRow: { minHeight: 77, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DCE2E9' },
  profileLink: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 11 },
  linkIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  linkSubtitle: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  developerButton: { marginTop: 16 },
  logoutButton: { marginTop: 12 },
  attribution: { alignItems: 'center', gap: 3, marginTop: 24 },
  attributionText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
