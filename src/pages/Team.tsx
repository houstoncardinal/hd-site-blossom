import { motion } from 'framer-motion';
import { Instagram, Crown, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PersonSchema from '@/components/seo/PersonSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
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
        .eq('is_active', true)
        .order('years_experience', { ascending: false });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  // Separate founder from other team members
  const founder = teamMembers?.find(m => m.role.toLowerCase().includes('founder'));
  const artists = teamMembers?.filter(m => !m.role.toLowerCase().includes('founder')) || [];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="About Us - Meet Our Expert Team"
        description="Meet the talented makeup artists at HDA Studio. Our team of experienced beauty professionals specializes in editorial, bridal, and event makeup artistry."
        keywords="makeup artists, beauty team, professional makeup artists, bridal makeup artist, editorial makeup artist, HDA Studio team, about HDA Studio"
        canonicalUrl="/about"
        ogImage="/IMG_8915.JPG"
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' }
        ]}
      />

      {teamMembers && teamMembers.length > 0 && (
        <PersonSchema
          people={teamMembers.map(member => ({
            name: member.name,
            jobTitle: member.role,
            description: member.bio || `Professional makeup artist specializing in ${member.specialties?.join(', ') || 'beauty services'}`,
            image: member.image_url || '/IMG_8915.JPG',
            ...(member.instagram_handle && {
              sameAs: [`https://instagram.com/${member.instagram_handle.replace('@', '')}`]
            })
          }))}
        />
      )}

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ name: 'About', url: '/about' }]} />
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

      {/* Founder Section */}
      {founder && (
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.2em] uppercase mb-4">
                  <Crown size={16} />
                  Leadership
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Founder Image */}
                {founder.image_url && (
                  <div className="w-64 md:w-80 flex-shrink-0">
                    <div className="relative">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={founder.image_url}
                          alt={founder.name}
                          className="w-full h-full object-cover border border-primary/30"
                        />
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-full h-full border border-primary/30 -z-10" />
                    </div>
                  </div>
                )}

                {/* Founder Info */}
                <div className="flex-1 text-center md:text-left">
                  {founder.instagram_handle && (
                    <a
                      href={`https://instagram.com/${founder.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-3"
                    >
                      <Instagram size={16} />
                      <span className="text-sm">{founder.instagram_handle}</span>
                    </a>
                  )}

                  <h2 className="text-3xl md:text-4xl font-serif mb-2">{founder.name}</h2>
                  <p className="text-primary text-sm tracking-widest uppercase mb-4">
                    {founder.role}
                  </p>

                  {founder.years_experience && (
                    <p className="text-muted-foreground text-sm mb-4">
                      {founder.years_experience}+ years of experience
                    </p>
                  )}

                  {founder.bio && (
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {founder.bio}
                    </p>
                  )}

                  {founder.specialties && founder.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {founder.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="text-xs tracking-wider uppercase px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.2em] uppercase mb-4">
              <Award size={16} />
              The Team
            </span>
            <h2 className="text-2xl md:text-3xl font-serif">Our Expert Team</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted mb-4 rounded-lg" />
                  <div className="h-6 bg-muted w-1/2 mb-2 rounded" />
                  <div className="h-4 bg-muted w-1/3 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {artists.map((member, index) => (
                <motion.article
                  key={member.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                >
                  {/* Instagram Link */}
                  {member.instagram_handle && (
                    <a
                      href={`https://instagram.com/${member.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
                    >
                      <Instagram size={14} />
                      <span className="text-xs">{member.instagram_handle}</span>
                    </a>
                  )}

                  {/* Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-serif">{member.name}</h3>
                      <p className="text-primary text-xs tracking-widest uppercase">
                        {member.role}
                      </p>
                    </div>

                    {member.years_experience && (
                      <p className="text-muted-foreground text-sm">
                        {member.years_experience}+ years of experience
                      </p>
                    )}

                    {member.bio && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {member.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs tracking-wider px-2 py-1 bg-muted text-muted-foreground rounded"
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
              className="inline-flex h-12 px-8 items-center justify-center bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:bg-primary/90 transition-colors rounded-lg"
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
