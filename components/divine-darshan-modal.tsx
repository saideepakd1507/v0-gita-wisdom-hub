'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AudioPlayer, SlokaAudioPlayer } from '@/components/audio-player';
import { useLanguage } from '@/lib/language-context';
import type { DivineDarshanItem } from './divine-darshan';
import type { Sloka } from '@/lib/gita-data';

interface DivineDarshanModalProps {
  item: DivineDarshanItem;
  slokas: Sloka[];
  onClose: () => void;
  onSelectSloka: (sloka: Sloka) => void;
}

export function DivineDarshanModal({ 
  item, 
  slokas, 
  onClose, 
  onSelectSloka 
}: DivineDarshanModalProps) {
  const { t, currentLanguage } = useLanguage();
  const [expandedSloka, setExpandedSloka] = useState<string | null>(null);

  // Filter slokas related to this divine darshan item
  const relatedSlokas = slokas.filter(s => item.slokaIds.includes(s.id));

  const getTranslation = (sloka: Sloka) => {
    if (currentLanguage === 'sanskrit') {
      return sloka.sanskrit;
    }
    return sloka.translations[currentLanguage as keyof typeof sloka.translations] || sloka.translations.english;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden divine-card rounded-3xl"
      >
        {/* Header with Image */}
        <div className="relative h-48 md:h-64">
          <Image
            src={item.src}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-40`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Title */}
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className={`bg-gradient-to-r ${item.color} text-white mb-2`}>
              {relatedSlokas.length} {t('slokas')}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {t(item.titleKey)}
            </h2>
            <p className="text-sm text-white/80 mt-1">{item.description}</p>
          </div>
        </div>

        {/* Slokas List */}
        <ScrollArea className="max-h-[calc(90vh-280px)]">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4">
              {t('relatedSlokas') || 'Related Slokas'}
            </h3>
            
            {relatedSlokas.map((sloka) => (
              <motion.div
                key={sloka.id}
                layout
                className="divine-border rounded-xl overflow-hidden bg-card/30"
              >
                {/* Sloka Header */}
                <button
                  onClick={() => setExpandedSloka(expandedSloka === sloka.id ? null : sloka.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {sloka.chapter}.{sloka.verse}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {sloka.speaker}
                    </Badge>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedSloka === sloka.id ? 'rotate-90' : ''
                    }`} 
                  />
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedSloka === sloka.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 space-y-4 border-t border-border/50">
                        {/* Sanskrit */}
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground mb-1">Sanskrit</p>
                          <p className="sanskrit-text text-sm leading-relaxed whitespace-pre-line">
                            {sloka.sanskrit}
                          </p>
                        </div>

                        {/* Translation in current language */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('translation')}</p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {getTranslation(sloka)}
                          </p>
                        </div>

                        {/* Brief Overview */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('briefOverview')}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {sloka.brief}
                          </p>
                        </div>

                        {/* Audio Player */}
                        <div className="pt-2">
                          <SlokaAudioPlayer sloka={sloka} />
                        </div>

                        {/* Read More Button */}
                        <div className="flex justify-end pt-2">
                          <Button
                            onClick={() => {
                              onClose();
                              onSelectSloka(sloka);
                            }}
                            className="rounded-full"
                            size="sm"
                          >
                            {t('readFullExplanation')}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex justify-end">
          <Button onClick={onClose} variant="outline" className="rounded-full">
            {t('close')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
