import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import softGlamImage from '@/assets/service-soft-glam.jpg';
import bridalImage from '@/assets/service-bridal.jpg';
import glamImage from '@/assets/service-glam.jpg';
import naturalImage from '@/assets/service-natural.jpg';
import specialEventImage from '@/assets/service-special-event.jpg';
import editorialImage from '@/assets/service-editorial.jpg';

const posts = [
  {
    image: softGlamImage,
    likes: 234,
    comments: 18,
    caption: 'Soft glam perfection ✨ #hdastudio #softglam',
  },
  {
    image: bridalImage,
    likes: 456,
    comments: 32,
    caption: 'Wedding day ready 💍 #bridalmakeup #hdastudio',
  },
  {
    image: glamImage,
    likes: 321,
    comments: 24,
    caption: 'Bold and beautiful 💄 #eveningglam #makeup',
  },
  {
    image: naturalImage,
    likes: 189,
    comments: 15,
    caption: 'Natural glow goals 🌟 #naturalmakeup #dewy',
  },
  {
    image: specialEventImage,
    likes: 278,
    comments: 21,
    caption: 'Gala ready ✨ #specialevent #glam',
  },
  {
    image: editorialImage,
    likes: 412,
    comments: 29,
    caption: 'Editorial vibes 📸 #editorialmakeup #creative',
  },
];

const InstagramFeed = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram size={20} className="text-primary" />
            <span className="text-primary text-sm tracking-[0.3em] uppercase font-sans">
              @hdastudio
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light">
            Follow Us on <span className="italic">Instagram</span>
          </h2>
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {posts.map((post, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="flex items-center gap-1">
                    <Heart size={18} className="fill-current" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Instagram size={16} />
            <span className="text-sm tracking-widest uppercase">
              Follow @hdastudio for more
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
