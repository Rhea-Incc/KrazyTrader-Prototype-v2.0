import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, MetaRow, Page, PageTitle, SaccoCard, SectionHeader, StatusBadge } from '@/components/ui';
import { demoMembership, demoRider, demoSacco } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKes, formatShortDate } from '@/utils/format';

export default function MembershipScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <Page isTab>
      <PageTitle eyebrow="YOUR COOPERATIVE" title="Membership" subtitle="Your SACCO connection and member status." />
      <Card style={styles.statusCard}>
        <View style={styles.statusTop}>
          <View style={[styles.memberIcon, { backgroundColor: colors.limeSoft }]}><Feather name="shield" size={21} color={colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>MEMBERSHIP STATUS</Text>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>{demoMembership.status}</Text>
          </View>
          <StatusBadge status={demoMembership.status} />
        </View>
        <Text style={[styles.statusDescription, { color: colors.mutedForeground }]}>Your membership is linked to your cooperative network. Your member number is ready to reference.</Text>
        <AppButton label="Registration preview" icon="arrow-up-right" variant="secondary" onPress={() => router.push('/register')} />
      </Card>

      <SectionHeader title="Your SACCO" />
      <SaccoCard sacco={demoSacco} membership={demoMembership} />
      <Card style={styles.detailsCard}>
        <MetaRow label="Rider" value={`${demoRider.firstName} ${demoRider.lastName}`} />
        <MetaRow label="Member number" value={demoMembership.memberNumber} />
        <MetaRow label="Joined" value={formatShortDate(demoMembership.createdAt)} />
        <MetaRow label="Illustrative monthly contribution" value={formatKes(demoSacco.monthlyContributionKes)} />
        <View style={{ height: 2 }} />
      </Card>
      <View style={[styles.note, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={16} color={colors.primary} />
        <Text style={[styles.noteText, { color: colors.foreground }]}>All rider and membership details shown here are fictional demonstration data.</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  statusCard: { padding: 17 },
  statusTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  memberIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  smallLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.9 },
  statusTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 4 },
  statusDescription: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginVertical: 15 },
  detailsCard: { paddingHorizontal: 15, paddingVertical: 1 },
  note: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 14, marginTop: 12 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
});
