'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How does the appointment scheduling work?',
            answer: 'Waylio provides an intuitive scheduling system that allows patients to book appointments online 24/7. Doctors can set their availability, and the system automatically manages conflicts and sends reminders to both parties.',
        },
        {
            id: 'item-2',
            question: 'Is my patient data secure and compliant?',
            answer: 'Yes, Waylio implements enterprise-grade security measures and is fully HIPAA compliant. All data is encrypted both in transit and at rest, ensuring your patient information remains private and secure.',
        },
        {
            id: 'item-3',
            question: 'Can I integrate Waylio with my existing systems?',
            answer: 'Waylio offers comprehensive API access and integration capabilities with popular EHR systems, billing platforms, and other healthcare tools. Our support team can help you set up custom integrations as needed.',
        },
        {
            id: 'item-4',
            question: 'What kind of support do you provide?',
            answer: "We offer 24/7 customer support via chat, email, and phone. Our dedicated support team is here to help you with onboarding, training, and any technical issues you might encounter.",
        },
        {
            id: 'item-5',
            question: 'Can I try Waylio before committing?',
            answer: 'Absolutely! We offer a 30-day free trial with full access to all features. No credit card required. You can explore the platform, schedule demo appointments, and see how Waylio fits your practice needs.',
        },
    ]

    return (
        <section className="py-16 md:py-24" id="faqs">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Can&apos;t find what you&apos;re looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
