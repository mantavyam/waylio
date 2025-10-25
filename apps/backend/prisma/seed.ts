import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { seedNotificationTemplates } from './seeds/notificationTemplates.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed notification templates first
  await seedNotificationTemplates(prisma);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@waylio.com' },
    update: {},
    create: {
      email: 'admin@waylio.com',
      phone: '+1234567890',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create reception user
  const receptionPassword = await bcrypt.hash('reception123', 10);
  const reception = await prisma.user.upsert({
    where: { email: 'reception@waylio.com' },
    update: {},
    create: {
      email: 'reception@waylio.com',
      phone: '+1234567891',
      password_hash: receptionPassword,
      first_name: 'Reception',
      last_name: 'Staff',
      role: 'RECEPTION',
    },
  });
  console.log('✅ Reception user created:', reception.email);

  // Create doctors
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@waylio.com' },
    update: {},
    create: {
      email: 'dr.smith@waylio.com',
      phone: '+1234567892',
      password_hash: doctorPassword,
      first_name: 'John',
      last_name: 'Smith',
      role: 'DOCTOR',
      doctor_profile: {
        create: {
          specialization: 'Cardiology',
          registration_number: 'DR-CARD-001',
          qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
          experience: 15,
          consultation_fee: 150.00,
          follow_up_fee: 75.00,
          video_consultation_fee: 100.00,
          languages: ['English', 'Spanish'],
          bio: 'Experienced cardiologist with 15 years of practice in treating cardiovascular diseases.',
          certificate_urls: [],
          availability: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' },
          },
        },
      },
    },
  });
  console.log('✅ Doctor created:', doctor1.email);

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.johnson@waylio.com' },
    update: {},
    create: {
      email: 'dr.johnson@waylio.com',
      phone: '+1234567893',
      password_hash: doctorPassword,
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'DOCTOR',
      doctor_profile: {
        create: {
          specialization: 'Orthopedics',
          registration_number: 'DR-ORTH-002',
          qualifications: ['MBBS', 'MS Orthopedics', 'FAAOS'],
          experience: 12,
          consultation_fee: 175.00,
          follow_up_fee: 85.00,
          video_consultation_fee: 125.00,
          languages: ['English', 'French'],
          bio: 'Orthopedic specialist focusing on sports injuries and joint replacements.',
          certificate_urls: [],
          availability: {
            monday: { start: '10:00', end: '18:00' },
            tuesday: { start: '10:00', end: '18:00' },
            wednesday: { start: '10:00', end: '18:00' },
            thursday: { start: '10:00', end: '18:00' },
            friday: { start: '10:00', end: '14:00' },
          },
        },
      },
    },
  });
  console.log('✅ Doctor created:', doctor2.email);

  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.williams@waylio.com' },
    update: {},
    create: {
      email: 'dr.williams@waylio.com',
      phone: '+1234567894',
      password_hash: doctorPassword,
      first_name: 'Michael',
      last_name: 'Williams',
      role: 'DOCTOR',
      doctor_profile: {
        create: {
          specialization: 'General Medicine',
          registration_number: 'DR-GENM-003',
          qualifications: ['MBBS', 'MD General Medicine'],
          experience: 10,
          consultation_fee: 100.00,
          follow_up_fee: 50.00,
          video_consultation_fee: 75.00,
          languages: ['English', 'Hindi'],
          bio: 'General practitioner with expertise in preventive care and chronic disease management.',
          certificate_urls: [],
          availability: {
            monday: { start: '08:00', end: '16:00' },
            tuesday: { start: '08:00', end: '16:00' },
            wednesday: { start: '08:00', end: '16:00' },
            thursday: { start: '08:00', end: '16:00' },
            friday: { start: '08:00', end: '16:00' },
          },
        },
      },
    },
  });
  console.log('✅ Doctor created:', doctor3.email);

  // Create patient users
  const patientPassword = await bcrypt.hash('patient123', 10);
  
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient1@example.com' },
    update: {},
    create: {
      email: 'patient1@example.com',
      phone: '+1234567895',
      password_hash: patientPassword,
      first_name: 'Alice',
      last_name: 'Brown',
      role: 'PATIENT',
      patient_profile: {
        create: {
          medical_history: 'No known allergies. Previous surgery in 2020.',
          emergency_contact: '+1234567896',
        },
      },
    },
  });
  console.log('✅ Patient created:', patient1.email);

  const patient2 = await prisma.user.upsert({
    where: { email: 'patient2@example.com' },
    update: {},
    create: {
      email: 'patient2@example.com',
      phone: '+1234567897',
      password_hash: patientPassword,
      first_name: 'Bob',
      last_name: 'Davis',
      role: 'PATIENT',
      patient_profile: {
        create: {
          medical_history: 'Diabetic. Regular medication required.',
          emergency_contact: '+1234567898',
        },
      },
    },
  });
  console.log('✅ Patient created:', patient2.email);

  // Create some POIs
  const pois = [
    {
      name: 'Cardiology Department',
      category: 'DEPARTMENT',
      building: 'Main Building',
      floor: 2,
      coordinates: { x: 100, y: 200, z: 0 },
      description: 'Cardiology department with state-of-the-art facilities',
    },
    {
      name: 'Orthopedics Department',
      category: 'DEPARTMENT',
      building: 'Main Building',
      floor: 3,
      coordinates: { x: 150, y: 250, z: 0 },
      description: 'Orthopedics department specializing in bone and joint care',
    },
    {
      name: 'Main Cafeteria',
      category: 'CAFETERIA',
      building: 'Main Building',
      floor: 1,
      coordinates: { x: 50, y: 100, z: 0 },
      description: 'Main hospital cafeteria serving meals 24/7',
    },
    {
      name: 'Pharmacy',
      category: 'PHARMACY',
      building: 'Main Building',
      floor: 1,
      coordinates: { x: 75, y: 125, z: 0 },
      description: 'Hospital pharmacy for prescription medications',
    },
    {
      name: 'Parking Lot A',
      category: 'PARKING',
      building: 'Parking Structure',
      floor: 0,
      coordinates: { x: 0, y: 0, z: 0 },
      description: 'Main parking lot with 200 spaces',
    },
  ];

  for (const poi of pois) {
    await prisma.pointOfInterest.upsert({
      where: { id: poi.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: poi as any,
    });
  }
  console.log('✅ POIs created');

  // Create parking slots
  const parkingSlots = [];
  for (let level = 1; level <= 3; level++) {
    for (let zone of ['A', 'B', 'C']) {
      for (let num = 1; num <= 20; num++) {
        parkingSlots.push({
          slot_number: `${level}${zone}${num.toString().padStart(2, '0')}`,
          level: `Level ${level}`,
          zone: `Zone ${zone}`,
          coordinates: { x: num * 10, y: level * 100, z: 0 },
        });
      }
    }
  }

  for (const slot of parkingSlots) {
    await prisma.parkingSlot.upsert({
      where: { slot_number: slot.slot_number },
      update: {},
      create: slot as any,
    });
  }
  console.log('✅ Parking slots created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@waylio.com / admin123');
  console.log('Reception: reception@waylio.com / reception123');
  console.log('Doctor 1: dr.smith@waylio.com / doctor123');
  console.log('Doctor 2: dr.johnson@waylio.com / doctor123');
  console.log('Doctor 3: dr.williams@waylio.com / doctor123');
  console.log('Patient 1: patient1@example.com / patient123');
  console.log('Patient 2: patient2@example.com / patient123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

