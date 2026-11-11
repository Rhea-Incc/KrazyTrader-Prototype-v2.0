import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppButton, FeaturePlaceholder, Page } from '@/components/ui';

export default function FinancingScreen() {
  const router = useRouter();
  return (
    <Page>
      <FeaturePlaceholder
        icon="trending-up"
        description="This route is the starting point for future vehicle financing information and applications. No lender connection or credit application is active."
        nextPhase="Vehicle acquisition & financing"
      />
      <View style={{ height: 18 }} />
      <AppButton label="Browse sample vehicles" icon="truck" onPress={() => router.push('/vehicles')} variant="secondary" />
    </Page>
  );
}
