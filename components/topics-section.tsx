'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Heart, Trophy, Users, Flame, Sparkles, 
  Leaf, Shield, Wind, BookOpen, Flower2, Zap, 
  Sun, Infinity, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  slokaCount: number;
}

interface TopicsSectionProps {
  topics: Topic[];
  onSelectTopic: (topicId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Heart,
  Trophy,
  Users,
  Flame,
  Sparkles,
  Leaf,
  Shield,
  Wind,
  BookOpen,
  Flower2,
  Zap,
  Sun,
  Infinity,
};

export function TopicsSection({ topics, onSelectTopic }: TopicsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedTopics = showAll ? topics : topics.slice(0, 6);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold divine-text mb-2">
            Explore By Topic
          </h2>
          <p className="text-muted-foreground">
            Find divine wisdom for every aspect of life
          </p>
        </div>
        {topics.length > 6 && (
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="rounded-full divine-border"
          >
            {showAll ? 'Show Less' : 'See All Topics'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTopics.map((topic, index) => {
          const IconComponent = iconMap[topic.icon] || Sparkles;
          
          return (
            <motion.button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative divine-card rounded-2xl p-6 text-left overflow-hidden"
            >
              {/* Background gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-10 group-hover:opacity-20 transition-opacity`}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {topic.slokaCount} slokas
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>

                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore slokas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
