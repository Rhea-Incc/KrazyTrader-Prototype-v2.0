import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppButton, FeaturePlaceholder, Page } from '@/components/ui';

export default function InsuranceScreen() {
  const router = useRouter();
  return (
    <Page>
      <FeaturePlaceholder
        icon="shield"
        description="This route is reserved for insurance information and emergency assistance. There is no live insurer, policy purchase or emergency dispatch."
        nextPhase="Insurance & rider assistance"
      />
      <View style={{ height: 18 }} />
      <AppButton label="Explore member benefits" icon="gift" onPress={() => router.push('/benefits')} variant="secondary" />
    </Page>
  );
}
