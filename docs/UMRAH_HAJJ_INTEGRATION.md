# Umrah & Hajj Integration - SAFRGO Platform

## Overview
SAFRGO now supports Umrah and Hajj as first-class offer types alongside regular travel offers. This integration ensures that religious journeys are treated with the respect, trust, and special requirements they deserve.

---

## Database Schema

### Offer Type Enum
```sql
CREATE TYPE offer_type AS ENUM ('travel', 'umrah', 'hajj');
```

### New Fields in `offers` Table

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `offer_type` | `offer_type` | Yes | Type of offer: travel, umrah, or hajj |
| `season` | TEXT | For Umrah/Hajj | Season/period (e.g., "Ramadan 1447", "Hajj 1447") |
| `accommodation_details` | TEXT | For Umrah/Hajj | Detailed hotel information, distance from Haram |
| `transport_details` | TEXT | For Umrah/Hajj | Flight, internal transport details |
| `religious_program` | TEXT[] | Optional | Array of religious activities and schedules |

---

## Business Rules

### Verification Requirements
- **Regular Travel Offers**: Any active agency can create
- **Umrah Offers**: Only VERIFIED agencies
- **Hajj Offers**: Only VERIFIED agencies

### Validation Rules
Database trigger `validate_umrah_hajj_offer()` enforces:
1. Agency must be verified for Umrah/Hajj offers
2. Required fields must be filled:
   - `season`
   - `accommodation_details`
   - `transport_details`

---

## TypeScript Types

### OfferType
```typescript
export type OfferType = "travel" | "umrah" | "hajj"
```

### Offer Interface Updates
```typescript
export interface Offer {
  // ... existing fields
  offerType: OfferType
  // Umrah & Hajj specific fields
  season?: string
  accommodationDetails?: string
  transportDetails?: string
  religiousProgram?: string[]
}
```

---

## Agency Dashboard - Create Offer

### Offer Type Selection
- Dropdown with 3 options:
  - سفر عادي (Regular Travel)
  - عمرة (Umrah) - Disabled if agency not verified
  - حج (Hajj) - Disabled if agency not verified

### Conditional Fields
When offer type is Umrah or Hajj:

**Warning Message:**
```
مسؤولية خاصة
عروض العمرة/الحج تتطلب مستوى عالٍ من الأمانة والمسؤولية
```

**Additional Required Fields:**
1. **Season (الموسم / الفترة)**
   - Example: "Ramadan 1447", "Hajj 1447"

2. **Accommodation Details (تفاصيل الإقامة)**
   - Hotels near Haram
   - Star rating
   - Distance
   - Services

3. **Transport Details (تفاصيل النقل)**
   - Flight information
   - Internal buses
   - Airport transfers

4. **Religious Program (البرنامج الديني)**
   - Array of activities
   - Example: "زيارة غار حراء", "دروس دينية"

---

## User Experience

### Filters on Explore Page
Category filter includes:
- All
- **Umrah** (new)
- **Hajj** (new)
- Cultural
- Adventure
- Beach
- Wildlife
- Romance

### Filter Logic
```typescript
// Special handling for Umrah/Hajj
const matchesCategory =
  selectedCategory === "all" ||
  (selectedCategory === "umrah" && offer.offer_type === "umrah") ||
  (selectedCategory === "hajj" && offer.offer_type === "hajj") ||
  (selectedCategory !== "umrah" && selectedCategory !== "hajj" && 
   offer.category.toLowerCase() === selectedCategory.toLowerCase())
```

---

## Agency Profile Badge

### Display Logic
If agency has active Umrah or Hajj offers, show badge:

```
🛡️ Provides Umrah & Hajj Services
```

**Badge appears when:**
- `activeOffers.some((o) => o.offer_type === "umrah")` OR
- `activeOffers.some((o) => o.offer_type === "hajj")`

**Design:**
- Primary color badge
- Shield icon
- Positioned below agency name and location

---

## Migration Script

**File:** `scripts/017_add_offer_type_umrah_hajj.sql`

**What it does:**
1. Creates `offer_type` enum
2. Adds `offer_type` column to offers (default: 'travel')
3. Adds Umrah/Hajj specific columns
4. Creates indexes for performance
5. Adds constraint: Umrah/Hajj requires verified agency
6. Creates trigger to validate Umrah/Hajj requirements

**To apply:**
```bash
# Connect to your Supabase database
psql -h your-db-url -U postgres -d postgres

# Run the migration
\i scripts/017_add_offer_type_umrah_hajj.sql
```

---

## Design Philosophy

### Why Special Treatment?

1. **Trust-First**: Religious journeys require higher trust levels
2. **Verification Gate**: Only verified agencies can offer Umrah/Hajj
3. **Transparency**: Detailed information required (accommodation, transport)
4. **Respectful UX**: Calm design, minimal pricing emphasis
5. **Clear Separation**: Umrah/Hajj not mixed visually with leisure travel

### Visual Distinctions
- Special warning in creation form
- Trust-focused badges on agency profiles
- Dedicated filter categories
- Calm, respectful presentation

---

## Future Enhancements

### Potential Additions
1. **Umrah/Hajj Specific Reviews**: Separate review system for religious services
2. **Certification Display**: Show agency certifications for religious travel
3. **Guidance Content**: Educational content about Umrah/Hajj requirements
4. **Specialized Search**: Filter by season, accommodation level, group size
5. **Ministry Integration**: Verification against official religious tourism authorities

---

## Important Notes

### For Agencies
- Umrah/Hajj offers carry special responsibility
- All information must be accurate and honest
- Compliance with religious and legal requirements is mandatory
- Platform reserves right to remove misleading offers

### For Platform Administrators
- Verify agencies thoroughly before approving Umrah/Hajj offers
- Monitor quality and accuracy of religious journey offerings
- Act swiftly on any complaints or inaccuracies

---

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] TypeScript types compile without errors
- [ ] Non-verified agencies cannot select Umrah/Hajj
- [ ] Required fields validation works in form
- [ ] Umrah/Hajj offers appear in correct filters
- [ ] Agency badges display correctly
- [ ] Warning message shows for Umrah/Hajj creation
- [ ] Database trigger prevents unverified agencies from creating Umrah/Hajj

---

## Support

For questions or issues:
- Review database constraints if saves fail
- Check agency verification status
- Ensure all required fields are filled for Umrah/Hajj
- Verify migration script ran successfully

---

**Last Updated:** January 2026
**Version:** 1.0
