import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, type ComponentProps } from 'react-native';
import {
  AppButton,
  BenefitCard,
  BrandHeader,
  Card,
  EmptyState,
  Page,
  SaccoCard,
  SectionHeader,
  StatusBadge,
  VehicleCard,
} from '@/components/ui';
import { demoBenefits, demoNotifications, demoSaccos, demoVehicles } from '@/data/demo';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { rider, membership } = useDemoApp();
  const activeMember = membership?.status === 'Active';
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);
  const currentName = rider?.firstName || 'rider';
  const status = membership?.status ?? 'No application';
  const cardNumber = membership?.memberNumber || membership?.applicationReference;
  const membershipCopy = getMembershipCopy(status);

  return (
    <Page isTab>
      <BrandHeader
        onNotifications={() => router.push('/notifications')}
        onProfile={() => router.push('/profile')}
      />
      <View style={styles.greeting}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR RIDER NETWORK</Text>
        <Text style={[styles.greetingTitle, { color: colors.foreground }]}>Good morning, {currentName}</Text>
        <Text style={[styles.greetingBody, { color: colors.mutedForeground }]}>A stronger ride starts with a stronger network.</Text>
      </View>

      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroEyebrow, { color: colors.primaryForeground, opacity: 0.75 }]}>MEMBERSHIP</Text>
            <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>{membershipCopy.title}</Text>
            <Text style={[styles.heroBody, { color: colors.primaryForeground, opacity: 0.86 }]}>{membershipCopy.body}</Text>
          </View>
          <View style={[styles.heroIcon, { backgroundColor: colors.lime }]}>
            <Feather name={activeMember ? 'shield' : 'clock'} size={23} color={colors.foreground} />
          </View>
        </View>
        <View style={styles.heroBottom}>
          <View style={[styles.statusPill, { backgroundColor: colors.card }]}>
            <View style={[styles.statusDot, { backgroundColor: activeMember ? colors.success : colors.warning }]} />
            <Text style={[styles.statusText, { color: colors.foreground }]}>{status}</Text>
          </View>
          {cardNumber ? <Text style={[styles.memberNumber, { color: colors.primaryForeground }]}>{cardNumber}</Text> : null}
        </View>
        {!membership ? (
          <AppButton label="Start rider registration" icon="arrow-right" onPress={() => router.push('/register')} variant="lime" style={styles.heroButton} />
        ) : (
          <Pressable onPress={() => router.push('/membership')} accessibilityRole="button" style={styles.heroAction}>
            <Text style={[styles.heroActionText, { color: colors.primaryForeground }]}>View membership</Text>
            <Feather name="arrow-up-right" size={15} color={colors.primaryForeground} />
          </Pressable>
        )}
        <View style={[styles.heroAccent, { backgroundColor: colors.lime }]} />
      </View>

      <SectionHeader title="Your next step" />
      {membership ? (
        <SaccoCard sacco={sacco ?? demoSaccos[0]} membership={membership} />
      ) : (
        <Card style={styles.noMembershipCard}>
          <Text style={[styles.noMembershipTitle, { color: colors.foreground }]}>No application yet</Text>
          <Text style={[styles.noMembershipBody, { color: colors.mutedForeground }]}>Create a local demo application to connect your rider profile with a fictional SACCO.</Text>
          <AppButton label="Register as a rider" icon="user-plus" onPress={() => router.push('/register')} variant="secondary" />
        </Card>
      )}

      <SectionHeader title="Explore KrazyTrader" />
      <View style={styles.quickLinks}>
        <QuickLink label="Vehicle acquisition" icon="truck" onPress={() => router.push('/vehicles')} />
        <QuickLink label="Financing" icon="trending-up" onPress={() => router.push('/financing')} />
        <QuickLink label="Member benefits" icon="gift" onPress={() => router.push('/benefits')} locked={!activeMember} />
        <QuickLink label="Insurance & assistance" icon="shield" onPress={() => router.push('/insurance')} />
      </View>

      <SectionHeader title="Vehicle opportunities" actionLabel="See all" onAction={() => router.push('/vehicles')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vehicleRow}>
        {demoVehicles.slice(0, 2).map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleTile}>
            <VehicleCard vehicle={vehicle} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })} />
          </View>
        ))}
      </ScrollView>

      <SectionHeader title="Member benefits" actionLabel={activeMember ? 'Explore' : undefined} onAction={activeMember ? () => router.push('/benefits') : undefined} />
      {activeMember ? (
        <BenefitCard benefit={demoBenefits[0]} onPress={() => router.push({ pathname: '/benefit/[id]', params: { id: demoBenefits[0].id } })} />
      ) : (
        <Card style={styles.lockedBenefit}>
          <View style={[styles.lockIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="lock" size={17} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.noMembershipTitle, { color: colors.foreground }]}>Available when membership is active</Text>
            <Text style={[styles.noMembershipBody, { color: colors.mutedForeground }]}>Your application status will update here. Member-only benefits are not available yet.</Text>
          </View>
        </Card>
      )}

      <SectionHeader title="Partner network" />
      <Card style={styles.partnerCard}>
        <View style={[styles.partnerIcon, { backgroundColor: colors.limeSoft }]}>
          <Feather name="map-pin" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.updateTitle, { color: colors.foreground }]}>Local partner directory preview</Text>
          <Text style={[styles.updateBody, { color: colors.mutedForeground }]}>Sample fuel, tyre, repair and rider-cover partners are shown in the Benefits area for active members.</Text>
        </View>
      </Card>

      <SectionHeader title="Recent updates" actionLabel="All alerts" onAction={() => router.push('/notifications')} />
      {activeMember ? (
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
      ) : (
        <Card style={styles.emptyUpdates}>
          <EmptyState title="No membership updates yet" message="Your application status and future rider notices will appear here." icon="bell" />
        </Card>
      )}

      <SectionHeader title="Need a hand?" actionLabel="Support" onAction={() => router.push('/support')} />
      <Card style={styles.supportCard}>
        <View style={[styles.supportIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="headphones" size={19} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.updateTitle, { color: colors.foreground }]}>Rider support</Text>
          <Text style={[styles.updateBody, { color: colors.mutedForeground }]}>The support route is a prototype only. No request is sent.</Text>
        </View>
      </Card>

      <View style={styles.footer}>
        <Image source={require('../../assets/images/krazytrader-logo.png')} style={styles.footerLogo} resizeMode="contain" />
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>A rider-first network by Rhea Technologies</Text>
      </View>
    </Page>
  );
}

function QuickLink({ label, icon, onPress, locked = false }: { label: string; icon: ComponentProps<typeof Feather>['name']; onPress: () => void; locked?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]} accessibilityRole="button">
      <View style={[styles.quickIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name={locked ? 'lock' : icon} size={19} color={locked ? colors.mutedForeground : colors.primary} />
      </View>
      <Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

function getMembershipCopy(status: string): { title: string; body: string } {
  if (status === 'Active') return { title: 'You’re an active member.', body: 'Your SACCO network and member benefits are available.' };
  if (status === 'Submitted') return { title: 'Your application was submitted.', body: 'Submission is not approval. We’ll show your next step here.' };
  if (status === 'Pending verification') return { title: 'Your details are being reviewed.', body: 'Your membership is not active while verification is pending.' };
  if (status === 'Rejected') return { title: 'Your application needs attention.', body: 'Review your application or contact rider support for next steps.' };
  if (status === 'Inactive') return { title: 'Your membership is inactive.', body: 'Contact your SACCO for guidance before using member services.' };
  return { title: 'Start with your rider profile.', body: 'Register and choose a SACCO to begin your membership application.' };
}

const styles = StyleSheet.create({
  greeting: { marginTop: 20, marginBottom: 18 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 6 },
  greetingTitle: { fontSize: 23, lineHeight: 29, fontFamily: 'Inter_700Bold' },
  greetingBody: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 5 },
  hero: { minHeight: 185, borderRadius: 24, padding: 18, overflow: 'hidden', justifyContent: 'space-between', marginBottom: 3 },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroEyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 7 },
  heroTitle: { fontSize: 17, lineHeight: 22, fontFamily: 'Inter_700Bold', maxWidth: 235 },
  heroBody: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 5, maxWidth: 240 },
  heroIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  heroBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, gap: 8 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  memberNumber: { flex: 1, textAlign: 'right', fontSize: 10, fontFamily: 'Inter_500Medium', letterSpacing: 0.2 },
  heroButton: { alignSelf: 'flex-start', minHeight: 40, marginTop: 12, paddingHorizontal: 13 },
  heroAction: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4, paddingTop: 12 },
  heroActionText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  heroAccent: { position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -83, bottom: -95, opacity: 0.16 },
  noMembershipCard: { gap: 10 },
  noMembershipTitle: { fontSize: 13, lineHeight: 18, fontFamily: 'Inter_600SemiBold' },
  noMembershipBody: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  quickLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 15, marginBottom: 2 },
  quickItem: { width: '48%', minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: 16, backgroundColor: 'transparent' },
  quickIcon: { width: 43, height: 43, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { flex: 1, fontSize: 11, lineHeight: 15, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.8 },
  vehicleRow: { gap: 12, paddingBottom: 3, paddingRight: 18 },
  vehicleTile: { width: 255 },
  lockedBenefit: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  lockIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  partnerCard: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  partnerIcon: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  updateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  updateIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  updateTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  updateBody: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  emptyUpdates: { paddingVertical: 0 },
  supportCard: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  supportIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  footer: { alignItems: 'center', marginTop: 24, marginBottom: 6, gap: 4 },
  footerLogo: { height: 28, width: 54, opacity: 0.5 },
  footerText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
