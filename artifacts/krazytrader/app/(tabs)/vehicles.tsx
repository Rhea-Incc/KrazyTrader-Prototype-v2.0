import { Feather } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton, Page, PageTitle, SectionHeader, VehicleCard } from '@/components/ui';
import { demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKes } from '@/utils/format';

const filters = ['All', 'Cargo', 'Passenger'] as const;
type VehicleFilter = (typeof filters)[number];

export default function VehiclesScreen() {
  const colors = useColors();
  const router = useRouter();
  const [filter, setFilter] = useState<VehicleFilter>('All');
  const featuredVehicle = demoVehicles[2];
  const vehicles = demoVehicles.filter((vehicle) => {
    if (filter === 'Cargo') return vehicle.category === 'Cargo tricycle';
    if (filter === 'Passenger') return vehicle.category === 'Passenger tricycle';
    return true;
  });

  return (
    <Page isTab>
      <PageTitle eyebrow="RIDER MOBILITY" title="Find your next work vehicle" subtitle="Compare the sample fleet by use, capacity and price. Select a vehicle to explore a demo finance plan." />

      <View style={[styles.featured, { backgroundColor: colors.primary }]}>
        <View style={styles.featuredImageStage}>
          <ExpoImage source={featuredVehicle.image} style={styles.featuredImage} contentFit="contain" cachePolicy="memory-disk" transition={140} />
          <View style={styles.featuredLabel}><Text style={styles.featuredLabelText}>DELIVERY PICK</Text></View>
        </View>
        <View style={styles.featuredContent}>
          <Text style={[styles.featuredEyebrow, { color: colors.lime }]}>BUILT FOR DAILY CARGO</Text>
          <Text style={[styles.featuredTitle, { color: colors.primaryForeground }]}>{featuredVehicle.name}</Text>
          <Text style={[styles.featuredDescription, { color: colors.primaryForeground }]}>{featuredVehicle.capacity} · {formatKes(featuredVehicle.priceKes)}</Text>
          <View style={styles.featuredActions}>
            <AppButton label="View vehicle" icon="arrow-up-right" onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: featuredVehicle.id } })} variant="lime" style={styles.featuredButton} />
            <Pressable onPress={() => router.push({ pathname: '/financing', params: { vehicleId: featuredVehicle.id } })} accessibilityRole="button" style={styles.featuredFinance}>
              <Feather name="trending-up" size={15} color={colors.primaryForeground} />
              <Text style={[styles.featuredFinanceText, { color: colors.primaryForeground }]}>Estimate payments</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.disclosure}>
        <Feather name="info" size={14} color={colors.mutedForeground} />
        <Text style={[styles.disclosureText, { color: colors.mutedForeground }]}>All listings, prices and availability are fictional demonstration data.</Text>
      </View>

      <SectionHeader title="Browse the fleet" />
      <View style={[styles.filters, { backgroundColor: colors.muted }]} accessibilityRole="tablist">
        {filters.map((item) => {
          const selected = filter === item;
          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.filterButton, selected && { backgroundColor: colors.card }]}
            >
              <Text style={[styles.filterLabel, { color: selected ? colors.foreground : colors.mutedForeground }]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
      <SectionHeader title={`${vehicles.length} vehicles`} />
      <View style={styles.list}>
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })}
            onFinance={() => router.push({ pathname: '/financing', params: { vehicleId: vehicle.id } })}
          />
        ))}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  featured: { borderRadius: 18, overflow: 'hidden', marginBottom: 15 },
  featuredImageStage: { height: 225, backgroundColor: '#FFFFFF', padding: 12, position: 'relative' },
  featuredImage: { width: '100%', height: '100%' },
  featuredLabel: { position: 'absolute', top: 14, left: 14, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFFFFF', borderRadius: 4 },
  featuredLabelText: { color: '#174B9B', fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  featuredContent: { padding: 17 },
  featuredEyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.1 },
  featuredTitle: { fontSize: 18, lineHeight: 24, fontFamily: 'Inter_700Bold', marginTop: 6 },
  featuredDescription: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 5, opacity: 0.82 },
  featuredActions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 13, marginTop: 14 },
  featuredButton: { minHeight: 42, borderRadius: 8, paddingHorizontal: 12 },
  featuredFinance: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 7 },
  featuredFinanceText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  disclosure: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  disclosureText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  filters: { minHeight: 43, flexDirection: 'row', alignItems: 'center', borderRadius: 9, padding: 3, gap: 3 },
  filterButton: { flex: 1, height: 37, alignItems: 'center', justifyContent: 'center', borderRadius: 7 },
  filterLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  list: { gap: 12 },
});
