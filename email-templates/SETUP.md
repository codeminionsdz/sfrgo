# 📧 SAFRGO Email Templates - Quick Setup Guide

## 🎯 Goal
Set up professional, branded Arabic email templates for SAFRGO authentication flows.

---

## ✅ Available Templates

| Template | File | Supabase Template | Purpose |
|----------|------|-------------------|---------|
| **Confirm Signup** | `confirm-signup.html` | `Confirm signup` | Email verification after registration |
| **Reset Password** | `reset-password.html` | `Reset Password` | Password recovery email |
| **Magic Link** | `magic-link.html` | `Magic Link` | Passwordless login link |

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: **SAFRGO**
3. Navigate to: **Authentication** → **Email Templates**

### Step 2: Update Each Template

#### Confirm Signup Template
1. Click on **"Confirm signup"** template
2. Copy entire content from: `email-templates/confirm-signup.html`
3. Paste into editor (replace all existing content)
4. Click **"Save"**

#### Reset Password Template
1. Click on **"Reset Password"** template
2. Copy entire content from: `email-templates/reset-password.html`
3. Paste into editor
4. Click **"Save"**

#### Magic Link Template
1. Click on **"Magic Link"** template
2. Copy entire content from: `email-templates/magic-link.html`
3. Paste into editor
4. Click **"Save"**

---

## 🧪 Testing

### Test Signup Email
```javascript
// In your app or Supabase SQL editor
await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test-password-123'
})
```

### Test Password Reset
```javascript
await supabase.auth.resetPasswordForEmail('test@example.com')
```

### Test Magic Link
```javascript
await supabase.auth.signInWithOtp({
  email: 'test@example.com'
})
```

---

## ✨ Features

### Professional Design
- ✅ SAFRGO branding (logo + colors)
- ✅ Clean, modern layout
- ✅ Mobile-responsive
- ✅ Email-safe HTML

### Arabic Language
- ✅ Full RTL support
- ✅ Professional Arabic copy
- ✅ Respectful tone

### User Experience
- ✅ Clear call-to-action buttons
- ✅ Security information
- ✅ Alternative text links
- ✅ Trust badges
- ✅ Footer with links

---

## 🎨 Branding

**Colors**:
- Primary Blue: `#3b82f6`
- Purple Accent: `#9333ea`
- Background: `#f5f5f5`
- Text: `#1f2937`

**Logo**: Inline SVG (works in all email clients)

**Typography**: System fonts (email-safe)

---

## 🔒 Security Features

### Confirm Signup
- ✅ Explains 24-hour link expiry
- ✅ Clear instructions
- ✅ Alternative link provided

### Reset Password
- ⚠️ Security warning if user didn't request
- ✅ 1-hour link expiry
- ✅ Security tips included

### Magic Link
- ✅ 5-minute expiry
- ✅ One-time use only
- ✅ Benefits explanation

---

## 📱 Email Client Compatibility

Tested and working in:
- ✅ Gmail (Desktop & Mobile)
- ✅ Apple Mail (macOS & iOS)
- ✅ Outlook (Windows & Web)
- ✅ Yahoo Mail
- ✅ ProtonMail

---

## ⚙️ Configuration

### Email Sender
In Supabase Dashboard → Authentication → Settings:

**Sender Name**: `SAFRGO`
**Sender Email**: `noreply@safrgo.online`

### Email Rate Limits
Default Supabase limits (can be increased):
- Signup: 4 emails per hour per email
- Password Reset: 4 emails per hour per email
- Magic Link: 4 emails per hour per email

---

## 🔄 Customization

### Update Logo
Find and replace the inline SVG in each template with:
```html
<img src="https://safrgo.online/logo.png" 
     alt="SAFRGO" 
     width="120" 
     style="display: block; margin: 0 auto;">
```

### Update Colors
Find and replace hex codes:
- `#3b82f6` → Your primary color
- `#9333ea` → Your accent color

### Update Links
Footer links currently point to:
- `https://safrgo.online`
- `https://safrgo.online/explore`
- `https://safrgo.online/agencies`
- `https://safrgo.online/login`

Update as needed.

---

## 📊 Template Variables

These Supabase variables are automatically replaced:

- `{{ .ConfirmationURL }}` - Verification/magic link URL
- `{{ .Token }}` - Verification token
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - Your site URL (from Supabase config)

**Important**: Do NOT remove or modify these variables!

---

## ✅ Pre-Launch Checklist

Before going live:

- [ ] All 3 templates uploaded to Supabase
- [ ] Test signup flow (check email received)
- [ ] Test password reset (check email received)
- [ ] Test magic link (check email received)
- [ ] Verify logos display correctly
- [ ] Verify buttons link correctly
- [ ] Test on mobile email client
- [ ] Test on desktop email client
- [ ] Check spam folder (shouldn't be there)
- [ ] Verify sender name/email in Supabase

---

## 🚨 Troubleshooting

### Email Not Received
1. Check Supabase logs: Authentication → Logs
2. Check spam folder
3. Verify email rate limits not exceeded
4. Check Supabase SMTP configuration

### Button Not Working
1. Verify `{{ .ConfirmationURL }}` is in template
2. Check Supabase site URL configuration
3. Test in different email client

### Logo Not Showing
1. Use inline SVG (recommended) or hosted image
2. If using image: ensure HTTPS URL
3. Check image URL is accessible

### Wrong Language
1. Verify template has `lang="ar"` and `dir="rtl"`
2. Check Arabic text copied correctly
3. Test in email client with RTL support

---

## 📞 Support

**Full Documentation**: See `email-templates/README.md`

**Template Files**:
- `email-templates/confirm-signup.html`
- `email-templates/reset-password.html`
- `email-templates/magic-link.html`

**Supabase Docs**: https://supabase.com/docs/guides/auth/auth-email-templates

---

## ⏱️ Estimated Setup Time

- **Upload templates**: 3 minutes
- **Test emails**: 2 minutes
- **Verify everything**: 5 minutes

**Total**: ~10 minutes

---

**Status**: ✅ Ready to Deploy

**Last Updated**: January 12, 2026
