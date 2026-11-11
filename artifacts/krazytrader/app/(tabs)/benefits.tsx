import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Card, BenefitCard, Page, PageTitle, SectionHeader } from '@/components/ui';
import { demoBenefits } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function BenefitsScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <Page isTab>
      <PageTitle eyebrow="MEMBER PERKS" title="Benefits" subtitle="Practical partner offers for everyday riding." />
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
    </Page>
  );
}

const styles = StyleSheet.create({
  featureCard: { padding: 18, minHeight: 150, justifyContent: 'center' },
  featureOverline: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.1 },
  featureTitle: { fontSize: 20, lineHeight: 26, fontFamily: 'Inter_700Bold', marginTop: 8, maxWidth: 260 },
  featureBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 7, maxWidth: 290 },
  disclaimer: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 8 },
});
