import { Feather } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, CheckboxRow, KenyanPhoneField, Page, TextField } from '@/components/ui';
import { isValidKenyanPhone, useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isAuthenticated, isLoading, login, storageError } = useDemoApp();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [stage, setStage] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <Page safeTop><Text style={{ color: colors.mutedForeground }}>Loading your demo session…</Text></Page>;
  if (isAuthenticated) return <Redirect href="/" />;

  const requestDemoCode = () => {
    setError('');
    if (!isValidKenyanPhone(phone)) {
      setError('Enter a valid 9-digit Kenyan mobile number.');
      return;
    }
    if (!termsAccepted) {
      setError('Acknowledge the Terms and Privacy notice to continue.');
      return;
    }
    setStage('code');
  };

  const verifyDemoCode = async () => {
    setError('');
    if (code !== '123456') {
      setError('That demo code does not match. Use 123456.');
      return;
    }
    setSubmitting(true);
    try {
      await login(phone, termsAccepted);
      router.replace('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page safeTop>
      <View style={styles.brand}>
        <Image source={require('../assets/images/krazytrader-logo.png')} style={styles.logo} resizeMode="contain" />
        <View>
          <Text style={[styles.brandName, { color: colors.foreground }]}>KrazyTrader</Text>
          <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>RIDER MEMBERSHIP</Text>
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR RIDE. YOUR NETWORK.</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Good to have you here.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A trusted place for rider membership, cooperative support and everyday opportunities.</Text>
      </View>

      {storageError ? (
        <Card style={[styles.errorCard, { borderColor: colors.warning }]}>
          <Text style={[styles.errorText, { color: colors.warning }]}>{storageError}</Text>
        </Card>
      ) : null}

      {stage === 'phone' ? (
        <>
          <KenyanPhoneField value={phone} onChangeText={setPhone} label="Kenyan mobile number" />
          <CheckboxRow checked={termsAccepted} onPress={() => setTermsAccepted((value) => !value)}>
            I acknowledge the demo Terms and Privacy notice.
          </CheckboxRow>
          {error ? <InlineError message={error} /> : null}
          <AppButton label="Continue" icon="arrow-right" onPress={requestDemoCode} />
          <View style={styles.separator}>
            <View style={[styles.rule, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.mutedForeground }]}>OR</Text>
            <View style={[styles.rule, { backgroundColor: colors.border }]} />
          </View>
          <AppButton label="Create a rider account" icon="user-plus" onPress={() => router.push('/register')} variant="secondary" />
          <Card style={styles.demoCard}>
            <View style={[styles.demoIcon, { backgroundColor: colors.limeSoft }]}>
              <Feather name="info" size={17} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.demoTitle, { color: colors.foreground }]}>Demonstration mode</Text>
              <Text style={[styles.demoText, { color: colors.mutedForeground }]}>No SMS is sent. Use any valid Kenyan number with code 123456.</Text>
              <Text style={[styles.demoCredential, { color: colors.primary }]}>Active sample rider: 700 123 456</Text>
            </View>
          </Card>
        </>
      ) : (
        <>
          <View style={[styles.backRow, { borderBottomColor: colors.border }]}>
            <AppButton label="Change number" icon="arrow-left" onPress={() => { setStage('phone'); setError(''); }} variant="secondary" />
          </View>
          <Text style={[styles.codeTitle, { color: colors.foreground }]}>Enter your demo code</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A real text message was not sent. Enter the code shown below to continue.</Text>
          <Card style={styles.codeCard}>
            <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>REPEATABLE DEMO CODE</Text>
            <Text style={[styles.codeValue, { color: colors.primary }]}>123456</Text>
          </Card>
          <TextField
            label="Six-digit verification code"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            textContentType="oneTimeCode"
          />
          {error ? <InlineError message={error} /> : null}
          <AppButton label={submitting ? 'Checking…' : 'Verify and continue'} icon="check" disabled={submitting} onPress={() => void verifyDemoCode()} />
        </>
      )}

      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>Rhea Technologies · KrazyTrader Phase 02 prototype</Text>
    </Page>
  );
}

function InlineError({ message }: { message: string }) {
  const colors = useColors();
  return (
    <View style={[styles.inlineError, { backgroundColor: colors.warningSoft }]}>
      <Feather name="alert-circle" size={16} color={colors.warning} />
      <Text style={[styles.errorText, { color: colors.warning }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 11, marginBottom: 36 },
  logo: { width: 54, height: 48 },
  brandName: { fontSize: 18, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  brandCaption: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginTop: 3 },
  intro: { marginBottom: 24 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.1, marginBottom: 9 },
  title: { fontSize: 29, lineHeight: 35, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 8 },
  errorCard: { padding: 12, marginBottom: 14 },
  errorText: { flex: 1, fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' },
  inlineError: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 13, marginVertical: 10 },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  rule: { flex: 1, height: 1 },
  orText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  demoCard: { flexDirection: 'row', gap: 10, marginTop: 19, padding: 14 },
  demoIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  demoTitle: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  demoText: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  demoCredential: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 5 },
  footnote: { fontSize: 10, textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 28, marginBottom: 6 },
  backRow: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 14, marginBottom: 19, alignItems: 'flex-start' },
  codeTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 3 },
  codeCard: { marginTop: 17, marginBottom: 14, alignItems: 'center', padding: 15 },
  codeLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  codeValue: { fontSize: 27, letterSpacing: 5, fontFamily: 'Inter_700Bold', marginTop: 5 },
});
