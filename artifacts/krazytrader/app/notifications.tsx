import { useRouter } from 'expo-router';
import { Text } from 'react-native';
import { AppButton, EmptyState, NotificationItem, Page, PageTitle } from '@/components/ui';
import { demoNotifications } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function NotificationsScreen() {
  const colors = useColors();
  const router = useRouter();
  return (
    <Page>
      <PageTitle eyebrow="RIDER UPDATES" title="Notifications" subtitle="Sample updates from your membership network." />
      {demoNotifications.length === 0 ? (
        <EmptyState title="You’re all caught up" message="New membership and partner updates will appear here." icon="bell" />
      ) : (
        demoNotifications.map((item) => <NotificationItem key={item.id} item={item} />)
      )}
      <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 5, marginBottom: 15 }}>
        These are sample notifications. Push notifications are not enabled in this phase.
      </Text>
      <AppButton label="Back to home" icon="home" onPress={() => router.replace('/')} variant="secondary" />
    </Page>
  );
}
