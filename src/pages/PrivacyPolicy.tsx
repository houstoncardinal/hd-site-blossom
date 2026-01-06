import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS_CONFIG } from '@/config/business';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 6, 2026';

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy - Data Protection & Security"
        description="Read HDA Studio's privacy policy to understand how we collect, use, and protect your personal information. GDPR and CCPA compliant."
        keywords="privacy policy, data protection, GDPR, CCPA, personal information, cookies"
        canonicalUrl="/privacy-policy"
        noIndex={true}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy-policy' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
              Privacy <span className="italic">Policy</span>
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-light prose-a:text-primary hover:prose-a:text-primary/80"
          >
            <p className="lead">
              At {BUSINESS_CONFIG.name.full}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Book an appointment or consultation</li>
              <li>Submit a contact form or inquiry</li>
              <li>Subscribe to our newsletter or marketing communications</li>
              <li>Leave a review or testimonial</li>
              <li>Create an account on our website</li>
            </ul>

            <p>This information may include:</p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Appointment preferences and history</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information about your device and browsing behavior, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring website</li>
              <li>Pages viewed and time spent on our site</li>
              <li>Clickstream data</li>
            </ul>

            <h2 id="cookies">2. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files stored on your device that help us:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve our website functionality</li>
              <li>Provide personalized content and advertisements</li>
            </ul>

            <p>You can control cookie preferences through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.</p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>Service Delivery:</strong> To process bookings, schedule appointments, and provide our beauty services</li>
              <li><strong>Communication:</strong> To respond to inquiries, send appointment reminders, and provide customer support</li>
              <li><strong>Marketing:</strong> To send promotional emails, newsletters, and special offers (with your consent)</li>
              <li><strong>Improvement:</strong> To analyze website usage and improve our services, content, and user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities</li>
            </ul>

            <h2>4. How We Share Your Information</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>

            <h3>Service Providers</h3>
            <p>We work with trusted third-party service providers who assist us in operating our website and providing our services, including:</p>
            <ul>
              <li>Payment processors (for secure transaction processing)</li>
              <li>Email service providers (for newsletters and communications)</li>
              <li>Analytics providers (Google Analytics, etc.)</li>
              <li>Cloud storage providers (Supabase for database services)</li>
              <li>Booking and scheduling platforms</li>
            </ul>
            <p>These providers are contractually obligated to protect your information and use it only for the purposes we specify.</p>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to:</p>
            <ul>
              <li>Valid legal processes (subpoenas, court orders)</li>
              <li>Requests from government authorities</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Protection of the rights, property, or safety of others</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            <ul>
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p>However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>

            <h2>6. Your Privacy Rights</h2>

            <h3>General Rights</h3>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
            </ul>

            <h3>California Privacy Rights (CCPA)</h3>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
            <ul>
              <li>Right to know what personal information is collected and how it is used</li>
              <li>Right to delete personal information (with exceptions)</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>

            <h3>European Privacy Rights (GDPR)</h3>
            <p>If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent at any time</li>
            </ul>

            <p>To exercise any of these rights, please contact us at <a href={`mailto:${BUSINESS_CONFIG.contact.email.primary}`}>{BUSINESS_CONFIG.contact.email.primary}</a>.</p>

            <h2>7. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete such information.</p>

            <h2>8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites and social media platforms. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.</p>

            <h2>9. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to the United States and other countries where we operate.</p>

            <h2>10. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>

            <p>Typical retention periods include:</p>
            <ul>
              <li>Appointment records: 7 years (for business and tax purposes)</li>
              <li>Marketing communications: Until you unsubscribe</li>
              <li>Account information: Until you request deletion</li>
              <li>Analytics data: 26 months (Google Analytics default)</li>
            </ul>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.</p>

            <p>For material changes, we may provide additional notice, such as:</p>
            <ul>
              <li>Posting a prominent notice on our website</li>
              <li>Sending an email to registered users</li>
            </ul>

            <h2>12. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>

            <div className="bg-card border border-border p-6 rounded-lg my-6">
              <p className="font-semibold mb-2">{BUSINESS_CONFIG.name.full}</p>
              <p>{BUSINESS_CONFIG.contact.address.oneLine}</p>
              <p>Email: <a href={`mailto:${BUSINESS_CONFIG.contact.email.primary}`}>{BUSINESS_CONFIG.contact.email.primary}</a></p>
              <p>Phone: <a href={`tel:${BUSINESS_CONFIG.contact.phone.raw}`}>{BUSINESS_CONFIG.contact.phone.display}</a></p>
            </div>

            <h2>13. Consent</h2>
            <p>By using our website and services, you consent to the collection, use, and sharing of your information as described in this Privacy Policy.</p>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy is effective as of {lastUpdated} and applies to all information collected by {BUSINESS_CONFIG.name.full}.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PrivacyPolicy;
