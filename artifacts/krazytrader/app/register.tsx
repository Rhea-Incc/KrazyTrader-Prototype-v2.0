import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card, DropdownField, FeaturePlaceholder, Page, TextField } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

export default function RegistrationScreen() {
  const colors = useColors();
  const [county, setCounty] = useState('');
  return (
    <Page>
      <FeaturePlaceholder
        icon="user-plus"
        description="This route confirms where rider onboarding will live. The form below is a component preview only; it does not save or submit rider information."
        nextPhase="Rider onboarding"
      />
      <Card style={styles.formPreview}>
        <Text style={[styles.previewTitle, { color: colors.foreground }]}>Form components</Text>
        <TextField label="Rider name" value="" placeholder="Your full name" disabled />
        <DropdownField label="County" value={county} options={['Nakuru', 'Nairobi', 'Kiambu']} onChange={setCounty} disabled />
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  formPreview: { marginTop: 18 },
  previewTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 14 },
});
