import { PrismaClient } from '@prisma/client';

export async function seedNotificationTemplates(prisma: PrismaClient) {
  console.log('Seeding notification templates...');

  const templates = [
    {
      name: 'USER_CREDENTIALS',
      type: 'EMAIL',
      subject: 'Welcome to Waylio - Your Login Credentials',
      body: `
        <h2>Welcome to Waylio!</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Your account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><strong>Unique ID:</strong> {{uniqueId}}</li>
          <li><strong>Temporary Password:</strong> {{temporaryPassword}}</li>
        </li>
        <p>Please login and change your password immediately.</p>
        <p>Login URL: {{loginUrl}}</p>
        <br>
        <p>Best regards,<br>Waylio Team</p>
      `,
    },
    {
      name: 'WELCOME_EMAIL',
      type: 'EMAIL',
      subject: 'Welcome to Waylio!',
      body: `
        <h2>Welcome to Waylio!</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>Thank you for registering with Waylio. We're excited to have you on board!</p>
        <p>You can now access all our features including:</p>
        <ul>
          <li>Book appointments with doctors</li>
          <li>Navigate the hospital campus with AR</li>
          <li>Manage parking</li>
          <li>View digital prescriptions</li>
        </ul>
        <br>
        <p>Best regards,<br>Waylio Team</p>
      `,
    },
    {
      name: 'PASSWORD_RESET',
      type: 'EMAIL',
      subject: 'Reset Your Password - Waylio',
      body: `
        <h2>Password Reset Request</h2>
        <p>Dear {{firstName}} {{lastName}},</p>
        <p>We received a request to reset your password. Use the OTP below to reset your password:</p>
        <h3 style="background: #f0f0f0; padding: 10px; text-align: center;">{{otp}}</h3>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br>Waylio Team</p>
      `,
    },
    {
      name: 'TWO_FACTOR_AUTH',
      type: 'SMS',
      subject: null,
      body: 'Your Waylio 2FA code is: {{code}}. Valid for 5 minutes.',
    },
    {
      name: 'OTP_VERIFICATION',
      type: 'SMS',
      subject: null,
      body: 'Your Waylio verification code is: {{otp}}. Valid for 5 minutes.',
    },
    {
      name: 'APPOINTMENT_CONFIRMATION',
      type: 'EMAIL',
      subject: 'Appointment Confirmed - Waylio',
      body: `
        <h2>Appointment Confirmed</h2>
        <p>Dear {{patientName}},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <ul>
          <li><strong>Doctor:</strong> Dr. {{doctorName}}</li>
          <li><strong>Department:</strong> {{department}}</li>
          <li><strong>Date & Time:</strong> {{appointmentTime}}</li>
          <li><strong>Location:</strong> {{location}}</li>
        </ul>
        <p>Please arrive 15 minutes early for check-in.</p>
        <br>
        <p>Best regards,<br>Waylio Team</p>
      `,
    },
    {
      name: 'APPOINTMENT_REMINDER',
      type: 'SMS',
      subject: null,
      body: 'Reminder: You have an appointment with Dr. {{doctorName}} tomorrow at {{appointmentTime}}. Location: {{location}}',
    },
    {
      name: 'QUEUE_UPDATE',
      type: 'PUSH',
      subject: null,
      body: 'You are now {{position}} in the queue. Please proceed to {{location}}.',
    },
    {
      name: 'PRESCRIPTION_READY',
      type: 'PUSH',
      subject: null,
      body: 'Your prescription from Dr. {{doctorName}} is ready. You can view it in the app.',
    },
    {
      name: 'PARKING_CONFIRMATION',
      type: 'SMS',
      subject: null,
      body: 'Parking confirmed! Slot: {{slotNumber}}, Level: {{level}}, Zone: {{zone}}. Duration: {{duration}} hours. Amount: ${{amount}}',
    },
  ];

  for (const template of templates) {
    await prisma.notificationTemplateModel.upsert({
      where: { name: template.name as any },
      create: template as any,
      update: template as any,
    });
  }

  console.log(`✓ Seeded ${templates.length} notification templates`);
}

