## 🏥 **PHASE 1: Admin Portal - Hospital Setup & User Management**

**Depends on: Phase 0 | Blocking: All user-facing features**

### **Why This First?**

Admins must configure the hospital, create departments, and onboard doctors/staff before any appointments can be booked.

### **Deliverables:**

#### **1.1 Authentication Service (Backend)**

- **Auth Service APIs:**
    - `POST /api/auth/register` - User registration
    - `POST /api/auth/login` - Login with credentials
    - `POST /api/auth/verify-otp` - OTP verification
    - `POST /api/auth/refresh-token` - Token refresh
    - `POST /api/auth/forgot-password` - Password reset
    - `GET /api/auth/me` - Get current user
- JWT token generation and validation
- OTP generation and storage in Redis (5-min TTL)
- Password hashing with bcrypt
- Role-based token payload

#### **1.2 Admin Web Dashboard Foundation (Next.js)**

- Setup Next.js 14+ App Router in `apps/web`
- Implement authentication:
    - Login page with role selection
    - First-time user ID confirmation flow
    - 2FA setup and verification
    - Session management with NextAuth.js
- Protected route middleware
- Admin layout with sidebar navigation

#### **1.3 Hospital Profile Configuration**

- **Backend APIs:**
    - `POST /api/admin/hospital` - Create/update hospital profile
    - `GET /api/admin/hospital` - Get hospital details
- **Admin UI Screens:**
    - Hospital Profile Setup Form:
        - Basic info (name, address, contact)
        - Logo upload to cloud storage
        - Operating hours configuration
        - Holiday calendar
        - Emergency contacts
    - Department Management:
        - Create/edit/delete departments
        - Assign locations (building, floor, wing)
        - Set operating hours per department
        - Define services offered

#### **1.4 Staff & Doctor CRUD Management**

- **Backend APIs:**
    - `POST /api/admin/doctors` - Create doctor
    - `POST /api/admin/staff` - Create staff member
    - `GET /api/admin/users` - List all users with filters
    - `PUT /api/admin/users/:id` - Update user
    - `DELETE /api/admin/users/:id` - Deactivate user
    - `POST /api/admin/users/:id/reset-password` - Reset password
- **Unique ID Generation Logic:**
    - Format: `HOS-DOC-XXXXX` or `HOS-STF-XXXXX`
    - Alphanumeric, collision-free
    - Store in database, send via SMS/email
- **Admin UI Screens:**
    - User List View (table with filters/search)
    - Add New User Modal:
        - Role selection (Doctor, Staff, Nurse, etc.)
        - Personal info form
        - Professional details (for doctors: specialization, registration no.)
        - Auto-generate and display Unique User ID
        - Send credentials via SMS/Email
    - User Detail View:
        - Complete profile
        - Activity logs
        - Edit/Deactivate buttons
    - Bulk import functionality (CSV upload)

#### **1.5 Role-Based Access Control (RBAC)**

- Define permission matrix in database:
    - Admin: Full access
    - Doctor: Own patients, prescriptions, schedule
    - Staff: Appointments, check-ins, parking
    - Patient: Own data only
- Implement RBAC middleware
- Add permission checks to all protected routes

#### **1.6 Notification Service Foundation**

- **Backend Notification Service:**
    - `POST /api/notifications/send` - Generic send API
    - Template engine for SMS/Email
    - Integration with SMS gateway (Twilio/MSG91)
    - Integration with Email service (SendGrid)
    - Firebase FCM setup for push notifications
- **Notification Templates:**
    - User credentials (ID and password)
    - Welcome email
    - Password reset
    - 2FA codes

**✅ Exit Criteria:**

- Admin can login to web dashboard
- Admin can create hospital profile with departments
- Admin can add doctors and staff with unique IDs
- Doctors/Staff receive credentials via SMS/Email
- RBAC prevents unauthorized access
- All CRUD operations are audited

**🔗 Connected Systems:**

- Authentication system ready for all user types
- Database populated with hospital structure
- RBAC foundation for all future features

---

## 👨‍⚕️ **PHASE 2: Doctor & Staff Onboarding + Profile Management**

**Depends on: Phase 1**

### **Why Now?**

Doctors and staff need to setup their profiles and schedules before patients can book appointments.

### **Deliverables:**

#### **2.1 Doctor/Staff First-Time Login Flow**

- **Web UI:**
    - Unique ID confirmation screen
    - Force password change on first login
    - Security questions setup
    - Profile photo upload
    - Dashboard tour/tutorial

#### **2.2 Doctor Profile & Schedule Management**

- **Backend APIs:**
    - `GET /api/doctor/profile` - Get own profile
    - `PUT /api/doctor/profile` - Update profile
    - `PUT /api/doctor/schedule` - Update weekly schedule
    - `POST /api/doctor/holidays` - Mark holidays/leaves
    - `PUT /api/doctor/fees` - Update consultation fees
- **Doctor UI Screens:**
    - Profile Management:
        - Personal & professional info
        - Specializations, languages, bio
        - Certificates upload
    - Schedule Setup:
        - Weekly availability grid (drag-to-mark)
        - Slot duration configuration
        - Break times
        - Multiple locations/rooms
    - Fee Configuration:
        - New patient fee
        - Follow-up fee
        - Video consultation fee
    - Holiday Management:
        - Calendar view
        - Mark leaves with approval workflow
        - Substitute doctor assignment

#### **2.3 Staff Profile Management**

- **Backend APIs:**
    - `GET /api/staff/profile` - Get own profile
    - `PUT /api/staff/profile` - Update profile
- **Staff UI Screen:**
    - Basic profile editing
    - Shift timings
    - Department assignment

**✅ Exit Criteria:**

- Doctors can login with unique ID
- Doctors have complete profiles with schedules
- Staff can login and access their dashboard
- Schedules are stored and queryable for appointment slots

**🔗 Connected Systems:**

- Doctor availability data ready for appointment booking
- Profile data ready for patient-facing searches

---

## 📱 **PHASE 3: Mobile App Foundation + Patient Authentication**

**Depends on: Phase 0, Phase 1 (Auth Service)**

### **Why Now?**

Need a mobile interface for patients to interact with the system. Must happen before appointment booking.

### **Deliverables:**

#### **3.1 Mobile App Project Setup**

- Initialize Kotlin Android project in `apps/android`
- Setup Jetpack Compose
- Configure Retrofit for API calls
- Setup Coroutines + Flow for async operations
- Implement dependency injection (Hilt/Koin)
- Setup navigation (Compose Navigation)

#### **3.2 Patient Authentication Flow**

- **Mobile UI Screens:**
    - Splash Screen with branding
    - Welcome/Onboarding screens (swipeable)
    - Registration Screen:
        - Phone number (primary)
        - Name, email, DOB, gender
        - Password with strength indicator
    - OTP Verification Screen
    - Login Screen:
        - Phone/email + password
        - Biometric login option (fingerprint/face)
    - Forgot Password Flow
- **API Integration:**
    - Connect to Auth Service APIs from Phase 1
    - Store JWT tokens securely (EncryptedSharedPreferences)
    - Implement auto token refresh

#### **3.3 Patient Profile Setup**

- **Backend APIs:**
    - `GET /api/patient/profile` - Get patient profile
    - `PUT /api/patient/profile` - Update profile
    - `POST /api/patient/medical-history` - Add medical info
- **Mobile UI Screens:**
    - Post-registration onboarding:
        - Profile photo upload
        - Medical information form:
            - Known allergies
            - Current medications
            - Chronic conditions
            - Blood group
        - Emergency contact
    - Profile Management Screen
    - Permission requests (Location, Camera, Notifications)

#### **3.4 Home Dashboard**

- **Mobile UI:**
    - Home screen with quick action cards:
        - Book Appointment
        - Navigate Campus
        - My Parking
        - Medical Records
    - Active status cards (appointment, parking, queue)
    - Bottom navigation bar
- **Backend APIs:**
    - `GET /api/patient/dashboard` - Get dashboard data
        - Upcoming appointments
        - Active parking session
        - Recent prescriptions

**✅ Exit Criteria:**

- Patient can download and install mobile app
- Patient can register and login
- Patient can setup medical profile
- Home dashboard displays correctly
- JWT authentication works end-to-end

**🔗 Connected Systems:**

- Mobile app ready to consume all backend APIs
- Patient data foundation for appointments and medical records

---