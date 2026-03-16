'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function InstagramFeed() {
  // TODO: Replace with real Instagram API data
  const posts = [
    { id: 1, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", caption: "Morning run complete 💪" },
    { id: 2, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", caption: "Training day" },
    { id: 3, image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&q=80", caption: "Push through" },
    { id: 4, image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", caption: "Race prep" },
    { id: 5, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", caption: "Mountain views" },
    { id: 6, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", caption: "Summit day" },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            THE <span className="text-orange-500">JOURNEY</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light mb-8">
            Follow along in real-time
          </p>
          
          <motion.a
            href="https://instagram.com/patrick.wingert"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @patrick.wingert
          </motion.a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square rounded-2xl overflow-hidden group"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white text-sm font-medium">{post.caption}</p>
              </div>

              <div className="absolute inset-0 border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" 
                   style={{
                     boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)'
                   }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/60 text-lg">
            Training updates, race days, and behind-the-scenes moments
          </p>
        </motion.div>
      </div>
    </section>
  );
}
