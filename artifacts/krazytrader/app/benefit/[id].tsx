import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, FeaturePlaceholder, Page } from '@/components/ui';
import { demoBenefits, demoPartners } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function BenefitDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const benefit = demoBenefits.find((item) => item.id === id);
  const partner = demoPartners.find((item) => item.id === benefit?.partnerId);

  if (!benefit || !partner) {
    return (
      <Page>
        <FeaturePlaceholder icon="gift" description="This sample offer could not be found." nextPhase="Member benefits" />
        <View style={{ height: 18 }} />
        <AppButton label="Back to benefits" onPress={() => router.replace('/benefits')} variant="secondary" />
      </Page>
    );
  }

  return (
    <Page>
      <View style={[styles.iconBox, { backgroundColor: colors.limeSoft }]}><Feather name="gift" size={25} color={colors.primary} /></View>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{benefit.category.toUpperCase()} · MEMBER BENEFIT</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>{benefit.title}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]}>{benefit.description}</Text>
      <Card style={styles.partnerCard}>
        <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>PARTNER EXAMPLE</Text>
        <Text style={[styles.partnerName, { color: colors.foreground }]}>{partner.name}</Text>
        <Text style={[styles.partnerDetails, { color: colors.mutedForeground }]}>{partner.town}, {partner.county}</Text>
        <View style={[styles.offerPill, { backgroundColor: colors.limeSoft }]}>
          <Text style={[styles.offerText, { color: colors.primary }]}>{benefit.offerLabel}</Text>
        </View>
      </Card>
      <View style={[styles.infoRow, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={16} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.foreground }]}>This offer is a fictional preview. No partner transaction can be started here.</Text>
      </View>
      <View style={{ height: 18 }} />
      <AppButton label="Back to benefits" onPress={() => router.replace('/benefits')} variant="secondary" />
    </Page>
  );
}

const styles = StyleSheet.create({
  iconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 19 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 7 },
  title: { fontSize: 23, lineHeight: 29, fontFamily: 'Inter_700Bold' },
  description: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 7 },
  partnerCard: { marginTop: 19 },
  metaLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.9 },
  partnerName: { fontSize: 15, fontFamily: 'Inter_700Bold', marginTop: 7 },
  partnerDetails: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  offerPill: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7, marginTop: 13 },
  offerText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  infoRow: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 14, marginTop: 12 },
  infoText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
});
