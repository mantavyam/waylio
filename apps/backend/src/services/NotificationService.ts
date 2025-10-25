import { PrismaClient, NotificationType, NotificationTemplate, NotificationStatus } from '@prisma/client';
import { BaseService } from './BaseService.js';
import { APIError } from '../utils/APIError.js';

export interface SendNotificationInput {
  type: NotificationType;
  template: NotificationTemplate;
  recipient: {
    email?: string;
    phone?: string;
    fcmToken?: string;
  };
  data: Record<string, string | number>;
  priority?: 'high' | 'normal' | 'low';
}

export class NotificationService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Send a notification using the specified template
   */
  async send(input: SendNotificationInput) {
    // Get template
    const template = await this.getTemplate(input.template);

    if (!template) {
      throw new APIError('Notification template not found', 404, 'TEMPLATE_NOT_FOUND');
    }

    // Validate recipient based on type
    this.validateRecipient(input.type, input.recipient);

    // Replace placeholders in template
    const body = this.replacePlaceholders(template.body, input.data);
    const subject = template.subject ? this.replacePlaceholders(template.subject, input.data) : undefined;

    // Create notification log
    const log = await this.prisma.notificationLog.create({
      data: {
        type: input.type,
        template: input.template,
        recipient_email: input.recipient.email,
        recipient_phone: input.recipient.phone,
        status: 'PENDING',
        metadata: {
          data: input.data,
          priority: input.priority || 'normal',
        },
      },
    });

    try {
      // Send notification based on type
      switch (input.type) {
        case 'SMS':
          await this.sendSMS(input.recipient.phone!, body);
          break;
        case 'EMAIL':
          await this.sendEmail(input.recipient.email!, subject!, body);
          break;
        case 'PUSH':
          await this.sendPush(input.recipient.fcmToken!, subject || 'Notification', body);
          break;
      }

      // Update log status
      await this.prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: 'SENT',
          sent_at: new Date(),
        },
      });

      return {
        id: log.id,
        status: 'SENT' as NotificationStatus,
        sentAt: new Date(),
      };
    } catch (error) {
      // Update log with error
      await this.prisma.notificationLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw new APIError('Failed to send notification', 500, 'NOTIFICATION_FAILED');
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(phone: string, message: string): Promise<void> {
    // TODO: Integrate with SMS gateway (Twilio/MSG91)
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SMS] To: ${phone}, Message: ${message}`);
      return;
    }

    // Example Twilio integration:
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    throw new Error('SMS gateway not configured');
  }

  /**
   * Send Email notification
   */
  private async sendEmail(email: string, subject: string, body: string): Promise<void> {
    // TODO: Integrate with email service (SendGrid/AWS SES)
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EMAIL] To: ${email}, Subject: ${subject}, Body: ${body}`);
      return;
    }

    // Example SendGrid integration:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: email,
    //   from: process.env.FROM_EMAIL,
    //   subject,
    //   html: body,
    // });

    throw new Error('Email service not configured');
  }

  /**
   * Send Push notification
   */
  private async sendPush(fcmToken: string, title: string, body: string): Promise<void> {
    // TODO: Integrate with Firebase FCM
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PUSH] To: ${fcmToken}, Title: ${title}, Body: ${body}`);
      return;
    }

    // Example FCM integration:
    // const admin = require('firebase-admin');
    // await admin.messaging().send({
    //   token: fcmToken,
    //   notification: {
    //     title,
    //     body,
    //   },
    // });

    throw new Error('Push notification service not configured');
  }

  /**
   * Get notification template
   */
  private async getTemplate(name: NotificationTemplate) {
    return await this.prisma.notificationTemplateModel.findUnique({
      where: { name },
    });
  }

  /**
   * Validate recipient based on notification type
   */
  private validateRecipient(type: NotificationType, recipient: SendNotificationInput['recipient']): void {
    switch (type) {
      case 'SMS':
        if (!recipient.phone) {
          throw new APIError('Phone number is required for SMS', 400, 'MISSING_PHONE');
        }
        break;
      case 'EMAIL':
        if (!recipient.email) {
          throw new APIError('Email is required for EMAIL', 400, 'MISSING_EMAIL');
        }
        break;
      case 'PUSH':
        if (!recipient.fcmToken) {
          throw new APIError('FCM token is required for PUSH', 400, 'MISSING_FCM_TOKEN');
        }
        break;
    }
  }

  /**
   * Replace placeholders in template
   * Example: "Hello {{name}}" with data {name: "John"} => "Hello John"
   */
  private replacePlaceholders(template: string, data: Record<string, string | number>): string {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }
    return result;
  }

  /**
   * Create or update notification template
   */
  async upsertTemplate(
    name: NotificationTemplate,
    type: NotificationType,
    body: string,
    subject?: string
  ) {
    return await this.prisma.notificationTemplateModel.upsert({
      where: { name },
      create: {
        name,
        type,
        body,
        subject,
      },
      update: {
        type,
        body,
        subject,
      },
    });
  }

  /**
   * Get notification logs with filters
   */
  async getLogs(filters: {
    type?: NotificationType;
    status?: NotificationStatus;
    recipientEmail?: string;
    recipientPhone?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.recipientEmail) where.recipient_email = filters.recipientEmail;
    if (filters.recipientPhone) where.recipient_phone = filters.recipientPhone;
    if (filters.startDate || filters.endDate) {
      where.created_at = {};
      if (filters.startDate) where.created_at.gte = filters.startDate;
      if (filters.endDate) where.created_at.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.notificationLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.notificationLog.count({ where }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

