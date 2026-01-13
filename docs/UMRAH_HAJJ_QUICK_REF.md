# Umrah & Hajj Quick Reference

## ✅ Implementation Checklist

### 1. Database
```bash
# Run migration
psql -h your-db-url -U postgres -d postgres < scripts/017_add_offer_type_umrah_hajj.sql
```

### 2. Offer Types
```typescript
type OfferType = "travel" | "umrah" | "hajj"
```

### 3. Who Can Create What?
| Agency Status | Travel | Umrah | Hajj |
|--------------|--------|-------|------|
| Active | ✅ | ❌ | ❌ |
| Verified | ✅ | ✅ | ✅ |

### 4. Required Fields for Umrah/Hajj
- ✅ All regular offer fields
- ✅ Season (الموسم)
- ✅ Accommodation Details (تفاصيل الإقامة)
- ✅ Transport Details (تفاصيل النقل)
- ⚪ Religious Program (optional)

---

## 🎯 Quick Access

### Files Modified
```
✅ scripts/017_add_offer_type_umrah_hajj.sql
✅ lib/types.ts
✅ components/agency/offer-editor.tsx
✅ components/traveler/explore.tsx
✅ components/traveler/agency-profile.tsx
```

### Key Components

**Offer Creation Form:**
- Path: `components/agency/offer-editor.tsx`
- Dropdown: Select offer type
- Conditional: Umrah/Hajj fields appear when selected

**Explore Filters:**
- Path: `components/traveler/explore.tsx`
- Categories: Travel, Umrah, Hajj, Cultural, etc.

**Agency Badge:**
- Path: `components/traveler/agency-profile.tsx`
- Shows: "Provides Umrah & Hajj Services"

---

## 🔍 Common Scenarios

### Create Umrah Offer
1. Go to agency dashboard
2. Create new offer
3. Select "عمرة" from offer type
4. Fill all Umrah-specific fields
5. Warning appears about special responsibility
6. Submit for review

### Filter Umrah Offers
1. Go to explore page
2. Select "Umrah" from category filters
3. See only Umrah offers

### Agency Badge Display
- Badge shows automatically if agency has active Umrah/Hajj offers
- No manual configuration needed

---

## 🚨 Troubleshooting

### Agency can't select Umrah/Hajj
**Problem:** Dropdown disabled
**Solution:** Agency must be verified first

### Database error on save
**Problem:** Validation trigger fails
**Solution:** 
- Check agency is verified
- Fill all required fields
- Ensure season is not empty

### Badge not showing
**Problem:** No Umrah/Hajj badge on profile
**Solution:**
- Ensure offers are active
- Check offer_type is set correctly
- Verify database has correct data

---

## 📊 Database Queries

### Count offers by type
```sql
SELECT offer_type, COUNT(*) 
FROM offers 
WHERE active = true 
GROUP BY offer_type;
```

### Find Umrah agencies
```sql
SELECT DISTINCT a.name, a.slug
FROM agencies a
JOIN offers o ON o.agency_id = a.id
WHERE o.offer_type IN ('umrah', 'hajj')
AND o.active = true
AND a.verified = true;
```

### Validate Umrah/Hajj requirements
```sql
SELECT id, title, season, accommodation_details, transport_details
FROM offers
WHERE offer_type IN ('umrah', 'hajj')
AND (
  season IS NULL OR 
  accommodation_details IS NULL OR 
  transport_details IS NULL
);
```

---

## 🎨 UI/UX Guidelines

### Umrah/Hajj Offers Should:
- ✅ Look calm and respectful
- ✅ Emphasize trust over price
- ✅ Show clear accommodation details
- ✅ Display verification badges prominently
- ❌ Not look like regular travel ads
- ❌ Not use flashy colors/imagery

### Badge Design
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 
                rounded-full bg-primary/10 border border-primary/20">
  <Shield className="w-4 h-4 text-primary" />
  <span className="text-sm font-medium text-primary">
    Provides Umrah & Hajj Services
  </span>
</div>
```

---

## 📝 Testing Steps

1. **Database Migration**
   - [ ] Run migration script
   - [ ] Check columns added
   - [ ] Test constraint (unverified agency blocked)

2. **Agency Dashboard**
   - [ ] Non-verified sees disabled options
   - [ ] Verified can select Umrah/Hajj
   - [ ] Warning message appears
   - [ ] Required fields validate

3. **Explore Page**
   - [ ] Umrah filter shows Umrah offers only
   - [ ] Hajj filter shows Hajj offers only
   - [ ] Filters work correctly

4. **Agency Profile**
   - [ ] Badge shows for Umrah providers
   - [ ] Badge shows for Hajj providers
   - [ ] Badge shows for both
   - [ ] Badge hidden if no religious offers

---

## 🔗 Related Documentation
- Full Guide: `docs/UMRAH_HAJJ_INTEGRATION.md`
- Migration: `scripts/017_add_offer_type_umrah_hajj.sql`
- Types: `lib/types.ts`
