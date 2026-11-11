import { Feather } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageStyle,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import type { DemoVehicle } from '@/data/demo';
import type { MemberBenefit, Membership, Notification, Rider, SACCO } from '@/types/models';
import { formatKes, formatShortDate } from '@/utils/format';
import { useColors } from '@/hooks/useColors';

type IconName = React.ComponentProps<typeof Feather>['name'];

export function Page({
  children,
  isTab = false,
  safeTop = isTab,
}: {
  children: React.ReactNode;
  isTab?: boolean;
  safeTop?: boolean;
}) {
  const colors = useColors();
  return (
    <SafeAreaView
      edges={safeTop ? ['top', 'left', 'right'] : ['left', 'right']}
      style={[styles.page, { backgroundColor: colors.background }]}
    >
      <KeyboardAwareScrollViewCompat
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        bottomOffset={20}
        contentContainerStyle={[
          styles.pageContent,
          {
            paddingTop: Platform.OS === 'web' && safeTop ? 67 : 16,
            paddingBottom: isTab ? (Platform.OS === 'web' ? 118 : 105) : Platform.OS === 'web' ? 34 : 30,
          },
        ]}
      >
        {children}
      </KeyboardAwareScrollViewCompat>
    </SafeAreaView>
  );
}

export function BrandHeader({ onNotifications, onProfile }: { onNotifications: () => void; onProfile: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.brandHeader}>
      <View style={styles.brandIdentity}>
        <View style={styles.brandLogoFrame}>
          <ExpoImage source={require('../assets/images/krazytrader-logo.png')} style={styles.brandLogo} contentFit="contain" cachePolicy="memory-disk" transition={100} />
        </View>
        <View>
          <Text style={[styles.brandName, { color: colors.foreground }]}>KrazyTrader</Text>
          <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>RIDER MEMBERSHIP</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <Pressable onPress={onProfile} accessibilityRole="button" accessibilityLabel="Open profile" style={styles.iconAction}>
          <Feather name="user" size={21} color={colors.foreground} />
        </Pressable>
        <Pressable onPress={onNotifications} accessibilityRole="button" accessibilityLabel="Open notifications" style={styles.iconAction}>
          <Feather name="bell" size={21} color={colors.foreground} />
          <View style={[styles.notificationDot, { backgroundColor: colors.lime, borderColor: colors.background }]} />
        </Pressable>
      </View>
    </View>
  );
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'lime';
  icon?: IconName;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const colors = useColors();
  const backgroundColor = variant === 'primary' ? colors.primary : variant === 'lime' ? colors.lime : colors.card;
  const color = variant === 'primary' ? colors.primaryForeground : colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor: variant === 'secondary' ? colors.border : backgroundColor },
        variant === 'secondary' && styles.secondaryButton,
        disabled && { opacity: 0.45 },
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={color} /> : null}
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useColors();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" style={styles.sectionAction}>
          <Text style={[styles.sectionActionText, { color: colors.primary }]}>{actionLabel}</Text>
          <Feather name="arrow-up-right" size={14} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const approved = status === 'Approved' || status === 'Active' || status === 'Available';
  const pending = status === 'Pending' || status === 'Submitted' || status === 'Pending verification' || status === 'Limited stock';
  const rejected = status === 'Rejected';
  const backgroundColor = approved ? colors.successSoft : pending || rejected ? colors.warningSoft : colors.muted;
  const color = approved ? colors.success : rejected ? colors.destructive : pending ? colors.warning : colors.mutedForeground;
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

export function SaccoCard({ sacco, membership }: { sacco: SACCO; membership: Membership }) {
  const colors = useColors();
  return (
    <Card style={styles.saccoCard}>
      <View style={styles.saccoTop}>
        <View style={[styles.saccoIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="users" size={19} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>{sacco.name}</Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>{sacco.town}, {sacco.county}</Text>
        </View>
        <StatusBadge status={membership.status} />
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.saccoBottom}>
        <View>
          <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>{membership.memberNumber ? 'MEMBER ID' : 'APPLICATION REF'}</Text>
          <Text style={[styles.metaValue, { color: colors.foreground }]}>{membership.memberNumber || membership.applicationReference || 'Pending assignment'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>MEMBERS</Text>
          <Text style={[styles.metaValue, { color: colors.foreground }]}>{sacco.memberCount.toLocaleString('en-KE')}</Text>
        </View>
      </View>
    </Card>
  );
}

export function VehicleCard({ vehicle, onPress, onFinance }: { vehicle: DemoVehicle; onPress: () => void; onFinance?: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => pressed && styles.pressed}>
        <View style={[styles.vehicleImageStage, { backgroundColor: '#FFFFFF' }]}>
          <ExpoImage source={vehicle.image} style={styles.vehicleImage} contentFit="contain" cachePolicy="memory-disk" transition={140} />
        </View>
        <View style={styles.productContent}>
          <View style={styles.productHeading}>
            <Text numberOfLines={1} style={[styles.productTitle, { color: colors.foreground }]}>{vehicle.name}</Text>
            <Feather name="arrow-up-right" size={17} color={colors.primary} />
          </View>
          <Text style={[styles.productCategory, { color: colors.mutedForeground }]}>{vehicle.category} · {vehicle.capacity}</Text>
          <View style={styles.productFooter}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>{formatKes(vehicle.priceKes)}</Text>
            <StatusBadge status={vehicle.availability} />
          </View>
        </View>
      </Pressable>
      {onFinance ? (
        <Pressable onPress={onFinance} accessibilityRole="button" style={[styles.financeAction, { borderTopColor: colors.border }]}>
          <Feather name="trending-up" size={15} color={colors.primary} />
          <Text style={[styles.financeActionText, { color: colors.primary }]}>Simulate financing</Text>
          <Feather name="arrow-right" size={15} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function BenefitCard({ benefit, onPress }: { benefit: MemberBenefit; onPress: () => void }) {
  const colors = useColors();
  const icon = benefit.category === 'Fuel' ? 'zap' : benefit.category === 'Insurance' ? 'shield' : benefit.category === 'Tyres' ? 'circle' : 'tool';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.benefitCard, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
      <View style={[styles.benefitIcon, { backgroundColor: colors.limeSoft }]}>
        <Feather name={icon} size={19} color={colors.primary} />
      </View>
      <View style={styles.benefitDetails}>
        <View style={styles.benefitTop}>
          <Text style={[styles.benefitTitle, { color: colors.foreground }]}>{benefit.title}</Text>
          <Feather name="arrow-up-right" size={16} color={colors.primary} />
        </View>
        <Text numberOfLines={2} style={[styles.benefitDescription, { color: colors.mutedForeground }]}>{benefit.description}</Text>
        <Text style={[styles.offerText, { color: colors.primary }]}>{benefit.offerLabel} · {benefit.availableIn}</Text>
      </View>
    </Pressable>
  );
}

export function NotificationItem({ item }: { item: Notification }) {
  const colors = useColors();
  const icon = item.type === 'Membership' ? 'check-circle' : item.type === 'Vehicle' ? 'truck' : item.type === 'Support' ? 'message-circle' : 'gift';
  return (
    <Card style={styles.notificationCard}>
      <View style={[styles.notificationIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.notificationHeading}>
          <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>{item.title}</Text>
          <Text style={[styles.notificationDate, { color: colors.mutedForeground }]}>{formatShortDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.notificationBody, { color: colors.mutedForeground }]}>{item.body}</Text>
      </View>
    </Card>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  ...inputProps
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        editable={!disabled}
        style={[styles.textField, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }, disabled && { opacity: 0.65 }]}
        {...inputProps}
      />
    </View>
  );
}

export function KenyanPhoneField({
  value,
  onChangeText,
  label = 'Mobile number',
}: {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={[styles.phoneField, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.phonePrefix, { color: colors.primary }]}>+254</Text>
        <View style={[styles.phoneDivider, { backgroundColor: colors.border }]} />
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/\D/g, '').replace(/^0/, '').slice(0, 9))}
          placeholder="700 123 456"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          maxLength={9}
          style={[styles.phoneInput, { color: colors.foreground }]}
          accessibilityLabel={`${label}, Kenya country code plus 254`}
        />
      </View>
    </View>
  );
}

export function CheckboxRow({
  checked,
  onPress,
  children,
}: {
  checked: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked }} style={styles.checkboxRow}>
      <View style={[styles.checkbox, { borderColor: checked ? colors.primary : colors.border, backgroundColor: checked ? colors.primary : colors.card }]}>
        {checked ? <Feather name="check" size={14} color={colors.primaryForeground} /> : null}
      </View>
      <Text style={[styles.checkboxLabel, { color: colors.foreground }]}>{children}</Text>
    </Pressable>
  );
}

export function DropdownField({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  const colors = useColors();
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <Pressable
        onPress={() => setVisible(true)}
        disabled={disabled}
        accessibilityRole="button"
        style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }, disabled && { opacity: 0.65 }]}
      >
        <Text style={[styles.dropdownText, { color: value ? colors.foreground : colors.mutedForeground }]}>{value || 'Select an option'}</Text>
        <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable onPress={() => setVisible(false)} style={[styles.modalScrim, { backgroundColor: colors.scrim }]}>
          <View style={[styles.optionSheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.dialogTitle, { color: colors.foreground }]}>{label}</Text>
            {options.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  onChange?.(option);
                  setVisible(false);
                }}
                style={[styles.optionRow, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.optionText, { color: colors.foreground }]}>{option}</Text>
                {option === value ? <Feather name="check" size={18} color={colors.primary} /> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Continue',
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const colors = useColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.modalScrim, { backgroundColor: colors.scrim }]}>
        <View style={[styles.dialog, { backgroundColor: colors.card }]}>
          <View style={[styles.dialogIcon, { backgroundColor: colors.limeSoft }]}>
            <Feather name="info" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.dialogTitle, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.dialogMessage, { color: colors.mutedForeground }]}>{message}</Text>
          <AppButton label={confirmLabel} onPress={onConfirm} />
          <AppButton label="Not now" onPress={onCancel} variant="secondary" />
        </View>
      </View>
    </Modal>
  );
}

export function EmptyState({ title, message, icon = 'inbox' }: { title: string; message: string; icon?: IconName }) {
  const colors = useColors();
  return (
    <View style={styles.stateBlock}>
      <View style={[styles.stateIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={22} color={colors.primary} /></View>
      <Text style={[styles.stateTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.stateMessage, { color: colors.mutedForeground }]}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.stateBlock}>
      <View style={[styles.stateIcon, { backgroundColor: colors.warningSoft }]}><Feather name="alert-circle" size={22} color={colors.warning} /></View>
      <Text style={[styles.stateTitle, { color: colors.foreground }]}>Something needs attention</Text>
      <Text style={[styles.stateMessage, { color: colors.mutedForeground }]}>{message}</Text>
      <AppButton label="Try again" onPress={onRetry} variant="secondary" />
    </View>
  );
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  const colors = useColors();
  return <View style={styles.loadingState}><ActivityIndicator color={colors.primary} /><Text style={[styles.loadingLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const colors = useColors();
  return (
    <View style={styles.pageTitle}>
      {eyebrow ? <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{eyebrow}</Text> : null}
      <Text style={[styles.pageTitleText, { color: colors.foreground }]}>{title}</Text>
      {subtitle ? <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function FeaturePlaceholder({
  icon,
  eyebrow = 'PHASE 01 PREVIEW',
  description,
  nextPhase,
}: {
  icon: IconName;
  eyebrow?: string;
  description: string;
  nextPhase: string;
}) {
  const colors = useColors();
  return (
    <View style={{ gap: 18 }}>
      <View style={[styles.featureIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={25} color={colors.primary} />
      </View>
      <View>
        <Text style={[styles.pageEyebrow, { color: colors.primary }]}>{eyebrow}</Text>
        <Text style={[styles.featureHeading, { color: colors.foreground }]}>This route is ready for the next step.</Text>
        <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <Card style={styles.phaseCard}>
        <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>PLANNED FOR</Text>
        <Text style={[styles.cardTitle, { color: colors.foreground, marginTop: 5 }]}>{nextPhase}</Text>
        <Text style={[styles.phaseNote, { color: colors.mutedForeground }]}>No real application, payment or service request is sent from this prototype.</Text>
      </Card>
    </View>
  );
}

export function MetaRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.metaRow, { borderBottomColor: colors.border }]}>
      <Text style={[styles.metaRowLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.metaRowValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

export function ProductHeroImage({ source, style }: { source: number; style?: StyleProp<ImageStyle> }) {
  const colors = useColors();
  return <ExpoImage source={source} contentFit="contain" cachePolicy="memory-disk" transition={140} style={[styles.productHeroImage, { backgroundColor: '#FFFFFF' }, style]} />;
}

export function DigitalMembershipCard({ rider, membership, sacco }: { rider: Rider; membership: Membership; sacco: SACCO }) {
  const colors = useColors();
  const cardNumber = membership.status === 'Active'
    ? membership.memberNumber || membership.applicationReference || 'Member number pending'
    : membership.applicationReference || 'Application reference pending';
  return (
    <View style={[styles.digitalCard, { backgroundColor: colors.primary }]}>
      <View style={styles.digitalTop}>
        <View>
          <Text style={[styles.digitalBrand, { color: colors.primaryForeground }]}>KrazyTrader</Text>
          <Text style={[styles.digitalCaption, { color: colors.primaryForeground }]}>RIDER MEMBERSHIP</Text>
        </View>
        <View style={[styles.digitalChip, { backgroundColor: colors.lime }]}>
          <Feather name="shield" size={18} color={colors.foreground} />
        </View>
      </View>
      <Text style={[styles.digitalLabel, { color: colors.primaryForeground }]}>{membership.status === 'Active' ? 'MEMBER NUMBER' : 'APPLICATION REFERENCE'}</Text>
      <Text style={[styles.digitalNumber, { color: colors.primaryForeground }]}>{cardNumber}</Text>
      <View style={styles.digitalBottom}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.digitalName, { color: colors.primaryForeground }]}>{rider.firstName} {rider.lastName}</Text>
          <Text style={[styles.digitalSacco, { color: colors.primaryForeground }]}>{sacco.name}</Text>
        </View>
        <StatusBadge status={membership.status} />
      </View>
      <View style={[styles.digitalAccent, { backgroundColor: colors.lime }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageContent: { paddingHorizontal: 20, alignSelf: 'center', width: '100%', maxWidth: 560, gap: 0 },
  brandHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  brandIdentity: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandLogoFrame: { width: 44, height: 40, borderRadius: 8, backgroundColor: '#FFFFFF', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  brandLogo: { width: 44, height: 36 },
  brandName: { fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: -0.4 },
  brandCaption: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 1.15, marginTop: 2 },
  iconAction: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', right: 9, top: 9, width: 9, height: 9, borderRadius: 5, borderWidth: 2 },
  button: { minHeight: 49, borderRadius: 15, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButton: { borderWidth: 1 },
  buttonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  card: { borderWidth: 1, borderRadius: 19, padding: 16, marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 11 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: -0.2 },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 4, paddingLeft: 8 },
  sectionActionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  badgeText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  saccoCard: { padding: 15 },
  saccoTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  saccoIcon: { width: 41, height: 41, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  cardSubtitle: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  divider: { height: 1, marginVertical: 14 },
  saccoBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.9 },
  metaValue: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 5 },
  productCard: { borderWidth: 1, borderRadius: 19, overflow: 'hidden', marginBottom: 4 },
  vehicleImageStage: { width: '100%', height: 180, padding: 12 },
  vehicleImage: { width: '100%', height: '100%' },
  productContent: { padding: 13, gap: 6 },
  productHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  productTitle: { flex: 1, fontSize: 13, fontFamily: 'Inter_700Bold' },
  productCategory: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  productPrice: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  financeAction: { minHeight: 44, paddingHorizontal: 13, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 8 },
  financeActionText: { flex: 1, fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  benefitCard: { borderWidth: 1, borderRadius: 19, padding: 15, flexDirection: 'row', gap: 12, marginBottom: 4 },
  benefitIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  benefitDetails: { flex: 1, gap: 5 },
  benefitTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  benefitTitle: { flex: 1, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  benefitDescription: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  offerText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  notificationCard: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  notificationIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notificationHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  notificationDate: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  notificationBody: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 5 },
  fieldWrap: { gap: 7, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  textField: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, fontSize: 14, fontFamily: 'Inter_400Regular' },
  phoneField: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  phonePrefix: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  phoneDivider: { width: 1, height: 23, marginHorizontal: 12 },
  phoneInput: { flex: 1, minHeight: 46, fontSize: 14, fontFamily: 'Inter_400Regular' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxLabel: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  dropdown: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  modalScrim: { flex: 1, justifyContent: 'center', padding: 22 },
  optionSheet: { borderRadius: 21, padding: 18 },
  optionRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth },
  optionText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  dialog: { borderRadius: 23, padding: 20, gap: 12 },
  dialogIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dialogTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  dialogMessage: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  stateBlock: { alignItems: 'center', paddingVertical: 28, gap: 9 },
  stateIcon: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stateTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  stateMessage: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', textAlign: 'center', maxWidth: 290 },
  loadingState: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 },
  loadingLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  pageTitle: { marginBottom: 18 },
  pageEyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.1, marginBottom: 7 },
  pageTitleText: { fontSize: 23, lineHeight: 29, fontFamily: 'Inter_700Bold', letterSpacing: -0.4 },
  pageSubtitle: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 6 },
  featureIcon: { width: 55, height: 55, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  featureHeading: { fontSize: 20, lineHeight: 27, fontFamily: 'Inter_700Bold', letterSpacing: -0.3 },
  phaseCard: { marginTop: 2 },
  phaseNote: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 8 },
  metaRow: { paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  metaRowLabel: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  metaRowValue: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'right', flexShrink: 1 },
  productHeroImage: { width: '100%', height: 255, borderRadius: 8 },
  digitalCard: { minHeight: 194, borderRadius: 23, padding: 18, overflow: 'hidden', justifyContent: 'space-between', marginBottom: 4 },
  digitalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  digitalBrand: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  digitalCaption: { fontSize: 8, fontFamily: 'Inter_600SemiBold', letterSpacing: 1.2, opacity: 0.75, marginTop: 3 },
  digitalChip: { width: 39, height: 39, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  digitalLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1, opacity: 0.72, marginTop: 17 },
  digitalNumber: { fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: 0.6, marginTop: 4 },
  digitalBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 17 },
  digitalName: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  digitalSacco: { fontSize: 10, fontFamily: 'Inter_400Regular', opacity: 0.82, marginTop: 4 },
  digitalAccent: { position: 'absolute', width: 144, height: 144, borderRadius: 72, right: -72, top: 87, opacity: 0.13 },
});
