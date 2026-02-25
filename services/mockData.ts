
import { EBook, User, Seller, UserType, CreatorSiteConfig } from '../types';

export const mockEBooks: EBook[] = [
  {
    id: 'manual-01',
    title: "Ebook-Engine Manual",
    author: 'Ebook-Engine AI',
    description: 'The official documentation for the Ebook-Engine platform. Learn how to use the Neural Engine, generate viral covers, and publish your work to the world.',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800', 
    genre: 'Technology',
    sellerId: 'seller_admin',
    publicationDate: '2025-10-15',
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        title: 'Welcome to the Future',
        content: `# Welcome to Ebook-Engine\n\n**Where Thought Becomes Literature.**\n\nEbook-Engine is more than just a writing tool; it is a collaborative neural engine designed to elevate your creative process. Whether you are outlining a sci-fi epic, drafting a technical manual, or publishing your first novel, this platform provides the intelligence and infrastructure you need.\n\n![Workspace](https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000)\n\n### Core Philosophy\n\nWe believe that AI should not replace the author, but amplify them. Our "Co-Author" engine is built on Google's Gemini models, fine-tuned to understand narrative structure, tone, and pacing.\n\n### In This Manual\n\nOver the next 10 pages, we will cover:\n- The Studio Interface\n- AI Tools & Prompting\n- Visual Asset Generation\n- Publishing & Monetization`
      },
      {
        id: 'p2',
        pageNumber: 2,
        title: 'The Dashboard',
        content: `# Your Command Center\n\nThe Dashboard is your home base. From here, you can track sales, manage your library, and access the Studio.\n\n![Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000)\n\n### Key Sections\n\n1. **Overview**: Real-time analytics of your book sales and reader engagement.\n2. **My Library**: Access books you have purchased or written.\n3. **Wishlist**: Books you've saved for later.\n4. **Studio Access**: One-click launch into the writing environment.\n\n**Pro Tip:** Switch between "Reader Mode" and "Writer Mode" in the sidebar to toggle between consuming content and creating it.`
      },
      {
        id: 'p3',
        pageNumber: 3,
        title: 'The eBook Studio',
        content: `# The Studio\n\nThis is where the magic happens. The Studio is divided into two main zones: the **Context Panel** (Left) and the **Editor** (Right).\n\n![Studio](https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000)\n\n### 1. The Editor\n\nA distraction-free markdown environment. It supports:\n- **Rich Text**: Headers (#), Bold (**text**), and Lists (- item).\n- **Slash Commands**: Type \`/\` to open the quick menu for headings, images, or AI generation.\n\n### 2. The Context Panel\n\nYour AI Co-Author lives here. You can chat with it to brainstorm ideas, or switch to the **Outline View** to manage your chapters.`
      },
      {
        id: 'p4',
        pageNumber: 4,
        title: 'Using the AI Co-Author',
        content: `# The Neural Engine\n\nYour Co-Author is always listening. You can ask it to:\n\n- *"Write the next paragraph describing a rainy neon city."*\n- *"Fix the grammar in this chapter."*\n- *"Give me 5 ideas for a plot twist."*\n\n![AI Brain](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000)\n\n### Context Awareness\n\nThe AI reads what you write. If you are in Chapter 3, it knows what happened in Chapter 2. This ensures consistency in character names, plot points, and tone.\n\n**Auto-Pilot**: Use the "Auto-Write" button in the header to let the AI draft an entire chapter structure for you automatically.`
      },
      {
        id: 'p5',
        pageNumber: 5,
        title: 'Generating Visuals',
        content: `# AI Art Generation\n\nA picture is worth a thousand words. Ebook-Engine integrates the **Gemini 2.5 Image Model** to generate professional cover art and in-book illustrations.\n\n![Art Generation](https://images.unsplash.com/photo-1561557944-6e7860d9a7fd?auto=format&fit=crop&q=80&w=1000)\n\n### How to Generate\n\n1. **Cover Art**: Go to the "Publish" page and use the AI Cover Designer. Select a style (e.g., Cinematic, Minimalist) and describe your vision.\n2. **In-Text Illustrations**: In the Studio editor, type \`/image\` to conjure an image command. Describe the scene, and the AI will insert it directly into your page.\n\n> *Note: All images are royalty-free and unique to your book.*`
      },
      {
        id: 'p6',
        pageNumber: 6,
        title: 'Audio Features',
        content: `# Voice & Dictation\n\nWriter's block? Speak your story. The Studio supports real-time dictation and text-to-speech.\n\n![Microphone](https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000)\n\n### Dictation\n\nClick the **Mic Icon** in the chat bar. Speak naturally. The AI will transcribe your voice into text, which you can then ask it to format or expand upon.\n\n### Text-to-Speech (TTS)\n\nThe AI can read its responses back to you. This is perfect for proofhearing your dialogue flow or brainstorming while multitasking.`
      },
      {
        id: 'p7',
        pageNumber: 7,
        title: 'Publishing Your Work',
        content: `# Going Live\n\nOnce your manuscript is ready, it's time to share it with the world.\n\n![Publishing](https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&q=80&w=1000)\n\n### The Process\n\n1. **Metadata**: Enter your Title, Author Name, and Description.\n2. **Genre & Pricing**: Choose a category. Decide if your book is **Free** (for growth) or **Paid** (for revenue).\n3. **AI Pricing**: Use our "Smart Pricing Model" to analyze market trends and suggest the optimal price point.\n4. **Publish**: Click "Publish to Store". Your book is instantly available to all users on the platform.`
      },
      {
        id: 'p8',
        pageNumber: 8,
        title: 'Seller Features',
        content: `# Monetization\n\nCreators keep **70%** of every sale. We handle the payment processing, file hosting, and delivery.\n\n![Analytics](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000)\n\n### Audience Analytics\n\nGo to the **Audience** tab in your dashboard to see who is reading your books. You can track:\n- Total Visitors\n- Active Readers\n- Geographic Location\n- Purchase History\n\nUse this data to refine your marketing strategy and write what your audience loves.`
      },
      {
        id: 'p9',
        pageNumber: 9,
        title: 'Pro Tips',
        content: `# Mastering the Platform\n\nHere are some advanced tips for power users:\n\n![Lightbulb](https://images.unsplash.com/photo-1531297461136-82lwDe43qRm?auto=format&fit=crop&q=80&w=1000)\n\n- **Slash Commands**: Learn them. \`/h1\` for titles, \`/quote\` for blockquotes. Speed is key.\n- **Variable Pacing**: Ask the AI to "Slow down and describe the room" or "Speed up the action". It understands pacing.\n- **Series Management**: Keep your character notes in a separate text file or the chat context to ensure consistency across multiple books.\n- **Draft Mode**: You can save books as drafts without publishing them. They stay in your Studio securely.`
      },
      {
        id: 'p10',
        pageNumber: 10,
        title: 'Community & Support',
        content: `# We Are Here For You\n\nEbook-Engine is built by writers, for writers. If you encounter bugs or have feature requests, reach out.\n\n![Community](https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000)\n\n### Channels\n\n- **Help Center**: Accessible from your profile dropdown.\n- **Email**: opendev-labs.help@gmail.com\n- **Updates**: Follow the "Ebook-Engine Manual" book for patch notes and new feature guides.\n\nThank you for creating with us.\n\n**- The OpenDev Team**`
      }
    ]
  },
  {
    id: 'sacred-quantum-01',
    title: "The Quantum Scripture",
    author: 'Dr. A. Vance & The Institute',
    description: 'Hidden Laws of Consciousness Backed by Real Scientific Evidence. A deep dive into the observer effect, entanglement, and the unification of ancient spirituality with modern physics.',
    price: 1111,
    coverImageUrl: 'https://images.unsplash.com/photo-1506318137071-a8bcbf67cc77?auto=format&fit=crop&q=80&w=800',
    genre: 'Spirituality',
    sellerId: 'seller_admin',
    publicationDate: '2025-11-11',
    pages: [
        {
            id: 'qs-p1', pageNumber: 1, title: 'Introduction: The Bridge',
            content: `# The Bridge Between Worlds\n\nFor centuries, science and spirituality have stood on opposite banks of a wide river. Spirituality spoke of the "soul," "connection," and "miracles." Science spoke of "atoms," "forces," and "proof." \n\n**But the river is drying up.**\n\nNew discoveries in Quantum Mechanics are not just validating ancient texts; they are explaining *how* they work. This book is not a metaphorical comparison. It is a technical manual for consciousness, cited with peer-reviewed studies.\n\n> "The first gulp from the glass of natural sciences will turn you into an atheist, but at the bottom of the glass God is waiting for you." — *Werner Heisenberg, Nobel Prize Winner in Physics*\n\nWe begin our journey at the intersection of the Observer and the Observed.`
        },
        {
            id: 'qs-p2', pageNumber: 2, title: 'The Observer Effect',
            content: `# The Observer Effect\n\nIn the classical Newtonian world, things exist whether you look at them or not. A falling tree makes a sound. But in the quantum world, this rule breaks.\n\n### The Double-Slit Experiment\n\nWhen particles (like electrons) are fired at two slits, they behave like waves, creating an interference pattern. However, when a measuring device (an "observer") is placed to see which slit the particle goes through, the particle **behaves like solid matter**.\n\n**Scientific Source:** *Nature Physics, "Quantum interference of large organic molecules," 2011.*\n\n**The Implication:** Consciousness collapses the wave function. Your attention literally constructs reality from a field of infinite probability.`
        },
        {
            id: 'qs-p3', pageNumber: 3, title: 'Quantum Entanglement',
            content: `# Entanglement: The Science of Oneness\n\n"Spooky action at a distance," Einstein called it. When two particles are entangled, a change in the spin of one *instantly* affects the other, even if they are galaxies apart.\n\n### Non-Locality\n\nThis proves that space is an illusion. Information travels faster than light because, at a fundamental level, the two particles are not separate.\n\n**Scientific Source:** *The Big Bell Test Collaboration, Nature, 2018.*\n\n**Spiritual Corollary:** This is the scientific basis for telepathy, prayer, and the concept that "we are all one." We are distinct points in a unified field.`
        },
        {
            id: 'qs-p4', pageNumber: 4, title: 'The Holographic Principle',
            content: `# The Holographic Universe\n\nLeading physicists now posit that our 3D reality is a projection of information stored on a 2D surface at the boundary of the universe (the cosmological horizon).\n\n### Information Theory\n\nIf we live in a hologram, then "matter" is just "resolution." The spiritual idea that the physical world is "Maya" (illusion) is now a valid physical theory.\n\n**Scientific Source:** *Juan Maldacena, "The Large N Limit of Superconformal Field Theories," 1997.*\n\nEvery part contains the whole. Your mind is not *in* the universe; the universe is *in* your mind.`
        },
        {
            id: 'qs-p5', pageNumber: 5, title: 'The Zero Point Field',
            content: `# The Field\n\nSpace is not empty. It is a seething ocean of energy called the Zero Point Field (or Quantum Vacuum). Even at absolute zero, this field contains infinite potential energy.\n\n### Tapping the Source\n\nAncient mystics called this the *Akasha*. It is the memory of the universe. It connects everything. When you meditate, you are quieting the noise to access this signal.\n\n**Evidence:** The Casimir Effect proves the existence of vacuum fluctuations pushing plates together.\n\nWe are essentially bioluminescent beings floating in a sea of light.`
        },
        {
            id: 'qs-p6', pageNumber: 6, title: 'Biocentrism',
            content: `# Biocentrism\n\nProposed by Dr. Robert Lanza, Biocentrism argues that biology creates the universe, not the other way around. Space and time are tools of the mind, not external objects.\n\n### The Goldilocks Universe\n\nWhy are the laws of physics perfectly tuned for life? Because life is the primary constant. Without consciousness, the equations of the universe have no solution.\n\n**Scientific Context:** *Robert Lanza, "Biocentrism," 2009.*\n\nYou are not a visitor to this world. You are the projector.`
        },
        {
            id: 'qs-p7', pageNumber: 7, title: 'Neurotheology',
            content: `# The God Helmet\n\nNeuroscience has identified specific centers in the brain (the temporal lobes) that active during deep spiritual experiences. \n\n### Dr. Michael Persinger's Experiments\n\nBy stimulating the temporal lobes with weak magnetic fields, researchers induced "sensed presence" (the feeling of God or angels) in atheists. \n\n**Source:** *Neuropsychologia, 2003.*\n\nThis doesn't mean God is "just inside the head." It means the brain is a **receiver**. Just as a radio tunes into a station, your brain tunes into the frequency of the divine.`
        },
        {
            id: 'qs-p8', pageNumber: 8, title: 'Epigenetics',
            content: `# Belief Changes Biology\n\nFor decades, we believed genes were destiny. The new field of Epigenetics proves that environment and **perception** control gene expression.\n\n### The Placebo Effect\n\nYour belief in a cure is often as potent as the chemistry. The mind signals the cells to rewrite their instruction sets.\n\n**Scientific Source:** *Bruce Lipton, The Biology of Belief.*\n\n**Implication:** You can heal your lineage. Your thoughts are not just smoke; they are biochemical triggers.`
        },
        {
            id: 'qs-p9', pageNumber: 9, title: 'The Unified Field',
            content: `# The Grand Unified Theory\n\nPhysicists are hunting for the equation that unites Gravity with Quantum Mechanics. String Theory proposes that tiny vibrating filaments create all matter.\n\n### Frequency is Key\n\nIf everything is a vibrating string, then the universe is literally a symphony. "In the beginning was the Word" (Sound/Vibration).\n\nWe are approaching a singularity where scientific equations will look identical to spiritual sutras.`
        },
        {
            id: 'qs-p10', pageNumber: 10, title: 'Conclusion',
            content: `# Conclusion: The Awakened Scientist\n\nThe age of separation is over. \n\n1. **You are the Observer.**\n2. **You are Entangled with all life.**\n3. **Your beliefs rewrite your Biology.**\n\nTake this knowledge. Test it. Be the experiment.\n\n### References\n- *Journal of Consciousness Studies*\n- *Physical Review Letters*\n- *Nature*\n- *Max Planck Institute for Quantum Optics*`
        }
    ]
  },
  {
    id: 'sacred-quantum-02',
    title: "Divine Mechanics",
    author: 'Nikola T. & The Collective',
    description: 'How Energy, Frequency, and Vibration Create Reality — Proven Through Modern Physics. Unlocking the secrets of Tesla, Cymatics, and the frequencies that heal.',
    price: 888,
    coverImageUrl: 'https://images.unsplash.com/photo-1620052581237-b5d148ef2716?auto=format&fit=crop&q=80&w=800',
    genre: 'Physics',
    sellerId: 'seller_admin',
    publicationDate: '2025-12-01',
    pages: [
        {
            id: 'dm-p1', pageNumber: 1, title: 'The Key to the Universe',
            content: `# The Key\n\n> "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration." — *Nikola Tesla*\n\nEverything in existence is vibrating. The chair you sit on, the thoughts you think, the light you see. Matter is simply energy condensed to a slow vibration.\n\nThis book explores the mechanics of this vibration and how you can tune your personal frequency to alter your reality.\n\n**Scope:** From the oscillation of atoms to the rotation of galaxies.`
        },
        {
            id: 'dm-p2', pageNumber: 2, title: '3, 6, 9',
            content: `# The Mathematics of Creation\n\nTesla was obsessed with 3, 6, and 9. Why? \n\n### Vortex Math\n\nIf you double 1 (1, 2, 4, 8, 16...), the sum of digits never touches 3, 6, or 9. These numbers represent a higher-dimensional flux field—the energy that governs the physical circuit.\n\n**Application:** 9 is the number of the Universe. It represents completion and the void. By aligning with these mathematical constants, we tap into free energy principles.`
        },
        {
            id: 'dm-p3', pageNumber: 3, title: 'Cymatics',
            content: `# Visible Sound\n\nCymatics is the study of visible sound and vibration. \n\n### The Experiment\n\nPlace sand on a metal plate. Play a violin bow or a frequency tone. The sand arranges itself into complex, beautiful geometric mandalas.\n\n**Source:** *Hans Jenny, "Cymatics," 1967.*\n\n**The Truth:** You are 70% water. If sound organizes sand into sacred geometry, imagine what words, music, and thoughts are doing to the cellular structure of your body.`
        },
        {
            id: 'dm-p4', pageNumber: 4, title: 'String Theory',
            content: `# The Cosmic Symphony\n\nString Theory posits that the fundamental constituents of the universe are not point-like particles, but one-dimensional "strings."\n\n### Modes of Vibration\n\nA quark is a string vibrating in one mode. An electron is the same string vibrating in another. The only difference between gold and lead is the *music* their atoms are playing.\n\n**Scientific Source:** *Edward Witten, M-Theory.*\n\nReality is music solidified.`
        },
        {
            id: 'dm-p5', pageNumber: 5, title: 'Resonance',
            content: `# The Law of Resonance\n\nStrike a tuning fork tuned to 'C'. Bring it near another 'C' fork. The second one will begin to vibrate without being touched. This is Resonance.\n\n### Emotional Resonance\n\nYour heart emits an electromagnetic field 5,000 times stronger than your brain. It acts as a tuning fork. You do not "attract" what you want; you resonate with what you *are*.\n\n**Evidence:** *HeartMath Institute Research.*\n\nTo change your life, you must change your broadcast signal.`
        },
        {
            id: 'dm-p6', pageNumber: 6, title: 'Schumann Resonance',
            content: `# The Heartbeat of Earth\n\nThe space between the Earth's surface and the Ionosphere acts as a cavity resonator. It hums at **7.83 Hz**.\n\n### The Human Connection\n\nThis frequency matches the Alpha/Theta brainwave state (deep relaxation/healing). When we disconnect from nature, we desynchronize from the planet's pulse, leading to anxiety and illness.\n\n**Source:** *W.O. Schumann, 1952.*\n\nGrounding (walking barefoot) reconnects your electrical circuit to this stabilizing frequency.`
        },
        {
            id: 'dm-p7', pageNumber: 7, title: 'Water Memory',
            content: `# The Memory of Water\n\nDr. Masaru Emoto exposed water to words like "Love" and "Hate," then froze it. The "Love" water formed perfect crystals. The "Hate" water formed chaotic blobs.\n\n### Controversy & Validation\n\nWhile controversial, recent Nobel Prize winner Luc Montagnier proved water can retain the electromagnetic signature of DNA even after the DNA is removed.\n\n**Source:** *Journal of Physics: Conference Series, 2011.*\n\nSpeak kindly to yourself. You are mostly water.`
        },
        {
            id: 'dm-p8', pageNumber: 8, title: 'Entrainment',
            content: `# Frequency Entrainment\n\nA stronger rhythm will always pull a weaker rhythm into sync. This is why pendulums sync up, and why you feel calm near the ocean.\n\n### Binaural Beats\n\nWe can hack the brain by playing slightly different frequencies in each ear. The brain creates a third "phantom" beat, shifting consciousness instantly into Gamma (Insight) or Delta (Sleep) states.\n\n**Scientific Application:** Used in clinical settings for PTSD and ADHD treatment.`
        },
        {
            id: 'dm-p9', pageNumber: 9, title: 'Sound Healing',
            content: `# Ultrasound & Healing\n\nHospitals use ultrasound to break up kidney stones and speed up bone regeneration. This is sound healing.\n\n### Ancient Solfeggio\n\nAncient chants used specific frequencies (like 528 Hz) believed to repair DNA. Modern science is just catching up to the fact that specific frequencies trigger specific biological responses.\n\n**Future Tech:** "Frequency Pharmacy" — prescribing sounds instead of pills.`
        },
        {
            id: 'dm-p10', pageNumber: 10, title: 'Mastery',
            content: `# Mastering Your Frequency\n\nYou are the conductor of this divine mechanics.\n\n1. **Monitor your input** (Music, News, People).\n2. **Regulate your output** (Speech, Thought).\n3. **Use Tools** (Meditation, Breath, Nature).\n\nIf you want to understand the Universe, listen to the sound of your own breath.\n\n**End of Volume 1.**`
        }
    ]
  },
  {
    id: 'sacred-quantum-03',
    title: "The Sacred Algorithm",
    author: 'Cipher X',
    description: 'Ancient Truth, Quantum Science, and Verified Sources Revealed. Exploring the code behind the cosmos: Fibonacci, Simulation Theory, and the digital nature of reality.',
    price: 999,
    coverImageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae934794?auto=format&fit=crop&q=80&w=800',
    genre: 'Science',
    sellerId: 'seller_admin',
    publicationDate: '2026-01-10',
    pages: [
        {
            id: 'sa-p1', pageNumber: 1, title: 'The Code',
            content: `# The Code Behind the Canvas\n\nIs the universe biological or digital? The deeper we look, the more it resembles computer code. \n\nFrom the spiral of a galaxy to the arrangement of seeds in a sunflower, a specific algorithm repeats. This book investigates the possibility that we are living in a programmed reality—a Sacred Simulation.\n\n**The Question:** If there is a code, who is the Programmer?`
        },
        {
            id: 'sa-p2', pageNumber: 2, title: 'Phi',
            content: `# The Golden Ratio (1.618...)\n\nPhi. The Divine Proportion. It appears in the pyramids of Giza, the Parthenon, and the proportions of the human face.\n\n### Efficiency\n\nNature uses Phi not for aesthetics, but for efficiency. It allows for maximum packing (seeds) and exposure (leaves) with minimal energy expenditure. It is the optimization algorithm of the universe.\n\n**Observation:** The stock market and heartbeats also follow Phi fractal patterns.`
        },
        {
            id: 'sa-p3', pageNumber: 3, title: 'Fractals',
            content: `# Fractals Everywhere\n\nA fractal is a pattern that repeats at different scales. Zoom into a coastline, it looks the same. Zoom into a fern, the leaf looks like the whole plant.\n\n### The Mandelbrot Set\n\nA simple mathematical equation ($Z = Z^2 + C$) produces infinite complexity. This suggests our complex universe comes from a very simple seed code.\n\n**Spiritual Truth:** "As above, so below." The macrocosm reflects the microcosm.`
        },
        {
            id: 'sa-p4', pageNumber: 4, title: 'Simulation Theory',
            content: `# Evidence of Simulation\n\nElon Musk and Neil deGrasse Tyson famously argued there is a billion-to-one chance we are in "base reality."\n\n### Pixelation (Planck Length)\n\nSpace is not continuous. It is discrete. There is a minimum unit of length (Planck length), much like a pixel on a screen. You cannot zoom in forever.\n\n**Scientific Source:** *Nick Bostrom, "Are You Living in a Computer Simulation?" 2003.*\n\n**Glitch:** The Observer Effect is basically "rendering optimization" — only drawing what is being looked at.`
        },
        {
            id: 'sa-p5', pageNumber: 5, title: 'It From Bit',
            content: `# It From Bit\n\nPhysicist John Wheeler proposed that the universe is made of information, not matter. Every particle, every field, every force is ultimately a yes/no answer to a question.\n\n### The Digital Physics\n\nAt the bottom of the rabbit hole, there is no "stuff." There are only bits. Information is more fundamental than time or space.\n\n**Source:** *John Archibald Wheeler, 1990.*\n\nWe are processing information in a sea of data.`
        },
        {
            id: 'sa-p6', pageNumber: 6, title: 'DNA Code',
            content: `# The Software of Life\n\nDNA is literally a 4-character code (A, C, T, G). It functions exactly like computer software, complete with error-correcting subroutines.\n\n### Microsoft vs Nature\n\nBill Gates said, "DNA is like a computer program but far, far more advanced than any software ever created."\n\n**Source:** *The Road Ahead.*\n\nIf DNA is code, it implies a language. And a language implies an Intelligence.`
        },
        {
            id: 'sa-p7', pageNumber: 7, title: 'Fine Tuning',
            content: `# The Fine-Tuning Problem\n\nIf the force of gravity were slightly stronger, the universe would collapse. If slightly weaker, stars wouldn't form. There are ~20 constants that are precisely set for life to exist.\n\n### Randomness vs Design\n\nThe odds of this happening by chance are akin to throwing a dart across the universe and hitting a specific atom.\n\n**Conclusion:** The parameters were set. The simulation was configured.`
        },
        {
            id: 'sa-p8', pageNumber: 8, title: 'Algorithmic Botany',
            content: `# Algorithmic Botany\n\nL-systems (Lindenmayer systems) are simple algorithms that can generate realistic 3D trees and plants. Nature follows strict procedural generation rules.\n\n### The Fibonacci Sequence\n\nCount the petals on a flower. 3, 5, 8, 13, 21... almost always a Fibonacci number. The universe calculates its growth steps.\n\n**We are watching a procedural generation script run in real-time.**`
        },
        {
            id: 'sa-p9', pageNumber: 9, title: 'Consciousness',
            content: `# The Player\n\nIf reality is the game, Consciousness is the Player. The brain is not the source of consciousness; it is the VR headset.\n\n### Non-Local Data\n\nNear-Death Experiences (NDEs) suggest that when the "headset" dies, the signal continues. The user logs out of the avatar but retains the data.\n\n**Source:** *Dr. Eben Alexander, "Proof of Heaven."*`
        },
        {
            id: 'sa-p10', pageNumber: 10, title: 'The Programmer',
            content: `# Who is the Programmer?\n\nWe call it God, Source, The All, or The Architect. \n\nThe Sacred Algorithm reveals that science and religion are describing the same interface. One describes the User Experience (Spirituality), the other describes the Code (Physics).\n\n**Final Truth:** You are not just in the simulation. You are a piece of the code that woke up.\n\n**[End of Stream]**`
        }
    ]
  }
];

const defaultCreatorSiteConfig: CreatorSiteConfig = {
  isEnabled: true,
  slug: 'admin',
  theme: 'dark-minimal',
  profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  displayName: 'Ebook-Engine Team',
  tagline: 'Official Updates & Manuals',
  showcasedBookIds: ['manual-01', 'sacred-quantum-01', 'sacred-quantum-02'], 
};

// Standard Admin/Seller
export const mockSeller: Seller = {
  id: 'seller_admin',
  name: 'Ebook-Engine Official',
  username: '@ebookengine_hq',
  email: 'admin@ebook-engine.com',
  payoutEmail: 'finance@ebook-engine.com',
  uploadedBooks: mockEBooks, 
  creatorSite: defaultCreatorSiteConfig,
  isVerified: true,
  profileImageUrl: defaultCreatorSiteConfig.profileImageUrl,
  coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  bio: "The official account for Ebook-Engine updates and documentation."
};

// ROOT OWNER ADMIN
export const mockOwner: Seller = {
    id: 'seller_opendev',
    name: 'OpenDev Labs',
    username: '@opendev',
    email: 'opendev-labs', // Login Identifier
    payoutEmail: 'opendev-labs@gmail.com',
    uploadedBooks: [],
    creatorSite: {
        isEnabled: true,
        slug: 'opendev',
        theme: 'tech-vibrant',
        displayName: 'OpenDev Labs',
        tagline: 'System Architecture',
        showcasedBookIds: []
    },
    isVerified: true,
    isAdmin: true, // Key Flag
    bio: "Platform Administrator"
};

export const mockUser: User = {
  id: 'user_admin',
  name: 'Admin User',
  username: '@admin',
  email: 'admin@ebook-engine.com',
  purchaseHistory: [mockEBooks[0]], 
  wishlist: [],
  isVerified: true,
  profileImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  bio: "System Administrator and First Node."
};

export const mockUsers: Record<string, User | Seller> = {
  'user_admin': mockUser,
  'seller_admin': mockSeller,
  'seller_opendev': mockOwner, // Admin Login
  'guest': { id: 'guest', name: 'Guest', email: ''} as User, 
};

export const getUserData = (userId: string, type: UserType): User | Seller | null => {
  if (type === UserType.GUEST) return mockUsers['guest'];
  return mockUsers[userId] || null;
};
