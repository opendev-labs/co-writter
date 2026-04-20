
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const parseMarkdown = useCallback((md: string): Block[] => {
      if (!md) return [{ id: Date.now().toString(), type: 'p', content: '' }];
      const lines = md.split('\n');
      const blocks: Block[] = [];
      
      for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed && lines.length > 1) continue; // Skip empty lines between blocks in simple parser

          if (line.startsWith('# ')) blocks.push({ id: Math.random().toString(), type: 'h1', content: line.replace('# ', '') });
          else if (line.startsWith('## ')) blocks.push({ id: Math.random().toString(), type: 'h2', content: line.replace('## ', '') });
          else if (line.startsWith('- ')) blocks.push({ id: Math.random().toString(), type: 'ul', content: line.replace('- ', '') });
          else if (line.startsWith('> ')) blocks.push({ id: Math.random().toString(), type: 'blockquote', content: line.replace('> ', '') });
          else if (line.startsWith('![')) {
              const match = line.match(/\((.*?)\)/);
              if (match) blocks.push({ id: Math.random().toString(), type: 'image', content: match[1] });
          }
          else blocks.push({ id: Math.random().toString(), type: 'p', content: line });
      }
      if (blocks.length === 0) blocks.push({ id: Date.now().toString(), type: 'p', content: '' });
      return blocks;
  }, []);

  const serializeToMarkdown = useCallback((blocks: Block[]) => {
      return blocks.map(b => {
          if (b.type === 'h1') return `# ${b.content}`;
          if (b.type === 'h2') return `## ${b.content}`;
          if (b.type === 'ul') return `- ${b.content}`;
          if (b.type === 'blockquote') return `> ${b.content}`;
          if (b.type === 'image') return `![Image](${b.content})`;
          if (b.type === 'image-prompt') return ''; 
          return b.content;
      }).join('\n\n');
  }, []);

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
  // Avoid re-renders from parent content updates while user is typing
  const isTypingRef = useRef(false);

  useEffect(() => {
      if (isTypingRef.current) return;
      const currentMd = serializeToMarkdown(blocks);
      if (content !== currentMd) {
          setBlocks(parseMarkdown(content));
      }
  }, [content, parseMarkdown, serializeToMarkdown]);

  useEffect(() => {
      const newMarkdown = serializeToMarkdown(blocks);
      if (newMarkdown !== content && !blocks.some(b => b.type === 'image-prompt')) {
          onContentChange(newMarkdown);
      }
  }, [blocks, onContentChange, serializeToMarkdown, content]);

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
      const blockEl = blockRefs.current[activeBlockIndex];
      if (blockEl) {
          const rect = blockEl.getBoundingClientRect();
          const editorContainer = blockEl.closest('.editor-container');
          if (editorContainer) {
              const containerRect = editorContainer.getBoundingClientRect();
              setMenuPosition({ 
                  top: (rect.bottom - containerRect.top) + 8, 
                  left: (rect.left - containerRect.left) 
              });
              setMenuOpen(true);
              setMenuQuery('');
              setMenuSelectedIndex(0);
          }
      }
  };

  const closeMenu = () => {
      setMenuOpen(false);
      setMenuQuery('');
      setMenuSelectedIndex(0);
  };

  const executeCommand = (item: typeof MENU_ITEMS[0]) => {
      const newBlocks = [...blocks];
      newBlocks[activeBlockIndex].content = ''; 
      
      if (item.action) {
          if (item.action === 'img') {
              newBlocks[activeBlockIndex].type = 'image-prompt';
              setBlocks(newBlocks);
              closeMenu();
          } else {
              setBlocks(newBlocks);
              closeMenu();
              const userPrompt = window.prompt("Instruction for Co-Author:");
              if (userPrompt) onTriggerAI(userPrompt);
          }
      } else {
          newBlocks[activeBlockIndex].type = item.type as Block['type'];
          setBlocks(newBlocks);
          closeMenu();
          setTimeout(() => blockRefs.current[activeBlockIndex]?.focus(), 50);
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (menuOpen) {
          if (e.key === 'ArrowDown') { e.preventDefault(); setMenuSelectedIndex(prev => (prev + 1) % filteredMenuItems.length); return; }
          if (e.key === 'ArrowUp') { e.preventDefault(); setMenuSelectedIndex(prev => (prev - 1 + filteredMenuItems.length) % filteredMenuItems.length); return; }
          if (e.key === 'Enter') { e.preventDefault(); if (filteredMenuItems[menuSelectedIndex]) executeCommand(filteredMenuItems[menuSelectedIndex]); return; }
          if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const newBlock: Block = { id: Date.now().toString(), type: 'p', content: '' };
          const newBlocks = [...blocks];
          newBlocks.splice(index + 1, 0, newBlock);
          setBlocks(newBlocks);
          setActiveBlockIndex(index + 1);
          setTimeout(() => blockRefs.current[index + 1]?.focus(), 50);
      }
      else if (e.key === 'Backspace' && blocks[index].content === '') {
          if (blocks.length > 1) {
              e.preventDefault();
              const newBlocks = [...blocks];
              newBlocks.splice(index, 1);
              setBlocks(newBlocks);
              const nextIndex = Math.max(0, index - 1);
              setActiveBlockIndex(nextIndex);
              setTimeout(() => blockRefs.current[nextIndex]?.focus(), 50);
          }
      }
      else if (e.key === 'ArrowUp') {
          if (index > 0) {
              // Only navigate if caret is at the start or it's a key hold
              e.preventDefault();
              setActiveBlockIndex(index - 1);
              blockRefs.current[index - 1]?.focus();
          }
      }
      else if (e.key === 'ArrowDown') {
          if (index < blocks.length - 1) {
              e.preventDefault();
              setActiveBlockIndex(index + 1);
              blockRefs.current[index + 1]?.focus();
          }
      }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>, index: number) => {
      isTypingRef.current = true;
      const text = e.currentTarget.innerText;
      const newBlocks = [...blocks];
      newBlocks[index].content = text;
      setBlocks(newBlocks);
      
      if (text.endsWith('/')) {
          openMenu();
      } else if (menuOpen && !text.includes('/')) {
          closeMenu();
      } else if (menuOpen) {
          const slashIndex = text.lastIndexOf('/');
          setMenuQuery(text.substring(slashIndex + 1));
      }
      
      setTimeout(() => { isTypingRef.current = false; }, 100);
  };

  return (
    <div className="editor-container w-full max-w-4xl mx-auto min-h-screen relative font-sans flex flex-col pt-10 pb-32">
        
        <div className="px-12 mb-8 group">
             <input 
                type="text" 
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full bg-transparent text-5xl font-bold text-white border-none outline-none placeholder-neutral-700 leading-tight"
                placeholder="Untitled Chapter"
            />
        </div>

        <div className="px-12 relative flex-1">
             {blocks.map((block, index) => (
                 <div key={block.id} className="group relative mb-2">
                     {block.type === 'image' ? (
                         <div className="rounded-lg overflow-hidden border border-white/10 my-4 bg-black/20">
                             <img src={block.content} alt="Generated" className="w-full h-auto" />
                         </div>
                     ) : block.type === 'image-prompt' ? (
                         <div className="my-4 p-1.5 pl-3 bg-[#151515] border border-white/20 rounded-full flex items-center gap-3 w-full max-w-xl shadow-2xl animate-fade-in focus-within:border-white/40 transition-all">
                             <IconSparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                             <input 
                                autoFocus
                                type="text"
                                placeholder="Describe the visual to generate..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 h-8"
                                value={block.content}
                                onChange={(e) => {
                                    const newBlocks = [...blocks];
                                    newBlocks[index].content = e.target.value;
                                    setBlocks(newBlocks);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        onTriggerImageGen(block.content);
                                        const newBlocks = [...blocks];
                                        newBlocks[index] = { ...newBlocks[index], type: 'p', content: `*Generating: ${block.content}...*` };
                                        setBlocks(newBlocks);
                                    }
                                    if (e.key === 'Escape') {
                                        const newBlocks = [...blocks];
                                        newBlocks[index].type = 'p';
                                        newBlocks[index].content = '';
                                        setBlocks(newBlocks);
                                    }
                                }}
                             />
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
                                  block.type === 'ul' ? 'list-disc list-inside text-lg text-neutral-300 pl-4' :
                                  block.type === 'blockquote' ? 'text-xl italic text-neutral-400 border-l-4 border-white/20 pl-4 py-2 my-4' :
                                  'text-lg text-neutral-300 leading-relaxed'
                                }
                            `}
                            data-placeholder="Type '/' for commands"
                         >
                             {block.content}
                         </div>
                     )}
                 </div>
             ))}
        </div>

        {menuOpen && (
            <div 
                className="absolute z-50 w-72 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-slide-up flex flex-col"
                style={{ top: menuPosition.top, left: menuPosition.left }}
            >
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <span>Commands</span>
                    <IconX className="w-3 h-3 cursor-pointer" onClick={closeMenu} />
                </div>
                <div className="p-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                    {filteredMenuItems.map((item, idx) => (
                        <button
                            key={item.label}
                            onMouseDown={(e) => { e.preventDefault(); executeCommand(item); }}
                            onMouseEnter={() => setMenuSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${idx === menuSelectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className={`w-10 h-10 rounded border flex items-center justify-center ${item.highlight ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-white'}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-bold truncate ${item.highlight ? 'text-indigo-300' : 'text-white'}`}>{item.label}</div>
                                <div className="text-[10px] text-neutral-500 truncate">{item.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default NovelEditor;
