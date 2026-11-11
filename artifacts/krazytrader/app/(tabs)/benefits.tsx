import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { AppButton, Card, BenefitCard, Page, PageTitle, SectionHeader, StatusBadge } from '@/components/ui';
import { demoBenefits } from '@/data/demo';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function BenefitsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { membership } = useDemoApp();
  const activeMember = membership?.status === 'Active';
  return (
    <Page isTab>
      <PageTitle eyebrow="MEMBER PERKS" title="Benefits" subtitle="Practical partner offers for everyday riding." />
      {!activeMember ? (
        <>
          <Card style={styles.lockedCard}>
            <StatusBadge status={membership?.status ?? 'No application'} />
            <Text style={[styles.lockedTitle, { color: colors.foreground }]}>Benefits unlock when membership is active</Text>
            <Text style={[styles.lockedBody, { color: colors.mutedForeground }]}>
              {membership
                ? 'Your current membership state does not grant access to member-only offers. Submission or pending verification is not approval.'
                : 'Complete rider registration and choose a SACCO to start your application.'}
            </Text>
            <AppButton label="View membership status" icon="users" onPress={() => router.push('/membership')} variant="secondary" />
          </Card>
          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Sample offers are hidden until the development-only membership control sets the account to Active.</Text>
        </>
      ) : (
        <>
      <Card style={[styles.featureCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        <Text style={[styles.featureOverline, { color: colors.primaryForeground, opacity: 0.75 }]}>THE MEMBER NETWORK</Text>
        <Text style={[styles.featureTitle, { color: colors.primaryForeground }]}>More support beyond the ride.</Text>
        <Text style={[styles.featureBody, { color: colors.primaryForeground, opacity: 0.82 }]}>Fuel, tyre, repair and cover partners—connected through your membership.</Text>
      </Card>
      <SectionHeader title="Available in Nakuru" />
      {demoBenefits.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} onPress={() => router.push({ pathname: '/benefit/[id]', params: { id: benefit.id } })} />
      ))}
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Benefits shown are fictional examples. Partner availability and offers are not live.</Text>
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  lockedCard: { gap: 11 },
  lockedTitle: { fontSize: 16, lineHeight: 21, fontFamily: 'Inter_700Bold' },
  lockedBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  featureCard: { padding: 18, minHeight: 150, justifyContent: 'center' },
  featureOverline: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.1 },
  featureTitle: { fontSize: 20, lineHeight: 26, fontFamily: 'Inter_700Bold', marginTop: 8, maxWidth: 260 },
  featureBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 7, maxWidth: 290 },
  disclaimer: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 8 },
});
