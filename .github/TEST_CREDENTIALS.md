# Test Credentials for Waylio

## Pre-configured User Accounts

The database has been seeded with the following test accounts. You can use these credentials to log in to the application.

### Admin Account
- **Email**: `admin@waylio.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full administrative access to all features

### Reception Staff
- **Email**: `reception@waylio.com`
- **Password**: `reception123`
- **Role**: RECEPTION
- **Access**: Reception desk features, appointment management

### Doctors

#### Dr. John Smith (Cardiology)
- **Email**: `dr.smith@waylio.com`
- **Password**: `doctor123`
- **Role**: DOCTOR
- **Specialization**: Cardiology
- **Registration**: DR-CARD-001
- **Experience**: 15 years

#### Dr. Sarah Johnson (Orthopedics)
- **Email**: `dr.johnson@waylio.com`
- **Password**: `doctor123`
- **Role**: DOCTOR
- **Specialization**: Orthopedics
- **Registration**: DR-ORTH-002
- **Experience**: 12 years

#### Dr. Michael Williams (General Medicine)
- **Email**: `dr.williams@waylio.com`
- **Password**: `doctor123`
- **Role**: DOCTOR
- **Specialization**: General Medicine
- **Registration**: DR-GENM-003
- **Experience**: 10 years

### Patients

#### Patient 1 - Alice Brown
- **Email**: `patient1@example.com`
- **Password**: `patient123`
- **Role**: PATIENT

#### Patient 2 - Bob Wilson
- **Email**: `patient2@example.com`
- **Password**: `patient123`
- **Role**: PATIENT

## Quick Start

1. Make sure the backend is running on `http://localhost:4000`
2. Access the web app at `http://localhost:3001`
3. Use any of the credentials above to sign in
4. For admin access, use `admin@waylio.com` / `admin123`

## Notes

- All passwords are for **testing purposes only**
- Change these credentials in production
- The database is seeded automatically when you run `pnpm prisma:seed` in the backend directory
