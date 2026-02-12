# Backend API Documentation & Supabase Migration Mapping

## Base URL
`https://quickbite-e8kn.onrender.com/api`

## 1. Authentication
**Supabase Replaced:** `Supabase.auth`

| Feature | Endpoint | Method | Body | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| Register | `/auth/register` | POST | `{ email, password, fullName, studentId, course, role }` | No |
| Login | `/auth/login` | POST | `{ email, password }` | No |
| Get User | `/auth/me` | GET | - | Yes |

**Migration Note:**
-   Update `AuthProvider` in Flutter to use `http.post` for login/signup instead of `Supabase.auth`.
-   Store the returned `token` in `SharedPreferences` (or SecureStorage).
-   Add `Authorization: Bearer <token>` to all subsequent requests.

## 2. Menu
**Supabase Replaced:** `supabase.from('menu_items')`

| Feature | Endpoint | Method | Auth Required |
| :--- | :--- | :--- | :--- |
| Get Menu | `/menu` | GET | No |
| Add Item | `/menu` | POST | Yes (Admin) |
| Update | `/menu/:id` | PUT | Yes (Staff/Admin) |
| Delete | `/menu/:id` | DELETE | Yes (Admin) |

## 3. Orders (Real-time)
**Supabase Replaced:** `supabase.from('orders')` and Realtime Subscriptions

| Feature | Endpoint | Method | Body |
| :--- | :--- | :--- | :--- |
| Place Order | `/orders` | POST | `{ items: [], totalAmount, ... }` |
| My Orders | `/orders` | GET | - |
| Live Orders | `/orders/live` | GET | - |
| Update Status | `/orders/:id/status` | PATCH | `{ status: 'preparing' }` |

**Real-time Migration (Socket.IO):**
1.  **Staff**: Join 'staff_room' on connect. Listen for `order:new` and `order:update`.
2.  **Student**: Join `user_{userId}` on connect. Listen for `order:update`.

```dart
// Flutter Example
socket.on('order:update', (data) {
   // Update local order list
});
```

## 4. Wallet
**Supabase Replaced:** Local mock / `wallet` table

| Feature | Endpoint | Method | Body |
| :--- | :--- | :--- | :--- |
| Get Wallet | `/wallet` | GET | - |
| Add Money | `/wallet/add` | POST | `{ amount: 500 }` |

## 5. Feedback & Announcements
**Supabase Replaced:** `feedback`, `announcements` tables

| Feature | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| Submit Feed | `/feedback` | POST | Submit rating/comment |
| Get Feed | `/feedback` | GET | Admin view |
| Get Announce | `/announcements` | GET | Public list |
| Create Announce | `/announcements` | POST | Admin create |

## Folder Structure Summary

```
backend/
├── src/
│   ├── config/db.js           # Mongo Connection
│   ├── controllers/           # Business Logic
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── walletController.js
│   │   ├── feedbackController.js
│   │   └── announcementController.js
│   ├── middleware/auth.js     # JWT Protection
│   ├── models/                # Mongoose Schemas
│   ├── routes/                # API Endpoints
│   ├── app.js                 # Express Setup
│   └── server.js              # Entry + Socket.IO
```
