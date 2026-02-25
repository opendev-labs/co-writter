
import React, { useState, useRef, useEffect } from 'react';
import { 
    IconH1, IconH2, IconList, IconQuote, IconSparkles, IconImage, 
    IconMinus, IconX, IconArrowUp
} from '../constants';

interface Block {
    id: string;
    type: 'h1' | 'h2' | 'p' | 'ul' | 'blockquote' | 'image' | 'image-prompt';
    content: string;
}

interface NovelEditorProps {
  title: string;
  onTitleChange: (val: string) => void;
  content: string; // Markdown string
  onContentChange: (val: string) => void;
  onTriggerAI: (prompt: string) => void;
  onTriggerImageGen: (prompt: string) => void;
}

const NovelEditor: React.FC<NovelEditorProps> = ({ 
    title, 
    onTitleChange, 
    content, 
    onContentChange,
    onTriggerAI,
    onTriggerImageGen
}) => {
  // --- PARSER LOGIC ---
  const parseMarkdown = (md: string): Block[] => {
      if (!md) return [{ id: Date.now().toString(), type: 'p', content: '' }];
      const lines = md.split('\n');
      const blocks: Block[] = [];
      
      for (const line of lines) {
          if (line.startsWith('# ')) blocks.push({ id: Math.random().toString(), type: 'h1', content: line.replace('# ', '') });
          else if (line.startsWith('## ')) blocks.push({ id: Math.random().toString(), type: 'h2', content: line.replace('## ', '') });
          else if (line.startsWith('- ')) blocks.push({ id: Math.random().toString(), type: 'ul', content: line.replace('- ', '') });
          else if (line.startsWith('> ')) blocks.push({ id: Math.random().toString(), type: 'blockquote', content: line.replace('> ', '') });
          else if (line.startsWith('![')) {
              // Extract image url
              const match = line.match(/\((.*?)\)/);
              if (match) blocks.push({ id: Math.random().toString(), type: 'image', content: match[1] });
          }
          else blocks.push({ id: Math.random().toString(), type: 'p', content: line });
      }
      if (blocks.length === 0) blocks.push({ id: Date.now().toString(), type: 'p', content: '' });
      return blocks;
  };

  const serializeToMarkdown = (blocks: Block[]) => {
      return blocks.map(b => {
          if (b.type === 'h1') return `# ${b.content}`;
          if (b.type === 'h2') return `## ${b.content}`;
          if (b.type === 'ul') return `- ${b.content}`;
          if (b.type === 'blockquote') return `> ${b.content}`;
          if (b.type === 'image') return `![Image](${b.content})`;
          if (b.type === 'image-prompt') return ''; // Temporary state, do not save
          return b.content;
      }).join('\n\n');
  };

  // --- STATE ---
  const [blocks, setBlocks] = useState<Block[]>(() => parseMarkdown(content));
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
  
  // Menu State
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [menuQuery, setMenuQuery] = useState('');
  const [menuSelectedIndex, setMenuSelectedIndex] = useState(0);
  
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  // --- SYNC ---
  useEffect(() => {
      const newMarkdown = serializeToMarkdown(blocks);
      // Only sync if content actually changed (avoids loops with image-prompt)
      if (newMarkdown !== content && !blocks.some(b => b.type === 'image-prompt')) {
          onContentChange(newMarkdown);
      }
  }, [blocks]);

  useEffect(() => {
      // External content update (e.g. from AI generation completing)
      const currentMd = serializeToMarkdown(blocks);
      if (content !== currentMd) {
          // If we have an active prompt, we might want to be careful, but generally AI updates override
          setBlocks(parseMarkdown(content));
      }
  }, [content]);

  // --- MENU ITEMS ---
  const MENU_ITEMS = [
    { label: "Heading 1", type: 'h1', icon: IconH1, desc: "Big section header" },
    { label: "Heading 2", type: 'h2', icon: IconH2, desc: "Medium subsection header" },
    { label: "Bullet List", type: 'ul', icon: IconList, desc: "Simple bulleted list" },
    { label: "Quote", type: 'blockquote', icon: IconQuote, desc: "Capture a quote" },
    { label: "Text", type: 'p', icon: IconMinus, desc: "Plain text paragraph" },
    { label: "Ask Co-Author", action: 'ai', icon: IconSparkles, desc: "Generate text with AI", highlight: true },
    { label: "Generate Image", action: 'img', icon: IconImage, desc: "Create art from description", highlight: true },
  ];

  const filteredMenuItems = MENU_ITEMS.filter(item => 
      item.label.toLowerCase().includes(menuQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(menuQuery.toLowerCase())
  );

  // --- HANDLERS ---
  const openMenu = () => {
      // 1. Try Caret Position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          const editorContainer = blockRefs.current[activeBlockIndex]?.closest('.editor-container');
          
          if (editorContainer) {
              const containerRect = editorContainer.getBoundingClientRect();
              
              setMenuPosition({
                  // Position right below the cursor line with a small buffer
                  top: (rect.bottom - containerRect.top) + 8, 
                  left: (rect.left - containerRect.left)
              });
              setMenuOpen(true);
              setMenuQuery('');
              setMenuSelectedIndex(0);
              return;
          }
      }

      // 2. Fallback to Block Position (if selection fails)
      const blockEl = blockRefs.current[activeBlockIndex];
      if (blockEl) {
          setMenuPosition({ 
              top: blockEl.offsetTop + blockEl.clientHeight + 8, 
              left: blockEl.offsetLeft 
          });
          setMenuOpen(true);
          setMenuQuery('');
          setMenuSelectedIndex(0);
      }
  };

  const closeMenu = () => {
      setMenuOpen(false);
      setMenuQuery('');
      setMenuSelectedIndex(0);
  };

  const executeCommand = (item: typeof MENU_ITEMS[0]) => {
      const newBlocks = [...blocks];
      
      // Clear the slash command text
      newBlocks[activeBlockIndex].content = ''; 
      
      if (item.action) {
          if (item.action === 'img') {
              // Switch to inline prompt mode
              newBlocks[activeBlockIndex].type = 'image-prompt';
              setBlocks(newBlocks); // Update state to render input
              closeMenu();
              // Focus handled by autoFocus in render
          } else {
              setBlocks(newBlocks); // Commit clear
              closeMenu();
              // AI Text generation still uses window.prompt for now or could be enhanced later
              const userPrompt = window.prompt("Instruction for Co-Author:");
              if (userPrompt) onTriggerAI(userPrompt);
          }
      } else {
          // Change Block Type
          newBlocks[activeBlockIndex].type = item.type as Block['type'];
          setBlocks(newBlocks);
          closeMenu();
          setTimeout(() => blockRefs.current[activeBlockIndex]?.focus(), 0);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      // MENU NAVIGATION
      if (menuOpen) {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setMenuSelectedIndex(prev => (prev + 1) % filteredMenuItems.length);
              return;
          }
          if (e.key === 'ArrowUp') {
              e.preventDefault();
              setMenuSelectedIndex(prev => (prev - 1 + filteredMenuItems.length) % filteredMenuItems.length);
              return;
          }
          if (e.key === 'Enter') {
              e.preventDefault();
              if (filteredMenuItems[menuSelectedIndex]) {
                  executeCommand(filteredMenuItems[menuSelectedIndex]);
              }
              return;
          }
          if (e.key === 'Escape') {
              e.preventDefault();
              closeMenu();
              return;
          }
      }

      // EDITOR NAVIGATION
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const newBlock: Block = { id: Date.now().toString(), type: 'p', content: '' };
          const newBlocks = [...blocks];
          newBlocks.splice(index + 1, 0, newBlock);
          setBlocks(newBlocks);
          setActiveBlockIndex(index + 1);
          setTimeout(() => blockRefs.current[index + 1]?.focus(), 0);
      }
      else if (e.key === 'Backspace' && blocks[index].content === '') {
          e.preventDefault();
          if (blocks.length > 1) {
              const newBlocks = [...blocks];
              newBlocks.splice(index, 1);
              setBlocks(newBlocks);
              setActiveBlockIndex(Math.max(0, index - 1));
              setTimeout(() => blockRefs.current[Math.max(0, index - 1)]?.focus(), 0);
          }
      }
      else if (e.key === 'ArrowUp' && !menuOpen) {
          if (index > 0) {
              e.preventDefault();
              setActiveBlockIndex(index - 1);
              blockRefs.current[index - 1]?.focus();
          }
      }
      else if (e.key === 'ArrowDown' && !menuOpen) {
          if (index < blocks.length - 1) {
              e.preventDefault();
              setActiveBlockIndex(index + 1);
              blockRefs.current[index + 1]?.focus();
          }
      }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>, index: number) => {
      const text = e.currentTarget.innerText;
      const newBlocks = [...blocks];
      newBlocks[index].content = text;
      setBlocks(newBlocks);
      
      // Trigger Menu
      if (text.startsWith('/')) {
          if (!menuOpen) openMenu();
          setMenuQuery(text.substring(1));
          setMenuSelectedIndex(0); 
      } else {
          if (menuOpen) closeMenu();
      }
  };

  // Helper to handle prompt submission from the inline input
  const submitImagePrompt = (index: number, prompt: string) => {
      if (!prompt.trim()) return;
      onTriggerImageGen(prompt);
      
      // Update the block to a temporary "Generating" state
      const newBlocks = [...blocks];
      newBlocks[index] = { 
          ...newBlocks[index], 
          type: 'p', 
          content: `*Creating visual: "${prompt}"...*` 
      };
      
      // Add a new empty block below so user can keep typing
      const newBlock: Block = { id: Date.now().toString(), type: 'p', content: '' };
      newBlocks.splice(index + 1, 0, newBlock);
      
      setBlocks(newBlocks);
      setActiveBlockIndex(index + 1);
      setTimeout(() => blockRefs.current[index + 1]?.focus(), 0);
  };

  const cancelImagePrompt = (index: number) => {
      const newBlocks = [...blocks];
      newBlocks[index] = { ...newBlocks[index], type: 'p', content: '' };
      setBlocks(newBlocks);
      setTimeout(() => blockRefs.current[index]?.focus(), 0);
  };

  return (
    <div className="editor-container w-full max-w-4xl mx-auto min-h-screen relative font-sans flex flex-col pt-10 pb-32">
        
        {/* Title Area */}
        <div className="px-12 mb-8 group">
             <input 
                type="text" 
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-transparent text-5xl font-bold text-white border-none outline-none placeholder-neutral-700 leading-tight"
                placeholder="Untitled"
            />
        </div>

        {/* Blocks Editor */}
        <div className="px-12 relative flex-1">
             {blocks.map((block, index) => (
                 <div key={block.id} className="group relative mb-2">
                     {/* Drag Handle Placeholder */}
                     {block.type !== 'image-prompt' && (
                        <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 cursor-grab text-neutral-600 hover:text-white transition-opacity select-none">
                            <div className="w-6 h-6 flex items-center justify-center">::</div>
                        </div>
                     )}

                     {block.type === 'image' ? (
                         <div className="rounded-lg overflow-hidden border border-white/10 my-4 bg-black/20">
                             <img src={block.content} alt="Generated" className="w-full h-auto" />
                         </div>
                     ) : block.type === 'image-prompt' ? (
                         // INLINE IMAGE PROMPT INPUT
                         <div className="my-4 p-1.5 pl-3 bg-[#151515] border border-white/20 rounded-full flex items-center gap-3 w-full max-w-xl shadow-2xl animate-fade-in focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20 transition-all">
                             <IconSparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                             <input 
                                autoFocus
                                type="text"
                                placeholder="Describe the image (e.g. A cyberpunk city in rain)..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 h-8 min-w-0"
                                value={block.content}
                                onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[index].content = e.target.value;
                                    setBlocks(newBlocks);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        submitImagePrompt(index, block.content);
                                    }
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        cancelImagePrompt(index);
                                    }
                                    if (e.key === 'ArrowUp') {
                                        if (index > 0) { e.preventDefault(); blockRefs.current[index - 1]?.focus(); }
                                    }
                                    if (e.key === 'ArrowDown') {
                                        if (index < blocks.length - 1) { e.preventDefault(); blockRefs.current[index + 1]?.focus(); }
                                    }
                                }}
                             />
                             <div className="flex items-center gap-2 pr-1">
                                 <button 
                                    onClick={() => submitImagePrompt(index, block.content)}
                                    className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 flex-shrink-0"
                                    title="Generate Visual"
                                 >
                                     ENTER
                                 </button>
                                 <button 
                                    onClick={() => cancelImagePrompt(index)}
                                    className="w-8 h-8 rounded-full text-neutral-500 hover:text-white flex items-center justify-center transition-colors hover:bg-white/10"
                                    title="Cancel"
                                 >
                                     <IconX className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     ) : (
                         <div
                            ref={el => { blockRefs.current[index] = el; }}
                            contentEditable
                            suppressContentEditableWarning
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onInput={(e) => handleInput(e, index)}
                            onFocus={() => setActiveBlockIndex(index)}
                            className={`w-full outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-700
                                ${block.type === 'h1' ? 'text-4xl font-bold text-white mb-4 mt-6' : 
                                  block.type === 'h2' ? 'text-2xl font-bold text-neutral-200 mb-3 mt-4' : 
                                  block.type === 'ul' ? 'list-disc list-inside text-lg text-neutral-300 pl-4 border-l-2 border-transparent' :
                                  block.type === 'blockquote' ? 'text-xl italic text-neutral-400 border-l-4 border-white/20 pl-4 py-2 my-4' :
                                  'text-lg text-neutral-300 leading-relaxed'
                                }
                            `}
                            data-placeholder={block.type === 'p' && index === 0 && blocks.length === 1 ? "Start writing or type '/' for commands..." : "Type '/' for commands"}
                         >
                             {block.content}
                         </div>
                     )}
                 </div>
             ))}
        </div>

        {/* Floating Slash Menu */}
        {menuOpen && (
            <div 
                className="absolute z-50 w-72 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-slide-up origin-top-left flex flex-col ring-1 ring-white/10"
                style={{ top: menuPosition.top, left: menuPosition.left }}
            >
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <span>Blocks</span>
                    <button onClick={closeMenu} className="hover:text-white transition-colors">
                        <IconX className="w-3 h-3" />
                    </button>
                </div>
                <div className="p-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                    {filteredMenuItems.length > 0 ? filteredMenuItems.map((item, idx) => (
                        <button
                            key={item.label}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent blur
                                executeCommand(item);
                            }}
                            onMouseEnter={() => setMenuSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors group cursor-pointer ${
                                idx === menuSelectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded border flex items-center justify-center transition-colors shadow-sm ${
                                item.highlight 
                                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                                : 'bg-white/5 border-white/10 text-white'
                            }`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-bold truncate ${item.highlight ? 'text-indigo-300' : 'text-white'}`}>
                                    {item.label}
                                </div>
                                <div className="text-[10px] text-neutral-500 truncate">{item.desc}</div>
                            </div>
                        </button>
                    )) : (
                        <div className="p-4 text-center text-neutral-500 text-xs">No matching commands</div>
                    )}
                </div>
            </div>
        )}

    </div>
  );
};

export default NovelEditor;
