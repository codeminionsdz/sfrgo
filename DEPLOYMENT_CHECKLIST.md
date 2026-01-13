# 🚀 SAFRGO Production Deployment Checklist

**Target Domain**: `https://safrgo.online`

**Date**: January 12, 2026

---

## ✅ Pre-Deployment Checklist

### Environment Configuration
- [x] `NEXT_PUBLIC_APP_URL` added to `.env.local`
- [x] Production domain set to `https://safrgo.online`
- [x] `.env.example` updated with new variable
- [ ] Vercel environment variable configured (see Step 1 below)

### Code Updates
- [x] 9 files updated to use `NEXT_PUBLIC_APP_URL`
- [x] All QR code components updated
- [x] Share button updated
- [x] Open Graph metadata updated
- [x] Auth redirects updated
- [x] No TypeScript errors in updated files
- [x] Consistent URL pattern across all files

### Documentation
- [x] `docs/DOMAIN_CONFIGURATION.md` created
- [x] `docs/DOMAIN_QUICK_REF.md` created
- [x] `docs/DOMAIN_MIGRATION_SUMMARY.md` created
- [x] `scripts/verify-domain-config.js` created

---

## 🔧 Deployment Steps

### Step 1: Configure Vercel Environment Variables

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Go to Project Settings**:
   - Navigate to: https://vercel.com/[your-username]/safrgo
   - Click: **Settings** → **Environment Variables**

3. **Add Environment Variable**:
   ```
   Name: NEXT_PUBLIC_APP_URL
   Value: https://safrgo.online
   Environments: ✓ Production  ✓ Preview  ✓ Development
   ```

4. **Save Changes**

### Step 2: Verify Local Setup

```bash
# Run verification script
node scripts/verify-domain-config.js

# Expected output: ✅ READY FOR DEPLOYMENT
```

### Step 3: Build & Test Locally

```bash
# Install dependencies (if needed)
pnpm install

# Build project
pnpm build

# Run production build locally
pnpm start

# Test in browser
open http://localhost:3000
```

### Step 4: Deploy to Vercel

**Option A: Git Push**
```bash
git add .
git commit -m "feat: migrate to production domain safrgo.online"
git push origin main
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

**Option C: Vercel Dashboard**
- Go to: Deployments → Click "Redeploy"

### Step 5: Wait for Deployment

Monitor deployment status:
- Vercel Dashboard → Deployments
- Wait for "Ready" status
- Note the deployment URL

---

## 🧪 Post-Deployment Testing

### Test 1: Environment Variable ✓
```bash
# In Vercel deployment logs, check:
# Build output should show NEXT_PUBLIC_APP_URL is set

# Or in browser console:
console.log(process.env.NEXT_PUBLIC_APP_URL)
# Expected: https://safrgo.online
```

### Test 2: QR Code Generation ✓
**Steps**:
1. Navigate to: `https://safrgo.online/agency/profile`
2. View/Generate QR code
3. Use phone to scan QR code
4. **Expected**: Opens `https://safrgo.online/agencies/[your-slug]`

**Verification**:
- [ ] QR code displays correctly
- [ ] QR code scans successfully
- [ ] Opens correct production URL
- [ ] No localhost references

### Test 3: Share Button ✓
**Steps**:
1. Navigate to any offer: `https://safrgo.online/offers/[any-id]`
2. Click "Share" button
3. Select "Copy Link"
4. **Expected**: Clipboard contains `https://safrgo.online/offers/[id]`

**Verification**:
- [ ] Share button opens menu
- [ ] Copy link works
- [ ] URL is production domain
- [ ] No localhost in URL

### Test 4: Open Graph Image ✓
**Steps**:
1. Open: `https://safrgo.online/api/og/offer/[any-offer-id]`
2. **Expected**: 1200×630 image displays

**Verification**:
- [ ] Image loads successfully
- [ ] Size is 1200×630
- [ ] Content displays correctly
- [ ] No errors in browser console

### Test 5: Social Media Preview ✓
**Steps**:
1. Go to: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter: `https://safrgo.online/offers/[any-offer-id]`
3. Click "Debug"
4. **Expected**: Preview card displays with image

**Verification**:
- [ ] Facebook shows preview card
- [ ] Image loads (1200×630)
- [ ] Title displays correctly
- [ ] Description displays correctly
- [ ] URL is correct

**Repeat for**:
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Test 6: WhatsApp Share ✓
**Steps**:
1. Open any offer page on mobile
2. Click share → WhatsApp
3. Send to yourself
4. **Expected**: Message shows preview with image

**Verification**:
- [ ] Preview displays in WhatsApp
- [ ] Image loads
- [ ] Link is correct
- [ ] Clicking opens offer page

### Test 7: Authentication Flow ✓
**Steps**:
1. Sign up new test account
2. Check verification email
3. Click verification link
4. **Expected**: Redirects to `https://safrgo.online/auth/callback`

**Verification**:
- [ ] Email received
- [ ] Link contains production domain
- [ ] Redirect works correctly
- [ ] User can login successfully

### Test 8: Agency Profile ✓
**Steps**:
1. View agency profile page
2. Check browser address bar
3. **Expected**: URL is `https://safrgo.online/agencies/[slug]`

**Verification**:
- [ ] URL is correct
- [ ] Page loads without errors
- [ ] QR code displays
- [ ] Share buttons work

---

## 🔍 Monitoring

### After Deployment

**First 24 Hours**:
- [ ] Monitor Vercel logs for errors
- [ ] Check analytics for traffic
- [ ] Test on multiple devices
- [ ] Verify QR codes work
- [ ] Check social media shares

**First Week**:
- [ ] Gather user feedback
- [ ] Monitor error logs
- [ ] Check URL consistency
- [ ] Verify all features work

---

## 🚨 Rollback Plan

If issues occur after deployment:

### Immediate Rollback
```bash
# In Vercel Dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
```

### Fix Environment Variable
```bash
# If wrong domain set:
1. Vercel → Settings → Environment Variables
2. Edit NEXT_PUBLIC_APP_URL
3. Set correct value: https://safrgo.online
4. Redeploy
```

### Emergency Localhost Fallback
```bash
# If needed temporarily:
# In Vercel environment variables:
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Then fix production domain and redeploy
```

---

## 📊 Success Metrics

### Technical Metrics
- [ ] Zero deployment errors
- [ ] All pages load successfully
- [ ] No console errors
- [ ] QR codes scan correctly
- [ ] Share buttons work
- [ ] OG images load

### User Experience Metrics
- [ ] QR codes work on mobile
- [ ] Share previews look professional
- [ ] No broken links
- [ ] Fast page load times
- [ ] Consistent branding

### SEO Metrics
- [ ] Open Graph tags valid
- [ ] Twitter Cards valid
- [ ] All URLs use HTTPS
- [ ] Canonical URLs correct
- [ ] Social previews work

---

## ✅ Final Verification

After completing all tests above:

```bash
# Run verification script again
node scripts/verify-domain-config.js

# Check production site
curl -I https://safrgo.online

# Expected: 200 OK

# Check OG image API
curl -I https://safrgo.online/api/og/offer/test

# Expected: 200 OK or 404 (test ID)
```

---

## 📝 Sign-Off

**Deployment Completed By**: ___________________

**Date**: ___________________

**Time**: ___________________

**Status**: 
- [ ] ✅ All tests passed - PRODUCTION READY
- [ ] ⚠️ Minor issues - document and monitor
- [ ] ❌ Critical issues - rollback required

**Notes**:
```
_________________________________________________

_________________________________________________

_________________________________________________
```

---

## 📞 Support Contacts

**Technical Issues**: Check Vercel logs and console

**Documentation**: See `docs/DOMAIN_CONFIGURATION.md`

**Quick Reference**: See `docs/DOMAIN_QUICK_REF.md`

---

**Production Domain**: `https://safrgo.online`

**Environment Variable**: `NEXT_PUBLIC_APP_URL`

**Status**: Ready for deployment! 🚀
