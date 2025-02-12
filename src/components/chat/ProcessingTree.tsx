
import { motion } from 'framer-motion';
import { Brain, Building2, Sparkles } from 'lucide-react';
import { AgentCategory, ProcessingStage } from '@/types/chat';
import { KnowledgeStream } from './processing/KnowledgeStream';
import { ProcessingNode } from './processing/ProcessingNode';
import { agentIcons, agentThoughts, containerVariants, itemVariants } from './processing/constants';

interface ProcessingTreeProps {
  currentStage: ProcessingStage;
  agentStatuses: Record<AgentCategory, 'pending' | 'processing' | 'complete'>;
}

export const ProcessingTree = ({ currentStage, agentStatuses }: ProcessingTreeProps) => {
  const stages = ['initial', 'context', 'agents', 'synthesis'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="relative py-8">
      <KnowledgeStream />
      <motion.div 
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Brain}
            label="Understanding request"
            isActive={currentStage === 'initial'}
            isComplete={currentIndex > 0}
            thoughts={agentThoughts.initial}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Building2}
            label="Applying company context"
            isActive={currentStage === 'context'}
            isComplete={currentIndex > 1}
            thoughts={agentThoughts.context}
          />
        </motion.div>

        {currentStage === 'agents' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-12 space-y-4"
          >
            {Object.entries(agentStatuses).map(([category, status], index) => {
              const Icon = agentIcons[category as AgentCategory];
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProcessingNode
                    icon={Icon}
                    label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                    isActive={status === 'processing'}
                    isComplete={status === 'complete'}
                    size="sm"
                    thoughts={agentThoughts[category as AgentCategory]}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Sparkles}
            label="Synthesizing information"
            isActive={currentStage === 'synthesis'}
            isComplete={currentIndex > 3}
            thoughts={agentThoughts.synthesis}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
