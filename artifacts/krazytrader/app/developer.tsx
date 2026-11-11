import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, ConfirmDialog, Page, StatusBadge } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';
import type { MembershipStatus } from '@/types/models';

const states: MembershipStatus[] = ['Submitted', 'Pending verification', 'Active', 'Rejected', 'Inactive'];

export default function DeveloperScreen() {
  const colors = useColors();
  const router = useRouter();
  const { membership, setMembershipStatus, resetDemo } = useDemoApp();
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState('');

  if (!__DEV__) return <Redirect href="/" />;

  const chooseStatus = async (status: MembershipStatus) => {
    setError('');
    try {
      await setMembershipStatus(status);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The state could not be changed.');
    }
  };

  const confirmReset = async () => {
    try {
      await resetDemo();
      setShowReset(false);
      router.replace('/welcome');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Demo data could not be reset.');
    }
  };

  return (
    <Page>
      <Text style={[styles.title, { color: colors.foreground }]}>Development-only controls</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>These controls are only available in development builds. They do not appear in the regular rider experience.</Text>
      <Card style={styles.currentCard}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CURRENT MEMBERSHIP STATE</Text>
        <StatusBadge status={membership?.status ?? 'No application'} />
        {!membership ? <Text style={[styles.helper, { color: colors.mutedForeground }]}>Choosing a state creates a fictional rider and sample membership for testing.</Text> : null}
      </Card>
      <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Set a test state</Text>
      <View style={styles.stateList}>
        {states.map((status) => (
          <AppButton
            key={status}
            label={status}
            onPress={() => void chooseStatus(status)}
            variant={membership?.status === status ? 'lime' : 'secondary'}
          />
        ))}
      </View>
      {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
      <View style={styles.resetWrap}>
        <AppButton label="Reset all local demo data" icon="trash-2" onPress={() => setShowReset(true)} variant="secondary" />
      </View>
      <Text style={[styles.helper, { color: colors.mutedForeground }]}>Reset removes saved rider profiles, applications, preferences and unfinished registration drafts on this device.</Text>
      <ConfirmDialog
        visible={showReset}
        title="Reset local demo data?"
        message="This permanently clears the saved demo rider accounts and registration drafts from this device."
        confirmLabel="Reset demo data"
        onConfirm={() => void confirmReset()}
        onCancel={() => setShowReset(false)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 8 },
  subtitle: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 6, marginBottom: 17 },
  currentCard: { gap: 10 },
  sectionLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 9 },
  stateList: { gap: 9 },
  helper: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 9 },
  error: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 12 },
  resetWrap: { marginTop: 25 },
});
