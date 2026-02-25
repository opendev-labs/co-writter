

import React from 'react';
import { APP_NAME, IconSend, IconGlobe, IconInstagram } from '../constants';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans pt-32 pb-20">
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 animate-slide-up">
        
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Contact Support</h1>
            <p className="text-neutral-400 text-lg">We are here to help you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Card */}
            <div className="md:col-span-2 bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-8">Get in Touch</h3>
                
                <div className="space-y-8">
                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Merchant Name</h4>
                        <p className="text-white font-medium text-lg">{APP_NAME}</p>
                        <p className="text-neutral-400 text-sm mt-1">Created by OpenDev Labs</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Registered Address</h4>
                        <p className="text-neutral-300 leading-relaxed">
                            Gala No. 1, 1st Floor, Malwa,<br/>
                            Patanwala Industrial Estate, LBS Marg,<br/>
                            Ghatkopar West, Mumbai - 400086.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Support Channels</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                                    <IconSend className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase font-bold">Email Us</p>
                                    <a href="mailto:opendev-labs.help@gmail.com" className="text-white hover:text-brand-accent transition-colors">opendev-labs.help@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-black border border-white/20 text-white flex items-center justify-center">
                                    <IconGlobe className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase font-bold">Website</p>
                                    <a href="https://opendev-labs.github.io" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-accent transition-colors">opendev-labs.github.io</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="flex flex-col gap-6">
                <div className="bg-[#1e1e1e] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Response Time</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Our support team usually responds within 24 hours. For urgent inquiries regarding payments, please include your Transaction ID.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Operational Hours</p>
                        <p className="text-white font-medium">Mon - Fri</p>
                        <p className="text-neutral-400 text-sm">9:00 AM - 6:00 PM IST</p>
                    </div>
                </div>

                {/* Social Profiles */}
                <div className="bg-[#1e1e1e] border border-white/5 rounded-[32px] p-8">
                     <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
                     <div className="space-y-4">
                        <a href="https://instagram.com/iamyash.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                                <IconInstagram className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">@iamyash.io</span>
                        </a>
                        <a href="https://instagram.com/opendev-labs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                                <IconInstagram className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">@opendev-labs</span>
                        </a>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;