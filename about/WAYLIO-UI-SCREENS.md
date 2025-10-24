# Waylio - Core UI Screens and Views

## Overview
This document provides detailed specifications for all core UI screens across the Waylio platform, covering mobile (Kotlin) and web (Next.js) interfaces for all user roles.

---

## 1. PUBLIC USER (Patient/Attendant) - Mobile App (Kotlin)

### 1.1 Home Dashboard
**Purpose:** Central navigation hub providing quick access to all core features

**Layout & Components:**
- **Header Section:**
  - Profile avatar (top-right) with quick access to profile settings
  - Hospital logo/branding (top-left)
  - Notification bell icon with badge counter
  
- **Quick Status Cards (if active):**
  - Active Appointment Card: Shows upcoming appointment with doctor name, department, time, and countdown timer
  - Active Parking Session Card: Shows slot number, time remaining, "Find My Car" button
  - Queue Status Card: Real-time position in queue with estimated wait time
  
- **Primary Action Buttons (Grid Layout):**
  - "Book Appointment" - Large CTA button
  - "Navigate Campus" - AR navigation icon
  - "My Parking" - Parking management
  - "Medical Records" - History & documents
  
- **Secondary Features:**
  - Emergency Contact: Quick access to hospital emergency services
  - Help & Support: FAQs and contact options

**Interaction Flow:**
- Tap any card/button to navigate to respective feature
- Pull-to-refresh for real-time updates
- Bottom navigation bar: Home, Navigate, Appointments, Profile

---

### 1.2 APPOINTMENT BOOKING FLOW

#### 1.2.1 Department & Doctor Search
**Purpose:** Enable users to find and select appropriate healthcare providers

**Layout & Components:**
- **Search Bar:**
  - Prominent search field at top: "Search by doctor, department, or specialty"
  - Voice search icon
  - Filter button (specialty, availability, rating)
  
- **Quick Filters (Horizontal Scroll):**
  - Chips for common specialties: Cardiology, Orthopedics, Pediatrics, etc.
  - "All Departments" option
  
- **Search Results / Browse List:**
  - **Doctor Card (for each result):**
    - Profile photo (circular, left)
    - Name and credentials (e.g., Dr. Sarah Johnson, MD)
    - Specialty and department
    - Star rating (1-5) with review count
    - Consultation fee (bold)
    - "Next Available" time slot preview
    - "View Profile" and "Book Now" buttons
  
- **Empty State:**
  - Illustration with "No doctors found" message
  - Suggestions to refine search

**Interaction Flow:**
- Type or voice search → Instant filtered results
- Tap doctor card → View detailed profile
- Tap "Book Now" → Navigate to time slot selection

---

#### 1.2.2 Doctor Profile Detail
**Purpose:** Provide comprehensive information about selected doctor

**Layout & Components:**
- **Header Section:**
  - Large profile photo
  - Name, credentials, and specialization
  - Rating with detailed reviews
  - Department and location
  
- **Tabs Navigation:**
  - **About:** Education, experience, languages spoken, areas of expertise
  - **Availability:** Calendar view of available slots
  - **Reviews:** Patient testimonials with ratings
  - **Consultation Details:** Fees, typical consultation duration
  
- **Action Buttons:**
  - Primary: "Book Appointment"
  - Secondary: "View on Map" (shows clinic location)

**Interaction Flow:**
- Swipe between tabs for information
- Tap "Book Appointment" → Navigate to time slot selection

---

#### 1.2.3 Time Slot Selection
**Purpose:** Allow users to choose convenient appointment date and time

**Layout & Components:**
- **Calendar View:**
  - Month calendar with available dates highlighted
  - Unavailable dates greyed out
  - Current date indicator
  
- **Selected Date Display:**
  - Large date header showing selected day
  - Day of week and full date
  
- **Time Slot Grid:**
  - Time slots organized by AM/PM
  - Each slot shows:
    - Time (e.g., 9:00 AM)
    - Status: Available (green), Few slots left (yellow), Booked (grey)
  - Selected slot highlighted with checkmark
  
- **Consultation Details Card:**
  - Doctor name and photo
  - Department and location
  - Consultation fee
  - Estimated duration
  
- **Bottom Action:**
  - "Continue to Pre-Registration" button (disabled until slot selected)

**Interaction Flow:**
- Tap calendar date → Load available time slots
- Tap time slot → Select and highlight
- Tap "Continue" → Navigate to pre-registration

---

#### 1.2.4 Pre-Registration & Medical Forms
**Purpose:** Collect necessary patient information before appointment

**Layout & Components:**
- **Progress Indicator:**
  - Step indicator: Personal Info → Medical History → Review
  
- **Form Sections (Scrollable):**
  
  **Personal Information:**
  - Full name
  - Date of birth (date picker)
  - Gender (dropdown)
  - Contact number
  - Email address
  - Emergency contact (name & phone)
  
  **Medical History:**
  - Current medications (multi-select/add custom)
  - Known allergies (multi-select/add custom)
  - Chronic conditions (multi-select checkboxes)
  - Previous surgeries (text area)
  - Current symptoms (text area for reason for visit)
  
  **Insurance Information (Optional):**
  - Insurance provider
  - Policy number
  - Upload insurance card (photo capture)
  
- **Data Privacy Notice:**
  - Checkbox: "I agree to share my medical information"
  - Link to privacy policy
  
- **Navigation:**
  - "Back" button (top-left)
  - "Save & Continue" button (bottom)
  - "Save as Draft" option

**Interaction Flow:**
- Fill form fields → Validation on blur
- Tap "Continue" → Navigate to next section or review
- Auto-save progress to prevent data loss

---

#### 1.2.5 Appointment Review & Payment
**Purpose:** Confirm appointment details and process payment

**Layout & Components:**
- **Review Card:**
  - "Review Your Appointment" header
  - Doctor details with photo
  - Date and time (prominent display)
  - Department and location
  - Consultation type (In-person/Tele-consult if applicable)
  
- **Fee Breakdown Card:**
  - Consultation fee
  - Registration fee (if first-time)
  - Platform fee
  - Taxes
  - **Total Amount** (bold, large font)
  
- **Payment Method Selection:**
  - Radio buttons for:
    - Credit/Debit Card
    - UPI
    - Net Banking
    - Digital Wallets
  - Saved payment methods (if any)
  
- **Payment Details Form:**
  - Context-specific fields based on selected method
  - "Save for future use" checkbox
  
- **Terms & Conditions:**
  - Checkbox: "I agree to cancellation policy"
  - Link to view full policy
  
- **Action Buttons:**
  - "Confirm & Pay" (primary, green)
  - "Cancel Booking" (secondary, text button)

**Interaction Flow:**
- Review details → Select payment method → Enter payment details
- Tap "Confirm & Pay" → Process payment → Show loading state
- On success → Navigate to confirmation screen
- On failure → Show error with retry option

---

#### 1.2.6 Appointment Confirmation
**Purpose:** Confirm successful booking and provide next steps

**Layout & Components:**
- **Success Animation:**
  - Checkmark animation or success illustration
  
- **Confirmation Message:**
  - "Appointment Booked Successfully!"
  - Booking ID (bold, copyable)
  
- **Appointment Summary Card:**
  - Doctor name and photo
  - Department and location
  - Date and time (large, prominent)
  - "Add to Calendar" button
  
- **What's Next Section:**
  - Numbered steps:
    1. "Arrive 15 minutes early"
    2. "Complete e-check-in on arrival"
    3. "Navigate to [Department Name] using AR"
  
- **Quick Actions:**
  - "Get Directions" (maps to hospital)
  - "View Appointment Details"
  - "Reschedule" (if allowed)
  
- **Contact Information:**
  - Hospital helpline
  - "Need help?" support link
  
- **Primary Button:**
  - "Done" or "Back to Home"

**Interaction Flow:**
- View confirmation → Add to calendar (optional)
- Access directions or return to home
- Receive confirmation SMS/email

---

### 1.3 DIGITAL E-CHECK-IN & QUEUE MANAGEMENT

#### 1.3.1 E-Check-in Screen
**Purpose:** Allow patients to digitally check-in upon campus arrival

**Layout & Components:**
- **Location Verification:**
  - Campus map showing user's current location
  - "You are at [Building/Area Name]" confirmation
  
- **Appointment Details Card:**
  - "Today's Appointment" header
  - Doctor name and department
  - Scheduled time
  - Appointment ID
  
- **Check-in Button:**
  - Large, prominent "Check In Now" button
  - Only enabled when on campus (geofence)
  - Disabled state shows: "Check-in available when you arrive"
  
- **Pre-Check-in Checklist:**
  - Checkboxes for:
    - "Have you had fever in last 24 hours?"
    - "Are you experiencing any new symptoms?"
  - Required screening questions
  
- **Instructions:**
  - "After check-in, you'll join the virtual queue"
  - "We'll notify you when it's your turn"

**Interaction Flow:**
- Enter campus → Geofence triggers check-in availability
- Tap "Check In Now" → Submit screening questions
- Show loading → Confirmation → Navigate to queue status

---

#### 1.3.2 Live Queue Status Screen
**Purpose:** Display real-time queue position and manage patient waiting experience

**Layout & Components:**
- **Header:**
  - "Your Queue Status" title
  - Department and doctor name
  
- **Primary Status Card (Large, Center):**
  - **Queue Position Display:**
    - Large number showing position (e.g., "5")
    - "patients ahead of you" subtext
  - **Visual Queue Indicator:**
    - Progress bar or animated waiting visualization
    - Color-coded: Green (within 15 min), Yellow (15-30 min), Grey (30+ min)
  
- **Estimated Wait Time:**
  - Large text: "Approximately 25 minutes"
  - "Updated just now" timestamp
  - Auto-refresh indicator
  
- **Status Timeline:**
  - Checkpoint indicators:
    - ✓ Checked In (9:15 AM)
    - ⏳ In Queue (Current position: 5)
    - ⏺ Next Steps: Proceed to [Room Number]
  
- **Proximity Notification Banner (when near turn):**
  - Prominent alert: "You're next! Please proceed to Room 203"
  - Map/navigate button
  
- **Queue Management Actions:**
  - "Find Waiting Area" → Navigate to nearest seating
  - "Find Restroom" → Quick POI navigation
  - "Find Cafeteria" → Quick POI navigation
  
- **Support Options:**
  - "Having trouble?" help button
  - "Contact Reception" button
  
- **Bottom Sheet (Expandable):**
  - Today's appointments list
  - Appointment details
  - Reschedule/cancel options

**Interaction Flow:**
- View updates in real-time (WebSocket/polling)
- Receive push notification when 2 patients away
- Tap navigate buttons → Launch AR navigation
- Pull down to manually refresh

---

### 1.4 AR NAVIGATION SCREENS

#### 1.4.1 Navigation Home / POI Search
**Purpose:** Central hub for all campus navigation needs

**Layout & Components:**
- **Search Bar (Top):**
  - Large search field: "Where do you want to go?"
  - Voice search icon
  - Scan QR code icon (for location markers)
  
- **Quick Access Cards:**
  - "My Appointment" - Navigate to booked appointment location
  - "My Parking" - Navigate back to parked car
  
- **Categories (Horizontal Scroll):**
  - Icon-based categories:
    - Departments
    - Services (Lab, Pharmacy, Radiology)
    - Amenities (Cafeteria, Restroom, ATM, Prayer Room)
    - Emergency & Info Desk
  
- **Popular Destinations:**
  - List of frequently searched POIs
  - Each item shows:
    - Icon and name
    - Distance from current location
    - Navigate button
  
- **Current Location Display:**
  - "You are at: Main Building, Level 2"
  - "View Map" button
  
- **Recent Searches:**
  - History of previous navigation queries

**Interaction Flow:**
- Type/voice search → Filter results
- Tap category → Show filtered POI list
- Tap destination → Show route preview → Start navigation
- Tap "My Appointment" → Auto-route to appointment location

---

#### 1.4.2 Live AR/2D Navigation Screen
**Purpose:** Provide hyper-accurate turn-by-turn navigation with dual-mode viewing

**Layout & Components:**

**AR MODE (Device Held Up):**
- **Camera View (Full Screen):**
  - Live camera feed with AR overlays
  
- **AR Navigation Overlays:**
  - **Directional Arrow:**
    - Large, animated 3D arrow on floor/path
    - Color: Blue (following path), Green (approaching destination)
  - **Distance Indicator:**
    - Floating text: "15 meters ahead"
  - **Destination Marker:**
    - 3D pin at destination when in view
  - **Path Line:**
    - Virtual line on floor showing route
  
- **Top HUD (Overlay):**
  - Mini-map (top-right corner)
  - Current floor/level indicator
  - Destination name
  - "Switch to Map" button (top-left)
  
- **Bottom HUD (Overlay):**
  - **Next Instruction Card (Semi-transparent):**
    - Icon (turn, straight, stairs, elevator)
    - Text: "In 20m, turn right"
    - Distance counter
  - Progress bar to destination
  - Exit navigation button

**2D MAP MODE (Device Held Down):**
- **Map View (Full Screen):**
  - Floor plan with:
    - Blue dot showing user location (pulsing)
    - Blue route line to destination
    - POI markers
    - Room numbers and labels
  
- **Navigation Panel (Bottom Sheet):**
  - **Next Step Card:**
    - Step number (1 of 7)
    - Direction icon
    - Instruction text: "Continue straight for 50m"
    - Distance remaining
  
- **Map Controls:**
  - Zoom buttons (+/-)
  - Floor selector (if multi-level route)
  - Recenter button
  - "Switch to AR" button
  
- **Top Info Bar:**
  - Destination name
  - Total distance
  - Estimated time
  - Exit navigation (X)
  
- **Turn-by-Turn List (Expandable):**
  - Swipe up to view all steps
  - List of all navigation instructions
  - Each step shows icon and description

**Automatic Mode Switching:**
- Accelerometer detects orientation
- Smooth transition animation (300ms)
- Visual cue: "Hold phone up for AR view" / "Hold down for map view"

**Additional Features (Both Modes):**
- **Voice Guidance:**
  - Speaker icon to toggle audio directions
  - Haptic feedback on turns
  
- **Accessibility Mode:**
  - High contrast AR elements
  - Larger text and icons
  - Audio-only navigation option
  
- **Rerouting:**
  - Automatic detection if off-path
  - "Recalculating route..." notification
  - New route visualization

**Interaction Flow:**
- Start navigation → Choose AR or Map mode
- Follow visual/audio cues to destination
- Toggle between modes by tilting device
- Arrival notification → End navigation

---

#### 1.4.3 Parking Lot Navigation
**Purpose:** Guide users to their assigned parking slot

**Layout & Components:**
- **Parking Lot Map:**
  - Aerial/floor view of parking area
  - Slot grid with labels (A1, A2, B1, etc.)
  - User's assigned slot highlighted (green)
  - User's current location (blue dot)
  - Route path (blue line)
  
- **Assigned Slot Card (Top):**
  - Large slot number: "A-15"
  - Zone/level information
  - Distance from current location
  
- **Navigation Instructions:**
  - Turn-by-turn directions
  - "Follow the blue line to your spot"
  
- **Visual Aids:**
  - Directional arrows at decision points
  - Landmarks: "Turn left after Row C"
  
- **Bottom Actions:**
  - "I've Parked" button (updates session)
  - "Different Spot?" (report issue)
  - Switch to AR mode for in-lot navigation

**Interaction Flow:**
- Enter parking area → Map loads automatically
- Follow route → Update in real-time
- Arrive at slot → Tap "I've Parked" → Confirmation

---

### 1.5 PARKING MANAGEMENT

#### 1.5.1 Parking QR Scan & Payment
**Purpose:** Handle parking entry, payment, and slot assignment

**Layout & Components:**
- **Entry Screen:**
  - Large QR code scanner viewport
  - "Scan QR code at parking gate" instruction
  - Manual entry option (text link)
  
- **Payment Screen (Post-Scan):**
  - **Session Details Card:**
    - Hospital name and parking area
    - Entry time (auto-captured)
  
  - **Duration Selection:**
    - Time picker: 1 hour, 2 hours, 4 hours, Full day
    - Each option shows price
    - Recommended based on appointment duration
  
  - **Fee Display:**
    - Selected duration
    - Rate per hour
    - **Total Amount** (large, bold)
    - "Estimated end time" display
  
  - **Payment Method:**
    - Saved methods (if any)
    - Add new payment method
    - Pay via UPI, Card, Wallet
  
  - **Terms:**
    - "Overstay charges apply" notice
    - Link to parking policy
  
- **Action Button:**
  - "Pay & Get Slot" (primary CTA)

**Interaction Flow:**
- Scan QR → Load parking details → Select duration
- Choose payment method → Process payment
- On success → Slot assignment → Navigate to confirmation

---

#### 1.5.2 Digital Parking Ticket
**Purpose:** Display active parking session and provide quick access to navigation

**Layout & Components:**
- **Ticket Card (Styled like ticket):**
  - "PARKING TICKET" header
  - QR code (large, center) for exit verification
  
  - **Session Details:**
    - Slot Number (very large, bold): "A-15"
    - Zone/Level: "Level 2, Zone A"
    - Entry Time: "10:30 AM"
    - Paid Until: "2:30 PM" (4 hours)
    - Time Remaining: Countdown timer
  
  - **Visual Status Indicator:**
    - Green: Active session
    - Yellow: Expiring soon (< 30 min)
    - Red: Expired
  
- **Quick Actions:**
  - "Navigate to My Car" (primary button)
  - "Extend Time" (if expiring)
  - "Exit Parking" (when ready to leave)
  
- **Vehicle Details (Expandable):**
  - Vehicle number
  - Vehicle type
  - Photo of parked car (optional)
  
- **Important Info:**
  - "Show this QR code at exit gate"
  - Overstay charges information
  
- **Bottom Navigation:**
  - Screenshot prevention notice
  - "Save to Wallet" option (for Apple/Google Wallet)

**Interaction Flow:**
- Active session always accessible from home dashboard
- Tap "Navigate" → Launch AR navigation to car
- Tap "Exit" → Verify with guard → Close session
- Time expiry alert → Prompt to extend or exit

---

### 1.6 MEDICAL RECORDS & HISTORY

#### 1.6.1 Profile Management
**Purpose:** Manage personal and medical information

**Layout & Components:**
- **Profile Header:**
  - Profile photo (editable)
  - Name and patient ID
  - Member since date
  
- **Tabs Navigation:**
  - Personal Info
  - Medical History
  - Emergency Contacts
  - Settings
  
- **Personal Info Section:**
  - Full name
  - Date of birth
  - Gender
  - Blood group
  - Contact details (phone, email)
  - Address
  - Insurance information
  - Edit button for each field
  
- **Medical History Section:**
  - **Current Medications:**
    - List of active medications
    - Add/remove medications
  
  - **Allergies:**
    - List with severity indicators
    - Add/remove allergies
  
  - **Chronic Conditions:**
    - Diagnosed conditions with dates
    - Manage list
  
  - **Previous Surgeries:**
    - Surgery name, date, hospital
    - Add new entries
  
  - **Family Medical History:**
    - Hereditary conditions
    - Family member relationships
  
- **Emergency Contacts:**
  - Primary and secondary contacts
  - Name, relationship, phone number
  - Add/edit/delete contacts
  
- **Settings:**
  - Notification preferences
  - Privacy settings
  - Data sharing preferences
  - Language selection

**Interaction Flow:**
- Tap section → Edit mode
- Modify fields → Save changes
- Confirmation on successful update

---

#### 1.6.2 History & Records View
**Purpose:** Access comprehensive health records and transaction history

**Layout & Components:**
- **Filter Bar (Top):**
  - Dropdown: All Records / Appointments / Prescriptions / Payments / Reports
  - Date range selector
  - Search bar
  
- **Records List (Grouped by Date):**
  
  **Each Record Type has specific card:**
  
  **Appointment Card:**
  - Date and time
  - Doctor name and department
  - Status badge (Completed, Cancelled, Upcoming)
  - "View Details" button
  
  **Prescription Card:**
  - Date issued
  - Prescribing doctor
  - Number of medications
  - "View Prescription" button
  - "Reorder Medicines" option (if applicable)
  
  **Payment Card:**
  - Transaction date
  - Amount paid
  - Payment method
  - Purpose (Consultation, Pharmacy, Parking, etc.)
  - Download receipt button
  
  **Lab Report Card:**
  - Test name
  - Date of test
  - "View Report" button
  - Download PDF option
  
- **Quick Stats (Top Section):**
  - Total appointments this year
  - Total amount spent
  - Upcoming appointments count
  
- **Empty State:**
  - Illustration with "No records found"
  - Encourage booking first appointment

**Interaction Flow:**
- Browse timeline → Tap card for details
- Filter/search for specific records
- Download/share documents as needed

---

#### 1.6.3 Prescription Detail View
**Purpose:** Display complete prescription information

**Layout & Components:**
- **Prescription Header:**
  - Hospital logo and letterhead
  - "PRESCRIPTION" title
  - Prescription ID and date
  
- **Patient Information:**
  - Name and patient ID
  - Age, gender, blood group
  
- **Doctor Information:**
  - Doctor name and credentials
  - Specialization
  - Registration number
  - Department
  - Digital signature
  
- **Diagnosis:**
  - Primary diagnosis/reason for visit
  - ICD codes (if applicable)
  
- **Medications List:**
  **For each medication:**
  - Medicine name (generic and brand)
  - Dosage (e.g., 500mg)
  - Frequency (e.g., Twice daily)
  - Duration (e.g., 7 days)
  - Instructions (e.g., After meals)
  - Total quantity
  
- **Additional Instructions:**
  - Special notes from doctor
  - Precautions
  - Follow-up recommendations
  
- **Actions:**
  - Download PDF
  - Share (with pharmacy, family)
  - "Order Medicines" (link to pharmacy)
  - Print option
  
- **Security Features:**
  - Watermark: "Digital Prescription"
  - QR code for verification
  - Timestamp
  
- **Anti-Screenshot Alert:**
  - "For your safety, this prescription is protected"

**Interaction Flow:**
- View prescription details
- Share with pharmacy or family
- Order medicines online (if integrated)
- Download for records

---

#### 1.6.4 Payment History Detail
**Purpose:** Show comprehensive payment transaction details

**Layout & Components:**
- **Transaction Header:**
  - "PAYMENT RECEIPT" title
  - Transaction ID
  - Date and time
  
- **Payment Status:**
  - Large status badge: Success/Pending/Failed
  - Amount paid (very large, bold)
  
- **Transaction Details:**
  - Payment method (with last 4 digits if card)
  - Reference number
  - Payment gateway transaction ID
  
- **Bill Breakdown:**
  - Service/item description
  - Itemized charges
  - Subtotal
  - Taxes (if applicable)
  - Discounts (if any)
  - Total amount
  
- **Related Information:**
  - If appointment: Doctor name, date, time
  - If parking: Slot number, duration
  - If pharmacy: Prescription ID, items purchased
  
- **Actions:**
  - Download receipt (PDF)
  - Email receipt
  - Print receipt
  - Report issue
  
- **Support Information:**
  - Customer care contact
  - Refund policy link

**Interaction Flow:**
- View transaction details
- Download/email receipt
- Report issues if needed

---

### 1.7 POST-CONSULTATION SCREENS

#### 1.7.1 Post-Visit Feedback
**Purpose:** Collect patient feedback to improve service quality

**Layout & Components:**
- **Header:**
  - "How was your experience?" title
  - Doctor/department information
  - Visit date
  
- **Rating Sections:**
  
  **Overall Experience:**
  - 5-star rating selector
  - Emoji feedback (Very Unhappy to Very Happy)
  
  **Specific Ratings:**
  - Doctor behavior (1-5 stars)
  - Wait time (1-5 stars)
  - Cleanliness (1-5 stars)
  - Navigation experience (1-5 stars)
  - Staff helpfulness (1-5 stars)
  
- **Written Feedback:**
  - Text area: "Tell us more about your experience"
  - Placeholder suggestions
  - Character counter
  
- **Quick Response Buttons:**
  - Pre-defined feedback chips:
    - "Great service"
    - "Long wait time"
    - "Friendly staff"
    - "Navigation was helpful"
    - Custom option
  
- **Privacy Notice:**
  - "Your feedback is anonymous"
  - "We use this to improve our services"
  
- **Actions:**
  - "Submit Feedback" (primary)
  - "Skip for Now" (secondary)

**Interaction Flow:**
- Complete consultation → Prompt for feedback
- Provide ratings → Write comments (optional)
- Submit → Thank you message → Return to home

---

## 2. RECEPTION STAFF - Web Dashboard (Next.js)

### 2.1 Staff Dashboard Home
**Purpose:** Central hub for reception staff to manage daily operations

**Layout & Components:**
- **Header Bar:**
  - Hospital logo
  - Staff name and role
  - Quick stats: Patients checked-in today, pending appointments
  - Notification bell
  - Profile menu
  
- **Today's Overview Cards:**
  - Total Appointments Today
  - Checked-In Patients
  - Walk-In Patients
  - Pending Check-Ins
  
- **Quick Actions Panel:**
  - "Create Walk-In Appointment" (large button)
  - "View Doctor Schedules"
  - "Patient Search"
  - "Emergency Registration"
  
- **Active Queues Summary:**
  - Table showing all departments
  - Current queue length per doctor
  - Last patient checked-in time
  - Click to view details
  
- **Recent Activity Feed:**
  - Real-time log of:
    - New appointments created
    - Check-ins completed
    - Cancellations/reschedules
    - System alerts

**Interaction Flow:**
- Monitor real-time activity
- Quick access to common tasks
- Navigate to specific doctor queues

---

### 2.2 Doctor Booking Details View
**Purpose:** Monitor and manage appointments for specific doctors

**Layout & Components:**
- **Doctor Selection:**
  - Dropdown: Select doctor
  - Department filter
  - Date picker (default: today)
  
- **Doctor Info Card:**
  - Photo and name
  - Department and specialty
  - Today's schedule (start-end time)
  - Total appointments: X booked, Y completed, Z pending
  
- **Appointment Timeline:**
  - Chronological list of all appointments for selected date
  
  **Each Appointment Card:**
  - Time slot
  - Patient name and ID
  - Appointment type (New/Follow-up)
  - Status badge:
    - Confirmed (blue)
    - Checked-In (green)
    - In Consultation (orange)
    - Completed (grey)
    - Cancelled (red)
  - Patient contact number
  - "View Details" button
  - "Check-In Patient" button (if confirmed)
  
- **Queue Status Panel (Right Sidebar):**
  - Current queue position
  - Patients in waiting area
  - Average wait time
  - Next patient details
  
- **Actions:**
  - "Add Walk-In Appointment" button
  - "Print Schedule" option
  - "Send Reminders" bulk action
  - Filter by status

**Interaction Flow:**
- Select doctor and date
- View appointment list
- Manually check-in patients
- Add walk-in appointments
- Monitor queue in real-time

---

### 2.3 Manual Appointment Creation
**Purpose:** Create appointments for non-registered or walk-in patients

**Layout & Components:**
- **Form Layout (Multi-Step):**

**Step 1: Patient Search/Create**
- Search bar: "Search existing patient by phone/ID"
- **If existing:** Load patient details
- **If new:** "Create Temporary Profile" option

**Step 2: Patient Details**
- **Personal Information:**
  - Full name (required)
  - Contact number (required)
  - Age/DOB
  - Gender
  - Email (optional)
  
- **Basic Medical Information:**
  - Chief complaint/reason for visit (text area)
  - Known allergies (multi-select)
  - Current medications (multi-select)
  - Emergency contact
  
- **Temporary Profile Notice:**
  - "This is a temporary profile for today's visit"
  - "Patient can create full account via mobile app"

**Step 3: Appointment Details**
- Department selection (dropdown)
- Doctor selection (filtered by department)
- Available time slots (grid view)
- Consultation type (In-person/Tele)
- Priority level (Normal/Urgent)

**Step 4: Payment**
- Fee display (based on doctor)
- Payment mode:
  - Cash
  - Card (terminal)
  - UPI
  - To be collected
- Payment status selection

**Step 5: Confirmation**
- Review all details
- Generate temporary patient ID
- Print appointment slip option
- "Create Appointment" button

**Right Panel (always visible):**
- Summary of entered information
- Back buttons for each step
- Save as draft option
- Cancel creation button

**Interaction Flow:**
- Search for patient or create new
- Fill required information
- Select doctor and slot
- Process payment
- Generate appointment → Print slip

---

### 2.4 Patient Check-In Interface
**Purpose:** Manually check-in patients who arrive at reception

**Layout & Components:**
- **Search Section:**
  - Search bar: "Enter appointment ID, phone, or name"
  - Today's appointments filter
  - Department filter
  
- **Search Results:**
  - List of matching appointments
  - Each result shows:
    - Patient name
    - Appointment time
    - Doctor name
    - Current status
    - "Check-In" button
  
- **Check-In Confirmation Modal:**
  - Patient details verification
  - Appointment details
  - Screening questions:
    - "Any fever or symptoms?"
    - "First visit or follow-up?"
  - COVID screening (if applicable)
  - "Confirm Check-In" button
  
- **Post Check-In:**
  - Success message
  - Queue position assigned
  - Print queue ticket option
  - Directions to waiting area
  
- **Bulk Check-In:**
  - Multi-select appointments
  - Bulk check-in action

**Interaction Flow:**
- Search for patient appointment
- Verify details
- Complete screening
- Check-in → Assign queue number
- Provide directions

---

## 3. DOCTOR - Web Dashboard (Next.js)

### 3.1 Doctor Dashboard Home
**Purpose:** Comprehensive view of doctor's daily schedule and operations

**Layout & Components:**
- **Header:**
  - Hospital logo
  - Doctor name and photo
  - Department
  - Today's date
  - Notification bell
  - Profile menu
  
- **Key Metrics Cards (Top Row):**
  - **Today's Appointments:**
    - Total count
    - Completed / Pending breakdown
    - Progress bar
  
  - **Current Queue:**
    - Number of patients waiting
    - Average wait time
    - "View Queue" link
  
  - **Today's Revenue:**
    - Total consultation fees
    - Number of consultations
    - Comparison with average
  
  - **Next Patient:**
    - Patient name
    - Queue number
    - "View Details" button
  
- **Main Content Area:**
  - Tabs: Calendar | Kanban | List View

**Calendar View:**
- Monthly/weekly/daily toggle
- Time slots with appointments
- Color-coded by status:
  - Blue: Confirmed
  - Green: Checked-in
  - Orange: In-progress
  - Grey: Completed
- Drag-and-drop to reschedule
- Click slot to view/edit details

**Kanban View:**
- Columns:
  - **Scheduled** (upcoming appointments)
  - **Checked-In** (patients in queue)
  - **In Consultation** (current patient)
  - **Completed** (finished today)
  
- Cards draggable between columns
- Each card shows:
  - Patient name
  - Appointment time
  - Quick actions (View, Start, Complete)

**List View:**
- Table with columns:
  - Time
  - Patient Name
  - Age/Gender
  - Appointment Type
  - Status
  - Actions

- **Quick Filters:**
  - By status
  - By time range
  - By consultation type

**Right Sidebar:**
- **Today's Schedule Summary:**
  - Total appointments
  - Available slots
  - Break times
  
- **Quick Actions:**
  - "Start Consultation" button
  - "Add Note"
  - "Block Time Slot"
  - "View Profile Settings"

**Interaction Flow:**
- View at-a-glance daily schedule
- Switch between views as preferred
- Drag-drop to manage appointments
- Click patient card → Open patient details

---

### 3.2 Live Patient Card Feed
**Purpose:** Real-time queue management and patient consultation interface

**Layout & Components:**
- **Queue Panel (Left Sidebar, ~30% width):**
  - "Today's Queue" header
  - Patient count and average wait time
  - **Waiting Patients List:**
    - Cards in queue order
    - Each card shows:
      - Position number (large)
      - Patient name
      - Age and gender
      - Appointment time
      - Check-in time
      - Wait duration
      - Status indicator (waiting/called)
  - "Call Next Patient" button
  - Auto-scroll to current patient

- **Current Patient View (Main Area, ~70% width):**
  
  **Patient Header Card:**
  - Large patient name
  - Patient ID and age
  - Photo (if available)
  - Contact information
  - Today's appointment time
  
  **Patient Blueprint Tabs:**
  
  **1. Overview Tab:**
  - **Chief Complaint:**
    - Reason for today's visit (large text)
  - **Vital Signs Entry:**
    - Blood pressure
    - Pulse
    - Temperature
    - Weight
    - Quick input fields
  
  - **Quick Medical Summary:**
    - Known allergies (highlighted in red)
    - Current medications
    - Chronic conditions
    - Last visit date and summary
  
  **2. Medical History Tab:**
  - Complete past medical history
  - Previous diagnoses
  - Past surgeries
  - Family medical history
  - Immunization records
  - Scrollable detailed view
  
  **3. Past Visits Tab:**
  - Chronological list of previous consultations
  - Each visit shows:
    - Date
    - Diagnosis
    - Prescriptions issued
    - Lab tests ordered
    - Follow-up notes
  - "View Full Record" for each
  
  **4. Documents Tab:**
  - Uploaded medical reports
  - Lab results
  - Imaging reports
  - Previous prescriptions
  - Document viewer with download option
  
  **5. Prescription Tab (Active):**
  - Digital prescription creation interface (detailed below)
  
  **Action Buttons (Bottom Bar):**
  - "Create Prescription" (primary, blue)
  - "Order Lab Tests"
  - "Refer to Specialist"
  - "Schedule Follow-up"
  - "Add Notes"
  - "Mark as Complete" (green)
  - "Cancel Consultation"

**Interaction Flow:**
- View next patient in queue automatically
- Review patient blueprint across tabs
- Create prescription
- Mark complete → Auto-advance to next patient
- Queue updates in real-time

---

### 3.3 Digital Prescription Creation Interface
**Purpose:** Efficient electronic prescription generation

**Layout & Components:**
- **Prescription Form (Integrated in Patient View):**

**Diagnosis Section:**
- Text area: "Primary diagnosis"
- ICD-10 code search and select
- Add secondary diagnoses

**Medication Search & Add:**
- **Search Bar:**
  - "Search medicines by name or composition"
  - Autocomplete dropdown with:
    - Medicine name (brand and generic)
    - Dosage forms available
    - Common strengths
  
- **Selected Medications List:**
  **Each medication entry shows:**
  - Medicine name (editable)
  - **Dosage:** Dropdown (10mg, 25mg, 500mg, etc.)
  - **Frequency:** Quick select buttons:
    - Once daily
    - Twice daily
    - Thrice daily
    - Custom (opens time picker)
  - **When to take:** Before/After meals, empty stomach
  - **Duration:** Number + dropdown (days/weeks/months)
  - **Quantity:** Auto-calculated based on frequency and duration
  - **Special instructions:** Text field
  - Remove button (X)
  
- **Add Medicine Button:** "Search and add another medicine"

**Additional Instructions:**
- Text area: "General instructions to patient"
- Common templates dropdown:
  - "Avoid alcohol"
  - "Complete full course"
  - "Take with plenty of water"
  - Custom

**Lab Tests / Investigations:**
- Search and add lab tests
- List of selected tests
- Instructions for labs

**Follow-Up:**
- Checkbox: "Schedule follow-up"
- Duration selector: 1 week / 2 weeks / 1 month / Custom
- Notes for follow-up

**Prescription Preview:**
- Expandable section showing formatted prescription
- Hospital letterhead
- Doctor signature
- All entered details formatted

**Action Buttons:**
- "Save as Draft"
- "Preview" (opens formatted view)
- "Send to Patient" (primary action)
- "Print"
- "Cancel"

**Interaction Flow:**
- Search and add medicines
- Configure dosage and instructions
- Add any additional notes/tests
- Preview prescription
- Send to patient → Triggers notification
- Auto-save draft every 30 seconds

---

### 3.4 Prescription Templates
**Purpose:** Quick access to commonly prescribed medication combinations

**Layout & Components:**
- Accessible via "Use Template" button in prescription form
- **Template Modal:**
  - **Personal Templates:**
    - Doctor's saved templates
    - Each shows:
      - Template name
      - Conditions it's for
      - Number of medicines
      - Last used date
    - "Edit" and "Use" buttons
  
  - **Department Templates:**
    - Shared templates from department
    - Common protocols
  
  - **Template Editor:**
    - Pre-filled medication list
    - Can modify before applying
    - "Save as New Template" option
    - "Update Template" option
    - "Apply to Current Prescription" button

**Interaction Flow:**
- Click "Use Template"
- Select template
- Modify if needed
- Apply to current prescription

---

### 3.5 Doctor Profile Management
**Purpose:** Manage professional details, schedule, and preferences

**Layout & Components:**
- **Sidebar Navigation:**
  - Profile Information
  - Schedule & Availability
  - Consultation Fees
  - Specializations
  - Holidays & Leaves
  - Preferences
  - Account Settings

**Profile Information Tab:**
- Profile photo (upload/change)
- Full name and credentials
- Registration number
- Department
- Specializations (multi-select)
- Languages spoken
- Years of experience
- Education details
- Certificates/qualifications
- Bio (for patient-facing profile)
- Contact information

**Schedule & Availability Tab:**
- **Weekly Schedule Grid:**
  - Days (Mon-Sun) in rows
  - Time slots in columns
  - Click cell to mark available/unavailable
  - Color-coded:
    - Green: Available
    - Grey: Not available
    - Orange: Limited slots
  
- **For each time slot:**
  - Start time
  - End time
  - Maximum appointments
  - Slot duration (e.g., 15 min/patient)
  
- **Break Times:**
  - Add break slots
  - Lunch break
  - Tea breaks
  
- **Consultation Locations:**
  - Select rooms/clinics
  - Add multiple locations
  
- **Special Hours:**
  - Emergency on-call times
  - Weekend availability

**Consultation Fees Tab:**
- **Fee Structure:**
  - New patient consultation fee
  - Follow-up consultation fee
  - Video consultation fee (if offered)
  - Emergency consultation fee
  
- **Payment Settings:**
  - Accepted payment methods
  - Refund policy
  - Cancellation charges

**Holidays & Leaves Tab:**
- **Calendar View:**
  - Mark holidays
  - Planned leaves
  - Conference dates
  
- **Leave Request Form:**
  - Date range picker
  - Reason
  - Substitute doctor (if any)
  - "Submit for Approval" button
  
- **Upcoming Holidays List:**
  - List view of all marked dates
  - Edit/delete options

**Preferences Tab:**
- Notification settings
- Dashboard layout preferences
- Default prescription template
- Language preference
- Timezone
- Auto-logout timer

**Interaction Flow:**
- Navigate through tabs
- Edit relevant information
- Save changes
- Preview patient-facing profile
- Approve change confirmations

---

## 4. ADMIN (Super Admin) - Web Dashboard (Next.js)

### 4.1 Admin Dashboard Home
**Purpose:** Organization-wide overview and quick access to admin functions

**Layout & Components:**
- **Header:**
  - Hospital logo
  - "Admin Dashboard" title
  - Admin name and role
  - Date and time
  - Notifications
  - Profile menu

- **Key Metrics (Top Row - 4 Cards):**
  - **Total Staff & Doctors:**
    - Count with breakdown
    - Active vs inactive
  
  - **Today's Operations:**
    - Total appointments
    - Total patients
    - Revenue
  
  - **System Health:**
    - Uptime percentage
    - Active users
    - API response time
  
  - **Pending Actions:**
    - Unresolved complaints
    - Pending approvals
    - System alerts

- **Quick Actions Panel:**
  - "Add Staff/Doctor"
  - "View Live Occupancy"
  - "Generate Reports"
  - "Manage Departments"
  - "System Settings"

- **Dashboard Widgets (Grid Layout):**
  
  **Recent Activity:**
  - System logs
  - User registrations
  - Important events
  
  **Alerts & Notifications:**
  - System alerts
  - Critical issues
  - Pending approvals
  
  **Usage Analytics:**
  - Charts showing:
    - Daily appointments trend
    - Department-wise patient distribution
    - Peak hours analysis
    - Revenue trend
  
  **Department Status:**
  - List of all departments
  - Current occupancy
  - Doctors on duty
  - Queue status

- **Navigation Menu (Left Sidebar):**
  - Dashboard (Home)
  - Staff Management
  - Doctor Management
  - Department Management
  - Live Occupancy
  - Operations Dashboard
  - Complaints & Feedback
  - Reports & Analytics
  - System Settings
  - User Management

**Interaction Flow:**
- View high-level metrics
- Navigate to specific management areas
- Monitor real-time operations
- Respond to alerts

---

### 4.2 Staff & Doctor CRUD Management
**Purpose:** Comprehensive user management for hospital personnel

**Layout & Components:**
- **View Toggle:**
  - "Staff Members" tab
  - "Doctors" tab
  - "All Users" tab

- **Action Bar (Top):**
  - Search bar: "Search by name, ID, or department"
  - Filters:
    - Department
    - Role
    - Status (Active/Inactive)
    - Specialization (for doctors)
  - Sort by: Name, Date joined, Department
  - "Add New Staff" / "Add New Doctor" button (large, primary)
  - Export data button
  - Bulk actions dropdown

- **User List (Table View):**
  **Columns:**
  - Profile photo (thumbnail)
  - Name
  - Unique User ID (generated)
  - Role/Designation
  - Department
  - Contact
  - Status badge (Active/Inactive/Pending)
  - Last login
  - Actions (View/Edit/Deactivate)
  
  **Row Actions:**
  - Click row → Open detail view
  - Hover → Quick actions menu
  - Checkbox for bulk selection

- **Add/Edit User Form (Modal/Sidebar):**
  
  **Personal Information:**
  - Profile photo upload
  - Full name (required)
  - Date of birth
  - Gender
  - Contact number (required)
  - Email (required)
  - Address
  
  **Professional Information:**
  
  **For Staff:**
  - Employee ID (auto-generated)
  - Designation/Role
  - Department
  - Reporting manager
  - Date of joining
  
  **For Doctors:**
  - Medical registration number
  - Specialization (multi-select)
  - Sub-specializations
  - Department(s)
  - Years of experience
  - Education qualifications
  - Consultation fee
  
  **Account Setup:**
  - **Unique User ID:** 
    - Auto-generated alphanumeric ID
    - Format: HOS-DOC-XXXXX or HOS-STF-XXXXX
    - Display prominently
    - Copy button
  
  - Role assignment (dropdown):
    - Doctor
    - Reception Staff
    - Nurse
    - Lab Technician
    - Pharmacist
    - Administrator
  
  - Permissions (checkboxes):
    - Based on role
    - Custom permissions available
  
  - Initial password:
    - Auto-generated
    - "Send via SMS/Email" option
  
  **Confirmation Requirement:**
  - Notice: "User must confirm this ID during first login"
  - Security measure explanation
  
  **Schedule Setup (For Doctors):**
  - Weekly schedule
  - Available time slots
  - Consultation duration
  - Locations
  
  **Documents:**
  - Upload certificates
  - Upload IDs
  - Medical license
  
  **Action Buttons:**
  - "Save & Send Credentials" (primary)
  - "Save as Draft"
  - "Cancel"

- **User Detail View (Right Sidebar/Full Page):**
  - Complete profile information
  - Activity log
  - Appointment history (for doctors)
  - Performance metrics
  - Documents section
  - Edit button
  - Deactivate/Activate button
  - Reset password button

**Interaction Flow:**
- Search/filter users
- Click "Add New" → Fill form
- Generate unique ID → Display to user
- Save → Send credentials to user
- User confirms ID on first login
- Admin can edit/deactivate as needed

---

### 4.3 Live Occupancy Dashboard
**Purpose:** Real-time monitoring of facility utilization

**Layout & Components:**
- **Tab Navigation:**
  - Parking Occupancy
  - Department Occupancy
  - Room Occupancy
  - Equipment Status

**Parking Occupancy Tab:**
- **Overview Cards:**
  - Total Slots: 500
  - Occupied: 385 (77%)
  - Available: 115
  - Reserved: 50
  
- **Visual Parking Map:**
  - Floor plan of parking areas
  - Color-coded slots:
    - Green: Available
    - Red: Occupied
    - Blue: Reserved
    - Grey: Out of service
  - Zoom and pan controls
  - Click slot → See details (vehicle info, duration)
  
- **Parking Analytics:**
  - Occupancy trend graph (24-hour)
  - Peak hours indicator
  - Average duration
  - Revenue generated
  
- **Real-Time Feed:**
  - Latest entries
  - Latest exits
  - Timestamp for each

**Department Occupancy Tab:**
- **Department Cards Grid:**
  Each department card shows:
  - Department name and icon
  - Current patient count
  - Capacity
  - Occupancy percentage (progress bar)
  - Number of doctors on duty
  - Queue length
  - Color indicator (Green: <70%, Yellow: 70-90%, Red: >90%)
  
- **Department Detail View (Click card):**
  - Room-wise breakdown
  - Bed occupancy (for inpatient depts)
  - Doctor schedule
  - Patient flow rate
  - Average wait time
  
- **Filters:**
  - By floor/building
  - By type (OPD/IPD/Emergency)
  - Show only critical occupancy

**Room Occupancy Tab:**
- Table view of all rooms
- Columns:
  - Room number
  - Type (Consultation/Procedure/Ward)
  - Department
  - Status (Available/Occupied/Cleaning/Maintenance)
  - Current occupant (if any)
  - Duration
  - Expected vacancy time
  
- **Filters:**
  - By floor
  - By room type
  - By status

**Equipment Status Tab:**
- List of major equipment
- Each entry shows:
  - Equipment name
  - Location
  - Status (Available/In Use/Under Maintenance)
  - Last maintenance date
  - Next scheduled maintenance
  - Usage hours today
  
- **Maintenance Scheduler:**
  - Quick schedule maintenance button
  - View maintenance history

**Real-Time Updates:**
- Auto-refresh every 30 seconds
- Live update indicator
- Push notifications for critical occupancy levels
- Export occupancy reports

**Interaction Flow:**
- Monitor real-time occupancy across facilities
- Identify congestion points
- Allocate resources dynamically
- Generate occupancy reports for planning

---

### 4.4 Operations & Metrics Dashboard
**Purpose:** Organization-wide operational analytics and performance monitoring

**Layout & Components:**
- **Date Range Selector (Top):**
  - Quick select: Today, Yesterday, This Week, This Month, Custom Range
  - Date picker for custom range
  - "Compare with previous period" checkbox

- **Key Performance Indicators (Top Row):**
  
  **Patient Metrics:**
  - Total Patients: Count + trend indicator
  - New vs Returning: Ratio with breakdown
  - Patient Satisfaction Score: Average rating
  - No-show Rate: Percentage
  
  **Operational Metrics:**
  - Average Wait Time: Minutes + trend
  - Appointment Utilization: Percentage of slots filled
  - On-time Performance: Consultations starting on time
  - Queue Efficiency: Average time per patient
  
  **Financial Metrics:**
  - Total Revenue: Amount + trend
  - Revenue by Department: Breakdown
  - Collection Efficiency: Percentage
  - Outstanding Payments: Amount
  
  **Resource Utilization:**
  - Doctor Utilization: Hours worked vs available
  - Facility Utilization: Occupancy rates
  - Equipment Usage: Hours/Sessions

- **Visual Analytics Section:**

  **Appointment Trends:**
  - Line graph showing appointments over time
  - Breakdown by department
  - Filters: Department, Doctor, Type
  
  **Patient Flow Analysis:**
  - Sankey diagram showing patient journey:
    - Entry → Check-in → Waiting → Consultation → Checkout
  - Bottleneck identification
  - Average time at each stage
  
  **Revenue Analysis:**
  - Bar chart: Revenue by department
  - Pie chart: Revenue by service type
  - Trend comparison
  
  **Department Performance:**
  - Heatmap showing busy periods
  - Rows: Departments
  - Columns: Time slots
  - Color intensity: Patient volume
  
  **Doctor Performance Dashboard:**
  - Table/cards showing per doctor:
    - Total consultations
    - Average consultation time
    - Patient ratings
    - Revenue generated
    - Prescription accuracy
  - Sort and filter options
  
  **Wait Time Analysis:**
  - Distribution chart
  - By department
  - By time of day
  - Identify peak delay periods
  
  **Navigation Usage:**
  - Total navigation sessions
  - Most searched destinations
  - Success rate
  - Average time saved (estimated)
  
  **Parking Metrics:**
  - Average parking duration
  - Peak occupancy times
  - Revenue from parking
  - Overstay incidents

- **Alerts & Insights Panel:**
  - AI-generated insights:
    - "Cardiology wait times increased 15% this week"
    - "Peak appointment time: 10 AM - 12 PM"
    - "Doctor X has highest patient satisfaction"
  - Color-coded alerts (red, yellow, green)
  - Actionable recommendations

- **Export & Reports:**
  - "Generate Report" button
  - Export formats: PDF, Excel, CSV
  - Schedule automated reports
  - Email distribution list

**Interaction Flow:**
- Select date range
- Drill down into specific metrics
- Filter by department/doctor/service
- Export reports for stakeholders
- Set up alerts for KPIs

---

### 4.5 Complaints & Feedback Resolution
**Purpose:** Centralized system for managing patient feedback and resolving issues

**Layout & Components:**
- **Tab Navigation:**
  - All Feedback
  - Complaints (High Priority)
  - Suggestions
  - Compliments
  - Resolved
  - Archived

- **Filter & Sort Bar:**
  - Status: New, In Progress, Resolved, Closed
  - Priority: Critical, High, Medium, Low
  - Category: Service, Facility, Staff, Medical, Navigation, Parking, Other
  - Department
  - Date range
  - Rating (for general feedback)
  - Sort by: Date, Priority, Status

- **Summary Cards (Top):**
  - **Open Complaints:** Count with critical flag
  - **Average Resolution Time:** Days/hours
  - **Satisfaction Improvement:** Percentage trend
  - **Pending Actions:** Count

- **Feedback List (Main Area):**
  **Each feedback card shows:**
  - **Priority Indicator:** Color-coded stripe (red/yellow/green)
  - **Status Badge:** New, In Progress, Resolved
  - **Feedback ID:** Unique identifier
  - **Category Icon:** Visual indicator of type
  - **Title/Subject:** Brief description
  - **Patient Name:** (can be anonymous)
  - **Department/Service:** Related area
  - **Date Submitted:** Timestamp
  - **Assigned To:** Staff member handling
  - **Rating:** If applicable (stars)
  - **Quick Preview:** First 2 lines of feedback
  - **Actions:** View Details, Assign, Resolve
  
  **Visual Indicators:**
  - Red flag: Critical/urgent
  - Clock icon: Overdue response
  - Reply icon: Has admin response

- **Feedback Detail View (Right Sidebar/Modal):**
  
  **Feedback Information:**
  - Full feedback text
  - Category and tags
  - Priority level
  - Status
  - Related appointment (if applicable)
  - Doctor/staff involved (if mentioned)
  - Attachments (images/documents)
  
  **Patient Information:**
  - Name (if not anonymous)
  - Contact details
  - Patient ID
  - Visit date
  - Department visited
  
  **Timeline/Activity Log:**
  - Chronological record:
    - Feedback submitted
    - Assigned to staff member
    - Status changes
    - Internal notes added
    - Response sent
    - Marked resolved
  - Timestamp for each action
  - User who performed action
  
  **Internal Notes Section:**
  - Team discussion area
  - Add notes (text area)
  - Tag team members
  - Attach files/evidence
  - Only visible to admin team
  
  **Response Section:**
  - Text editor for official response
  - Template dropdown:
    - Acknowledgment
    - Apology
    - Resolution explanation
    - Follow-up
    - Custom
  - Preview before sending
  - Send via email/SMS/app notification
  
  **Actions Panel:**
  - Assign to: Dropdown (staff/departments)
  - Change status: Dropdown
  - Change priority: Buttons
  - Add tags: Multi-select
  - Schedule follow-up: Date picker
  - Escalate: Button to escalate to senior management
  - Mark as Resolved: Button (requires resolution notes)
  - Close Complaint: Final action
  
  **Resolution Form (when marking resolved):**
  - Action taken: Text area
  - Root cause: Dropdown + text
  - Preventive measures: Text area
  - Staff involved: Multi-select
  - Resolved by: Auto-filled
  - Resolution date: Auto-filled
  - "Send resolution to patient" checkbox

- **Analytics Dashboard (Separate Tab):**
  **Complaint Trends:**
  - Line graph: Complaints over time
  - Category breakdown (pie chart)
  - Department-wise distribution (bar chart)
  
  **Resolution Metrics:**
  - Average resolution time by category
  - First response time
  - Escalation rate
  - Satisfaction after resolution
  
  **Top Issues:**
  - Most common complaints
  - Recurring problems
  - Staff/department most mentioned
  
  **Performance Tracking:**
  - Resolution rate
  - SLA compliance
  - Team performance metrics

- **Automated Workflows:**
  - Auto-assign based on category
  - SLA timers (e.g., respond within 24 hours)
  - Auto-escalation for overdue items
  - Reminder notifications

**Interaction Flow:**
- View all feedback in unified dashboard
- Filter/sort by priority and category
- Click item → View full details
- Assign to appropriate team member
- Add internal notes and investigation details
- Draft and send response to patient
- Mark as resolved with documentation
- Track metrics and identify patterns
- Generate improvement action plans

---

### 4.6 System Settings & Configuration
**Purpose:** Centralized configuration for platform-wide settings

**Layout & Components:**
- **Settings Navigation (Left Sidebar):**
  - General Settings
  - Hospital Profile
  - Department Management
  - Appointment Configuration
  - Payment Settings
  - Navigation Configuration
  - Parking Settings
  - Notification Settings
  - Security & Access
  - Integrations
  - Backup & Maintenance
  - Legal & Compliance

**General Settings Tab:**
- Hospital name and branding
- Logo upload
- Color scheme customization
- Timezone
- Operating hours
- Holiday calendar
- Emergency contact numbers
- Default language

**Hospital Profile Tab:**
- Complete hospital information
- Address and location
- Contact details
- Departments list
- Facilities available
- Services offered
- Accreditations and certifications
- About/description for patient app

**Department Management Tab:**
- List of all departments
- Add/edit/deactivate departments
- For each department:
  - Name and code
  - Location (building, floor, wing)
  - Head of department
  - Staff allocation
  - Operating hours
  - Services offered
  - Consultation rooms
  - Specializations

**Appointment Configuration Tab:**
- **Booking Settings:**
  - Advance booking limit (days)
  - Cancellation policy
  - Rescheduling rules
  - No-show policy
  - Walk-in acceptance
  
- **Slot Configuration:**
  - Default slot duration
  - Buffer between appointments
  - Emergency slot allocation
  
- **Fees & Charges:**
  - Registration fee
  - Platform fee
  - Cancellation charges
  - Department-wise consultation fees

**Payment Settings Tab:**
- Enabled payment methods
- Payment gateway configuration
- Refund processing rules
- Tax settings
- Invoice templates
- Payment reminders
- Outstanding payment policies

**Navigation Configuration Tab:**
- Multiset AI API credentials
- Campus map updates
- POI management:
  - Add/edit/delete POIs
  - Categories
  - Floor plans upload
- Navigation preferences:
  - Default navigation mode
  - Voice guidance settings
  - Accessibility options

**Parking Settings Tab:**
- Total parking capacity
- Slot configuration
- Pricing structure:
  - Hourly rates
  - Daily rates
  - Special rates (staff, visitors, patients)
- Time limits
- Overstay charges
- Reserved slots allocation
- Payment integration
- QR code generation settings

**Notification Settings Tab:**
- **Push Notifications:**
  - Appointment reminders (timing)
  - Queue updates
  - Prescription ready
  - Payment receipts
  - Feedback requests
  
- **SMS Settings:**
  - SMS gateway configuration
  - Templates for different notification types
  - Sender ID
  
- **Email Settings:**
  - SMTP configuration
  - Email templates
  - From address
  
- **Notification Schedule:**
  - Quiet hours
  - Frequency limits
  - Priority-based delivery

**Security & Access Tab:**
- **Authentication:**
  - Password policies
  - Two-factor authentication
  - Session timeout
  - Single sign-on (SSO)
  
- **Role Management:**
  - Define custom roles
  - Permission sets
  - Access control matrix
  
- **Audit Logs:**
  - Enable/disable logging
  - Log retention period
  - View audit trail
  
- **Data Privacy:**
  - HIPAA compliance settings
  - Data encryption
  - Patient data access logs
  - Consent management

**Integrations Tab:**
- **Third-party Integrations:**
  - Laboratory systems (LIMS)
  - Pharmacy systems
  - Radiology/PACS
  - Electronic Health Records (EHR)
  - Insurance providers
  - Payment gateways
  
- **API Management:**
  - API keys
  - Webhooks configuration
  - Rate limits
  - API documentation access

**Backup & Maintenance Tab:**
- Automatic backup schedule
- Backup storage location
- Restore options
- Database maintenance windows
- System update notifications
- Downtime scheduling
- Maintenance mode toggle

**Legal & Compliance Tab:**
- Terms and conditions (edit)
- Privacy policy (edit)
- Consent forms
- Disclaimer text
- Data retention policies
- Compliance certifications
- Regulatory settings

**Interaction Flow:**
- Navigate through settings categories
- Modify configurations
- Preview changes
- Save with confirmation
- Some changes require system restart
- Audit log for all changes

---

## 5. ADDITIONAL SCREENS & FEATURES

### 5.1 Authentication & Onboarding

#### 5.1.1 Mobile App - Patient Registration/Login
**Purpose:** Secure user authentication and new user onboarding

**Layout & Components:**

**Splash Screen:**
- Waylio logo
- Hospital branding
- Tagline: "Your Healthcare Journey, Simplified"
- Loading indicator

**Welcome Screen:**
- Hero illustration (AR navigation concept)
- Brief value proposition:
  - "Book appointments instantly"
  - "Navigate with AR"
  - "Digital prescriptions"
  - "Smart parking"
- "Get Started" button
- "Already have an account? Login" link

**Registration Screen:**
- "Create Account" header
- **Input Fields:**
  - Full name
  - Mobile number (with country code)
  - Email (optional)
  - Date of birth
  - Gender
  - Password (with strength indicator)
  - Confirm password
- **Terms Acceptance:**
  - Checkbox: "I agree to Terms & Conditions and Privacy Policy"
  - Links to view documents
- "Create Account" button
- "Already registered? Login" link

**OTP Verification:**
- "Verify Mobile Number" header
- Display phone number
- OTP input boxes (6 digits)
- Countdown timer (60 seconds)
- "Resend OTP" link
- "Verify" button

**Login Screen:**
- "Welcome Back" header
- Input fields:
  - Mobile number or email
  - Password
- "Forgot Password?" link
- "Login" button
- "New user? Register" link
- Biometric login icon (fingerprint/face ID if enabled)

**Forgot Password:**
- Enter mobile number/email
- Receive OTP
- Verify OTP
- Set new password
- Confirmation

**Post-Registration Onboarding:**
- **Step 1: Profile Setup**
  - Add profile photo (optional)
  - Verify basic details
  - Add emergency contact
  
- **Step 2: Medical Information**
  - "Help us serve you better"
  - Add known allergies
  - Current medications
  - Chronic conditions
  - Blood group
  - Skip option available
  
- **Step 3: Permissions**
  - Request location access (for navigation)
  - Request camera access (for AR)
  - Request notifications
  - Explanation for each permission
  
- **Step 4: Quick Tutorial**
  - Swipeable cards showing key features
  - "How to book appointment"
  - "How to use AR navigation"
  - "How to access records"
  - Skip tutorial option
  
- **Completion:**
  - "You're all set!" message
  - "Start Exploring" button

**Interaction Flow:**
- New user → Registration → OTP → Onboarding → Home
- Returning user → Login → Home
- Biometric → Quick login → Home

---

#### 5.1.2 Web Dashboard - Staff/Doctor Login
**Purpose:** Secure role-based access to web dashboard

**Layout & Components:**

**Login Page:**
- Hospital logo and name
- "Staff Portal" or "Doctor Portal" title
- **Login Form:**
  - User ID (Unique ID from registration)
  - Password
  - "Remember me" checkbox
  - "Login" button
  - "Forgot password?" link
  - "Contact admin for access" link

**First-Time Login (ID Confirmation):**
- "Welcome! Please confirm your identity"
- Display the Unique User ID sent by admin
- "Enter your Unique User ID" input field
- Verification
- Set new password
- Security questions setup
- "Complete Setup" button

**Two-Factor Authentication (if enabled):**
- After password entry
- OTP sent to registered mobile/email
- Enter OTP
- "Verify & Login"

**Role Selection (if user has multiple roles):**
- "Select your role for this session"
- Radio buttons:
  - Doctor
  - Administrator
  - Reception Staff
- "Continue" button

**Password Reset:**
- Enter User ID
- Security questions
- OTP verification
- Set new password

**Interaction Flow:**
- First-time user → Confirm ID → Set password → Login
- Regular user → Login → 2FA → Dashboard
- Multiple roles → Select role → Appropriate dashboard

---

### 5.2 Error & Empty States

#### 5.2.1 Network Error
**Components:**
- Illustration (disconnected icon)
- Message: "No Internet Connection"
- Description: "Please check your connection and try again"
- "Retry" button

#### 5.2.2 Server Error
**Components:**
- Illustration (server icon)
- Message: "Something went wrong"
- Description: "We're working to fix the issue. Please try again later."
- Error code (if applicable)
- "Retry" button
- "Report Issue" link

#### 5.2.3 No Appointments Found
**Components:**
- Illustration (calendar with search)
- Message: "No appointments found"
- Description: "You haven't booked any appointments yet"
- "Book Your First Appointment" button

#### 5.2.4 No Prescriptions
**Components:**
- Illustration (prescription icon)
- Message: "No prescriptions yet"
- Description: "Your digital prescriptions will appear here after consultation"

#### 5.2.5 Search No Results
**Components:**
- Illustration (magnifying glass)
- Message: "No results found"
- Description: "Try different search terms or filters"
- "Clear Filters" button

#### 5.2.6 GPS/Location Error
**Components:**
- Illustration (location pin with error)
- Message: "Location access required"
- Description: "Enable location to use navigation features"
- "Enable Location" button
- "Skip for now" option

---

### 5.3 Loading & Progress States

#### 5.3.1 Splash Screen Loader
- Hospital logo
- Animated loading indicator
- Progress bar (if applicable)

#### 5.3.2 Content Loading (Skeleton Screens)
- For appointment list: Card skeletons with animated gradient
- For navigation map: Map outline with pulsing placeholder
- For dashboard: Metric card skeletons

#### 5.3.3 Payment Processing
- "Processing Payment..." message
- Animated spinner
- Security icons (lock, shield)
- "Please don't close or refresh"

#### 5.3.4 Navigation Route Calculating
- "Calculating best route..." message
- Map view with pulsing user location
- Progress indicator

#### 5.3.5 Form Submission
- Button changes to loading state
- Disabled interaction
- Spinner inside button
- "Submitting..." text

---

### 5.4 Success & Confirmation Modals

#### 5.4.1 Appointment Booked Success
- Checkmark animation (green circle with tick)
- "Appointment Confirmed!" message
- Booking details summary
- "Add to Calendar" button
- "View Details" button
- "Done" button

#### 5.4.2 Payment Successful
- Success animation
- "Payment Successful!" message
- Transaction ID
- Amount paid
- "Download Receipt" button
- "Done" button

#### 5.4.3 Check-In Successful
- Success animation
- "Checked-In Successfully!" message
- Queue position assigned
- "View Queue Status" button

#### 5.4.4 Prescription Sent
- Success animation
- "Prescription Sent Successfully!" message
- "Patient will receive notification"
- Patient name
- Prescription ID
- "View Prescription" button
- "Create Next Prescription" button

---

### 5.5 Notification Center

#### 5.5.1 In-App Notifications Screen
**Purpose:** View all notifications history

**Layout & Components:**
- **Header:**
  - "Notifications" title
  - "Mark all as read" button
  - Filter icon
  
- **Filter Options:**
  - All
  - Appointments
  - Prescriptions
  - Payments
  - Navigation
  - System

- **Notification List:**
  **Each notification card:**
  - Icon (type-specific)
  - Unread indicator (blue dot)
  - Title (bold if unread)
  - Message preview
  - Timestamp (relative: "2h ago")
  - Tap to expand/navigate
  
- **Notification Types:**
  
  **Appointment Reminder:**
  - "Appointment tomorrow at 10:00 AM with Dr. Smith"
  - "View Details" link
  
  **Queue Update:**
  - "You're next! Proceed to Room 203"
  - "Navigate" button
  
  **Prescription Ready:**
  - "Your prescription is ready"
  - "View Prescription" button
  
  **Payment Receipt:**
  - "Payment of ₹500 received"
  - "View Receipt" button
  
  **System Update:**
  - "New feature: AR Navigation now available"
  - "Learn More" link

- **Empty State:**
  - "No new notifications"
  - Illustration

**Interaction Flow:**
- Tap notification → Navigate to relevant screen
- Swipe to dismiss
- Long press → Delete option

---

### 5.6 Help & Support

#### 5.6.1 Help Center
**Purpose:** Provide self-service support resources

**Layout & Components:**
- **Search Bar:**
  - "How can we help you?"
  - Autocomplete suggestions
  
- **Quick Actions:**
  - Contact Support
  - Report an Issue
  - FAQs
  - Video Tutorials
  
- **Categories:**
  - Getting Started
  - Booking Appointments
  - Using Navigation
  - Managing Parking
  - Payments & Billing
  - Medical Records
  - Account Settings
  
- **Popular Articles:**
  - List of frequently accessed help articles
  - Each with title, brief description, read time
  
- **Video Tutorials:**
  - Short tutorial videos
  - Thumbnail, title, duration
  - Categories: AR Navigation, Booking, E-Check-in
  
- **Contact Support:**
  - Phone: Hospital helpline
  - Email: Support email
  - Live Chat (if available)
  - "Submit a Request" form

**Interaction Flow:**
- Search for issue → View relevant articles
- Browse categories → Find solution
- Can't find answer → Contact support

---

#### 5.6.2 In-App Chat Support
**Purpose:** Real-time support chat

**Layout & Components:**
- Chat interface (messaging style)
- Support agent avatar and name
- Message bubbles (user vs support)
- Type message input
- Attach image option
- Send button
- Quick reply suggestions
- Chat history
- "End Chat" option
- Satisfaction rating after resolution

---

### 5.7 Accessibility Features

#### 5.7.1 Accessibility Settings
**Purpose:** Customize app for accessibility needs

**Layout & Components:**
- **Visual Settings:**
  - High contrast mode toggle
  - Large text size slider
  - Color blind mode options
  - Reduce animations toggle
  
- **Audio Settings:**
  - Voice guidance toggle
  - Voice speed control
  - Volume controls
  - TTS (Text-to-Speech) settings
  
- **Navigation Settings:**
  - 2D map as default (skip AR)
  - Haptic feedback intensity
  - Alternative navigation cues
  
- **Screen Reader Support:**
  - Optimized labels
  - Alt text for images
  - Logical focus order

---