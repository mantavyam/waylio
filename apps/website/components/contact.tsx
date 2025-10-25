import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default function ContactSection() {
    return (
        <section className="py-32" id="contact">
            <div className="mx-auto max-w-4xl px-4 lg:px-0">
                <h1 className="mb-12 text-center text-4xl font-semibold lg:text-5xl">Get in Touch</h1>

                <div className="grid divide-y border md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0">
                    <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Sales & Partnerships</h2>
                            <Link
                                href="mailto:sales@waylio.com"
                                className="text-lg text-blue-600 hover:underline dark:text-blue-400">
                                sales@waylio.com
                            </Link>
                            <p className="mt-3 text-sm">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                        <div>
                            <h3 className="mb-3 text-lg font-semibold">Support</h3>
                            <Link
                                href="mailto:support@waylio.com"
                                className="text-lg text-blue-600 hover:underline dark:text-blue-400">
                                support@waylio.com
                            </Link>
                            <p className="mt-3 text-sm">24/7 Support Available</p>
                        </div>
                    </div>
                </div>

                <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>
                <form
                    action=""
                    className="border px-4 py-12 lg:px-0 lg:py-24">
                    <Card className="mx-auto max-w-lg p-8 sm:p-16">
                        <h3 className="text-xl font-semibold">Schedule a Demo</h3>
                        <p className="mt-4 text-sm">Reach out to our team to learn how Waylio can transform your healthcare practice.</p>

                        <div className="**:[&>label]:block mt-12 space-y-6 *:space-y-3">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="space-y-2">
                                    Full name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="space-y-2">
                                    Work Email
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="country"
                                    className="space-y-2">
                                    Country/Region
                                </Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">India</SelectItem>
                                        <SelectItem value="2">United States</SelectItem>
                                        <SelectItem value="3">Singapore</SelectItem>
                                        <SelectItem value="4">Japan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="website"
                                    className="space-y-2">
                                    Website
                                </Label>
                                <Input
                                    type="url"
                                    id="website"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="job"
                                    className="space-y-2">
                                    Role function
                                </Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a job function" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Medical</SelectItem>
                                        <SelectItem value="2">Diagnostics</SelectItem>
                                        <SelectItem value="3">Educational</SelectItem>
                                        <SelectItem value="4">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="msg"
                                    className="space-y-2">
                                    Message
                                </Label>
                                <Textarea
                                    id="msg"
                                    rows={3}
                                />
                            </div>
                            <Button>Submit</Button>
                        </div>
                    </Card>
                </form>
            </div>
        </section>
    )
}
