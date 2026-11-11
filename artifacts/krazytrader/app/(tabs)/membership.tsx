import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  AppButton,
  Card,
  DigitalMembershipCard,
  EmptyState,
  MetaRow,
  Page,
  PageTitle,
  SaccoCard,
  SectionHeader,
  StatusBadge,
} from '@/components/ui';
import { demoSaccos } from '@/data/demo';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';
import { formatShortDate } from '@/utils/format';

export default function MembershipScreen() {
  const colors = useColors();
  const router = useRouter();
  const { rider, membership } = useDemoApp();
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);
  const statusCopy = membership ? getStatusCopy(membership.status) : null;

  return (
    <Page isTab>
      <PageTitle eyebrow="YOUR COOPERATIVE" title="Membership" subtitle="Your SACCO connection, application reference and current status." />

      {!membership || !rider ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            title="No membership application yet"
            message="Register as a rider and choose one of the fictional SACCOs to create a local demonstration application."
            icon="users"
          />
          <AppButton label="Start rider registration" icon="user-plus" onPress={() => router.push('/register')} />
        </Card>
      ) : (
        <>
          {membership.status === 'Active' ? (
            <DigitalMembershipCard rider={rider} membership={membership} sacco={sacco ?? demoSaccos[0]} />
          ) : (
            <Card style={styles.applicationCard}>
              <View style={styles.statusTop}>
                <View style={[styles.memberIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="file-text" size={21} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>APPLICATION REFERENCE</Text>
                  <Text style={[styles.applicationReference, { color: colors.foreground }]}>{membership.applicationReference || 'Pending assignment'}</Text>
                </View>
                <StatusBadge status={membership.status} />
              </View>
              <Text style={[styles.statusDescription, { color: colors.mutedForeground }]}>A digital membership card is available only after the membership status becomes Active.</Text>
            </Card>
          )}
          <Card style={styles.statusCard}>
            <View style={styles.statusTop}>
              <View style={[styles.memberIcon, { backgroundColor: colors.limeSoft }]}>
                <Feather name={membership.status === 'Active' ? 'shield' : 'clock'} size={21} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>MEMBERSHIP STATUS</Text>
                <Text style={[styles.statusTitle, { color: colors.foreground }]}>{membership.status}</Text>
              </View>
              <StatusBadge status={membership.status} />
            </View>
            <Text style={[styles.statusDescription, { color: colors.mutedForeground }]}>{statusCopy?.body}</Text>
            <View style={[styles.verificationRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.smallLabel, { color: colors.mutedForeground }]}>DEMO VERIFICATION</Text>
              <Text style={[styles.verificationValue, { color: colors.foreground }]}>{membership.verificationStatus ?? 'Not started'}</Text>
            </View>
            {membership.status === 'Rejected' && membership.rejectionReason ? (
              <View style={[styles.rejectionNote, { backgroundColor: colors.warningSoft }]}>
                <Text style={[styles.rejectionText, { color: colors.warning }]}>{membership.rejectionReason}</Text>
              </View>
            ) : null}
          </Card>

          <SectionHeader title="Your SACCO" />
          <SaccoCard sacco={sacco ?? demoSaccos[0]} membership={membership} />
          <Card style={styles.detailsCard}>
            <MetaRow label="Rider" value={`${rider.firstName} ${rider.lastName}`} />
            <MetaRow label="Application number" value={membership.applicationReference || 'Not assigned'} />
            <MetaRow label="Submitted" value={formatShortDate(membership.submittedAt ?? membership.createdAt)} />
            <MetaRow label="Member number" value={membership.memberNumber || 'Assigned after activation'} />
            <View style={{ height: 2 }} />
          </Card>
          <View style={[styles.note, { backgroundColor: colors.secondary }]}>
            <Feather name="info" size={16} color={colors.primary} />
            <Text style={[styles.noteText, { color: colors.foreground }]}>Submission is not approval. Only an Active membership unlocks member-only benefits in this prototype.</Text>
          </View>
          {membership.status === 'Rejected' ? (
            <View style={styles.action}>
              <AppButton label="Start a new demo application" icon="refresh-cw" onPress={() => router.push('/register')} variant="secondary" />
            </View>
          ) : null}
          {membership.status === 'Inactive' ? (
            <View style={styles.action}>
              <AppButton label="View support route" icon="headphones" onPress={() => router.push('/support')} variant="secondary" />
            </View>
          ) : null}
        </>
      )}
    </Page>
  );
}

function getStatusCopy(status: string): { body: string } {
  if (status === 'Submitted') return { body: 'Your sample application has been received. It is not active and has not been approved.' };
  if (status === 'Pending verification') return { body: 'Your sample details are pending review. Member-only services stay locked until the status is Active.' };
  if (status === 'Active') return { body: 'Your sample membership is active. The membership card and member benefits are available in this demonstration.' };
  if (status === 'Rejected') return { body: 'This sample application was not accepted. Review the note below or start a new fictional application.' };
  return { body: 'This sample membership is inactive. Member-only services are not available.' };
}

const styles = StyleSheet.create({
  emptyCard: { padding: 16 },
  applicationCard: { padding: 16, marginBottom: 12 },
  statusCard: { padding: 17, marginTop: 14 },
  statusTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  memberIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  smallLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.9 },
  statusTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 4 },
  applicationReference: { fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 4 },
  statusDescription: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginVertical: 14 },
  verificationRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verificationValue: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  rejectionNote: { padding: 11, borderRadius: 12, marginTop: 12 },
  rejectionText: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
  detailsCard: { paddingHorizontal: 15, paddingVertical: 1 },
  note: { flexDirection: 'row', gap: 9, padding: 13, borderRadius: 14, marginTop: 12 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_500Medium' },
  action: { marginTop: 12 },
});
