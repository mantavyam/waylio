## 📅 **PHASE 4: P1 - Appointment Booking & Queue Management (Complete)**

**Depends on: Phase 2, Phase 3 | Priority: CRITICAL**

### **Why Now?**

Core feature #1. Doctors and patients are onboarded. Now enable the primary workflow.

### **Deliverables:**

#### **4.1 Doctor/Department Search (Mobile)**

- **Backend APIs:**
    - `GET /api/appointments/doctors` - Search doctors
        - Filters: department, specialization, name, availability
        - Pagination
    - `GET /api/appointments/departments` - List departments
    - `GET /api/appointments/doctors/:id` - Doctor detail
- **Mobile UI Screens:**
    - Search Screen:
        - Search bar with voice input
        - Quick filter chips (specializations)
        - Doctor cards with ratings, fees, next available
    - Doctor Profile Detail:
        - Tabs: About, Availability, Reviews
        - "Book Appointment" CTA

#### **4.2 Time Slot Selection**

- **Backend APIs:**
    - `GET /api/appointments/slots/:doctorId` - Get available slots
        - Query params: date range
        - Check doctor schedule + existing bookings
        - Return available/few-left/booked status
- **Mobile UI:**
    - Calendar view (month + day selection)
    - Time slot grid (AM/PM organized)
    - Visual availability indicators
    - Selected slot preview card

#### **4.3 Pre-Registration & Medical Forms**

- **Backend APIs:**
    - `POST /api/appointments/pre-registration` - Save draft
    - `GET /api/appointments/pre-registration/:id` - Resume draft
- **Mobile UI:**
    - Multi-step form (progress indicator):
        - Personal info (pre-filled from profile)
        - Medical history (pre-filled + update)
        - Chief complaint / reason for visit
        - Insurance info (optional)
    - Auto-save draft feature
    - Data privacy consent checkbox

#### **4.4 Payment Integration**

- **Backend Appointment Service:**
    - `POST /api/appointments/calculate-fee` - Calculate total fee
        - Consultation fee + registration fee + platform fee + taxes
    - `POST /api/appointments/create-payment` - Initiate payment
        - Integration with Razorpay/Stripe
        - Generate order ID
    - `POST /api/appointments/verify-payment` - Verify payment
        - Webhook handler for payment confirmation
- **Backend Payment Service (New):**
    - `POST /api/payments/process` - Process payment
    - `GET /api/payments/:id` - Get payment details
    - `POST /api/payments/refund` - Process refund
    - Store payment records in `payments` table
- **Mobile UI:**
    - Review & Payment Screen:
        - Appointment summary
        - Fee breakdown
        - Payment method selection (Card/UPI/Net Banking/Wallet)
        - Saved payment methods
        - Payment gateway integration
    - Loading state during processing
    - Success/failure handling

#### **4.5 Appointment Confirmation**

- **Backend APIs:**
    - `POST /api/appointments/create` - Create appointment (after payment)
        - Transaction: Create appointment + Update slots + Send notification
    - `GET /api/appointments/:id` - Get appointment details
- **Mobile UI:**
    - Confirmation Screen:
        - Success animation
        - Booking ID (copyable)
        - Appointment summary
        - "Add to Calendar" button
        - "Get Directions" button
        - SMS/Email confirmation sent
- **Notification Triggers:**
    - Appointment confirmation SMS/Email/Push
    - Reminder notification (24h before, 1h before)

#### **4.6 Digital E-Check-in**

- **Backend APIs:**
    - `POST /api/appointments/check-in` - Check-in patient
        - Validate: Patient on campus (geofence check)
        - Update appointment status
        - Add to virtual queue
    - `GET /api/appointments/:id/queue-status` - Get queue position
- **Mobile UI:**
    - E-Check-in Screen:
        - Location verification
        - Appointment details
        - Screening questions (fever, symptoms)
        - "Check In Now" button (enabled only on campus)
    - Confirmation with queue position assigned

#### **4.7 Queue Management System**

- **Backend Queue Logic:**
    - Redis-based queue management:
        - Key: `queue:{doctorId}:{date}`
        - Value: Sorted set with timestamp
    - `POST /api/queue/add` - Add patient to queue
    - `GET /api/queue/:doctorId` - Get queue for doctor
    - `POST /api/queue/next` - Doctor calls next patient
    - `PUT /api/queue/position/:appointmentId` - Update position
    - Queue position calculation algorithm
    - Estimated wait time calculation (based on avg consultation time)
- **Mobile UI - Live Queue Status:**
    - Queue Status Screen:
        - Large position indicator (e.g., "5")
        - Estimated wait time
        - Progress bar
        - Timeline (Checked-in → In Queue → Your Turn)
        - Quick actions: Find restroom, cafeteria, waiting area
    - Real-time updates via WebSocket
    - Push notification when 2 patients away

#### **4.8 WebSocket Integration for Real-Time Updates**

- **Backend WebSocket Server:**
    - Setup Socket.io in API service
    - Channels:
        - `queue_updates` - Queue position changes
        - `appointment_status` - Appointment status changes
    - Emit events on:
        - New check-in
        - Queue position update
        - Next patient called
- **Mobile Client:**
    - Connect to WebSocket on check-in
    - Subscribe to `queue_updates` channel
    - Update UI in real-time
    - Handle reconnection logic

#### **4.9 Doctor Dashboard - Queue View**

- **Backend APIs:**
    - `GET /api/doctor/appointments/today` - Today's appointments
    - `GET /api/doctor/queue` - Current queue
    - `POST /api/doctor/queue/call-next` - Call next patient
    - `PUT /api/doctor/appointments/:id/status` - Update status
- **Web UI - Doctor Dashboard:**
    - Daily Schedule View:
        - Calendar/Kanban/List view toggle
        - Appointments with status badges
    - Live Patient Queue Feed:
        - Left sidebar: Queue list with positions
        - Main area: Current patient card
        - "Call Next Patient" button
    - Patient Blueprint View:
        - Tabs: Overview, Medical History, Past Visits, Documents, Prescription
        - Chief complaint
        - Vital signs entry
        - Quick medical summary

#### **4.10 Staff Dashboard - Appointment Management**

- **Backend APIs:**
    - `GET /api/staff/appointments` - View all appointments
    - `POST /api/staff/appointments/manual` - Create walk-in appointment
    - `POST /api/staff/check-in/:id` - Manual check-in
- **Web UI - Staff Dashboard:**
    - Doctor Booking Details View:
        - Filter by doctor, date
        - Appointment timeline
        - Status tracking
    - Manual Appointment Creation:
        - Search existing patient or create temp profile
        - Patient details form
        - Doctor/slot selection
        - Payment processing
        - Generate appointment slip
    - Patient Check-in Interface:
        - Search by phone/ID/name
        - Verify details
        - Screening questions
        - Confirm check-in

**✅ Exit Criteria:**

- Patient can search and book appointments
- Payment flows work end-to-end
- Patient can check-in digitally on campus
- Queue updates in real-time on mobile
- Doctor sees live queue and can manage patients
- Staff can create walk-in appointments and check-in patients
- All notification triggers work (SMS/Email/Push)

**🔗 Connected Systems:**

- Payment service integrated
- Notification service actively sending alerts
- WebSocket real-time communication working
- Queue data in Redis cache
- All user roles interacting with appointment system

---

## 💊 **PHASE 5: P2 - Digital Prescription Management (Complete)**

**Depends on: Phase 4 | Priority: CRITICAL**

### **Why Now?**

Appointments are functional. Now enable the clinical handoff with digital prescriptions.

### **Deliverables:**

#### **5.1 Medicine Database Setup**

- **Backend:**
    - Seed medicine database (or integrate with API like CIMS/RxNorm)
    - Tables: `medicines` (name, generic, brand, strengths, forms)
    - `POST /api/medicines/seed` - Bulk import medicines
    - `GET /api/medicines/search` - Search medicines with autocomplete
        - Search by name, composition
        - Return available strengths and forms

#### **5.2 Prescription Creation Interface (Doctor)**

- **Backend APIs:**
    - `POST /api/prescriptions/create` - Create prescription
        - Input: doctorId, patientId, appointmentId, diagnosis, medicines[], instructions
        - Transaction: Create prescription + prescription_items
    - `POST /api/prescriptions/draft` - Save draft
    - `GET /api/prescriptions/draft/:id` - Resume draft
    - `GET /api/medicines/search` - Medicine search (already added in 5.1)
- **Web UI - Doctor Dashboard:**
    - Digital Prescription Creation Form (in Patient Card):
        - Diagnosis section (ICD-10 code search)
        - Medicine search with autocomplete:
            - Select medicine
            - Choose dosage (dropdown)
            - Set frequency (Once/Twice/Thrice daily or custom)
            - Set when to take (Before/After meals)
            - Set duration (days/weeks/months)
            - Auto-calculate quantity
            - Special instructions per medicine
            - Remove button
        - "Add Another Medicine" button
        - Additional instructions (text area)
        - Lab tests/investigations (multi-select)
        - Follow-up scheduling
        - Preview formatted prescription
        - Auto-save draft every 30 seconds

#### **5.3 Prescription Templates**

- **Backend APIs:**
    - `POST /api/prescriptions/templates` - Create template
    - `GET /api/prescriptions/templates` - List templates
    - `GET /api/prescriptions/templates/:id` - Get template
    - `PUT /api/prescriptions/templates/:id` - Update template
    - `DELETE /api/prescriptions/templates/:id` - Delete template
- **Web UI:**
    - Template Manager:
        - Personal templates list
        - Department-shared templates
        - Template editor (pre-fill medicines)
        - "Use Template" button in prescription form
        - Apply template → Modify → Save as new

#### **5.4 E-Signature & PDF Generation**

- **Backend:**
    - E-signature logic:
        - Doctor's digital signature (upload image during profile setup)
        - Timestamp and hash for verification
    - PDF generation service:
        - Use library like PDFKit or Puppeteer
        - Template with hospital letterhead
        - Doctor details, patient details
        - Prescription details (medicines, instructions)
        - QR code for verification
        - Watermark: "Digital Prescription"
    - `POST /api/prescriptions/:id/generate-pdf` - Generate PDF
    - Store PDF in cloud storage (AWS S3)
    - Return signed URL for download

#### **5.5 Prescription Transmission**

- **Backend APIs:**
    - `POST /api/prescriptions/:id/transmit` - Transmit to patient
        - Update prescription status to "Transmitted"
        - Send notification to patient (push + SMS)
        - Emit WebSocket event to doctor dashboard
        - Mark appointment as "Prescription Sent"
        - Auto-increment queue (doctor viewed patient)
- **Notification:**
    - Push notification: "Your prescription is ready"
    - SMS with prescription ID
    - Email with PDF attachment

#### **5.6 Prescription Viewing (Mobile - Patient)**

- **Backend APIs:**
    - `GET /api/patient/prescriptions` - List prescriptions
    - `GET /api/prescriptions/:id` - Get prescription details
    - `GET /api/prescriptions/:id/download` - Download PDF
- **Mobile UI:**
    - Prescription History Screen:
        - List of all prescriptions (grouped by date)
        - Each card: Date, doctor, medicine count
    - Prescription Detail View:
        - Hospital letterhead
        - Patient info
        - Doctor info with signature
        - Diagnosis
        - Medicine list (formatted):
            - Name, dosage, frequency, duration, instructions
        - Additional instructions
        - QR code for verification
        - Timestamp
    - Actions:
        - Download PDF
        - Share (with pharmacy, family)
        - "Order Medicines" button (if pharmacy integration)
        - Anti-screenshot protection (watermark)

#### **5.7 Prescription Analytics for Admin**

- **Backend APIs:**
    - `GET /api/admin/analytics/prescriptions` - Prescription metrics
        - Total digital prescriptions
        - Percentage vs manual
        - Average medicines per prescription
        - Most prescribed medicines
- **Web UI - Admin Dashboard:**
    - Prescription KPI card
    - Chart: Digital vs Manual prescriptions over time
    - Top 10 prescribed medicines list

**✅ Exit Criteria:**

- Doctor can create digital prescriptions with medicine search
- Prescriptions are saved with e-signature
- PDF generated with hospital letterhead
- Prescription transmitted to patient instantly
- Patient receives push notification
- Patient can view and download prescription on mobile
- Templates system working for doctors
- Analytics tracking digital prescription usage

**🔗 Connected Systems:**

- Prescription data linked to appointments
- Cloud storage for PDFs
- Notification service sending Rx ready alerts
- WebSocket notifying doctor dashboard
- Queue auto-advances after Rx sent

---

## 🗺️ **PHASE 6: P3 - AR Navigation with Multiset AI (Complete)**

**Depends on: Phase 3 | Priority: CRITICAL**

### **Why Now?**

Patients can book appointments and check-in. Now help them navigate to their destination.

### **Deliverables:**

#### **6.1 Multiset AI SDK Integration (Mobile)**

- **Setup:**
    - Add Multiset AI SDK dependency in `build.gradle`
    - Obtain API credentials from Multiset
    - Configure SDK initialization in Application class
    - Request camera and location permissions
- **SDK Configuration:**
    - Campus mapping setup (coordinate with Multiset for campus scan)
    - AR anchor placement
    - Calibration parameters

#### **6.2 Campus Maps & POI Management**

- **Backend APIs:**
    - `POST /api/navigation/poi` - Create POI
    - `GET /api/navigation/poi` - List all POIs
    - `GET /api/navigation/poi/search` - Search POI by name/category
    - `PUT /api/navigation/poi/:id` - Update POI
    - `DELETE /api/navigation/poi/:id` - Delete POI
    - `POST /api/navigation/maps/upload` - Upload floor plans
    - `GET /api/navigation/maps/:buildingId/:floor` - Get floor map
- **Admin Dashboard:**
    - POI Management Screen:
        - Add/edit/delete POIs
        - Categories: Departments, Services, Amenities, Emergency
        - POI details: Name, category, coordinates, floor, building, image
        - Floor plan upload for each level
    - Campus Map Viewer:
        - Visual map with POI markers
        - Click to edit
- **Database:**
    - `points_of_interest` table with:
        - name, category, coordinates (lat/lng), floor, building
        - description, image_url, status

#### **6.3 Navigation Service Backend**

- **Backend Navigation Service:**
    - `POST /api/navigation/route` - Calculate route
        - Input: startPoint, endPoint (coordinates)
        - Proxy to Multiset AI API
        - Return: Route waypoints, distance, estimated time, floor changes
    - `GET /api/navigation/current-location` - Get current location
        - Multiset indoor localization
    - `POST /api/navigation/session/start` - Start navigation session
    - `POST /api/navigation/session/end` - End navigation session
    - `POST /api/navigation/analytics` - Log navigation event
- **Multiset API Proxy:**
    - Secure API key management
    - Error handling for Multiset API failures
    - Retry logic for transient errors
    - Response caching (Redis) for frequently requested routes

#### **6.4 Navigation Home & POI Search (Mobile)**

- **Backend APIs:**
    - `GET /api/navigation/poi/search` - Search POI
    - `GET /api/navigation/poi/categories` - Get categories
    - `GET /api/navigation/popular` - Get popular destinations
- **Mobile UI:**
    - Navigation Home Screen:
        - Search bar with voice input
        - QR code scanner (for location markers)
        - Quick access cards:
            - "My Appointment" - Auto-route to appointment location
            - "My Parking" - Navigate back to car
        - Category chips (horizontal scroll)
        - Popular destinations list with distance
        - Recent searches
    - POI Search Results:
        - Filtered list based on search
        - Each result: Icon, name, distance, "Navigate" button
    - Current location display

#### **6.5 AR Camera Mode (Mobile)**

- **Mobile UI:**
    - AR Navigation Screen:
        - Full-screen camera view
        - ARCore session initialized
        - AR Overlays:
            - 3D directional arrow on floor (animated)
            - Distance indicator (floating text)
            - Destination marker (3D pin when in view)
            - Virtual path line on floor
        - Top HUD (overlay):
            - Mini-map (top-right)
            - Current floor indicator
            - Destination name
            - "Switch to Map" button
        - Bottom HUD (overlay):
            - Next instruction card (semi-transparent)
                - Icon (turn, straight, stairs, elevator)
                - Text: "In 20m, turn right"
                - Distance counter
            - Progress bar to destination
            - Exit navigation button
- **AR Rendering:**
    - Use ARCore for plane detection and tracking
    - Render 3D arrow using Sceneform or custom OpenGL
    - Update arrow direction based on user movement
    - Color-code arrow: Blue (following path), Green (approaching destination)
    - Smooth animations (60 FPS)

#### **6.6 2D Map Mode (Mobile)**

- **Mobile UI:**
    - 2D Map Navigation Screen:
        - Floor plan display (SVG or raster image)
        - User location (blue pulsing dot)
        - Destination marker (red pin)
        - Route path (blue line)
        - POI markers on map
        - Room numbers and labels
        - Map Controls:
            - Zoom buttons (+/-)
            - Floor selector dropdown (multi-level routes)
            - Recenter button
            - "Switch to AR" button
        - Top Info Bar:
            - Destination name
            - Total distance
            - Estimated time
            - Exit navigation (X)
        - Bottom Sheet (Navigation Panel):
            - Next Step Card:
                - Step number (1 of 7)
                - Direction icon
                - Instruction: "Continue straight for 50m"
                - Distance remaining
            - Swipe up to expand: Turn-by-Turn List
                - All navigation steps with icons and descriptions

#### **6.7 Automatic AR/2D Mode Switching**

- **Mobile Logic:**
    - Use accelerometer to detect device orientation
    - Threshold: > 45° from horizontal = AR Mode
    - < 45° from horizontal = 2D Mode
    - Smooth transition animation (300ms fade)
    - Visual cue: "Hold phone up for AR view" / "Hold down for map view"
    - User can manually toggle with button

#### **6.8 Voice Guidance & Accessibility**

- **Mobile Features:**
    - Text-to-Speech (TTS):
        - Announce turn-by-turn instructions
        - Volume control
        - Speed control
    - Haptic feedback:
        - Vibrate on turns
        - Pattern-based feedback for different instructions
    - Accessibility Mode:
        - High contrast AR elements
        - Larger text and icons
        - Audio-only navigation option
        - Screen reader optimization

#### **6.9 Rerouting & Error Handling**

- **Mobile Logic:**
    - Continuous location tracking
    - Off-path detection algorithm
    - Automatic rerouting if user deviates > 5 meters
    - Show notification: "Recalculating route..."
    - Fetch new route from backend
    - Update UI with new directions
- **Error States:**
    - GPS/Camera permission denied: Show explanation and settings link
    - Multiset API unavailable: Fallback to 2D map only with cached floor plans
    - Low accuracy warning: "Move to open area for better accuracy"

#### **6.10 Parking Lot Navigation Integration**

- **Backend APIs:**
    - `GET /api/parking/:sessionId/location` - Get parking slot coordinates
    - `POST /api/navigation/route/parking` - Route to parking slot
- **Mobile UI:**
    - Parking Lot Navigation View (special case):
        - Aerial/floor view of parking area
        - Slot grid with labels
        - User's assigned slot highlighted (green)
        - Current location (blue dot)
        - Route path (blue line)
        - Turn-by-turn directions
        - Directional arrows at decision points
        - "I've Parked" button (updates session, saves car location)
        - Switch to AR mode for in-lot navigation

#### **6.11 Navigation Analytics**

- **Backend:**
    - Log navigation events:
        - Session start/end
        - Route calculated
        - Navigation completed/abandoned
        - Off-path incidents
        - Mode switches (AR/2D)
    - Store in `analytics_logs` table

#### **6.12 Navigation Testing & Calibration**

- **Testing:**
    - On-campus testing with real users
    - AR accuracy verification (1-meter target)
    - Performance testing (latency < 50ms)
    - Battery consumption optimization
    - Multi-floor navigation testing
    - Edge case handling (GPS loss, API failure)
- **Calibration:**
    - Fine-tune Multiset AI parameters
    - Adjust AR anchor positions
    - Optimize route calculations
    - Update POI coordinates based on feedback

**✅ Exit Criteria:**

- Patient can search for POI and navigate
- AR mode displays accurate 3D arrows and overlays
- 2D map mode shows clear floor plans with route
- Auto-switching between AR/2D works seamlessly
- Voice guidance announces turn-by-turn directions
- Rerouting works when patient goes off-path
- Navigation to appointment location and parking slot works
- Performance meets targets (< 50ms latency, 60 FPS)
- Accessibility features functional

**🔗 Connected Systems:**

- Integrated with Appointment module (navigate to appointment)
- Integrated with Parking module (navigate to slot, find car)
- POI data managed by Admin dashboard
- Navigation analytics feeding into Admin metrics
- Multiset AI SDK communicating with backend proxy

---

