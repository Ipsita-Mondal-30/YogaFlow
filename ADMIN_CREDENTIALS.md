# Admin Account Credentials

## Quick Reference

Use these credentials to sign in as an admin in the Yoga Flow app.

---

### Admin Account 1
- **Email:** yogaadmin1@yogaflow.com
- **Password:** YogaAdmin@123

### Admin Account 2
- **Email:** yogaadmin2@yogaflow.com
- **Password:** YogaAdmin@456

### Admin Account 3
- **Email:** yogaadmin3@yogaflow.com
- **Password:** YogaAdmin@789

### Admin Account 4
- **Email:** yogaadmin4@yogaflow.com
- **Password:** YogaAdmin@012

---

## Setup Required

Before these accounts work, you must:

1. **Create them in Supabase Auth**
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add User" for each account above
   - Make sure "Auto Confirm User" is checked

2. **Sync to Database**
   - Go to Supabase Dashboard > SQL Editor
   - Run the SQL from `supabase-sync-admins.sql`
   - Or follow instructions in `ADMIN_AUTH_TROUBLESHOOTING.md`

---

## Testing Admin Login

1. Open the Yoga Flow app
2. On the auth choice screen, tap "Admin Sign In"
3. Enter any admin email and password from above
4. You should see:
   - Admin navigation (Home, Upload, Videos, Community)
   - Admin badge in profile
   - Ability to upload and manage videos

---

## Security Notes

⚠️ **IMPORTANT:** These are development/testing credentials.

For production:
- Change all passwords to strong, unique values
- Store credentials securely (password manager, env vars)
- Never commit real passwords to version control
- Consider implementing 2FA for admin accounts
- Regularly rotate admin passwords
- Monitor admin activity logs

---

## Troubleshooting

If login fails, see `ADMIN_AUTH_TROUBLESHOOTING.md` for detailed help.

Quick checks:
- [ ] Admin exists in Supabase Auth (Authentication > Users)
- [ ] Admin exists in users table with role='ADMIN'
- [ ] Password is correct (case-sensitive)
- [ ] Supabase connection is working (.env configured)
