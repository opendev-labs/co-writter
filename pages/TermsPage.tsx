
import React from 'react';
import { APP_NAME, IconBook } from '../constants';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans pt-32 pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto bg-[#1e1e1e] rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-lg">
                <IconBook className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Terms of Service</h1>
            <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">
                Effective Date: {new Date().toLocaleDateString()}
            </p>
        </div>

        {/* Content Card */}
        <div className="bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
             <div className="space-y-10 text-neutral-300 leading-relaxed">
                
                <section>
                    <h3 className="text-xl font-bold text-white mb-2">1. Agreement to Terms</h3>
                    <p>
                        By accessing <span className="text-white font-mono">ebook-engine.github.io</span>, you agree to be bound by these Terms of Service. If you do not agree to abide by the terms of this Agreement, you are not authorized to use or access the Website.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">2. Intellectual Property</h3>
                    <p>
                        The Platform and its original content, features, and functionality are owned by {APP_NAME} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                    <p className="mt-2 text-sm text-neutral-500 bg-white/5 p-4 rounded-xl border border-white/5">
                        <strong>Note on AI Content:</strong> Content generated via our AI tools belongs to the user (you), subject to the terms of the underlying model providers (Google Gemini).
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">3. Google API Services</h3>
                    <p>
                        Our application integrates with Google API Services. By using these features, you acknowledge and agree to be bound by Google's Terms of Service.
                    </p>
                    <ul className="list-disc list-inside ml-4 mt-2 text-neutral-400">
                        <li>We do not transfer user data to third parties for surveillance.</li>
                        <li>We do not sell user data sourced from Google APIs.</li>
                        <li>We do not use user data for advertising purposes.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">4. User Accounts</h3>
                    <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">5. Limitation of Liability</h3>
                    <p>
                        In no event shall {APP_NAME}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">6. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>
                </section>

             </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;