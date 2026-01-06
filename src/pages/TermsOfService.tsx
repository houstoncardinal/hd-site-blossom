import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BUSINESS_CONFIG } from '@/config/business';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const lastUpdated = 'January 6, 2026';

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Service - Service Agreement & Policies"
        description="Read HDA Studio's terms of service, booking policies, and service agreements. Understand your rights and responsibilities as a client."
        keywords="terms of service, booking policy, cancellation policy, service agreement"
        canonicalUrl="/terms-of-service"
        noIndex={true}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Terms of Service', url: '/terms-of-service' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">
              Terms of <span className="italic">Service</span>
            </h1>
            <p className="text-muted-foreground">
              Last Updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-light prose-a:text-primary hover:prose-a:text-primary/80"
          >
            <p className="lead">
              Welcome to {BUSINESS_CONFIG.name.full}. By accessing our website or using our services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>By booking an appointment, using our website, or engaging with our services, you acknowledge that you have read, understood, and agree to these Terms of Service and our <Link to="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use our services.</p>

            <h2>2. Services Provided</h2>
            <p>{BUSINESS_CONFIG.name.full} provides professional makeup artistry and beauty services, including but not limited to:</p>
            <ul>
              <li>Makeup application (soft glam, standard glam, signature glam)</li>
              <li>Bridal makeup services</li>
              <li>Special event makeup</li>
              <li>Makeup consultations and trials</li>
              <li>Additional beauty services as offered</li>
            </ul>

            <h2>3. Booking and Appointments</h2>

            <h3>3.1 Making a Booking</h3>
            <p>Appointments can be made through:</p>
            <ul>
              <li>Our online booking system at <a href={BUSINESS_CONFIG.website.url}>{BUSINESS_CONFIG.website.domain}</a></li>
              <li>Phone: <a href={`tel:${BUSINESS_CONFIG.contact.phone.raw}`}>{BUSINESS_CONFIG.contact.phone.display}</a></li>
              <li>Email: <a href={`mailto:${BUSINESS_CONFIG.contact.email.bookings}`}>{BUSINESS_CONFIG.contact.email.bookings}</a></li>
            </ul>

            <h3>3.2 Deposit Requirement</h3>
            <p>A non-refundable deposit of 50% of the total service cost is required to secure your appointment. The remaining balance is due on the day of service.</p>

            <h3>3.3 Confirmation</h3>
            <p>You will receive a confirmation email upon successful booking. Please verify all details and contact us immediately if there are any discrepancies.</p>

            <h2>4. Cancellation and Rescheduling Policy</h2>

            <h3>4.1 Client Cancellations</h3>
            <ul>
              <li><strong>48+ hours notice:</strong> Full deposit refund or credit toward future services</li>
              <li><strong>24-48 hours notice:</strong> 50% deposit refund or full credit toward future services</li>
              <li><strong>Less than 24 hours:</strong> Deposit is forfeited (non-refundable)</li>
              <li><strong>No-show:</strong> Deposit is forfeited, remaining balance may be charged</li>
            </ul>

            <h3>4.2 Bridal and Group Bookings</h3>
            <p>Special cancellation terms apply:</p>
            <ul>
              <li><strong>7+ days notice:</strong> Full deposit refund or credit</li>
              <li><strong>3-7 days notice:</strong> 50% deposit refund or full credit</li>
              <li><strong>Less than 3 days:</strong> Deposit is forfeited</li>
            </ul>

            <h3>4.3 Rescheduling</h3>
            <p>Rescheduling requests must be made at least 48 hours before your appointment. One free reschedule is permitted; subsequent changes may incur a $25 rescheduling fee.</p>

            <h3>4.4 Late Arrivals</h3>
            <p>We understand delays happen. However:</p>
            <ul>
              <li>Arrivals up to 15 minutes late: Service will be accommodated if possible, may be shortened</li>
              <li>Arrivals 15+ minutes late: Appointment may be shortened or rescheduled at our discretion</li>
              <li>Arrivals 30+ minutes late: May be considered a no-show, deposit forfeited</li>
            </ul>

            <h3>4.5 Our Cancellations</h3>
            <p>In rare cases (illness, emergency, weather), we may need to cancel or reschedule. We will provide as much notice as possible and offer:</p>
            <ul>
              <li>Priority rescheduling</li>
              <li>Full refund of all payments</li>
              <li>Complimentary add-on service when rescheduled</li>
            </ul>

            <h2>5. Payment Terms</h2>

            <h3>5.1 Accepted Payment Methods</h3>
            <p>We accept:</p>
            <ul>
              <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
              <li>Debit cards</li>
              <li>Cash (in-person payments only)</li>
              <li>Digital payments (Apple Pay, Google Pay)</li>
            </ul>

            <h3>5.2 Pricing</h3>
            <p>All prices are listed in USD and are subject to change. Current pricing is displayed on our <Link to="/services">Services page</Link>. Prices in effect at the time of booking will be honored.</p>

            <h3>5.3 Additional Services</h3>
            <p>Add-on services requested during your appointment may incur additional charges. You will be informed of costs before services are provided.</p>

            <h3>5.4 Gratuity</h3>
            <p>Gratuity is not included in service prices. Tips are appreciated but never required.</p>

            <h2>6. Service Expectations and Client Responsibilities</h2>

            <h3>6.1 Skin Preparation</h3>
            <p>For best results, clients should:</p>
            <ul>
              <li>Arrive with clean, moisturized skin</li>
              <li>Avoid trying new skincare products 48 hours before appointment</li>
              <li>Disclose any skin sensitivities or allergies</li>
              <li>Inform us of contact lens use (insert before appointment)</li>
            </ul>

            <h3>6.2 Health Disclosures</h3>
            <p>Clients must disclose:</p>
            <ul>
              <li>Skin conditions (acne, eczema, rosacea, etc.)</li>
              <li>Allergies to makeup products or ingredients</li>
              <li>Recent facial procedures or treatments</li>
              <li>Pregnancy or medical conditions that may affect services</li>
              <li>Contagious conditions (pink eye, cold sores, etc.)</li>
            </ul>

            <h3>6.3 Right to Refuse Service</h3>
            <p>We reserve the right to refuse or discontinue service if:</p>
            <ul>
              <li>Client has a contagious condition</li>
              <li>Client exhibits aggressive, abusive, or inappropriate behavior</li>
              <li>Client arrives intoxicated or under the influence</li>
              <li>Safety or hygiene concerns arise</li>
            </ul>

            <h2>7. Product Use and Hygiene</h2>
            <p>We use professional, high-quality makeup products and maintain strict hygiene standards:</p>
            <ul>
              <li>All brushes and tools are sanitized between clients</li>
              <li>Disposable applicators are used when appropriate</li>
              <li>Products are applied with clean hands or sanitized tools</li>
              <li>Clients may request hypoallergenic or specific product brands</li>
            </ul>

            <h2>8. Liability and Warranties</h2>

            <h3>8.1 Allergic Reactions</h3>
            <p>While we use professional products, allergic reactions can occur. Clients should:</p>
            <ul>
              <li>Perform a patch test if they have sensitive skin</li>
              <li>Notify us immediately of any discomfort during service</li>
              <li>Provide accurate allergy information</li>
            </ul>
            <p>{BUSINESS_CONFIG.name.full} is not liable for allergic reactions when proper disclosure was not made by the client.</p>

            <h3>8.2 Makeup Longevity</h3>
            <p>We use long-wearing, professional products and techniques. However, makeup longevity depends on:</p>
            <ul>
              <li>Skin type and condition</li>
              <li>Environmental factors (heat, humidity)</li>
              <li>Activity level</li>
              <li>Proper setting and application techniques</li>
            </ul>
            <p>We provide touch-up tips and products, but cannot guarantee specific wear time.</p>

            <h3>8.3 Limitation of Liability</h3>
            <p>To the fullest extent permitted by law, {BUSINESS_CONFIG.name.full} shall not be liable for any indirect, incidental, special, or consequential damages arising from our services.</p>

            <h2>9. Intellectual Property</h2>

            <h3>9.1 Photography and Marketing</h3>
            <p>We may photograph your makeup results for:</p>
            <ul>
              <li>Portfolio and marketing materials</li>
              <li>Social media posts</li>
              <li>Website content</li>
              <li>Before/after showcases</li>
            </ul>
            <p>You may decline to be photographed or request that photos not be used publicly. Please inform us of your preference before or during your appointment.</p>

            <h3>9.2 Website Content</h3>
            <p>All content on our website (text, images, logos, designs) is owned by {BUSINESS_CONFIG.name.full} and protected by copyright and intellectual property laws. Unauthorized use is prohibited.</p>

            <h2>10. Reviews and Testimonials</h2>
            <p>We appreciate honest reviews! When leaving a review:</p>
            <ul>
              <li>Reviews should be truthful and based on your actual experience</li>
              <li>We reserve the right to respond to reviews publicly</li>
              <li>We may use positive reviews in marketing materials</li>
              <li>Fraudulent or defamatory reviews may result in legal action</li>
            </ul>

            <h2>11. Gift Certificates and Promotions</h2>

            <h3>11.1 Gift Certificates</h3>
            <ul>
              <li>Valid for 1 year from purchase date</li>
              <li>Non-refundable and non-transferable</li>
              <li>Cannot be redeemed for cash</li>
              <li>Lost certificates cannot be replaced</li>
            </ul>

            <h3>11.2 Promotional Codes</h3>
            <ul>
              <li>One promotional code per transaction</li>
              <li>Cannot be combined with other offers unless specified</li>
              <li>Subject to terms and expiration dates</li>
              <li>May be revoked at any time</li>
            </ul>

            <h2>12. Privacy and Data Protection</h2>
            <p>Your privacy is important to us. Please review our <Link to="/privacy-policy">Privacy Policy</Link> to understand how we collect, use, and protect your personal information.</p>

            <h2>13. Modifications to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the modified terms.</p>

            <h2>14. Governing Law and Disputes</h2>
            <p>These Terms are governed by the laws of the State of {BUSINESS_CONFIG.contact.address.stateFullName}, without regard to conflict of law principles.</p>

            <h3>14.1 Dispute Resolution</h3>
            <p>Any disputes arising from these Terms or our services shall be resolved through:</p>
            <ol>
              <li>Good faith negotiation between parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Binding arbitration or small claims court</li>
            </ol>

            <h2>15. Severability</h2>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.</p>

            <h2>16. Contact Information</h2>
            <p>Questions about these Terms of Service? Contact us:</p>

            <div className="bg-card border border-border p-6 rounded-lg my-6">
              <p className="font-semibold mb-2">{BUSINESS_CONFIG.name.full}</p>
              <p>{BUSINESS_CONFIG.contact.address.oneLine}</p>
              <p>Email: <a href={`mailto:${BUSINESS_CONFIG.contact.email.primary}`}>{BUSINESS_CONFIG.contact.email.primary}</a></p>
              <p>Phone: <a href={`tel:${BUSINESS_CONFIG.contact.phone.raw}`}>{BUSINESS_CONFIG.contact.phone.display}</a></p>
            </div>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                By using our services, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Effective Date: {lastUpdated}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default TermsOfService;
