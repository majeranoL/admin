# Login Testing Setup

Since we've removed dummy credentials and disabled Firebase Authentication for testing, you need to add test users directly to Firestore.

## Test Users Setup

### Option 1: Use Shelter Registration (Recommended)

1. Go to `/register-shelter` and create a test shelter account
2. The shelter will be created with `verified: false`
3. Go to Firebase Console → Firestore → `shelters` collection
4. Find your shelter document and manually set `verified: true`
5. Now you can login with the shelter's email

### Option 2: Manually Add to Firestore

#### Add a Test Shelter (Admin Role)

Go to Firebase Console → Firestore → Create Collection: `shelters`

Add a document with ID (auto-generate or use custom):

```json
{
  "shelterName": "Test Animal Shelter",
  "contactPerson": "John Doe",
  "address": "123 Main St, City",
  "contactNumber": "+639123456789",
  "email": "admin@shelter.com",
  "password": "admin123",
  "verified": true,
  "status": "approved",
  "createdAt": "2025-11-05T00:00:00.000Z",
  "updatedAt": "2025-11-05T00:00:00.000Z"
}
```

**Login credentials:**

- Username: `admin@shelter.com`
- Password: `admin123`

#### Add a Super Admin

Go to Firebase Console → Firestore → Create Collection: `admins`

Add a document with ID (auto-generate or use custom):

```json
{
  "name": "Super Admin",
  "email": "superadmin@animal911.com",
  "password": "super123",
  "role": "superadmin",
  "createdAt": "2025-11-05T00:00:00.000Z",
  "updatedAt": "2025-11-05T00:00:00.000Z"
}
```

**Login credentials:**

- Username: `superadmin@animal911.com`
- Password: `super123`

## How Login Works Now

1. **Input**: User enters email as username and password
2. **Shelter Check**: System queries `shelters` collection for email where `verified = true`
3. **Admin Check**: If not found, system queries `admins` collection for email
4. **Password Check**: Compares entered password with the `password` field in Firestore document
5. **Success**: User is logged in with appropriate role (admin or superadmin)

## Testing Steps

1. **Enable Firestore** in Firebase Console (if not already enabled)
2. **Add test users** using one of the methods above
3. **Login** using the email and test password
4. **Verify** you're redirected to the appropriate dashboard

## Security Notes

⚠️ **Important**: This is a simplified login for testing purposes only!

For production, you should:

- Use proper password hashing (bcrypt, argon2, etc.)
- Implement Firebase Authentication
- Add rate limiting
- Add CSRF protection
- Use secure session management
- Implement 2FA for super admins

## Current Login Logic

```javascript
// Shelter (Admin) Login
- Username: shelter email from Firestore
- Password: password field from Firestore document
- Must have verified: true

// Super Admin Login
- Username: admin email from Firestore
- Password: password field from Firestore document
- From 'admins' collection
```

## Troubleshooting

**"Invalid credentials or account not verified"**

- Check if user exists in Firestore
- For shelters, verify `verified: true`
- Check email spelling (case-sensitive)

**"Login failed. Please try again"**

- Check Firebase Console for errors
- Ensure Firestore is enabled
- Check browser console for error details

**Can't see shelter in dashboard after login**

- Check user role in localStorage (should be 'admin' or 'superadmin')
- Clear browser cache and try again
- Check browser console for errors
