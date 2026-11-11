import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, DropdownField, Page, TextField } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';
import type { VehicleCategory } from '@/types/models';

const counties = ['Nakuru', 'Nairobi', 'Kiambu', 'Mombasa', 'Uasin Gishu', 'Kisumu', 'Machakos'];
const occupations = ['Boda-boda rider', 'Delivery rider', 'Three-wheeler operator', 'Other'];
const vehicleCategories: VehicleCategory[] = ['Two-wheeler', 'Three-wheeler'];

export default function EditProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const { rider, updateRider, storageError } = useDemoApp();
  const [firstName, setFirstName] = useState(rider?.firstName ?? '');
  const [lastName, setLastName] = useState(rider?.lastName ?? '');
  const [email, setEmail] = useState(rider?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(rider?.dateOfBirth ?? '');
  const [county, setCounty] = useState(rider?.county ?? '');
  const [town, setTown] = useState(rider?.town ?? '');
  const [occupation, setOccupation] = useState(rider?.occupation ?? '');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>(rider?.vehicleCategory ?? 'Two-wheeler');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!firstName.trim() || !lastName.trim() || !county || !town.trim() || !occupation) {
      setError('Complete your name, county, operating area and occupation.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address or leave it blank.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateRider({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim() || undefined,
        dateOfBirth: dateOfBirth.trim() || undefined,
        county,
        town: town.trim(),
        occupation,
        vehicleCategory,
      });
      router.back();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Your demo profile could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Text style={[styles.title, { color: colors.foreground }]}>Edit rider details</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Changes are saved locally on this device. Your mobile number and SACCO association are read-only here.</Text>
      {storageError ? <Card style={{ borderColor: colors.warning }}><Text style={{ color: colors.warning, fontSize: 11 }}>{storageError}</Text></Card> : null}
      {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
      <TextField label="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
      <TextField label="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" />
      <TextField label="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextField label="Date of birth (demo value)" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" />
      <DropdownField label="County" value={county} options={counties} onChange={setCounty} />
      <TextField label="Town or operating area" value={town} onChangeText={setTown} autoCapitalize="words" />
      <DropdownField label="Occupation" value={occupation} options={occupations} onChange={setOccupation} />
      <DropdownField label="Vehicle category" value={vehicleCategory} options={vehicleCategories} onChange={(value) => setVehicleCategory(value as VehicleCategory)} />
      <View style={styles.readOnlyRows}>
        <Card>
          <Text style={[styles.readOnlyLabel, { color: colors.mutedForeground }]}>MOBILE NUMBER</Text>
          <Text style={[styles.readOnlyValue, { color: colors.foreground }]}>{rider?.phone ?? 'Not set'}</Text>
        </Card>
        <Card>
          <Text style={[styles.readOnlyLabel, { color: colors.mutedForeground }]}>SACCO ASSOCIATION</Text>
          <Text style={[styles.readOnlyValue, { color: colors.foreground }]}>{rider?.saccoId ?? 'Not set'}</Text>
        </Card>
      </View>
      <AppButton label={saving ? 'Saving…' : 'Save profile changes'} icon="check" onPress={() => void save()} disabled={saving} />
    </Page>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 21, lineHeight: 27, fontFamily: 'Inter_700Bold', marginTop: 8 },
  subtitle: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 5, marginBottom: 19 },
  error: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium', marginBottom: 12 },
  readOnlyRows: { gap: 8, marginBottom: 16 },
  readOnlyLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.9 },
  readOnlyValue: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 5 },
});
