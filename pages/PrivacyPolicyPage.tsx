
import React from 'react';
import { APP_NAME, IconCheck } from '../constants';
import MorphicEye from '../components/MorphicEye';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans pt-32 pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
                <MorphicEye className="w-20 h-20 border border-white/20 bg-black shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-full" isActive={true} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Privacy Policy</h1>
            <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">
                Last Updated: {new Date().toLocaleDateString()}
            </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
             
             {/* Security Badge */}
             <div className="absolute top-0 right-0 p-6 opacity-50 hidden md:block">
                 <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Google Core Security Active</span>
                 </div>
             </div>

             <div className="space-y-12 text-neutral-300 leading-relaxed">
                
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm border border-white/10">01</span>
                        Introduction
                    </h2>
                    <p>
                        At {APP_NAME}, accessible from <span className="text-white font-mono">ebook-engine.github.io</span>, the privacy of our visitors and creators is our top priority. This Privacy Policy document contains types of information that is collected and recorded by {APP_NAME} and how we use it.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm border border-white/10">02</span>
                        Google Core Data & Security
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <p className="mb-4 text-sm font-medium text-white">
                            We comply with Google API Services User Data Policy, including the Limited Use requirements.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-neutral-400">
                                <IconCheck className="w-5 h-5 text-google-blue shrink-0" />
                                <span><strong>Authentication:</strong> We use Google OAuth 2.0 to securely authenticate users. Your password is never stored on our servers.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-400">
                                <IconCheck className="w-5 h-5 text-google-blue shrink-0" />
                                <span><strong>Database Integrity:</strong> User data (such as eBook drafts) is processed using ephemeral secure sessions. Long-term storage leverages secure cloud infrastructure.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-neutral-400">
                                <IconCheck className="w-5 h-5 text-google-blue shrink-0" />
                                <span><strong>Gemini AI:</strong> Content generated via Google Gemini is transmitted over encrypted (TLS 1.3) channels.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm border border-white/10">03</span>
                        Information Collection
                    </h2>
                    <p className="mb-4">We collect information to provide better services to all our users:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-400">
                        <li>Personal identification (Name, Email address, Profile Picture).</li>
                        <li>Log Data (IP address, browser version, visit duration).</li>
                        <li>Transactional Data (Purchase history of eBooks).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm border border-white/10">04</span>
                        Data Usage & Rights
                    </h2>
                    <p>
                        We use the collected data to maintain our service, notify you about changes, provide customer support, and detect technical issues.
                    </p>
                    <p className="mt-4">
                        You have the right to request copies of your personal data, request corrections, or request deletion of your account at any time via the User Dashboard.
                    </p>
                </section>

             </div>

             {/* Footer Note */}
             <div className="mt-12 pt-8 border-t border-white/5 text-center">
                 <p className="text-xs text-neutral-600 uppercase tracking-widest">
                     Protected by Ebook-Engine Secure Enclave
                 </p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;