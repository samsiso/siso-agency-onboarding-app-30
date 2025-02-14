
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/chat';
import { Bot, Command, History, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessingTree } from '@/components/chat/ProcessingTree';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface EnhancedChatStateProps {
  messages: ChatMessage[];
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

// [Analysis] Enhanced animations for a more engaging chat experience
const messageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const suggestions = [
  "How can I automate my marketing workflows?",
  "What are the best AI tools for agencies?",
  "Tell me about the latest AI news",
  "Find educational content about AI",
];

export const EnhancedChatState = ({ messages, handleSubmit, isLoading }: EnhancedChatStateProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full max-w-4xl mx-auto h-full"
    >
      {/* Chat Messages Area */}
      <div 
        className="flex-1 overflow-y-auto flex flex-col-reverse pb-4 scrollbar-thin scrollbar-thumb-siso-text/10 scrollbar-track-transparent"
      >
        <AnimatePresence initial={false}>
          {[...messages].reverse().map((message, index) => (
            <motion.div
              key={messages.length - 1 - index}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                "flex w-full items-start gap-4 rounded-lg p-6 mb-4",
                message.role === 'assistant' 
                  ? 'bg-black/30 backdrop-blur-sm border border-white/5' 
                  : 'bg-gradient-to-r from-siso-orange/10 to-siso-red/10'
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                message.role === 'assistant' 
                  ? 'bg-gradient-to-br from-siso-red to-siso-orange animate-glow' 
                  : 'bg-gradient-to-br from-siso-text/20 to-siso-text/30'
              )}>
                {message.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="text-sm text-siso-text/80">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </div>
                <div className="mt-2 text-siso-text">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <form 
          onSubmit={handleFormSubmit}
          className="relative space-y-4"
        >
          {/* Quick Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-black/50 backdrop-blur-xl rounded-lg border border-white/10"
              >
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left text-sm text-siso-text hover:text-white hover:bg-white/5"
                      onClick={() => {
                        setInput(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Controls */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-black/30 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-siso-orange/50 border border-white/10"
                disabled={isLoading}
                onFocus={() => setShowSuggestions(true)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-siso-text/50 hover:text-siso-text"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <Command className="w-4 h-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-siso-text/50 hover:text-siso-text"
              onClick={() => {}}
            >
              <History className="w-4 h-4" />
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "bg-gradient-to-r from-siso-orange to-siso-red text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-siso-orange",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
