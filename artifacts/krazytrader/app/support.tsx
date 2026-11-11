import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppButton, FeaturePlaceholder, Page } from '@/components/ui';

export default function SupportScreen() {
  const router = useRouter();
  return (
    <Page>
      <FeaturePlaceholder
        icon="headphones"
        description="A dedicated place for rider questions, membership guidance and service issues. This preview does not send a support request."
        nextPhase="Rider support"
      />
      <View style={{ height: 18 }} />
      <AppButton label="Return to your profile" icon="user" onPress={() => router.push('/profile')} variant="secondary" />
    </Page>
  );
}
