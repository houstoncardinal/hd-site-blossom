import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  specialties: string[] | null;
  image_url: string | null;
  instagram_handle: string | null;
  years_experience: number | null;
}

const Team = () => {
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('years_experience', { ascending: false });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Meet Our Team - Professional Makeup Artists"
        description="Meet the talented makeup artists at HDA Studio. Our team of experienced beauty professionals specializes in editorial, bridal, and event makeup artistry."
        keywords="makeup artists, beauty team, professional makeup artists, bridal makeup artist, editorial makeup artist, HDA Studio team"
        canonicalUrl="/team"
        ogImage="/IMG_8915.JPG"
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'Team', url: '/team' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block font-sans">
              Meet the Artists
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">
              Our <span className="italic">Team</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A collective of passionate beauty artists dedicated to making you look and feel extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-6" />
                  <div className="h-6 bg-muted w-1/2 mb-2" />
                  <div className="h-4 bg-muted w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {teamMembers?.map((member, index) => (
                <motion.article
                  key={member.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  {/* Instagram Link */}
                  {member.instagram_handle && (
                    <a
                      href={`https://instagram.com/${member.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
                    >
                      <Instagram size={16} />
                      <span className="text-sm">{member.instagram_handle}</span>
                    </a>
                  )}

                  {/* Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif">{member.name}</h3>
                      <p className="text-primary text-sm tracking-widest uppercase">
                        {member.role}
                      </p>
                    </div>

                    {member.years_experience && (
                      <p className="text-muted-foreground text-sm">
                        {member.years_experience}+ years of experience
                      </p>
                    )}

                    {member.bio && (
                      <p className="text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {member.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs tracking-wider uppercase px-3 py-1.5 bg-muted text-muted-foreground border border-border"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Ready to Be <span className="italic">Transformed?</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Book a session with one of our talented artists and experience the HDA difference.
            </p>
            <a
              href="/booking"
              className="inline-flex h-12 px-8 items-center justify-center bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:bg-primary/90 transition-colors"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Team;
