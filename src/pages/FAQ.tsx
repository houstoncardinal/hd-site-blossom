import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQContactForm from '@/components/FAQContactForm';

const faqs = [
  {
    category: 'Services & Pricing',
    questions: [
      {
        question: 'What is the difference between the four glam service levels?',
        answer: 'Basic Soft Glam ($90) is perfect for everyday natural looks with soft definition. Soft Glam ($108) adds enhanced definition with contouring and more defined eyes. Standard Glam ($144) is event-ready with full contour, highlighter, and camera-ready finishing - perfect for weddings and parties. Signature Glam ($180) is our premium service with intricate artistry, glitter or cut crease designs, ideal for red carpet events and editorials.',
      },
      {
        question: 'How long does each makeup service take?',
        answer: 'Basic Soft Glam takes 45 minutes, Soft Glam takes 60 minutes, Standard Glam takes 75 minutes, and our Signature Glam service takes 90 minutes. We recommend arriving 10 minutes early to ensure we have time to discuss your vision.',
      },
      {
        question: 'Do I need to bring my own makeup products?',
        answer: 'No, all professional makeup products and tools are provided as part of your service. We use premium, high-quality cosmetics suitable for all skin types. However, if you have specific products you prefer or allergies to certain ingredients, you are welcome to bring them.',
      },
      {
        question: 'What makeup add-ons do you offer?',
        answer: 'We offer several add-ons to enhance your look: Ombre Lips ($18), Winged Eyeliner/Lashes ($18), Scarf Setting ($12-18), Highlighter Upgrade ($12), Contour Upgrade ($12), and Jewellery Setting ($12-24). All add-ons can be added to any glam service level.',
      },
    ],
  },
  {
    category: 'Booking & Appointments',
    questions: [
      {
        question: 'How far in advance should I book my appointment?',
        answer: 'We recommend booking at least 2-3 weeks in advance for individual appointments. For bridal parties or special events, we suggest booking 2-3 months ahead to ensure availability. However, we do accept last-minute bookings based on availability - contact us to check.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'We require at least 48 hours notice for cancellations or rescheduling. Cancellations made with less than 48 hours notice may forfeit the deposit. For bridal packages and group bookings, we require 7 days notice. We understand emergencies happen - please contact us to discuss your situation.',
      },
      {
        question: 'Do you require a deposit to book?',
        answer: 'Yes, we require a 50% deposit to secure your appointment date and time. The remaining balance is due on the day of service. Deposits are non-refundable but can be applied to a rescheduled appointment if you provide proper notice.',
      },
      {
        question: 'Can I book a trial session before my event?',
        answer: 'Absolutely! We highly recommend trial sessions, especially for brides or those with specific vision for their look. Trial sessions are priced the same as regular services. For our Bridal Party Package, a pre-wedding trial for the bride is included.',
      },
    ],
  },
  {
    category: 'Bridal & Special Events',
    questions: [
      {
        question: 'Do you offer bridal makeup services?',
        answer: 'Yes! We specialize in bridal makeup. Our Bridal Party Package ($300 + $90 per bridesmaid) includes Signature Glam for the bride, a pre-wedding trial, 25% discount on bridesmaid makeup, group scheduling priority, and the option for on-location service. We also provide a complimentary touch-up kit for the bride.',
      },
      {
        question: 'Can you travel to my wedding venue or hotel?',
        answer: 'Yes, we offer on-location services for bridal parties and special events. Travel fees apply based on distance and group size. Please contact us with your venue location for a custom quote. This ensures everyone gets ready together in a stress-free environment.',
      },
      {
        question: 'How many people can you accommodate for a bridal party?',
        answer: 'We can accommodate bridal parties of various sizes. For larger groups (8+ people), we may bring additional artists to ensure everyone is ready on time. Contact us with your wedding date, party size, and timeline so we can plan accordingly.',
      },
      {
        question: 'What should I do to prepare for my makeup appointment?',
        answer: 'Arrive with a clean, moisturized face. Avoid trying new skincare products 48 hours before your appointment to prevent reactions. Bring inspiration photos if you have a specific look in mind. Wear a button-up shirt to avoid messing up your makeup when changing. Contact lenses should be inserted before your appointment.',
      },
    ],
  },
  {
    category: 'Studio & Experience',
    questions: [
      {
        question: 'Where is HDA Studio located?',
        answer: 'Our luxury studio is located in the heart of the city at 123 Beauty Lane. We offer a private, elegant setting with natural lighting, comfortable seating, and refreshments. Parking is available nearby, and we are accessible by public transportation.',
      },
      {
        question: 'What is included in the VIP Experience package?',
        answer: 'Our VIP Experience ($480) includes a private 2-hour exclusive session, champagne and gourmet refreshments, Signature Glam full application, one-on-one makeup lesson, premium product gift bag ($100 value), professional photography session, and the ultimate luxury studio experience. Perfect for special celebrations or treating yourself.',
      },
      {
        question: 'Do you offer makeup lessons?',
        answer: 'Yes! Makeup lessons are included in our VIP Experience package. We also offer standalone one-on-one lessons upon request. Learn professional techniques, product recommendations for your skin type, and how to recreate your favorite looks at home.',
      },
      {
        question: 'What COVID-19 safety measures do you have in place?',
        answer: 'Your safety is our priority. We sanitize all tools and surfaces between clients, use disposable applicators when possible, practice proper hand hygiene, and maintain a clean studio environment. We can also provide masks upon request and accommodate any specific safety concerns you may have.',
      },
    ],
  },
  {
    category: 'Products & Skin Care',
    questions: [
      {
        question: 'What brands do you use?',
        answer: 'We use a curated selection of professional-grade makeup brands including MAC, NARS, Charlotte Tilbury, Fenty Beauty, Pat McGrath Labs, and more. We select products based on quality, longevity, and suitability for all skin types and tones. We are constantly updating our kit with the latest and best products.',
      },
      {
        question: 'Do you work with all skin types and tones?',
        answer: 'Absolutely! We are proud to serve clients of all skin types, tones, and textures. Our extensive product range includes shades and formulas for every complexion. We take pride in our expertise with diverse beauty and specialize in creating customized looks that enhance your natural features.',
      },
      {
        question: 'What if I have sensitive skin or allergies?',
        answer: 'Please inform us of any allergies, sensitivities, or skin conditions when booking. We have hypoallergenic and fragrance-free options available. If you have severe allergies, we can discuss using your own products or conducting a patch test before your appointment.',
      },
      {
        question: 'How long will my makeup last?',
        answer: 'With our professional application techniques and long-wear products, your makeup should last 8-12 hours or more. We finish every service with setting spray to ensure longevity. For all-day events, we can provide touch-up tips or offer on-site touch-up services for special events.',
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  const allFAQs = faqs.flatMap(category => category.questions);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Frequently Asked Questions - Makeup Services Info"
        description="Get answers to common questions about HDA Studio makeup services, pricing, booking, bridal packages, and more. Learn about our glam services from $90-$180."
        keywords="makeup FAQ, beauty services questions, bridal makeup FAQ, makeup booking, glam services, makeup artist questions, beauty studio FAQ"
        canonicalUrl="/faq"
        ogImage="/IMG_8915.JPG"
      />

      <FAQSchema faqs={allFAQs} />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' }
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'FAQ', url: '/faq' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Have Questions?
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light mb-6">
              Frequently Asked <span className="italic">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Find answers to common questions about our services, booking process, and what to expect at HDA Studio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-serif mb-6 text-primary">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div
                      key={questionIndex}
                      className="border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-foreground pr-4">
                          {faq.question}
                        </span>
                        <span className="flex-shrink-0 text-primary">
                          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                        </span>
                      </button>

                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? 'auto' : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-charcoal-light">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Can't find the answer you're looking for? Submit your question below and we'll get back to you within 24 hours.
            </p>
          </motion.div>
          
          <FAQContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;
