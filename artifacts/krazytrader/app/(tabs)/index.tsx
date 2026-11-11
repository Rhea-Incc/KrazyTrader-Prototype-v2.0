import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, BenefitCard, BrandHeader, Card, Page, SaccoCard, SectionHeader, VehicleCard } from '@/components/ui';
import { demoBenefits, demoMembership, demoNotifications, demoRider, demoSacco, demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();

  return (
    <Page isTab>
      <BrandHeader onNotifications={() => router.push('/notifications')} />
      <View style={styles.greeting}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR RIDER NETWORK</Text>
        <Text style={[styles.greetingTitle, { color: colors.foreground }]}>Good morning, {demoRider.firstName}</Text>
        <Text style={[styles.greetingBody, { color: colors.mutedForeground }]}>A stronger ride starts with a stronger network.</Text>
      </View>

      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroEyebrow, { color: colors.primaryForeground, opacity: 0.75 }]}>MEMBER STATUS</Text>
            <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>You’re backed by your SACCO.</Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: colors.lime }]}>
            <Feather name="shield" size={23} color={colors.foreground} />
          </View>
        </View>
        <View style={styles.heroBottom}>
          <View style={[styles.approvedPill, { backgroundColor: colors.card }]}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.approvedText, { color: colors.foreground }]}>{demoMembership.status}</Text>
          </View>
          <Text style={[styles.memberNumber, { color: colors.primaryForeground }]}>{demoMembership.memberNumber}</Text>
        </View>
        <View style={[styles.heroAccent, { backgroundColor: colors.lime }]} />
      </View>

      <View style={styles.quickLinks}>
        <QuickLink label="Financing" icon="trending-up" onPress={() => router.push('/financing')} />
        <QuickLink label="Insurance" icon="shield" onPress={() => router.push('/insurance')} />
        <QuickLink label="Support" icon="headphones" onPress={() => router.push('/support')} />
      </View>

      <SectionHeader title="Your membership" actionLabel="Details" onAction={() => router.push('/membership')} />
      <SaccoCard sacco={demoSacco} membership={demoMembership} />

      <SectionHeader title="Vehicle opportunities" actionLabel="See all" onAction={() => router.push('/vehicles')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleRow}>
        {demoVehicles.slice(0, 2).map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleTile}>
            <VehicleCard vehicle={vehicle} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })} />
          </View>
        ))}
      </ScrollView>

      <SectionHeader title="Member benefits" actionLabel="Explore" onAction={() => router.push('/benefits')} />
      <BenefitCard benefit={demoBenefits[0]} onPress={() => router.push({ pathname: '/benefit/[id]', params: { id: demoBenefits[0].id } })} />

      <SectionHeader title="Latest update" actionLabel="All alerts" onAction={() => router.push('/notifications')} />
      <Card>
        <Pressable onPress={() => router.push('/notifications')} style={styles.updateRow} accessibilityRole="button">
          <View style={[styles.updateIcon, { backgroundColor: colors.limeSoft }]}>
            <Feather name="check-circle" size={20} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.updateTitle, { color: colors.foreground }]}>{demoNotifications[0].title}</Text>
            <Text numberOfLines={2} style={[styles.updateBody, { color: colors.mutedForeground }]}>{demoNotifications[0].body}</Text>
          </View>
          <Feather name="chevron-right" size={19} color={colors.mutedForeground} />
        </Pressable>
      </Card>

      <View style={styles.footer}>
        <Image source={require('../../assets/images/krazytrader-logo.png')} style={styles.footerLogo} resizeMode="contain" />
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>A rider-first network by Rhea Technologies</Text>
      </View>
    </Page>
  );
}

function QuickLink({ label, icon, onPress }: { label: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={styles.quickItem} accessibilityRole="button">
      <View style={[styles.quickIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greeting: { marginTop: 20, marginBottom: 18 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 6 },
  greetingTitle: { fontSize: 23, lineHeight: 29, fontFamily: 'Inter_700Bold' },
  greetingBody: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 5 },
  hero: { minHeight: 158, borderRadius: 24, padding: 19, overflow: 'hidden', justifyContent: 'space-between', marginBottom: 15 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroEyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 8 },
  heroTitle: { fontSize: 18, lineHeight: 24, fontFamily: 'Inter_700Bold', maxWidth: 225 },
  heroIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  heroBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 19 },
  approvedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  approvedText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  memberNumber: { fontSize: 11, fontFamily: 'Inter_500Medium', letterSpacing: 0.4 },
  heroAccent: { position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -83, bottom: -95, opacity: 0.16 },
  quickLinks: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 10 },
  quickItem: { flex: 1, alignItems: 'center', gap: 7 },
  quickIcon: { width: 54, height: 54, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  vehicleRow: { gap: 12, paddingBottom: 3, paddingRight: 18 },
  vehicleTile: { width: 255 },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  updateIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  updateTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  updateBody: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  footer: { alignItems: 'center', marginTop: 24, marginBottom: 6, gap: 4 },
  footerLogo: { height: 28, width: 54, opacity: 0.5 },
  footerText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
