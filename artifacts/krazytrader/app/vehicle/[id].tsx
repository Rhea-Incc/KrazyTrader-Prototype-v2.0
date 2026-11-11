import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, ConfirmDialog, MetaRow, Page, ProductHeroImage, StatusBadge } from '@/components/ui';
import { demoDealer, demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKes } from '@/utils/format';

export default function VehicleDetailsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = demoVehicles.find((item) => item.id === id);
  const [showNotice, setShowNotice] = useState(false);

  if (!vehicle) {
    return (
      <Page>
        <Card>
          <Text style={[styles.title, { color: colors.foreground }]}>Vehicle not found</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>This sample listing is not available.</Text>
          <View style={{ height: 14 }} />
          <AppButton label="Back to vehicles" onPress={() => router.replace('/vehicles')} variant="secondary" />
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <ProductHeroImage source={vehicle.image} />
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>{vehicle.name}</Text>
          <Text style={[styles.category, { color: colors.mutedForeground }]}>{vehicle.category}</Text>
        </View>
        <StatusBadge status={vehicle.availability} />
      </View>
      <Text style={[styles.price, { color: colors.primary }]}>{formatKes(vehicle.priceKes)}</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>{vehicle.description}</Text>
      <Card style={styles.details}>
        <MetaRow label="Load / passenger capacity" value={vehicle.capacity} />
        <MetaRow label="Sample dealer" value={demoDealer.name} />
        <MetaRow label="Location" value={`${demoDealer.town}, ${demoDealer.county}`} />
        <View style={{ height: 2 }} />
      </Card>
      <View style={[styles.notice, { backgroundColor: colors.warningSoft }]}>
        <Feather name="info" size={15} color={colors.warning} />
        <Text style={[styles.noticeText, { color: colors.foreground }]}>Sample listing only. Price and availability are fictional.</Text>
      </View>
      <View style={{ height: 16 }} />
      <AppButton label="Preview an inquiry" icon="message-circle" onPress={() => setShowNotice(true)} />
      <View style={{ height: 9 }} />
      <AppButton label="See financing preview" icon="trending-up" onPress={() => router.push('/financing')} variant="secondary" />
      <ConfirmDialog
        visible={showNotice}
        title="Prototype preview"
        message="Vehicle inquiries are planned for a later phase. No request or transaction will be sent."
        confirmLabel="Got it"
        onConfirm={() => setShowNotice(false)}
        onCancel={() => setShowNotice(false)}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 17 },
  title: { fontSize: 21, lineHeight: 27, fontFamily: 'Inter_700Bold' },
  category: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  price: { fontSize: 19, fontFamily: 'Inter_700Bold', marginTop: 12 },
  body: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 7 },
  details: { marginTop: 17, paddingHorizontal: 14, paddingVertical: 1 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 13, marginTop: 12 },
  noticeText: { flex: 1, fontSize: 11, fontFamily: 'Inter_500Medium' },
});
