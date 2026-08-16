'use client';

import { motion } from 'framer-motion';

export default function Credibility() {
  return (
    <section id="customers" className="py-32 bg-[#050505] relative border-t border-[#111]">
      <div className="container mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="eyebrow mb-4">Production Proven</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tighter leading-tight">
            Our automation engine already powers live booking and marketing operations for leading homestay businesses. Now, it's built for trek organizers.
          </h2>
        </motion.div>

        {/* Logo Strip Placeholder */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 mb-24 grayscale"
        >
          <div className="text-[#888] font-mono text-sm tracking-widest">[CLIENT LOGO 1]</div>
          <div className="text-[#888] font-mono text-sm tracking-widest">[CLIENT LOGO 2]</div>
          <div className="text-[#888] font-mono text-sm tracking-widest">[CLIENT LOGO 3]</div>
          <div className="text-[#888] font-mono text-sm tracking-widest">[CLIENT LOGO 4]</div>
        </motion.div>

        {/* Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#111] border border-[#222] p-8 rounded-2xl relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-[#222] text-[#888] text-[10px] uppercase font-mono px-2 py-1 rounded">Placeholder</div>
            </div>
            <div className="text-4xl text-[#333] font-serif leading-none mb-4">"</div>
            <p className="text-[#ccc] text-lg mb-6 relative z-10">
              Trailo completely eliminated the chaos of our WhatsApp bookings. What used to take three people all day now runs silently in the background.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#222]"></div>
              <div>
                <div className="text-white font-medium text-sm">Organizer Name</div>
                <div className="text-[#666] text-xs">Founder, Trek Co.</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-[#111] border border-[#222] p-8 rounded-2xl relative"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-[#222] text-[#888] text-[10px] uppercase font-mono px-2 py-1 rounded">Placeholder</div>
            </div>
            <div className="text-4xl text-[#333] font-serif leading-none mb-4">"</div>
            <p className="text-[#ccc] text-lg mb-6 relative z-10">
              Invoicing used to be my nightmare. Now, deposits are collected instantly, and I never have to chase a payment manually again.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#222]"></div>
              <div>
                <div className="text-white font-medium text-sm">Operator Name</div>
                <div className="text-[#666] text-xs">Owner, Adventure Expeditions</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
