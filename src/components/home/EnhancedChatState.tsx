import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/chat';
import { Bot, Command, History, Send, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessingTree } from '@/components/chat/ProcessingTree';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useChatHistory } from '@/hooks/useChatHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface EnhancedChatStateProps {
  messages: ChatMessage[];
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

// [Analysis] Enhanced animations for a more engaging chat experience
const messageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// [Analysis] Suggestions provide quick access to common queries
const suggestions = [
  "How can I automate my marketing workflows?",
  "What are the best AI tools for agencies?",
  "Tell me about the latest AI news",
  "Find educational content about AI",
];

export const EnhancedChatState = ({ messages, handleSubmit, isLoading }: EnhancedChatStateProps) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { uploadFile, isUploading } = useFileUpload();
  const { history, isLoading: isLoadingHistory, saveConversation } = useChatHistory();
  const { toast } = useToast();
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      await handleSubmit(input.trim());
      setInput('');
      // Save conversation after each message
      if (messages.length > 0) {
        await saveConversation(messages);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = await uploadFile(file);
    if (filePath) {
      setInput((prev) => prev + ` [Uploaded file: ${file.name}]`);
    }
  };

  return (
    <div className="flex w-full max-w-6xl mx-auto h-full relative">
      {/* Main Chat Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col w-full h-full relative"
      >
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-thin scrollbar-thumb-siso-text/10 scrollbar-track-transparent">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "flex w-full items-start gap-4 rounded-lg p-6",
                  message.role === 'assistant' 
                    ? 'bg-black/30 backdrop-blur-sm border border-white/5' 
                    : 'bg-gradient-to-r from-siso-orange/10 to-siso-red/10'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 rounded-full bg-gradient-to-r from-siso-orange to-siso-red p-2">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  {message.loading ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {message.processingStage && message.agentResponses && (
                        <ProcessingTree
                          currentStage={message.processingStage.current}
                          agentStatuses={{
                            'ai-tools': message.agentResponses['ai-tools'].status,
                            'videos': message.agentResponses['videos'].status,
                            'networking': message.agentResponses['networking'].status,
                            'assistants': message.agentResponses['assistants'].status,
                            'educators': message.agentResponses['educators'].status,
                            'news': message.agentResponses['news'].status,
                          }}
                        />
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-sm text-siso-text leading-relaxed">
                      {message.content}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced Input Section */}
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

              {/* Upload Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-siso-text/50 hover:text-siso-text relative"
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </Button>

              {/* History Toggle Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "text-siso-text/50 hover:text-siso-text",
                  showHistory && "text-siso-orange"
                )}
                onClick={() => setShowHistory(!showHistory)}
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

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-black/40 backdrop-blur-lg border-l border-white/10"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-siso-text">Chat History</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)] p-4">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-siso-orange"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                      onClick={() => {
                        toast({
                          title: "Coming Soon",
                          description: "Chat restoration will be available soon!"
                        });
                      }}
                    >
                      <p className="text-sm font-medium text-siso-text">{entry.title}</p>
                      <p className="text-xs text-siso-text/70">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
