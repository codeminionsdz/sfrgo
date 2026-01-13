# Umrah & Hajj - UI/UX Guide

## 🎨 Visual Components Overview

### 1. Agency Dashboard - Offer Creation Form

#### Offer Type Dropdown
```
┌─────────────────────────────────────┐
│ نوع العرض *                          │
├─────────────────────────────────────┤
│ ▼ سفر عادي                          │
│   سفر عادي                          │
│   عمرة (للوكالات الموثقة فقط) 🔒    │
│   حج (للوكالات الموثقة فقط) 🔒      │
└─────────────────────────────────────┘
```

#### Warning Message (Umrah/Hajj Selected)
```
╔═══════════════════════════════════════════════════╗
║  ⚠️  مسؤولية خاصة                                 ║
║                                                   ║
║  عروض العمرة/الحج تتطلب مستوى عالٍ من الأمانة   ║
║  والمسؤولية. يرجى التأكد من صحة جميع المعلومات  ║
║  والالتزام بالمعايير الدينية والقانونية.        ║
╚═══════════════════════════════════════════════════╝
```

#### Conditional Fields (Umrah/Hajj Only)
```
┌────────────────────────────────────────────────┐
│  ✓ معلومات العمرة                              │
├────────────────────────────────────────────────┤
│  الموسم / الفترة *                             │
│  [رمضان 1447]                                  │
│                                                │
│  تفاصيل الإقامة *                              │
│  ┌──────────────────────────────────────────┐  │
│  │ فندق 5 نجوم - 100م من الحرم             │  │
│  │ غرف مكيفة - إفطار مجاني                 │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  تفاصيل النقل *                                │
│  ┌──────────────────────────────────────────┐  │
│  │ طيران مباشر - الخطوط السعودية           │  │
│  │ حافلات مكيفة للتنقل الداخلي             │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  البرنامج الديني                              │
│  [زيارة غار حراء] [دروس دينية] [+]          │
│  [________________________] [إضافة]           │
└────────────────────────────────────────────────┘
```

---

### 2. Explore Page - Filters

#### Category Filter Bar
```
┌─────────────────────────────────────────────────────────┐
│  [All] [Umrah] [Hajj] [Cultural] [Adventure] [Beach]   │
└─────────────────────────────────────────────────────────┘
     ↑      ↑       ↑
   Globe  Badge   Badge
   icon   Check   Check
```

#### Filter Pills (Active State)
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ ✓ Umrah  │  │   Hajj   │  │   All    │
└──────────┘  └──────────┘  └──────────┘
  Primary      Default       Default
   color
```

---

### 3. Agency Profile - Umrah/Hajj Badge

#### Badge Placement
```
┌─────────────────────────────────────────────────┐
│  [Logo]                                         │
│                                                 │
│  مكتب الأحلام السياحي ✓                        │
│  📍 الرياض، السعودية                           │
│                                                 │
│  ┌─────────────────────────────────────┐        │
│  │ 🛡️ Provides Umrah & Hajj Services │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  [Follow] [Message]                             │
└─────────────────────────────────────────────────┘
```

#### Badge Variations
```
Single Service:
┌─────────────────────────────┐
│ 🛡️ Provides Umrah Services │
└─────────────────────────────┘

Both Services:
┌──────────────────────────────────┐
│ 🛡️ Provides Umrah & Hajj Services │
└──────────────────────────────────┘
```

---

### 4. Offer Card Appearance

#### Regular Travel Offer
```
┌─────────────────────────┐
│  [Beach Image]          │
│  $1,200                 │
├─────────────────────────┤
│  Beach Paradise         │
│  📍 Maldives  🕐 7 days │
│  🏷️ Beach               │
└─────────────────────────┘
```

#### Umrah Offer (Trust-Focused)
```
┌─────────────────────────┐
│  [Kaaba Image]          │
│  $2,500 ✓               │
├─────────────────────────┤
│  Umrah Ramadan 1447     │
│  📍 Makkah  🕐 10 days  │
│  🛡️ Umrah               │
└─────────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors (Trust & Religious)
```css
--primary: hsl(var(--primary))         /* Blue/Trust color */
--primary-10: rgba(primary, 0.1)       /* Light background */
--primary-20: rgba(primary, 0.2)       /* Border color */
```

### Usage
- **Badge Background**: `bg-primary/10`
- **Badge Border**: `border-primary/20`
- **Badge Text**: `text-primary`
- **Shield Icon**: `text-primary`

---

## 📏 Spacing & Sizing

### Badge Component
```
Padding: px-3 py-1.5 (12px 6px)
Border Radius: rounded-full
Icon Size: w-4 h-4 (16px)
Text Size: text-sm (14px)
Font Weight: font-medium (500)
Gap: gap-2 (8px)
```

### Form Section
```
Card Border Left: border-l-4
Border Color: border-l-primary
Icon Size: w-5 h-5 (20px)
Section Gap: space-y-4 (16px)
```

### Warning Box
```
Padding: p-4 (16px)
Border Radius: rounded-lg
Background: bg-primary/5
Border: border border-primary/20
Icon Size: w-5 h-5 (20px)
Icon Position: flex-shrink-0 mt-0.5
```

---

## 📱 Responsive Behavior

### Desktop (lg+)
- Badge inline with agency name and location
- Full form with side-by-side fields
- Filter pills in single row

### Tablet (md)
- Badge below location
- Form fields stacked
- Filter pills wrap to 2 rows

### Mobile (sm)
- Badge full width below name
- All fields stacked
- Filter pills scrollable horizontal

---

## ♿ Accessibility

### ARIA Labels
```tsx
<Select aria-label="Offer type selection">
  <SelectItem value="umrah" aria-disabled={!verified}>
    Umrah (Verified agencies only)
  </SelectItem>
</Select>

<div role="alert" aria-live="polite">
  ⚠️ Special responsibility warning
</div>
```

### Keyboard Navigation
- Tab through form fields
- Enter to submit
- Arrow keys in dropdowns
- Space to toggle checkboxes

### Screen Reader Support
- Badge announces: "Provides Umrah and Hajj Services"
- Warning announces: "Alert: Special responsibility"
- Disabled options announce: "Verified agencies only"

---

## 🎭 Animation & Transitions

### Badge Appearance
```css
transition: shadow 200ms ease-in-out
hover: shadow-md
```

### Warning Box
```css
/* Fade in when Umrah/Hajj selected */
animation: fadeIn 300ms ease-in
```

### Filter Pills
```css
transition: all 200ms ease
hover: scale-105
active: scale-95
```

---

## 🖼️ Icon Usage

### Shield Icon (🛡️)
- **Component**: `<Shield className="w-4 h-4 text-primary" />`
- **Usage**: Trust, security, religious services
- **Color**: Always primary color

### Badge Check Icon (✓)
- **Component**: `<BadgeCheck className="w-5 h-5 text-primary" />`
- **Usage**: Verification, categories
- **Color**: Primary for religious, default for others

### Alert Circle Icon (⚠️)
- **Component**: `<AlertCircle className="w-5 h-5 text-primary" />`
- **Usage**: Warnings, important notices
- **Color**: Primary for information, warning for errors

---

## 📐 Component Hierarchy

### Offer Creation Form
```
Form Container
├── Offer Type Section (NEW)
│   ├── Dropdown
│   └── Warning (conditional)
├── Basic Info Section
│   ├── Title
│   ├── Destination
│   ├── Duration
│   ├── Price
│   └── Category
├── Umrah/Hajj Section (NEW, conditional)
│   ├── Season
│   ├── Accommodation Details
│   ├── Transport Details
│   └── Religious Program
├── Includes Section
└── Excludes Section
```

### Agency Profile
```
Profile Container
├── Cover Image
├── Logo & Info
│   ├── Name + Verification Badge
│   ├── Location
│   └── Umrah/Hajj Badge (NEW, conditional)
├── Action Buttons
└── About & Offers
```

---

## 🎯 Design Principles

### For Umrah/Hajj Offers
1. **Trust First**: Shield icon, verified badge, calm colors
2. **Information Rich**: Detailed accommodation and transport
3. **Respectful**: No flashy design, minimal price emphasis
4. **Clear Responsibility**: Warning message, required fields
5. **Professional**: Clean layout, proper typography

### Visual Hierarchy
```
1. Verification Status (most important)
2. Umrah/Hajj Badge
3. Offer Details
4. Pricing (less emphasized than regular travel)
5. Actions
```

---

## 🔄 State Management

### Form States
```typescript
// Offer type selection
const [offerType, setOfferType] = useState<"travel" | "umrah" | "hajj">("travel")

// Conditional rendering
{offerType !== "travel" && <UmrahHajjFields />}

// Validation
if (offerType !== "travel" && !season) {
  showError("Season required for Umrah/Hajj")
}
```

### Badge Display Logic
```typescript
const providesUmrah = offers.some(o => o.offer_type === "umrah")
const providesHajj = offers.some(o => o.offer_type === "hajj")
const showBadge = providesUmrah || providesHajj
```

---

**Style Guide Version:** 1.0
**Last Updated:** January 2026
**Framework:** Next.js 14 + Tailwind CSS + shadcn/ui
