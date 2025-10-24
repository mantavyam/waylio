NOTE + WARNING : HUGE TOKEN CONTEXT CONSUMPTION AHEAD (40K+ CHARACTERS IN 5K+ WORDS), READ ONLY IF A DETAILED USER STORY CONTEXT UNDERSTANDING IS REQUIRED OR INSTRUCTED ELSE READ THE PRD DOCUMENT FOR BASIC CONTEXT.

# Epic List

1. **Epic 1: Foundation & Core Data Models (Focus: P1, P2 Enabling):** Establish the monorepo structure, core technical stack, and the relational data models (PostgreSQL) required for user, staff, doctor, and basic appointment/prescription entities. Deliver the Admin Staff/Doctor User CRUD for security handoff and the initial Patient Profile Management screen.  
     
2. **Epic 2: Patient Appointment & Queue Flow (Focus: P1):** Implement the full patient-side experience for Appointment Booking, including Doctor search, slot selection, and secure Upfront Payment Integration (for co-pays/fees). Deliver the initial Patient Queue Status view and the Reception Staff's Manual Booking screen.  
     
3. **Epic 3: Clinical & Digital Prescription Workflow (Focus: P2):** Deliver the Doctor-focused dashboard features: Doctor Profile Management, Daily Appointments Dashboard (Kanban View), the LIVE Patient Card Feed, and the full Digital Prescription Creation and Transmission workflow.  
     
4. **Epic 4: Campus Location & AR Navigation Core (Focus: P3):** Integrate the Multiset AI SDK and its APIs to establish campus-wide indoor mapping data. Implement the core AR/2D Map Navigation Screen, including the Hold Up/Down Toggle and the POI Search & Routing feature.  
     
5. **Epic 5: Lean Parking & End-of-Visit Handoff (Focus: P4, P2 Final):** Deliver the remaining features: the Lean Smart Parking flow (QR Scan, Upfront Payment, Slot Assignment, Nav to Spot) and all Post-Consultation workflows (Digital Prescription Display, In-App Payment for medication, and History/Records View).

## Epic 1: Foundation & Core Data Models

**Epic Goal:** Establish the Monorepo structure, core technical stack, and the relational data models (PostgreSQL) required for user, staff, doctor, appointment, and basic prescription entities. Deliver the **Admin Staff/Doctor User CRUD** for security handoff and the initial **Patient Profile Management** screen.

### Epic 1.1 Project Scaffolding & Monorepo Setup

As an Architect,

I want to establish the core Monorepo project structure with configured environments for Node.js, Kotlin, and Next.js,

so that the development team can immediately begin work across the full stack.

#### Acceptance Criteria

1. The project root directory shall be established as a **Monorepo** utilizing the chosen package management and build tools (e.g., npm Workspaces)32.  
     
2. The **Node.js backend service** shall be scaffolded with initial configuration, and dependencies for **PostgreSQL** and an optimized web framework (e.g., FastAPI/Django) shall be installed33.  
     
3. The **Next.js web application** (for staff/doctor dash) and the **Kotlin mobile application** (for patient app) shall be scaffolded with initial configuration and placed in the Monorepo's application directories34.  
     
4. A **Shared Code** directory shall be established within the Monorepo to define and export common **TypeScript/Node.js/Dart** data models for cross-stack use35.  
     
5. Basic **Render** deployment configurations (e.g., Dockerfile, render.yaml) shall be drafted for the Node.js backend and Next.js frontend to ensure adherence to the **Pay-as-You-Go** budget constraint36.  
     
6. A **Simple Health Check Endpoint** shall be implemented in the Node.js backend to confirm the initial service deployment and adherence to the monorepo setup37.

### Epic 1.2 Core Relational Data Model

As an Architect,

I want to define and implement the robust relational database schema and initial data access layer,

so that all subsequent feature development has a high-integrity, shared foundation for core entities.

#### Acceptance Criteria

1. The PostgreSQL database shall be provisioned (or set up for local development) via the Monorepo's infrastructure scripts38.  
     
2. The full relational schema shall be defined and implemented for the following core entities, including all necessary primary keys, foreign keys, and indexes: **User** (Patient/Attendant, Doctor, Staff, Admin), **Appointment** (Patient ID, Doctor ID, Department, Time Slot, Status, Payment Status), **Prescription** (Patient ID, Doctor ID, Medication Details, Dosage, Status, Timestamp), and **ParkingSession** (Slot ID, Vehicle ID, Entry Time, Paid Duration, Status)39.  
     
3. A dedicated **Data Access Layer (Repository Pattern)** shall be implemented in the Node.js backend service to manage CRUD operations for all core entities, ensuring clean separation from business logic40.  
     
4. Data models/interfaces for all core entities shall be defined in the **Shared Code** directory, using appropriate typing (e.g., Node.js typing, TypeScript interfaces) to enable cross-stack sharing with the Next.js and Kotlin applications41.  
     
5. All data models shall include fields for **Role-Based Access Control** (RBAC) verification, ensuring that data retrieval endpoints only return information relevant to the authenticated user's role (e.g., Doctor can see all their patients' appointments, but Patient only sees their own)42.

### Epic 1.3 User Authentication & Role-Based Access

As an Admin user,

I want the system to implement secure user authentication and granular Role-Based Access Control (RBAC) across the platform,

so that Patient, Doctor, and Staff data integrity and security (NFR4) are maintained.

#### Acceptance Criteria

1. **Patient/Attendant Authentication:** Secure registration and login functionality shall be implemented for Patient/Attendant users via the **Kotlin mobile application**43\.  
     
2. **Staff/Doctor Authentication:** Secure login functionality shall be implemented for Doctor and Staff roles via the **Next.js web dashboard** using credentials created in **Story 1.4** (Doctor/Staff User Management)44.  
     
3. **Role Authorization:** The Node.js backend API shall implement **Role-Based Access Control (RBAC)** middleware on all relevant endpoints to ensure: Patients can only access their own appointments, prescriptions, and profile data; Doctors can only access their scheduled patients' data and their professional management screens; Admin/Staff can access management screens implemented in subsequent stories45.  
     
4. **Token Management:** A secure, industry-standard token-based authentication mechanism (e.g., JWT) shall be implemented, ensuring tokens are properly secured and validated on every authenticated API request46.  
     
5. **Secure Credential Handling:** User passwords shall be stored using strong, one-way hashing algorithms, adhering strictly to security best practices47.  
     
6. **Unauthenticated Access:** Unauthenticated users attempting to access protected endpoints or mobile app screens shall be redirected to the respective login page48.

### Epic 1.4 Doctor/Staff User Management (CRUD)

As an Admin user,

I want a secure web interface to create, read, update, and deactivate Doctor and Staff profiles, including their required professional details,

so that the hospital workforce is correctly provisioned with appropriate access roles.

#### Acceptance Criteria

1. **Staff Profile Creation:** The Admin Dashboard (Next.js) shall provide a form to create new Doctor and Staff user profiles, including: name, contact information, associated department, user role (Doctor/Staff), and an auto-generated, system-assigned **Unique User ID**49\.  
     
2. **Unique ID Confirmation:** The system shall require the Doctor or Staff member to **confirm** the system-assigned **Unique User ID** during their initial app profile setup to maintain security50.  
     
3. **CRUD Functionality:** The Node.js backend API shall expose secure, role-restricted endpoints to support full CRUD (Create, Read, Update, Deactivate) functionality for Doctor and Staff profiles, utilizing the PostgreSQL data models defined in **Story 1.2**51\.  
     
4. **Profile Fields:** The Doctor profile shall include fields for managing their professional details such as **specialties, schedules, availability, general hours, holidays, and consultation fees**52\.  
     
5. **Role Restriction (NFR4):** The interface shall ensure that a standard Staff profile cannot access or modify Doctor-specific fields (e.g., consultation fees) and that only Super Admin roles can access the core management features53.  
     
6. **Web Interface:** The corresponding **Next.js web dashboard** view shall be implemented, displaying a searchable list of staff/doctor profiles with options to edit or deactivate them54.

### Epic 1.5 Patient Profile Management

As a Patient or Attendant,

I want a secure and easy way to manage my profile and current medical details within the app,

so that the registration process is simplified and my information is accurate for any future appointments.

#### Acceptance Criteria

1. **Mobile Interface:** A dedicated **User Profile Management** screen shall be implemented in the **Kotlin mobile application**55\.  
     
2. **Profile CRUD:** The Kotlin app shall integrate with the secure Node.js backend API to allow the Patient/Attendant to create, read, and update their personal information (name, contact, etc.)56.  
     
3. **Medical Detail Fields:** The profile shall include specific fields for recording **required important current medical details and medical history** to facilitate future appointment bookings57.  
     
4. **Role Verification (NFR4):** The Node.js backend shall enforce **Role-Based Access Control** to ensure that a Patient/Attendant user can only view and modify their *own* profile data, strictly preventing access to others58.  
     
5. **Data Persistence:** All profile and medical history updates shall be correctly persisted to the **PostgreSQL** database, linking back to the authenticated **User** entity established in **Story 1.2** and **1.3**59\.  
     
6. **Navigation Access:** The Patient/Attendant shall be able to easily navigate to the **User Profile Management** screen from the main application dashboard after successful login60.

---

## Epic 2: Patient Appointment & Queue Flow (Focus: P1)

**Epic Goal:** Implement the full patient-side experience for **Appointment Booking**, including Doctor search, slot selection, and secure **Upfront Payment Integration** (for co-pays/fees). Deliver the initial **Patient Queue Status** view and the **Reception Staff's Manual Booking** screen.

**Dependencies:** This Epic **requires** the completion of **Epic 1** (Monorepo, Auth, PostgreSQL Data Models, and Staff/Patient Profile Management).

### Story Breakdown and AC Definition

The stories are sequenced to proceed from initial setup/search, to payment/booking, and finally to queue management and the Reception Staff's workflow.

| Story | Title | Description | AC Focus |
| :---- | :---- | :---- | :---- |
| **2.1** | Doctor & Time Slot Availability API | Implement the Node.js API logic to fetch and filter available **Doctor Profiles** and **Appointment Time Slots**, adhering to the doctor's schedules and holidays defined in **Story 1.4**. | FR1 |
| **2.2** | Patient Appointment Booking & Pre-Reg UI | Implement the **Kotlin UI flow** allowing a patient to browse/search doctors, select a time slot, fill out mandatory **Pre-Registration/Forms**, and submit the appointment request. | FR1 |
| **2.3** | Upfront Payment Integration & Session Creation | Integrate with a secure payment gateway. Process the **upfront payment** for the appointment fee, create a confirmed **Appointment** record in PostgreSQL, and handle payment success/failure notifications. | FR1 |
| **2.4** | Digital E-Check-in & Queue Entry API | Implement the Node.js API to update an appointment status to "Checked-In" (FR2). Implement the **Virtual Queue** logic that sequentially orders checked-in patients for a specific doctor (FR3). | FR2, FR3 |
| **2.5** | Patient Live Queue Status UI | Implement the **Kotlin UI screen** to display the patient's current **Queue Status** and approximate wait time, updating the queue automatically as doctors process patients (FR3). | FR3 |
| **2.6** | Reception Staff Manual Booking & Detail View | Implement the **Reception Staff's Web Interface** (Next.js) to view booking details for a specific doctor and manually **Create a Temporary Profile** and book an appointment for non-registered users. | NFR4 |

---

### **Epic 2.1: Doctor & Time Slot Availability API**

**User Story:** As an **Appointment System**, I want the Node.js backend to provide a secure and efficient API for querying **Doctor Availability** based on schedule and existing bookings, so the patient application can display accurate time slots.

#### **Acceptance Criteria**

1. **Doctor Search API:** The Node.js backend shall expose a secure, authenticated API endpoint to fetch a list of available **Doctor Profiles** based on department, specialty, or name, utilizing data from **Story 1.4**.  
     
2. **Availability Logic:** The Node.js service shall implement logic to calculate and return available time slots for a specified Doctor/Department, excluding slots that are already booked, outside of general hours, or marked as holiday/unavailable.  
     
3. **Data Filtering (RBAC):** The API response shall adhere to **Role-Based Access Control (NFR4)** by only returning essential, non-sensitive profile information to the Patient role.  
     
4. **Performance (NFR3):** The query performance for fetching available slots shall be optimized to ensure low-latency response times for a positive user experience.  
     
5. **Data Mapping:** The service shall correctly map and utilize the professional schedule data defined in the Doctor profile in **Story 1.4** (e.g., availability, general hours, holidays).

### **Epic 2.2: Patient Appointment Booking & Pre-Reg UI**

**User Story:** As a **Patient**, I want an intuitive mobile interface to select my doctor/time and complete any necessary pre-registration forms, so my details are ready before my visit.

#### **Acceptance Criteria**

1. **Mobile Interface:** The **Kotlin mobile app** shall implement the sequential UI screens for the Appointment Booking Flow, enabling the patient to search for Doctors (via **Story 2.1 API**) and select an available time slot.  
     
2. **Pre-Registration/Forms:** The flow shall include screens for filling out mandatory **Pre-Registration/Forms** (e.g., patient personal info, basic medical history), utilizing and updating the profile data from **Story 1.5**.  
     
3. **Slot Selection:** The selection of a time slot shall include real-time validation against the **Story 2.1 API** to prevent double-booking.  
     
4. **UI Feedback:** The mobile application shall provide clear and immediate feedback (e.g., loading states, error messages) during the selection and validation process.

### **Epic 2.3: Upfront Payment Integration & Session Creation**

**User Story:** As a **Patient**, I want to securely pay my appointment fee upfront, so that my booking is immediately confirmed and I can avoid payment delays during my visit.

#### **Acceptance Criteria**

1. **Payment Gateway Integration:** The Node.js backend shall integrate with a secure **Payment Gateway API** (e.g., Stripe, Razorpay) to process the upfront co-pay/fee payment.  
     
2. **Transaction API:** A secure Node.js API endpoint shall be implemented to handle payment processing requests, ensuring transactional integrity (NFR1).  
     
3. **Appointment Record:** Upon successful payment, a new **Appointment** record shall be created in the PostgreSQL database with the status set to "Confirmed" and a **Payment Status** set to "Paid."  
     
4. **Payment Notifications:** The Kotlin app shall display a clear **Appointment Confirmation Screen** and process the payment and booking outcome (success/failure) with appropriate user notifications.  
     
5. **Render Configuration (NFR2):** The deployment configuration shall confirm that the Payment Integration infrastructure adheres to the **Pay-as-You-Go** budget constraint (NFR2).

### **Epic 2.4: Digital E-Check-in & Queue Entry API**

**User Story:** As an **Administrative System**, I want the backend to manage the transition from a 'Confirmed' appointment to a 'Checked-In' status, so that the patient is correctly sequenced into the virtual queue.

#### **Acceptance Criteria**

1. **E-Check-in Endpoint:** A secure Node.js API endpoint shall be created to accept an E-Check-in request from the patient's mobile app.  
     
2. **Status Update:** The backend shall update the patient's corresponding Appointment record status from "Confirmed" to "Checked-In" (FR2).  
     
3. **Virtual Queue Logic:** The system shall implement **Virtual Queue Logic** to assign a sequential queue position to the checked-in patient based on their appointment time and doctor, maintaining real-time sequential order (FR3).  
     
4. **Queue Data API:** A Node.js API endpoint shall be exposed that securely provides real-time, frequently updated queue status data (position and estimated wait time) for a specific doctor/department (FR3).  
     
5. **Push Notification Trigger:** The API shall include logic to trigger an **Automated Push Notification** to the patient when their queue position is within a specified threshold (e.g., 2 spots away).

### **Epic 2.5: Patient Live Queue Status UI**

**User Story:** As a **Patient**, I want to see my current queue position and receive automatic alerts, so that I can wait comfortably elsewhere and arrive just in time for my consultation.

#### **Acceptance Criteria**

1. **Mobile Interface:** A dedicated **Kotlin UI screen** shall be implemented to display the patient's current **Queue Status**, including their sequential number and estimated wait time.  
     
2. **Real-Time Data:** The screen shall consume the **Queue Data API (Story 2.4)**, displaying near real-time updates without manual refresh.  
     
3. **Notification Management:** The mobile application shall be configured to receive and display the **Automated Push Notifications** triggered by the backend (Story 2.4) when it's time to proceed (FR3).  
     
4. **Visual Clarity:** The visual design of the queue status shall be clear and calming, adhering to the UI Design Goals for stress reduction.

### **Epic 2.6: Reception Staff Manual Booking & Detail View**

**User Story:** As a **Reception Staff member**, I want a simple web interface to view a doctor's booking details and manually create bookings for non-registered users, so that I can manage the queue and accommodate all visitors (FR1).

#### **Acceptance Criteria**

1. **Web Interface:** The **Next.js web dashboard** shall implement the **Reception Staff's Manual Booking & Detail View**, restricted by RBAC (NFR4) to only staff roles.  
     
2. **Manual Booking Flow:** The screen shall provide a flow to **create a manual appointment booking for non-registered users** by gathering basic medical details and creating a **Temporary Profile** (FR1).  
     
3. **Doctor Detail View:** The interface shall display the booking details (patient name, status, time) for a respective Doctor on a calendar or list view, utilizing the **Appointment** data model from **Story 1.2**.  
     
4. **Role Restriction (NFR4):** Access to this dashboard shall be strictly limited to users with the Staff role, configured in **Story 1.4**.

---

## Epic 3: Clinical & Digital Prescription Workflow (Focus: P2)

**Epic Goal:** Deliver the Doctor-focused dashboard features, including **Daily Appointments Dashboard**, the **LIVE Patient Card Feed**, and the crucial **Digital Prescription Creation and Transmission** workflow. This completes the core P2 clinical functionality.

**Dependencies:** This Epic **requires** the completion of **Epic 1** (Auth, Data Models) and **Epic 2** (Appointment/Queue Logic) to ensure patient data and the real-time queue are available.

### Story Breakdown and AC Definition

The stories are sequenced to proceed from the doctor's high-level view (dashboard) down to the critical, granular task (prescription creation).

| Story | Title | Description | AC Focus |
| :---- | :---- | :---- | :---- |
| **3.1** | Doctor Daily Schedule & Kanban Dashboard | Implement the **Next.js Web Dashboard** to display the Doctor's daily schedule in a **Kanban/Calendar View** with appointment cards and summary metrics. | FR4 |
| **3.2** | LIVE Patient Card Feed & Queue Integration | Implement the **LIVE Patient Card Feed** on the dashboard, consuming the real-time queue data from **Epic 2.4** and allowing the doctor to mark a patient as "Viewed" to auto-increment the queue. | FR4, FR3 |
| **3.3** | Medicine Database Management API | Implement a secure Node.js API layer to manage the **Medicine Database** (CRUD) and provide search functionality necessary for prescription creation. | FR5 |
| **3.4** | Digital Prescription Creation Interface | Implement the **Next.js UI** (part of the LIVE Patient Card Feed) with the necessary form and tools to create, specify dosage, and electronically sign/save a final **Digital Prescription**. | FR5 |
| **3.5** | Prescription Handoff & Patient Notification | Implement the API to securely **transmit the Digital Prescription** to the patient's app and a simulated **Pharmacy System**. Trigger the final patient notification that the prescription is ready for pickup. | FR5, FR6 |

---

### Epic 3.1: Doctor Daily Schedule & Kanban Dashboard

**User Story:** As a **Doctor**, I want a personalized web dashboard that clearly shows my daily schedule and appointment metrics, so I can efficiently manage my time and prepare for consultations.

#### Acceptance Criteria

1. **Web Interface:** The **Next.js web dashboard** shall implement a dedicated view for the Doctor's daily schedule, accessible after successful login (Story 1.3).  
     
2. **Dashboard Metrics:** The dashboard shall display summary metrics, including the number of appointments, estimated remaining consultation time, and potential revenue (if applicable).  
     
3. **Kanban/Calendar View:** The view shall display appointment bookings in a **Kanban-style card view** (e.g., 'Awaiting Check-in,' 'In Queue,' 'Consulting'), utilizing appointment data from **Epic 2**.  
     
4. **Data Filtering (RBAC):** The dashboard shall strictly adhere to **RBAC (NFR4)**, ensuring the Doctor can only view their own appointments and schedule, using the Doctor ID from **Story 1.4**.  
     
5. **Detail View:** Each appointment card shall be expandable to view patient details (name, basic medical history) sourced from **Story 1.5**.

### Epic 3.2: LIVE Patient Card Feed & Queue Integration

**User Story:** As a **Doctor**, I want a real-time feed of the next patient in my queue with their complete blueprint, and a simple button to process them, so that I can maintain optimal patient flow during consultations.

#### Acceptance Criteria

1. **LIVE Patient Card Feed:** The Next.js dashboard shall display a prominent **LIVE Patient Card Feed** that shows the details of the patient currently in the consultation room, utilizing the real-time queue data from **Epic 2.4**.  
     
2. **Queue Auto-Increment:** A user action (e.g., a "Mark Viewed" or "Consultation End" button) shall be implemented, which, when triggered by the Doctor, automatically increments the **LIVE queue counter** for that respective doctor in the backend (FR4).  
     
3. **Patient Blueprint:** The Patient Card shall display the patient's **complete blueprint**, including: Name, Age, basic medical history (from Story 1.5), and their status in the queue.  
     
4. **Data Synchronization:** The feed shall consume the queue and patient data via secure API endpoints, ensuring the patient information is synchronized with the PostgreSQL database (NFR1).

### Epic 3.3: Medicine Database Management API

**User Story:** As an **Administrative System**, I want a secure Node.js API layer to manage a core **Medicine Database**, so that the Digital Prescription Creation Interface has validated, searchable data for medication names and dosage information.

#### Acceptance Criteria

1. **Medicine Data Model:** A new PostgreSQL table/data model shall be defined to store the **Medicine Database** (Name, Dosage Forms, Standard Units, etc.).  
     
2. **Search API:** The Node.js backend shall expose a high-performance, secure API endpoint to enable **real-time search functionality** against the Medicine Database (FR5).  
     
3. **Management API (CRUD):** The Node.js backend shall include API endpoints restricted to Admin/Staff roles for **CRUD operations** on the Medicine Database to manage its content (FR5).  
     
4. **Performance (NFR3):** The search API for medicine names must adhere to the low-latency performance requirement to ensure a smooth prescription creation workflow.

### Epic 3.4: Digital Prescription Creation Interface

**User Story:** As a **Doctor**, I want a rich and integrated interface within the patient card view to quickly and accurately create a final digital prescription, so that the prescription handoff is efficient and error-free (P2).

#### Acceptance Criteria

1. **Prescription Interface:** The Next.js dashboard shall implement the **Digital Prescription Creation Form/Editor**, integrated into the **LIVE Patient Card Feed** (Story 3.2).  
     
2. **Medicine Search:** The interface shall integrate with the **Medicine Database Search API (Story 3.3)**, allowing the Doctor to quickly search for, select, and add medications to the prescription.  
     
3. **Prescription Record:** The interface shall allow the Doctor to specify details such as **Dosage, Frequency, and Duration** and then save the prescription as a record linked to the **Appointment** in PostgreSQL (FR5).  
     
4. **Electronic Signature:** The interface shall implement a secure mechanism to capture or apply the Doctor's **Electronic Signature** before the final prescription transmission (FR5).

### Epic 3.5: Prescription Handoff & Patient Notification

**User Story:** As an **Appointment System**, I want the final digital prescription to be instantly and securely delivered to the patient's mobile app and the on-campus pharmacy, so that the clinical handoff is complete.

#### Acceptance Criteria

1. **Transmission API:** A secure Node.js API endpoint shall be implemented to handle the final **Prescription Transmission** request from the Doctor's dashboard (Story 3.4).  
     
2. **Data Delivery (FR6):** The API shall perform two simultaneous actions: **Save the final prescription record** to the PostgreSQL database (NFR1), and **push the digital prescription data** to the patient's Kotlin app (FR6).  
     
3. **Handoff Notification:** The system shall trigger a push notification to the patient, confirming they have received the prescription and that it is **ready for pickup** at the on-campus pharmacy.  
     
4. **Patient Access (FR6):** The Kotlin app shall receive, securely store, and display the new digital prescription on the **Digital Prescription Display Screen** (defined in the UI Goals).  
     
5. **Security Audit (NFR4):** All transmission logic shall be audited to ensure that sensitive prescription data adheres strictly to security and privacy standards (NFR4).

---

## Epic 4: Campus Location & AR Navigation Core (Focus: P3)

**Epic Goal:** Integrate the **Multiset AI** SDK and its APIs to establish campus-wide indoor mapping data. Implement the core **AR/2D Map Navigation Screen**, including the **Hold Up/Down Toggle** and the **POI Search & Routing** feature.

**Dependencies:** This Epic **requires** the completion of:

- **Epic 1 (Foundation):** Specifically, the Monorepo setup, User/Auth foundation, and Patient Profile management (Stories 1.1, 1.3, 1.5).  
    
- **Epic 2 (Appt Flow):** The Appointment Booking flow (Story 2.1) is needed to enable the navigation feature to guide users to their booked locations.

The core challenges here are **external integration (Multiset AI)** and the **dual-mode UI (AR/Map)**. We must sequence the stories to establish the necessary backend APIs and mobile SDK integration *before* building the complex visual features.

**Strategy:**

1. **Backend/API:** Create the Node.js API service layer to interface with the Multiset AI APIs (e.g., fetching campus maps/POI data).  
     
2. **Mobile SDK Integration:** Integrate the Kotlin application with the Multiset AI SDK and test basic location/map display.  
     
3. **Core UI:** Build the Dual Navigation Mode screen (AR/Map Toggle).  
     
4. **Feature Logic:** Implement the POI Search and the actual pathfinding/routing logic.

### **Epic 4.1: Multiset AI Backend Service Integration**

| Detail | Description |
| :---- | :---- |
| **User Story** | As an **Architect**, I want the Node.js backend service to establish a secure, managed service layer to interface with the **Multiset AI APIs**, so that map data and routing requests can be managed and served to the mobile application. |
| **AC Focus** | FR7, NFR2, NFR3 |
| **Acceptance Criteria** | 1\. A new Node.js service module shall be created for all interactions with the **Multiset AI APIs**. 2\. The service shall include functionality to securely fetch and cache **Campus Map data** and **POI data** from Multiset AI. 3\. Securely store and manage the **Multiset AI API keys** and credentials, adhering to the Monorepo's security standards (NFR4). 4\. A public Node.js endpoint shall be exposed (e.g., `/api/v1/navigation/maps`) that serves the campus map data to the mobile app. 5\. The service shall implement initial error handling and logging for Multiset AI API failures. |

---

### **Epic 4.2: Kotlin SDK Integration & 2D Map View**

| Detail | Description |
| :---- | :---- |
| **User Story** | As a **Kotlin Developer**, I want to successfully integrate the **Multiset AI Kotlin SDK** and display the campus floor plan map (2D View) on a dedicated screen, so that the basis for navigation visualization is complete. |
| **AC Focus** | FR7, NFR3 |
| **Acceptance Criteria** | 1\. The **Multiset AI Kotlin SDK** shall be successfully added and initialized in the mobile application. 2\. A dedicated, stateful screen shall be created in the Kotlin app to display the 2D Campus Floor Plan Map using the SDK, fetching map data via the new Node.js service (Story 4.1). 3\. The 2D map view shall correctly render the floor/level information and basic Points of Interest (POI) fetched from the backend. 4\. Initial performance testing shall confirm map loading speed is low-latency (NFR3). 5\. The app shall include basic level detection and switching functionality for a single test building. |

---

### **Epic 4.3: AR/2D Dual Navigation Mode Toggle**

| Detail | Description |
| :---- | :---- |
| **User Story** | As a **UX Expert**, I want the Kotlin navigation screen to seamlessly toggle between **AR Mode** (device up) and **2D Map Mode** (device down), so that the user experience is intuitive and adheres to the **Dual Navigation Mode (FR8)** requirement. |
| **AC Focus** | FR8 |
| **Acceptance Criteria** | 1\. The Kotlin application shall implement the logic to detect the **device orientation** (up/down). 2\. When the device is held **up**, the view shall switch to an **AR-enabled camera view**, initializing the Multiset AI AR pathfinding feature (FR8). 3\. When the device is held **down**, the view shall revert to the **2D Map View** (Story 4.2). 4\. The transition between the two modes must be smooth, intuitive, and complete within **500ms** (NFR3, aligning with high performance). 5\. The screen shall display placeholder **AR visual cues** (e.g., a guidance arrow) in AR Mode, ready for the pathfinding logic. |

---

### **Epic 4.4: POI Search and Turn-by-Turn Routing**

| Detail | Description |
| :---- | :---- |
| **User Story** | As a **Patient**, I want to search for a destination (e.g., "restroom," "cafeteria," or my appointment room) and see a clear, hyper-accurate, turn-by-turn route displayed in both AR and 2D modes, so that I can easily find anything on campus (FR9). |
| **AC Focus** | FR7, FR9 |
| **Acceptance Criteria** | 1\. A search interface shall be implemented on the Kotlin navigation screen to allow users to search for **POI** (restrooms, cafeteria, etc.) and known room destinations. 2\. Upon selecting a destination, the Kotlin app shall request a route from the Node.js backend service, which interfaces with **Multiset AI** to calculate the path (FR7). 3\. The calculated path shall be overlaid on the **2D Map View** with clear turn-by-turn instructions. 4\. The route shall be visually projected onto the **AR Mode** camera view with directional guidance, confirming **1-meter accuracy** is visually supported. 5\. The routing logic shall account for multi-level and multi-building paths. |

---

## Epic 5: Lean Parking & End-of-Visit Handoff (Focus: P4, P2 Final)

**Epic Goal:** Deliver the remaining features: the **Lean Smart Parking** flow (QR Scan, Upfront Payment, Slot Assignment, Nav to Spot) and all **Post-Consultation** workflows (Digital Prescription Display, In-App Payment for medication, and History/Records View). This completes all four MVP priority pillars.

**Dependencies:** This Epic **requires** the completion of **Epic 1** (Users, Auth, Data Models), **Epic 2** (Appointment Flow), **Epic 3** (Prescription Creation), and **Epic 4** (AR Navigation Core).

### Story Breakdown and AC Definition

The stories are sequenced to first implement the **P4** feature, followed by the final **P2** patient-facing features.

| Story | Title | Description | AC Focus |
| :---- | :---- | :---- | :---- |
| **5.1** | Parking Entry: QR Scan & Slot Assignment API | Implement the Node.js API logic to securely handle the **QR-code entry process**, manage real-time slot availability (using the **ParkingSession** model from **Epic 1**), and assign a slot ID after payment. | FR10 |
| **5.2** | Parking UI: Upfront Payment & Navigation Handoff | Implement the **Mobile/Web interface** (Web for initial entry scan) to process the **Upfront Fixed-Time Payment** and display the **Digital Parking Ticket**. Hand off navigation to **Epic 4**'s AR Navigation component. | FR10, FR11 |
| **5.3** | Parking Exit: Manual Guard Verification UI | Implement the lean **Parking Guard Verification Interface** (Web Dashboard) used by staff to manually verify the patient's digital parking ticket against the assigned slot ID upon exit. | NFR4 |
| **5.4** | Prescription & Payment In-App Display | Implement the final **Kotlin UI screens** for secure display of the **Digital Prescription** and the post-consultation **In-App Payment** (e.g., for pharmacy medication purchases). | FR6, NFR4 |
| **5.5** | Patient History & Records Display | Implement the API and Kotlin UI to display the patient's comprehensive **History Detail View**, including past appointments, payments, and digital prescriptions. | NFR4 |

---

### Epic 5.1: Parking Entry: QR Scan & Slot Assignment API

**User Story:** As a **Parking System**, I want a secure Node.js API to manage parking entry, process payment, and assign an available slot, so that the entry gate flow is frictionless.

#### Acceptance Criteria

1. **QR Code Processing API:** A secure Node.js API endpoint shall be implemented to initiate the parking process, triggered by scanning a QR code at the entrance (FR10).  
     
2. **Availability & Assignment Logic:** The Node.js service shall implement logic to query real-time slot availability (using the **ParkingSession** model) and **automatically assign an available slot ID** upon successful payment authorization (FR10).  
     
3. **Payment Integration:** The API shall integrate with the external **Payment Gateway (Epic 2.3)** to process the required **upfront fixed-time payment** for the parking session (FR10).  
     
4. **Session Creation:** Upon successful payment, a new **ParkingSession** record shall be created in PostgreSQL, linked to the User and the assigned Slot ID.

### Epic 5.2: Parking UI: Upfront Payment & Navigation Handoff

**User Story:** As a **Driver**, I want a simple mobile interface to pay for parking and receive instant navigation to my assigned spot, minimizing search time.

#### Acceptance Criteria

1. **Mobile/Web Interface:** A **Web/Mobile interface** shall be implemented to handle the parking entry flow (QR scan trigger), display payment options, and process the upfront payment (FR10).  
     
2. **Digital Ticket Display (FR11):** Upon successful payment, the application shall immediately display the **Digital Parking Ticket/Session ID** (FR11).  
     
3. **Navigation Handoff:** The application shall automatically launch the **AR Navigation component (Epic 4\)** and receive the generated **turn-by-turn route** directly to the assigned parking slot (FR10).  
     
4. **Find My Spot (MVP):** The **ParkingSession** details (Slot ID and location coordinates) shall be stored in the patient's session data for future retrieval.  
     
5. **Error Handling (Lean):** The interface shall clearly display an error message and provide instructions for proceeding if the fixed-time payment fails or if no spots are available.

### Epic 5.3: Parking Exit: Manual Guard Verification UI

**User Story:** As a **Parking Guard**, I want a simple web interface to quickly verify a vehicle's digital parking ticket upon exit, so that the lean MVP exit flow is secure and efficient.

#### Acceptance Criteria

1. **Web Interface:** A basic, role-restricted **Next.js web interface** shall be implemented for **Parking Guards** to use on a tablet/desktop, utilizing the Staff role credentials (NFR4).  
     
2. **Verification Lookup:** The interface shall allow the Guard to input or scan the **Digital Parking Ticket/Session ID** to retrieve the session details, including paid duration and assigned Slot ID.  
     
3. **Status Display:** The interface shall clearly display the **Status** (Valid, Expired, Wrong Spot, etc.) and confirm the associated vehicle details based on the lookup.  
     
4. **Lean Exit:** The flow shall conclude with the Guard visually verifying the match and manually confirming the session as "Closed" in the system, adhering to the Lean MVP scope.

### Epic 5.4: Prescription & Payment In-App Display

**User Story:** As a **Patient**, I want to see my final digital prescription and easily pay for related services (like pharmacy medication) directly in the app, so that the post-consultation process is simple and transparent.

#### Acceptance Criteria

1. **Digital Prescription Display (FR6):** The **Kotlin mobile app** shall implement the secure display screen for the final **Digital Prescription** transmitted in **Epic 3.5**.  
     
2. **Prescription Details:** The display shall include all required details: medication, dosage, doctor's signature, and date.  
     
3. **In-App Payment:** A new payment flow shall be implemented in the Kotlin app that allows the patient to pay post-consultation fees (e.g., pharmacy bill), utilizing the payment gateway integrated in **Epic 2.3**.  
     
4. **Security (NFR4):** The Prescription display shall implement data protection measures, ensuring the highly sensitive information cannot be easily screenshotted or accessed by unauthorized users.

### Epic 5.5: Patient History & Records Display

**User Story:** As a **Patient**, I want a single view of my past visits, payments, and prescriptions, so that I can track my health records over time.

#### Acceptance Criteria

1. **Mobile Interface:** A dedicated **History Detail View** screen shall be implemented in the **Kotlin mobile application**.  
     
2. **Record Retrieval:** The Kotlin app shall consume secure Node.js API endpoints to retrieve the patient's records from the **PostgreSQL** database, including:  
     
   - Past Appointment details.  
       
   - Past Payment records.  
       
   - Archived Digital Prescriptions (FR6).

3. **Data Filtering (RBAC):** The API shall strictly enforce **Role-Based Access Control (NFR4)** to ensure only the authenticated Patient/Attendant can view their own historical records.  
     
4. **Performance (NFR3):** The API for retrieving the history shall be optimized for quick data retrieval, even for patients with long visit histories.

---