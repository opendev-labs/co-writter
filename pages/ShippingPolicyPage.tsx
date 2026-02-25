
import React from 'react';
import { APP_NAME, IconRocket } from '../constants';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full relative bg-transparent font-sans pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl relative z-10 animate-slide-up">
        
        <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto bg-[#1e1e1e] rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-lg">
                <IconRocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Shipping Policy</h1>
            <p className="text-neutral-400 text-sm font-mono uppercase tracking-widest">
                Instant Digital Delivery
            </p>
        </div>

        <div className="bg-[#0b0b0b] border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
             <div className="space-y-8 text-neutral-300 leading-relaxed">
                
                <section>
                    <h3 className="text-xl font-bold text-white mb-2">1. Digital Delivery</h3>
                    <p>
                        {APP_NAME} is a digital marketplace. We do not ship physical products. Upon successful payment, delivery of your eBook is <strong>instant</strong>.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">2. Accessing Your Order</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2 text-neutral-400">
                        <li><strong>Dashboard:</strong> Access via "Purchase History" immediately.</li>
                        <li><strong>Email:</strong> A download link is sent to your registered email.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">3. Shipping Costs</h3>
                    <p>
                        There are <strong>zero shipping charges</strong> applicable to any purchase on {APP_NAME}.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-2">4. Delays</h3>
                    <p>
                         If you do not receive access within 5 minutes of payment, please verify your email spam folder or contact support.
                    </p>
                </section>
             </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
