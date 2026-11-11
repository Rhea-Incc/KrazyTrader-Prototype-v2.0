import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, Page, PageTitle, SectionHeader, VehicleCard } from '@/components/ui';
import { demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function VehiclesScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <Page isTab>
      <PageTitle eyebrow="MOBILITY" title="Vehicles" subtitle="Explore sample vehicles and see where a future inquiry could begin." />
      <Card style={styles.introCard}>
        <Text style={[styles.introTitle, { color: colors.foreground }]}>Options for the work you do</Text>
        <Text style={[styles.introBody, { color: colors.mutedForeground }]}>The photos are supplied examples. Prices, stock and dealer details are fictional and are not live offers.</Text>
      </Card>
      <SectionHeader title={`${demoVehicles.length} sample vehicles`} />
      <View style={styles.list}>
        {demoVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })} />
        ))}
      </View>
      <Card style={[styles.financeCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        <Text style={[styles.financeTitle, { color: colors.primaryForeground }]}>Looking at financing?</Text>
        <Text style={[styles.financeBody, { color: colors.primaryForeground, opacity: 0.82 }]}>See the future financing route in this prototype.</Text>
        <AppButton label="Explore financing" onPress={() => router.push('/financing')} variant="lime" style={styles.financeButton} />
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  introCard: { marginBottom: 2 },
  introTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  introBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 6 },
  list: { gap: 12 },
  financeCard: { marginTop: 18, padding: 17 },
  financeTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  financeBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 5 },
  financeButton: { alignSelf: 'flex-start', minHeight: 43 },
});
