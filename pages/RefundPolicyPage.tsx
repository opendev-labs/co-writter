
import React from 'react';
import { APP_NAME, IconWallet } from '../constants';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl relative z-10 animate-slide-up">
        
        <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto bg-[#1e1e1e] rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-lg">
                <IconWallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Refund Policy</h1>
            <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">
                Digital Goods & Services
            </p>
        </div>

        <div className="bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
             <div className="space-y-8 text-neutral-300 leading-relaxed">
                 <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-2xl">
                     <h3 className="text-red-400 font-bold mb-2 uppercase tracking-widest text-xs">Important Notice</h3>
                     <p className="text-sm text-neutral-300">
                        Due to the nature of digital goods (eBooks), which can be downloaded instantly, orders are generally <strong>non-refundable</strong> once processed.
                     </p>
                 </div>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">1. Cancellations</h3>
                    <p>
                        As our products are instant digital downloads, orders cannot be cancelled once the payment is processed and the download link has been generated.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">2. Eligibility for Refunds</h3>
                    <p>We may consider a refund request under these exceptional circumstances:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-neutral-400">
                        <li>The eBook file is corrupt or technically defective.</li>
                        <li>Duplicate payment for the same item.</li>
                    </ul>
                    <p className="mt-2 text-sm text-neutral-500">Requests must be made within 7 days of purchase.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">3. Processing Timeline</h3>
                    <p>
                        Approved refunds are processed within 5-7 working days. The amount will be credited back to your original payment method.
                    </p>
                </section>
             </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
