/**
 * SAFRGO Subscription Plans & Pricing
 * Professional pricing system with annual plans in DZD
 */

// ===========================
// SUBSCRIPTION PLANS
// ===========================

export const SUBSCRIPTION_PLANS = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
} as const

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]

// ===========================
// PRICING (Annual in DZD)
// ===========================

export const PRICING = {
  [SUBSCRIPTION_PLANS.STARTER]: {
    name: 'Starter',
    nameAr: 'المبتدئ',
    price: 15000,
    currency: 'DZD',
    period: 'annual',
    periodAr: 'سنوي',
    features: {
      offers: 10,
      profile: true,
      search: true,
      chat: true,
      qr: true,
      location: true,
      support: 'basic',
      badge: null,
      priority: 'normal',
      analytics: false,
      multipleStaff: false,
    },
    featuresListAr: [
      'ملف وكالة احترافي',
      'ظهور في نتائج البحث',
      'نشر حتى 10 عروض',
      'محادثة مع المسافرين',
      'رمز QR للوكالة',
      'موقع حقيقي على الخريطة',
      'دعم أساسي',
    ],
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    nameAr: 'المحترف',
    price: 30000,
    currency: 'DZD',
    period: 'annual',
    periodAr: 'سنوي',
    features: {
      offers: 50,
      profile: true,
      search: true,
      chat: true,
      qr: true,
      location: true,
      support: 'priority',
      badge: 'trusted',
      priority: 'high',
      analytics: true,
      multipleStaff: false,
    },
    featuresListAr: [
      'جميع ميزات المبتدئ +',
      'نشر حتى 50 عرض',
      'شارة "وكالة موثوقة"',
      'أولوية أعلى في الظهور',
      'تحليلات أساسية (المشاهدات، المحادثات)',
      'دعم سريع',
    ],
  },
  [SUBSCRIPTION_PLANS.BUSINESS]: {
    name: 'Business',
    nameAr: 'الأعمال',
    price: 50000,
    currency: 'DZD',
    period: 'annual',
    periodAr: 'سنوي',
    features: {
      offers: 999, // Effectively unlimited
      profile: true,
      search: true,
      chat: true,
      qr: true,
      location: true,
      support: 'premium',
      badge: 'verified',
      priority: 'highest',
      analytics: true,
      multipleStaff: true,
    },
    featuresListAr: [
      'جميع ميزات المحترف +',
      'عروض غير محدودة',
      'شارة "وكالة موثقة"',
      'صفحة وكالة مميزة',
      'تحليلات متقدمة',
      'عدة حسابات للموظفين',
      'دعم ذو أولوية',
    ],
  },
} as const

// ===========================
// HELPER FUNCTIONS
// ===========================

export function getPlanDetails(plan: SubscriptionPlan) {
  return PRICING[plan]
}

export function getOfferLimit(plan: SubscriptionPlan | null): number {
  if (!plan) return 0
  return PRICING[plan]?.features.offers || 0
}

export function formatPlanPrice(plan: SubscriptionPlan): string {
  const details = PRICING[plan]
  return `${details.price.toLocaleString('ar-DZ')} ${details.currency}`
}

export function getBadgeType(plan: SubscriptionPlan | null): 'trusted' | 'verified' | null {
  if (!plan) return null
  return PRICING[plan]?.features.badge || null
}

export function canCreateOffers(
  currentOfferCount: number,
  plan: SubscriptionPlan | null,
  subscriptionStatus: string
): boolean {
  if (subscriptionStatus !== 'active') return false
  if (!plan) return false
  
  const limit = getOfferLimit(plan)
  return currentOfferCount < limit
}

// ===========================
// SUBSCRIPTION STATUS
// ===========================

export const SUBSCRIPTION_STATUS = {
  NONE: 'none',
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
} as const

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS]

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SUBSCRIPTION_STATUS.NONE]: 'بدون اشتراك',
  [SUBSCRIPTION_STATUS.PENDING]: 'قيد المراجعة',
  [SUBSCRIPTION_STATUS.ACTIVE]: 'نشط',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'منتهي',
  [SUBSCRIPTION_STATUS.REJECTED]: 'مرفوض',
}

export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, string> = {
  [SUBSCRIPTION_STATUS.NONE]: 'gray',
  [SUBSCRIPTION_STATUS.PENDING]: 'yellow',
  [SUBSCRIPTION_STATUS.ACTIVE]: 'green',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'red',
  [SUBSCRIPTION_STATUS.REJECTED]: 'red',
}

// ===========================
// VALIDATION
// ===========================

export function isValidPlan(plan: string): plan is SubscriptionPlan {
  return Object.values(SUBSCRIPTION_PLANS).includes(plan as SubscriptionPlan)
}

export function hasActiveSubscription(status: string | null): boolean {
  return status === SUBSCRIPTION_STATUS.ACTIVE
}

// ===========================
// PAYMENT INFO
// ===========================

export const PAYMENT_INFO = {
  accountName: 'SAFRGO',
  accountNumber: '0020 0001 1234567890 12',
  bank: 'البنك الوطني الجزائري (BNA)',
  ccpNumber: '1234567 89',
  ccpName: 'بريد الجزائر CCP',
  instructions: [
    'قم بتحويل المبلغ إلى الحساب البنكي أو CCP المذكور أعلاه',
    'في خانة المرجع/البيان، اكتب: اسم وكالتك + اسم الخطة',
    'احتفظ بإيصال الدفع (وصل التحويل)',
    'ارفع صورة واضحة من الإيصال في الحقل أدناه',
    'سيتم مراجعة طلبك خلال 24-48 ساعة',
    'ستصلك رسالة بالبريد الإلكتروني عند الموافقة',
  ],
  note: 'مهم: يجب أن يكون الإيصال واضحاً ويحتوي على جميع التفاصيل (التاريخ، المبلغ، رقم العملية)',
}
