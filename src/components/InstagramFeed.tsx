import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';

const posts = [
  {
    image: '/IMG_8915.JPG',
    likes: 456,
    comments: 32,
    caption: 'Evening glam perfection ✨ #hdastudio #eveningglam',
  },
  {
    image: '/IMG_8910.JPG',
    likes: 521,
    comments: 41,
    caption: 'Fashion week ready 💄 #fashionweek #editorialmakeup',
  },
  {
    image: '/IMG_8863.JPG',
    likes: 298,
    comments: 24,
    caption: 'Behind the scenes magic ✨ #makeupstudio #hdastudio',
  },
  {
    image: '/IMG_8900.JPG',
    likes: 412,
    comments: 29,
    caption: 'Global Fashion Week vibes 📸 #gfw #runway',
  },
  {
    image: '/IMG_8905.JPG',
    likes: 389,
    comments: 31,
    caption: 'Bold and beautiful 💋 #eveningglam #makeup',
  },
  {
    image: '/IMG_8920.JPG',
    likes: 467,
    comments: 38,
    caption: 'Editorial excellence 🌟 #editorialmakeup #creative',
  },
  {
    image: '/IMG_8960.JPG',
    likes: 534,
    comments: 42,
    caption: 'High fashion elegance ✨ #highfashion #runway',
  },
  {
    image: '/IMG_8955.JPG',
    likes: 445,
    comments: 36,
    caption: 'Dramatic glam goals 💎 #dramaticlook #eveningglam',
  },
  {
    image: '/115A82F7-E04C-4A13-B50A-B919D9C20240.JPG',
    likes: 398,
    comments: 27,
    caption: 'Elegant and timeless 👑 #elegance #hdastudio',
  },
  {
    image: '/IMG_8865.JPG',
    likes: 321,
    comments: 25,
    caption: 'Creating magic one brush at a time ✨ #makeupartist',
  },
  {
    image: '/13715236-067F-4BEC-BFAA-CAA183BFF0CD.JPG',
    likes: 402,
    comments: 30,
    caption: 'Wedding glam perfection 💍 #bridal #bridalmakeup',
  },
  {
    image: '/IMG_8869.JPG',
    likes: 356,
    comments: 28,
    caption: 'Special event ready 🎉 #specialevent #glam',
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
              {BUSINESS_CONFIG.social.instagram.handle}
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
              href={BUSINESS_CONFIG.social.instagram.url}
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
            href={BUSINESS_CONFIG.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Instagram size={16} />
            <span className="text-sm tracking-widest uppercase">
              Follow {BUSINESS_CONFIG.social.instagram.handle} for more
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeed;
