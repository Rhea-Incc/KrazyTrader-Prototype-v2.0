import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, DropdownField, Page, PageTitle, ProductHeroImage, StatusBadge, TextField } from '@/components/ui';
import { isValidKenyanPhone, useDemoApp } from '@/context/DemoAppContext';
import { demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKes } from '@/utils/format';

const annualDemoRate = 0.14;

export default function FinancingScreen() {
  const colors = useColors();
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const { currentPhone, rider, financingApplications, submitFinancingApplication } = useDemoApp();
  const vehicle = demoVehicles.find((item) => item.id === vehicleId) ?? demoVehicles[0];
  const [depositInput, setDepositInput] = useState(() => String(Math.round(vehicle.priceKes * 0.2)));
  const [term, setTerm] = useState('24 months');
  const [applicantName, setApplicantName] = useState(rider ? `${rider.firstName} ${rider.lastName}` : '');
  const [phone, setPhone] = useState(rider?.phone ?? currentPhone ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    setDepositInput(String(Math.round(vehicle.priceKes * 0.2)));
    setReference(null);
    setError('');
  }, [vehicle.id, vehicle.priceKes]);

  const depositKes = Number(depositInput.replace(/[^\d]/g, '')) || 0;
  const requestedAmountKes = Math.max(0, vehicle.priceKes - depositKes);
  const termMonths = Number.parseInt(term, 10) || 24;
  const totalWithDemoInterest = requestedAmountKes * (1 + annualDemoRate * termMonths / 12);
  const monthlyEstimateKes = Math.ceil(totalWithDemoInterest / termMonths);
  const existingApplication = [...financingApplications].reverse().find((item) => item.vehicleId === vehicle.id);

  const submit = async () => {
    setError('');
    setReference(null);
    if (!applicantName.trim()) {
      setError('Enter the applicant name to continue.');
      return;
    }
    if (!isValidKenyanPhone(phone)) {
      setError('Enter a valid Kenyan mobile number.');
      return;
    }
    if (depositKes < 0 || depositKes >= vehicle.priceKes) {
      setError('The deposit must be less than the vehicle price.');
      return;
    }

    setSubmitting(true);
    try {
      const applicationReference = await submitFinancingApplication({
        vehicleId: vehicle.id,
        applicantName,
        phone,
        requestedAmountKes,
        depositKes,
        termMonths,
        estimatedMonthlyPaymentKes: monthlyEstimateKes,
      });
      setReference(applicationReference);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The demo application could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <PageTitle eyebrow="DEMO FINANCING" title="Plan the purchase" subtitle="Explore a sample repayment estimate and save a fictional application on this device." />

      <Card style={styles.vehicleSummary}>
        <ProductHeroImage source={vehicle.image} style={styles.vehicleImage} />
        <View style={styles.vehicleHeading}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.vehicleName, { color: colors.foreground }]}>{vehicle.name}</Text>
            <Text style={[styles.vehicleCategory, { color: colors.mutedForeground }]}>{vehicle.category} · {vehicle.capacity}</Text>
          </View>
          <StatusBadge status={vehicle.availability} />
        </View>
        <Text style={[styles.vehiclePrice, { color: colors.primary }]}>{formatKes(vehicle.priceKes)}</Text>
        <AppButton label="Choose another vehicle" icon="repeat" onPress={() => router.push('/vehicles')} variant="secondary" />
      </Card>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Adjust your estimate</Text>
        <Text style={[styles.sectionSubTitle, { color: colors.mutedForeground }]}>All amounts shown in Kenyan shillings.</Text>
      </View>
      <TextField
        label="Deposit amount (KES)"
        value={depositInput}
        onChangeText={(value) => { setDepositInput(value.replace(/[^\d]/g, '')); setError(''); setReference(null); }}
        keyboardType="number-pad"
        placeholder="e.g. 75000"
      />
      <DropdownField label="Repayment period" value={term} options={['12 months', '24 months', '36 months', '48 months']} onChange={(value) => { setTerm(value); setReference(null); }} />

      <Card style={styles.estimateCard}>
        <View style={styles.estimateHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.estimateEyebrow, { color: colors.mutedForeground }]}>ILLUSTRATIVE MONTHLY PAYMENT</Text>
            <Text style={[styles.monthlyAmount, { color: colors.primary }]}>{formatKes(monthlyEstimateKes)}<Text style={[styles.monthlySuffix, { color: colors.mutedForeground }]}> / month</Text></Text>
          </View>
          <View style={[styles.estimateIcon, { backgroundColor: colors.limeSoft }]}><Feather name="trending-up" size={19} color={colors.primary} /></View>
        </View>
        <View style={[styles.breakdown, { borderTopColor: colors.border }]}>
          <BreakdownRow label="Vehicle price" value={formatKes(vehicle.priceKes)} />
          <BreakdownRow label="Your deposit" value={formatKes(depositKes)} />
          <BreakdownRow label="Demo amount financed" value={formatKes(requestedAmountKes)} />
          <BreakdownRow label="Repayment period" value={`${termMonths} months`} />
        </View>
        <Text style={[styles.rateNote, { color: colors.mutedForeground }]}>Estimate uses a fictional 14% flat annual rate. It is not a lender quote or offer.</Text>
      </Card>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Save a demo application</Text>
        <Text style={[styles.sectionSubTitle, { color: colors.mutedForeground }]}>No credit check is performed and nothing is sent to a lender.</Text>
      </View>
      <TextField label="Applicant name" value={applicantName} onChangeText={(value) => { setApplicantName(value); setError(''); setReference(null); }} placeholder="Full name" autoCapitalize="words" />
      <TextField label="Kenyan mobile number" value={phone} onChangeText={(value) => { setPhone(value); setError(''); setReference(null); }} placeholder="+254 700 123 456" keyboardType="phone-pad" />
      {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
      {reference ? (
        <Card style={[styles.confirmation, { backgroundColor: colors.successSoft, borderColor: colors.successSoft }]}>
          <Feather name="check-circle" size={20} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.confirmationTitle, { color: colors.foreground }]}>Demo application saved</Text>
            <Text style={[styles.confirmationBody, { color: colors.mutedForeground }]}>{reference} · Submitted on this device only</Text>
          </View>
        </Card>
      ) : existingApplication ? (
        <Card style={styles.existingApplication}>
          <StatusBadge status={existingApplication.status} />
          <Text style={[styles.existingReference, { color: colors.mutedForeground }]}>{existingApplication.applicationReference ?? 'Previous demo application'} · {formatKes(existingApplication.estimatedMonthlyPaymentKes ?? 0)} / month</Text>
        </Card>
      ) : null}
      <AppButton label={submitting ? 'Saving…' : 'Save demo application'} icon="check" onPress={() => void submit()} disabled={submitting} />
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Fictional workflow only. No credit bureau, lender, dealer, payment or production service is contacted.</Text>
    </Page>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.breakdownRow}>
      <Text style={[styles.breakdownLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.breakdownValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  vehicleSummary: { padding: 12, gap: 10 },
  vehicleImage: { height: 190 },
  vehicleHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  vehicleName: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  vehicleCategory: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  vehiclePrice: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  sectionHeading: { marginTop: 22, marginBottom: 13 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionSubTitle: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  estimateCard: { marginTop: 4, padding: 15 },
  estimateHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  estimateEyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  monthlyAmount: { fontSize: 24, lineHeight: 31, fontFamily: 'Inter_700Bold', marginTop: 4 },
  monthlySuffix: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  estimateIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  breakdown: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12, paddingTop: 7 },
  breakdownRow: { minHeight: 33, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  breakdownLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  breakdownValue: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  rateNote: { fontSize: 10, lineHeight: 15, marginTop: 7 },
  error: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium', marginBottom: 10 },
  confirmation: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginBottom: 12 },
  confirmationTitle: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  confirmationBody: { fontSize: 10, lineHeight: 15, marginTop: 3 },
  existingApplication: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  existingReference: { flex: 1, fontSize: 10, lineHeight: 15, textAlign: 'right' },
  disclaimer: { fontSize: 10, lineHeight: 15, marginTop: 12, textAlign: 'center' },
});
