'use client';

import { Check } from 'lucide-react';
import MagneticButton from '../MagneticButton';

const tiers = [
  {
    name: 'Starter',
    description: 'Perfect for organizers managing up to 10 trips a year.',
    price: 'Contact Us',
    features: [
      'Automated Lead Capture',
      'Basic Chat Automation',
      'Invoice Generation',
      'Up to 2 Team Members',
    ],
    highlighted: false,
  },
  {
    name: 'Growth',
    description: 'For growing operations scaling their trek volume.',
    price: 'Contact Us',
    features: [
      'Everything in Starter',
      'Advanced Chat Workflows',
      'Automated Payment Chasing',
      'Custom Branding',
      'Up to 10 Team Members',
      'Priority Support',
    ],
    highlighted: true,
  },
  {
    name: 'Custom',
    description: 'Enterprise volume, custom API integrations, and white-labeling.',
    price: 'Contact Us',
    features: [
      'Everything in Growth',
      'Unlimited Team Members',
      'Custom API Integrations',
      'Dedicated Account Manager',
      'SLA Guarantee',
    ],
    highlighted: false,
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="eyebrow mb-4">Pricing</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white tracking-tighter mb-6">
            Simple pricing for serious operators.
          </h2>
          <p className="text-[#888] text-lg">
            Stop paying per message or per user. Simple, volume-based pricing that scales as your business grows.
          </p>
        </div>

        <div 
          className="flex flex-row md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          data-lenis-prevent="true"
        >
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative p-8 rounded-2xl flex flex-col w-[85vw] md:w-auto shrink-0 snap-center ${
                tier.highlighted 
                  ? 'bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-[#333] shadow-[0_0_40px_rgba(42,138,246,0.05)] ring-1 ring-[#2A8AF6]/20' 
                  : 'bg-[#111] border border-[#222]'
              } hover:border-[#444] transition-all duration-300 group`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d0d] border border-[#333] text-[#2A8AF6] text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-[0_0_20px_rgba(42,138,246,0.2)]">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-[#888] text-sm h-10">{tier.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="text-3xl font-mono font-bold text-white">{tier.price}</div>
              </div>

              <div className="flex-1 mb-8">
                <ul className="space-y-4">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#ccc]">
                      <Check size={16} className="text-[#2A8AF6] mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <MagneticButton 
                href="/demo" 
                variant={tier.highlighted ? 'primary' : 'secondary'} 
                className="w-full"
              >
                Book a Demo
              </MagneticButton>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
