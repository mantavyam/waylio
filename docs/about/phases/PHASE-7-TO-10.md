## 🅿️ **PHASE 7: P4 - Smart Parking Management (Complete)**

**Depends on: Phase 6 (for navigation) | Priority: CRITICAL**

### **Why Now?**

Final core pillar. Patients can book appointments and navigate. Now solve the parking friction from arrival to exit.

### **Deliverables:**

#### **7.1 Parking Infrastructure Setup**

- **Backend:**
    - `parking_sessions` table schema:
        - id, user_id, slot_id, entry_time, exit_time, duration_paid, amount, payment_id, status, qr_code
    - `parking_slots` table:
        - id, slot_number, zone, level, status (available/occupied/reserved/maintenance), coordinates
    - Seed parking slot data (e.g., 500 slots across zones A-E, levels 1-3)

#### **7.2 Parking Entry - QR Code System**

- **Backend APIs:**
    - `POST /api/parking/verify-qr` - Verify QR code at gate
        - Input: QR code data
        - Validate code is for this hospital
        - Return: Entry gate ID, timestamp
    - `GET /api/parking/available-slots` - Get available slots count
- **QR Code Generation:**
    - Admin generates QR codes for each entry gate
    - QR format: `{hospitalId}|{gateId}|{timestamp}`
    - Display QR codes at physical entry gates
- **Mobile UI:**
    - QR Scan Screen:
        - Camera viewfinder
        - Instructions: "Scan QR code at parking gate"
        - Manual entry option (fallback)
    - Post-scan: Navigate to duration selection

#### **7.3 Duration Selection & Upfront Payment**

- **Backend APIs:**
    - `POST /api/parking/calculate-fee` - Calculate parking fee
        - Input: duration (hours)
        - Return: Rate, total amount, estimated end time
    - `POST /api/parking/create-session` - Create parking session
        - Input: duration, payment details
        - Process payment
        - Return: session_id, slot assignment
- **Mobile UI:**
    - Duration Selection Screen:
        - Time picker options: 1h, 2h, 4h, Full day
        - Custom duration picker
        - Recommendation based on appointment duration (if applicable)
        - Fee display:
            - Selected duration
            - Rate per hour
            - **Total Amount** (large, bold)
            - Estimated end time
        - Payment method selection:
            - Saved methods
            - Add new (Card/UPI/Wallet)
        - Terms notice: "Overstay charges apply"
        - "Pay & Get Slot" button
    - Payment Processing:
        - Integration with payment gateway
        - Loading state
        - Success/failure handling

#### **7.4 Slot Assignment Algorithm**

- **Backend Logic:**
    - Real-time slot availability check from Redis cache
    - Assignment algorithm:
        - Find nearest available slot to entry gate
        - Consider: Distance, accessibility requirements, slot type (regular/disabled/EV)
        - Reserve slot immediately (mark as occupied in Redis)
        - Update PostgreSQL database
    - `POST /api/parking/assign-slot` - Assign optimal slot
        - Input: entry_gate_id, user preferences
        - Return: slot_id, slot_number, zone, level, coordinates
    - Redis cache update:
        - Key: `parking:slots:available`
        - Decrement available count
        - Key: `parking:slot:{slotId}` → status: occupied

#### **7.5 Digital Parking Ticket**

- **Backend APIs:**
    - `GET /api/parking/session/:id` - Get parking session details
    - `POST /api/parking/extend/:id` - Extend parking duration
    - `GET /api/parking/ticket/:id/qr` - Generate exit QR code
- **Mobile UI:**
    - Digital Parking Ticket Screen:
        - Ticket-styled card with border
        - Large QR code (center) - for exit verification
        - Session Details:
            - **Slot Number** (very large, bold): "A-15"
            - Zone/Level: "Level 2, Zone A"
            - Entry Time: "10:30 AM"
            - Paid Until: "2:30 PM"
            - Time Remaining: Live countdown timer
        - Status Indicator:
            - Green: Active (> 30 min remaining)
            - Yellow: Expiring soon (< 30 min)
            - Red: Expired
        - Quick Actions:
            - "Navigate to My Car" (primary button)
            - "Extend Time" (if expiring/expired)
            - "Exit Parking" (ready to leave)
        - Vehicle Details (expandable):
            - Vehicle number
            - Photo of parked car (optional - taken at parking)
        - Important Info:
            - "Show this QR code at exit gate"
            - Overstay charges notice
        - "Save to Wallet" option (Apple/Google Pay)
    - Always accessible from Home Dashboard
    - Screenshot prevention notice

#### **7.6 Navigation to Assigned Slot**

- **Backend APIs:**
    - Reuse navigation APIs from Phase 6
    - `POST /api/navigation/route/parking-entry` - Route from gate to slot
- **Mobile UI:**
    - Automatic transition: Payment Success → Slot Assigned → Navigation
    - Parking Lot Navigation Screen (from Phase 6.10):
        - Show parking lot map
        - Highlight assigned slot
        - Blue route line from current location
        - Turn-by-turn instructions
        - "I've Parked" button
    - On "I've Parked" confirmation:
        - Save car location (coordinates)
        - Update session status
        - Prompt to take car photo (optional)
        - Show digital ticket

#### **7.7 Find My Car Feature**

- **Backend APIs:**
    - `GET /api/parking/session/:id/car-location` - Get saved car coordinates
    - Reuse navigation route API
- **Mobile UI:**
    - "Navigate to My Car" button on ticket
    - Launch navigation to saved parking slot
    - Use AR or 2D mode (Phase 6 integration)
    - Help patient find their car after visit

#### **7.8 Parking Extension**

- **Backend APIs:**
    - `POST /api/parking/extend/:sessionId` - Extend parking time
        - Input: additional_duration
        - Calculate additional fee
        - Process payment
        - Update session paid_until time
        - Update Redis cache
- **Mobile UI:**
    - Extend Time Screen (triggered when expiring):
        - Current session details
        - Select additional duration
        - Fee for extension
        - Payment method
        - "Extend Now" button
    - Update ticket display after extension
    - Notification: "Parking extended until 4:30 PM"

#### **7.9 Exit Process & Verification**

- **Backend APIs:**
    - `POST /api/parking/exit/verify` - Verify exit QR code
        - Input: qr_code, sessionId
        - Validate session is active
        - Check if within paid time or calculate overstay charges
        - Return: exit_allowed (true/false), overstay_amount
    - `POST /api/parking/exit/complete` - Complete exit
        - Update session status to "completed"
        - Update slot status to "available"
        - Update Redis cache (increment available slots)
        - Process overstay payment if applicable
        - Send exit receipt
- **Staff Dashboard:**
    - Parking Guard Verification Interface:
        - QR scanner for exit verification
        - Display session details:
            - Slot number, entry time, paid until
            - Overstay status (if any)
        - Actions:
            - "Allow Exit" (if no overstay)
            - "Collect Overstay Charges" (show amount)
            - Process payment (if overstay)
        - Manual override for issues
        - Log all exits with guard ID
- **Mobile UI:**
    - "Exit Parking" flow:
        - Tap "Exit Parking" on ticket
        - Show exit QR code (large)
        - Instructions: "Show QR to guard at exit gate"
        - If overstay: Show amount due with payment option
    - Exit Confirmation:
        - "Exit successful" message
        - Session summary
        - Final receipt
        - Feedback prompt (optional)

#### **7.10 Parking Occupancy Dashboard (Admin)**

- **Backend APIs:**
    - `GET /api/admin/parking/occupancy` - Get real-time occupancy
        - Total slots, occupied, available, reserved
        - By zone, by level
    - `GET /api/admin/parking/analytics` - Parking analytics
        - Occupancy trend (24-hour graph)
        - Peak hours
        - Average duration
        - Revenue generated
        - Overstay incidents
- **Admin Dashboard:**
    - Live Occupancy Screen:
        - Overview cards:
            - Total Slots: 500
            - Occupied: 385 (77%)
            - Available: 115
            - Reserved: 50
        - Visual Parking Map:
            - Floor plan with slot grid
            - Color-coded slots:
                - Green: Available
                - Red: Occupied
                - Blue: Reserved
                - Grey: Out of service
            - Click slot → Details (vehicle info, duration, user)
            - Zoom and pan controls
        - Real-Time Feed:
            - Latest entries (timestamp, slot)
            - Latest exits (timestamp, slot, duration)
            - Auto-refresh every 30 seconds
        - Parking Analytics:
            - Occupancy trend graph
            - Revenue chart
            - Peak hours heatmap
        - Export occupancy reports

#### **7.11 Parking Configuration (Admin)**

- **Backend APIs:**
    - `PUT /api/admin/parking/settings` - Update parking config
    - `POST /api/admin/parking/slots` - Add/edit slots
    - `PUT /api/admin/parking/pricing` - Update pricing
- **Admin Dashboard:**
    - Parking Settings Screen:
        - Slot Management:
            - Add/edit/delete slots
            - Mark out of service
            - Reserve slots (VIP, disabled, EV)
        - Pricing Configuration:
            - Hourly rates
            - Daily rates
            - Special rates (staff, patients with appointments)
            - Overstay charges
        - Time Limits:
            - Maximum parking duration
            - Grace period (e.g., 15 min after paid time)
        - QR Code Management:
            - Generate new gate QR codes
            - View active QR codes

**✅ Exit Criteria:**

- Patient can scan QR code at parking gate
- Patient can select duration and pay upfront
- Slot automatically assigned using optimal algorithm
- Digital parking ticket displays with QR code
- Patient can navigate to assigned parking slot
- Patient can navigate back to car using "Find My Car"
- Patient can extend parking time before expiration
- Exit verification works with QR code
- Overstay charges calculated and collected
- Admin can view live parking occupancy
- Staff can verify exits at gate
- Parking analytics tracking all metrics

**🔗 Connected Systems:**

- Navigation module integrated for slot finding and car location
- Payment gateway processing parking fees
- Redis cache managing real-time slot availability
- WebSocket updates for live occupancy dashboard
- Notification service sending expiry warnings
- Appointment module can recommend parking duration

---

## 🔔 **PHASE 8: Notification System Enhancement & Real-Time Features**

**Depends on: Phases 4, 5, 6, 7 | Priority: HIGH**

### **Why Now?**

All core features are functional. Now enhance the user experience with comprehensive notifications and real-time updates.

### **Deliverables:**

#### **8.1 Push Notification Service Completion**

- **Backend:**
    - Firebase Cloud Messaging (FCM) full integration
    - Device token management:
        - `POST /api/notifications/register-device` - Register FCM token
        - `PUT /api/notifications/device-token/:userId` - Update token
    - Notification templates expansion:
        - Appointment reminders (24h, 1h before)
        - Queue position updates ("You're next!")
        - Prescription ready notifications
        - Parking expiry warnings (30 min, 15 min, expired)
        - Payment confirmations
        - Doctor schedule changes
        - System announcements
- **Mobile:**
    - FCM SDK integration
    - Foreground notification handling
    - Background notification handling
    - Notification tap handling (deep linking to relevant screen)
    - Notification permission request flow
    - Notification preferences in settings

#### **8.2 SMS & Email Notification Templates**

- **Backend:**
    - Template engine with variable substitution
    - SMS templates:
        - Appointment confirmation with details
        - Check-in reminder
        - Queue status updates
        - Prescription ready with download link
        - Parking session details
        - Payment receipts
    - Email templates (HTML):
        - Appointment confirmation (detailed with calendar attachment)
        - Digital prescription PDF attachment
        - Payment receipts
        - Monthly visit summary
        - Promotional emails (optional)
    - Delivery status tracking
    - Failed delivery retry logic

#### **8.3 In-App Notification Center**

- **Backend APIs:**
    - `GET /api/notifications` - List all notifications
    - `PUT /api/notifications/:id/read` - Mark as read
    - `PUT /api/notifications/mark-all-read` - Mark all read
    - `DELETE /api/notifications/:id` - Dismiss notification
- **Mobile UI:**
    - Notification Center Screen:
        - Bell icon in header with badge counter
        - Filter tabs: All, Appointments, Prescriptions, Payments, System
        - Notification list:
            - Each card: Icon, title, message, timestamp
            - Unread indicator (blue dot)
            - Tap to expand/navigate
            - Swipe to dismiss
        - "Mark all as read" button
        - Empty state: "No new notifications"

#### **8.4 WebSocket Channel Expansion**

- **Backend:**
    - Additional channels:
        - `notifications` - General notifications
        - `appointment_reminders` - Time-based reminders
        - `doctor_updates` - Schedule changes
    - Connection management:
        - User authentication on WebSocket connect
        - Room-based subscriptions (userId, doctorId, etc.)
        - Graceful reconnection handling
        - Heartbeat/ping-pong for connection health
- **Mobile/Web:**
    - Subscribe to relevant channels based on user role
    - Handle WebSocket reconnection
    - Update UI on real-time events
    - Show "Live" indicator when connected

#### **8.5 Notification Preferences**

- **Backend APIs:**
    - `GET /api/user/notification-preferences` - Get preferences
    - `PUT /api/user/notification-preferences` - Update preferences
- **Mobile UI:**
    - Notification Settings Screen:
        - Toggle switches for each notification type:
            - Appointment reminders (Push/SMS/Email)
            - Queue updates (Push/SMS)
            - Prescription notifications (Push/Email)
            - Parking alerts (Push/SMS)
            - Payment confirmations (Email)
            - Marketing communications (Email)
        - Quiet hours configuration
        - Do Not Disturb mode
        - Notification sound selection

**✅ Exit Criteria:**

- All notification types triggering correctly
- Push notifications delivered reliably on mobile
- SMS and email templates formatted properly
- In-app notification center functional
- WebSocket connections stable with reconnection
- Users can customize notification preferences
- Deep linking from notifications works

**🔗 Connected Systems:**

- All modules (Appointment, Prescription, Parking) triggering notifications
- FCM, SMS gateway, Email service integrated
- WebSocket server broadcasting real-time updates
- User preferences stored and respected

---

## 📊 **PHASE 9: Admin Analytics, Reports & System Management**

**Depends on: Phases 4-7 | Priority: MEDIUM**

### **Why Now?**

Core features are complete and generating data. Now provide tools for monitoring, analytics, and optimization.

### **Deliverables:**

#### **9.1 Analytics Data Collection**

- **Backend:**
    - Analytics logging across all services:
        - Appointment metrics (bookings, cancellations, no-shows)
        - Queue efficiency (wait times, consultation times)
        - Prescription metrics (digital vs manual, medicines prescribed)
        - Navigation usage (sessions, destinations, success rate)
        - Parking metrics (occupancy, duration, revenue)
    - Store in `analytics_logs` table with aggregation
    - Scheduled jobs for daily/weekly/monthly aggregations
    - Redis for real-time metric calculations

#### **9.2 KPI Dashboard (Admin)**

- **Backend APIs:**
    - `GET /api/admin/analytics/kpis` - Get all KPIs
        - Query params: date_range, comparison_period
    - Individual KPI endpoints:
        - `/api/admin/analytics/appointments`
        - `/api/admin/analytics/prescriptions`
        - `/api/admin/analytics/navigation`
        - `/api/admin/analytics/parking`
        - `/api/admin/analytics/revenue`
- **Admin Dashboard:**
    - Operations & Metrics Dashboard:
        - Date range selector (Today, Week, Month, Custom, Compare)
        - KPI Cards (top row):
            - **Patient Metrics:**
                - Total Patients (+ trend)
                - New vs Returning ratio
                - Patient Satisfaction Score (avg rating)
                - No-show Rate (%)
            - **Operational Metrics:**
                - Average Wait Time (min + trend)
                - Appointment Utilization (% slots filled)
                - On-time Performance (%)
                - Queue Efficiency (avg time per patient)
            - **Financial Metrics:**
                - Total Revenue (+ trend)
                - Revenue by Department (breakdown)
                - Collection Efficiency (%)
                - Outstanding Payments
            - **Resource Utilization:**
                - Doctor Utilization (%)
                - Facility Occupancy (%)
                - Parking Occupancy (%)
        - Visual Charts:
            - Appointment Trends (line graph over time)
            - Patient Flow Sankey Diagram (Entry → Check-in → Wait → Consult → Exit)
            - Revenue Analysis (bar chart by department, pie chart by service type)
            - Department Performance Heatmap (busy periods)
            - Doctor Performance Table (sortable)
            - Wait Time Distribution (histogram)
            - Navigation Usage (total sessions, popular destinations)
            - Parking Metrics (occupancy over time, revenue)
        - AI-Generated Insights Panel:
            - Automatic insights: "Cardiology wait times up 15% this week"
            - Recommendations: "Consider adding slots at 10 AM"
            - Alerts (color-coded)

#### **9.3 Report Generation System**

- **Backend:**
    
    - Report generation service:
        - PDF generation using Puppeteer
        - Excel generation using ExcelJS
        - CSV export
    - Report templates:
        - Daily Operations Report
        - Weekly Performance Report
        - Monthly Financial Report
        - Department-wise Report
        - Doctor Performance Report
        - Patient Satisfaction Report
        - Custom Report Builder
    - `POST /api/admin/reports/generate` - Generate report
        - Input: report_type, date_range, filters, format
        - Return: download URL (from cloud storage)
    - Scheduled reports:
        - Cron jobs for automated report generation
        - Email distribution to stakeholders
- **Admin Dashboard:**
    
    - Reports Screen:
        - Report templates list
        - Custom report builder:
            - Select metrics
            - Choose date range
            - Apply filters (department, doctor, service)
            - Select format (PDF/Excel/CSV)
        - "Generate Report" button
        - Download generated reports
        - Schedule automated reports:
            - Frequency (Daily/Weekly/Monthly)
            - Email recipients
            - Time of delivery
        - Report history with download links

#### **9.4 Live Occupancy Dashboard Completion**

- **Backend APIs:**
    - `GET /api/admin/occupancy/parking` - Parking occupancy
    - `GET /api/admin/occupancy/departments` - Department occupancy
    - `GET /api/admin/occupancy/rooms` - Room status
    - `GET /api/admin/occupancy/equipment` - Equipment status
    - Real-time data from Redis cache
- **Admin Dashboard:**
    - Live Occupancy Screen (already outlined in Phase 1, now implement):
        - **Parking Tab** (from Phase 7.10)
        - **Department Occupancy Tab:**
            - Grid of department cards
            - Each shows: Name, patient count, capacity, occupancy %, queue length, doctors on duty
            - Color indicator (Green < 70%, Yellow 70-90%, Red > 90%)
            - Click card → Drill down (room-wise breakdown, bed occupancy, patient flow rate)
            - Filters: Floor, type (OPD/IPD/Emergency)
        - **Room Occupancy Tab:**
            - Table view: Room number, type, department, status, occupant, duration
            - Filters: Floor, type, status
            - Expected vacancy time
        - **Equipment Tab:**
            - List of major equipment
            - Status (Available/In Use/Maintenance)
            - Location, usage hours, maintenance schedule
        - Auto-refresh every 30 seconds
        - Export occupancy reports
        - Push notifications for critical occupancy levels

#### **9.5 System Settings & Configuration**

- **Backend APIs:**
    - `GET /api/admin/settings` - Get all settings
    - `PUT /api/admin/settings` - Update settings
    - Settings categories: General, Hospital Profile, Departments, Appointments, Payments, Navigation, Parking, Notifications, Security, Integrations
- **Admin Dashboard:**
    - System Settings Screen (comprehensive):
        - **General Settings:**
            - Hospital name, logo, color scheme, timezone, operating hours, holiday calendar
        - **Hospital Profile:**
            - Complete details, departments, facilities, accreditations
        - **Department Management:**
            - CRUD for departments with locations, staff, operating hours
        - **Appointment Configuration:**
            - Booking rules, cancellation policy, slot settings, fees
        - **Payment Settings:**
            - Enabled methods, gateway config, refund rules, tax settings
        - **Navigation Configuration:**
            - Multiset API credentials, POI management, preferences
        - **Parking Settings:**
            - Capacity, pricing, time limits, overstay charges
        - **Notification Settings:**
            - Push/SMS/Email templates, scheduling, delivery preferences
        - **Security & Access:**
            - Password policies, 2FA, session timeout, audit logs, data privacy
        - **Integrations:**
            - Third-party APIs (Lab, Pharmacy, EHR, Insurance, Payment gateways)
            - API keys management, webhooks
        - **Backup & Maintenance:**
            - Backup schedule, restore options, maintenance windows
        - **Legal & Compliance:**
            - Terms, privacy policy, consent forms, data retention

**✅ Exit Criteria:**

- Admin can view comprehensive KPI dashboard with real-time data
- All charts and graphs rendering correctly
- AI-generated insights appearing
- Reports can be generated in PDF/Excel/CSV formats
- Scheduled reports being emailed to stakeholders
- Live occupancy dashboard showing real-time data across all facilities
- System settings are centralized and functional
- All configuration changes take effect immediately

**🔗 Connected Systems:**

- Analytics aggregating data from all modules
- Report generation using data from PostgreSQL
- Live occupancy pulling from Redis cache
- WebSocket broadcasting occupancy updates
- Settings affecting behavior of all services

---

## 💬 **PHASE 10: Feedback & Complaints Management**

**Depends on: Phase 4-7 | Priority: MEDIUM**

### **Why Now?**

Patients are using all features. Capture feedback to improve service quality.

### **Deliverables:**

#### **10.1 Feedback Collection (Mobile)**

- **Backend APIs:**
    - `POST /api/feedback/submit` - Submit feedback
        - Input: appointmentId, rating, category, description, attachments
    - `GET /api/feedback/:id` - Get feedback status
- **Mobile UI:**
    - Post-Visit Feedback Screen (triggered after consultation):
        - "How was your experience?" header
        - Appointment details (doctor, date)
        - **Rating Sections:**
            - Overall Experience (5-star + emoji)
            - Specific ratings: Doctor behavior, Wait time, Cleanliness, Navigation, Staff helpfulness
        - Written Feedback (text area)
        - Quick response chips: "Great service", "Long wait", "Friendly staff", "Navigation helpful"
        - Photo attachments (optional)
        - Privacy notice: "Feedback is anonymous"
        - "Submit Feedback" button
        - "Skip for Now" option
    - Thank you confirmation after submission

#### **10.2 Feedback Management (Admin)**

- **Backend APIs:**
    - `GET /api/admin/feedback` - List all feedback with filters
        - Filters: Status, priority, category, department, date range, rating
    - `GET /api/admin/feedback/:id` - Get feedback details
    - `PUT /api/admin/feedback/:id` - Update feedback
    - `POST /api/admin/feedback/:id/assign` - Assign to staff
    - `POST /api/admin/feedback/:id/resolve` - Mark resolved
    - `POST /api/admin/feedback/:id/response` - Send response to patient
    - `GET /api/admin/feedback/analytics` - Feedback analytics
- **Admin Dashboard:**
    - Complaints & Feedback Screen:
        - **Tabs:** All, Complaints, Suggestions, Compliments, Resolved, Archived
        - **Filters:** Status, priority, category, department, date, rating
        - **Summary Cards:**
            - Open Complaints (with critical count)
            - Average Resolution Time
            - Satisfaction Improvement (%)
            - Pending Actions
        - **Feedback List:**
            - Cards with: Priority indicator, status badge, ID, category icon, title, patient name, department, date, assigned staff, rating, preview
            - Visual flags: Red (critical), Clock (overdue), Reply (has response)
        - **Feedback Detail View (sidebar/modal):**
            - Full feedback text
            - Category, priority, status
            - Related appointment details
            - Doctor/staff mentioned
            - Attachments (images)
            - Patient information (name, contact, ID)
            - **Timeline/Activity Log:**
                - Submitted, Assigned, Status changes, Notes added, Response sent, Resolved
                - Timestamps and users
            - **Internal Notes Section:**
                - Team discussion area
                - Tag team members
                - Attach files/evidence
                - Only visible to admin
            - **Response Section:**
                - Text editor for official response
                - Templates: Acknowledgment, Apology, Resolution, Follow-up
                - Preview before sending
                - Send via email/SMS/app notification
            - **Actions Panel:**
                - Assign to dropdown
                - Change status dropdown
                - Change priority buttons
                - Add tags
                - Schedule follow-up
                - Escalate to senior management
                - Mark as Resolved (requires resolution notes)
                - Close Complaint
            - **Resolution Form:**
                - Action taken (text area)
                - Root cause (dropdown + text)
                - Preventive measures (text area)
                - Staff involved (multi-select)
                - Resolved by (auto-filled)
                - "Send resolution to patient" checkbox
        - **Analytics Dashboard Tab:**
            - Complaint trends (line graph)
            - Category breakdown (pie chart)
            - Department-wise distribution (bar chart)
            - Resolution metrics (avg time, first response, escalation rate)
            - Top issues list
            - Recurring problems identification
            - Staff/department most mentioned
            - Performance tracking (resolution rate, SLA compliance)
        - **Automated Workflows:**
            - Auto-assign based on category
            - SLA timers (respond within 24 hours)
            - Auto-escalation for overdue items
            - Reminder notifications

#### **10.3 Sentiment Analysis (Optional Enhancement)**

- **Backend:**
    - Integrate basic sentiment analysis API (AWS Comprehend or similar)
    - Analyze feedback text for sentiment: Positive, Neutral, Negative
    - Auto-prioritize negative sentiment
    - Tag common themes/topics
    - Display sentiment score in admin dashboard

**✅ Exit Criteria:**

- Patients receive feedback prompt after consultation
- Feedback submissions stored with all details
- Admin can view all feedback in unified dashboard
- Filtering and sorting works correctly
- Admin can assign feedback to appropriate staff
- Internal notes system functional
- Response templates available and customizable
- Resolved feedback tracked with documentation
- Analytics showing feedback trends
- SLA timers and auto-escalation working

**🔗 Connected Systems:**

- Triggered after appointment completion
- Linked to appointment and doctor data
- Notification service sending feedback requests and responses
- Analytics aggregating sentiment and trends

---