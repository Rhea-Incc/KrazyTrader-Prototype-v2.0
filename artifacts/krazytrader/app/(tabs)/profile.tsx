import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Page, PageTitle, StatusBadge } from '@/components/ui';
import { demoMembership, demoRider } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { getInitials } from '@/utils/format';

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <Page isTab>
      <PageTitle eyebrow="YOUR DETAILS" title="Profile" subtitle="Your demonstration rider profile and app routes." />
      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{getInitials(demoRider.firstName, demoRider.lastName)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.foreground }]}>{demoRider.firstName} {demoRider.lastName}</Text>
          <Text style={[styles.phone, { color: colors.mutedForeground }]}>{demoRider.phone}</Text>
          <Text style={[styles.location, { color: colors.mutedForeground }]}>{demoRider.town}, {demoRider.county}</Text>
        </View>
        <StatusBadge status={demoMembership.status} />
      </Card>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ACCOUNT & SUPPORT</Text>
      <Card style={styles.linksCard}>
        <ProfileLink icon="user-plus" title="Registration" subtitle="Preview the onboarding route" onPress={() => router.push('/register')} />
        <ProfileLink icon="bell" title="Notifications" subtitle="Membership and partner updates" onPress={() => router.push('/notifications')} />
        <ProfileLink icon="shield" title="Insurance & assistance" subtitle="A route for future cover support" onPress={() => router.push('/insurance')} />
        <ProfileLink icon="help-circle" title="Rider support" subtitle="View the support route" onPress={() => router.push('/support')} last />
      </Card>
      <View style={styles.attribution}>
        <Text style={[styles.attributionText, { color: colors.mutedForeground }]}>KrazyTrader · Phase 01 prototype</Text>
        <Text style={[styles.attributionText, { color: colors.mutedForeground }]}>By Rhea Technologies</Text>
      </View>
    </Page>
  );
}

function ProfileLink({ icon, title, subtitle, onPress, last = false }: { icon: React.ComponentProps<typeof Feather>['name']; title: string; subtitle: string; onPress: () => void; last?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.profileLink, !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.linkIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={18} color={colors.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.linkTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.linkSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  phone: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  location: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  sectionLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginTop: 24, marginBottom: 9, marginLeft: 2 },
  linksCard: { paddingVertical: 0, paddingHorizontal: 13 },
  profileLink: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 11 },
  linkIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  linkSubtitle: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  attribution: { alignItems: 'center', gap: 3, marginTop: 24 },
  attributionText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
