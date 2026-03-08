'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Chapter } from '@/lib/gita-data';

interface ChaptersSectionProps {
  chapters: Chapter[];
  onSelectChapter: (chapterNum: number) => void;
}

export function ChaptersSection({ chapters, onSelectChapter }: ChaptersSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedChapters = showAll ? chapters : chapters.slice(0, 6);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold divine-text mb-2">
            18 Chapters of Wisdom
          </h2>
          <p className="text-muted-foreground">
            Journey through the complete Bhagavad Gita
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAll(!showAll)}
          className="rounded-full divine-border"
        >
          {showAll ? 'Show Less' : 'See All Chapters'}
          <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedChapters.map((chapter, index) => (
          <motion.button
            key={chapter.number}
            onClick={() => onSelectChapter(chapter.number)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group divine-card rounded-2xl p-6 text-left overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    {chapter.number}
                  </span>
                </div>
                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    {chapter.totalVerses} verses
                  </Badge>
                </div>
              </div>
              <Play className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
              {chapter.nameEnglish}
            </h3>
            <p className="text-sm text-primary/80 sanskrit-text mb-3">
              {chapter.nameSanskrit}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {chapter.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-1">
              {chapter.topics.slice(0, 3).map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Total Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="divine-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold divine-text">18</div>
          <div className="text-sm text-muted-foreground">Chapters</div>
        </div>
        <div className="divine-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold divine-text">700</div>
          <div className="text-sm text-muted-foreground">Total Slokas</div>
        </div>
        <div className="divine-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold divine-text">574</div>
          <div className="text-sm text-muted-foreground">By Krishna</div>
        </div>
        <div className="divine-card rounded-xl p-4 text-center">
          <div className="text-3xl font-bold divine-text">5000+</div>
          <div className="text-sm text-muted-foreground">Years of Wisdom</div>
        </div>
      </div>
    </section>
  );
}
