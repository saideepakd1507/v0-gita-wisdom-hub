'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, Lightbulb, Calendar, Target, Sparkles, 
  ChevronDown, ChevronUp, Play, Volume2, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SlokaAudioPlayer } from './audio-player';
import { useLanguage, LANGUAGES, type LanguageCode } from '@/lib/language-context';
import type { Sloka } from '@/lib/gita-data';

interface SlokaDetailProps {
  sloka: Sloka;
  onClose: () => void;
}

const speakerColors: Record<string, string> = {
  Krishna: 'from-blue-500 to-cyan-500',
  Arjuna: 'from-amber-500 to-orange-500',
  Sanjaya: 'from-green-500 to-emerald-500',
  Dhritarashtra: 'from-purple-500 to-violet-500',
};

export function SlokaDetail({ sloka, onClose }: SlokaDetailProps) {
  const { currentLanguage, t, setCurrentLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLanguage);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    brief: true,
    simple: true,
    detail: true,
    matters: true,
    example: true,
    motivation: true,
  });

  // Sync with global language
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle language change for translations
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang as LanguageCode);
  };

  // Get Sanskrit text in selected language script (if available)
  const getSanskritDisplay = () => {
    // Sanskrit remains in Devanagari script always
    return sloka.sanskrit;
  };

  // Get translation based on selected language
  const getTranslation = () => {
    if (selectedLanguage === 'sanskrit') {
      return sloka.translations.english; // Fallback to English for Sanskrit
    }
    return sloka.translations[selectedLanguage as keyof typeof sloka.translations] || sloka.translations.english;
  };

  const sections = [
    {
      id: 'brief',
      titleKey: 'briefOverview',
      icon: BookOpen,
      content: sloka.brief,
      color: 'text-primary',
    },
    {
      id: 'simple',
      titleKey: 'simpleExplanation',
      icon: Lightbulb,
      content: sloka.simpleExplanation,
      color: 'text-yellow-500',
    },
    {
      id: 'detail',
      titleKey: 'detailedUnderstanding',
      icon: BookOpen,
      content: sloka.detail,
      color: 'text-blue-500',
    },
    {
      id: 'matters',
      titleKey: 'whyThisMatters',
      icon: Calendar,
      content: sloka.whyThisMattersToday,
      color: 'text-green-500',
    },
    {
      id: 'example',
      titleKey: 'practicalExample',
      icon: Target,
      content: sloka.practicalExample,
      color: 'text-orange-500',
    },
    {
      id: 'motivation',
      titleKey: 'motivationalTakeaway',
      icon: Sparkles,
      content: sloka.motivationalTakeaway,
      color: 'text-pink-500',
    },
  ];

  // Filter languages - exclude Sanskrit from translation tabs since we show it separately
  const translationLanguages = LANGUAGES.filter(l => l.code !== 'sanskrit');

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
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold divine-text">
                  {t('chapters').includes('Chapter') 
                    ? `Chapter ${sloka.chapter}, Verse ${sloka.verse}`
                    : `${t('chapters').replace('18 ', '')} ${sloka.chapter}, ${t('verses')} ${sloka.verse}`
                  }
                </h2>
                <Badge 
                  className={`bg-gradient-to-r ${speakerColors[sloka.speaker]} text-white`}
                >
                  {sloka.speaker}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {(sloka.topics || []).map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* Sanskrit Text */}
          <div className="divine-border rounded-2xl p-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="om-symbol text-lg">ॐ</span> Sanskrit
            </h3>
            <p className="sanskrit-text text-xl leading-relaxed text-foreground whitespace-pre-line">
              {getSanskritDisplay()}
            </p>
            <p className="mt-4 text-sm italic text-muted-foreground">
              {sloka.transliteration}
            </p>
          </div>

          {/* Audio Player */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Volume2 className="w-4 h-4" />
              {t('listenSloka')}
            </div>
            <SlokaAudioPlayer 
              sloka={sloka}
              language={selectedLanguage}
            />
          </div>

          {/* Language Tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Globe className="w-4 h-4" />
              {t('translation')}
            </div>
            <Tabs value={selectedLanguage} onValueChange={handleLanguageChange}>
              <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
                {translationLanguages.map((lang) => (
                  <TabsTrigger
                    key={lang.code}
                    value={lang.code}
                    className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="hidden sm:inline">{lang.name}</span>
                    <span className="sm:hidden">{lang.flag}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {translationLanguages.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="mt-4">
                  <div className="divine-border rounded-xl p-4 bg-card/50">
                    <p className="text-lg leading-relaxed">
                      {sloka.translations[lang.code as keyof typeof sloka.translations]}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="divine-border rounded-xl overflow-hidden bg-card/30"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className={`w-5 h-5 ${section.color}`} />
                    <span className="font-semibold">{t(section.titleKey)}</span>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/50">
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {t('listenSloka').replace('Listen to this Sloka', 'Click play to listen in')} {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
            </span>
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-full">
            {t('close')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
