'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  BookOpen, Play, Pause, ChevronRight, Filter,
  Sparkles, ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OmLogo } from '@/components/om-logo';
import { DivineParticles, FloatingLotus } from '@/components/divine-particles';
import { SearchBar } from '@/components/search-bar';
import { SlokaDetail } from '@/components/sloka-detail';
import { TopicsSection } from '@/components/topics-section';
import { ChaptersSection } from '@/components/chapters-section';
import { SpeakersSection } from '@/components/speakers-section';
import { AudioPlayer, SlokaAudioPlayer } from '@/components/audio-player';
import { DivineDarshan, type DivineDarshanItem } from '@/components/divine-darshan';
import { DivineDarshanModal } from '@/components/divine-darshan-modal';
import { LanguageSelector } from '@/components/language-selector';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import { chapters, topics, generateAllSlokas, type Sloka } from '@/lib/gita-data';

// Generate all slokas once
const allSlokas = generateAllSlokas();

// Enhanced topics with descriptions and counts
const enhancedTopics = topics.map(topic => ({
  ...topic,
  description: getTopicDescription(topic.id),
  slokaCount: allSlokas.filter(s => s.topics && Array.isArray(s.topics) && s.topics.includes(topic.id)).length,
}));

function getTopicDescription(topicId: string): string {
  const descriptions: Record<string, string> = {
    stress: 'Find peace and calm through ancient wisdom that addresses modern anxiety and stress.',
    depression: 'Discover hope and motivation to overcome feelings of despair and low energy.',
    success: 'Learn the principles of achieving success while maintaining inner peace.',
    relationships: 'Navigate family dynamics and relationships with wisdom and compassion.',
    anger: 'Master your emotions and transform anger into constructive energy.',
    spiritual: 'Deepen your spiritual connection and understanding of the divine.',
    mindfulness: 'Cultivate present-moment awareness and inner tranquility.',
    duty: 'Understand your dharma and fulfill your responsibilities with purpose.',
    detachment: 'Learn the art of letting go while remaining engaged with life.',
    wisdom: 'Gain profound knowledge that illuminates the path of life.',
    devotion: 'Experience the transformative power of bhakti and divine love.',
    karma: 'Understand the law of action and create positive outcomes.',
    self: 'Discover your true nature and achieve self-realization.',
    fear: 'Overcome fears and develop courage through spiritual strength.',
    death: 'Understand the eternal nature of the soul beyond physical existence.',
    love: 'Experience divine love that transcends all worldly attachments.',
  };
  return descriptions[topicId] || 'Explore timeless wisdom on this topic.';
}

function GitaWisdomHubContent() {
  const { t, currentLanguage } = useLanguage();
  const [selectedSloka, setSelectedSloka] = useState<Sloka | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [filterSpeaker, setFilterSpeaker] = useState<string | null>(null);
  const [filterChapter, setFilterChapter] = useState<number | null>(null);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedDarshanItem, setSelectedDarshanItem] = useState<DivineDarshanItem | null>(null);

  // Handle scroll for back to top button
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 500);
  }, []);

  // Filter slokas based on current filters
  const filteredSlokas = useMemo(() => {
    let result = allSlokas;
    
    if (filterSpeaker) {
      result = result.filter(s => s.speaker === filterSpeaker);
    }
    if (filterChapter) {
      result = result.filter(s => s.chapter === filterChapter);
    }
    if (filterTopic) {
      result = result.filter(s => s.topics && Array.isArray(s.topics) && s.topics.includes(filterTopic));
    }
    
    return result;
  }, [filterSpeaker, filterChapter, filterTopic]);

  // Search results handler
  const handleSearchResults = useCallback(() => {
    // Search is handled in the SearchBar component
  }, []);

  // Select sloka handler
  const handleSelectSloka = useCallback((id: string) => {
    const sloka = allSlokas.find(s => s.id === id);
    if (sloka) {
      setSelectedSloka(sloka);
    }
  }, []);

  // Select topic handler
  const handleSelectTopic = useCallback((topicId: string) => {
    setFilterTopic(topicId);
    setActiveTab('slokas');
  }, []);

  // Select chapter handler
  const handleSelectChapter = useCallback((chapterNum: number) => {
    setFilterChapter(chapterNum);
    setActiveTab('slokas');
  }, []);

  // Select speaker handler
  const handleSelectSpeaker = useCallback((speaker: string) => {
    setFilterSpeaker(speaker);
    setActiveTab('slokas');
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilterSpeaker(null);
    setFilterChapter(null);
    setFilterTopic(null);
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Search results for SearchBar
  const searchableResults = useMemo(() => {
    return allSlokas.map(s => ({
      id: s.id,
      chapter: s.chapter,
      verse: s.verse,
      brief: s.brief,
      topics: s.topics,
      speaker: s.speaker,
    }));
  }, []);

  // Handle Divine Darshan selection
  const handleDarshanSelect = useCallback((item: DivineDarshanItem) => {
    setSelectedDarshanItem(item);
  }, []);

  // Get translation based on current language
  const getTranslation = (sloka: Sloka) => {
    if (currentLanguage === 'sanskrit') {
      return sloka.translations.english;
    }
    return sloka.translations[currentLanguage as keyof typeof sloka.translations] || sloka.translations.english;
  };

  // Featured sloka
  const featuredSloka = allSlokas.find(s => s.id === '2.47');

  return (
    <div className="min-h-screen divine-gradient">
      {/* Divine Background Effects */}
      <DivineParticles />
      <FloatingLotus />
      
      {/* Background Image Overlay */}
      <div className="fixed inset-0 z-0 opacity-10">
        <Image
          src="/images/divine-bg.jpg"
          alt="Divine background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OmLogo size="md" />
                <div>
                  <h1 className="text-xl font-bold divine-text">Gita Wisdom</h1>
                  <p className="text-xs text-muted-foreground">{t('divineKnowledgeHub')}</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant={activeTab === 'home' ? 'default' : 'ghost'}
                  onClick={() => { setActiveTab('home'); clearFilters(); }}
                  className="rounded-full"
                >
                  {t('home')}
                </Button>
                <Button
                  variant={activeTab === 'chapters' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('chapters')}
                  className="rounded-full"
                >
                  {t('chapters')}
                </Button>
                <Button
                  variant={activeTab === 'slokas' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('slokas')}
                  className="rounded-full"
                >
                  {t('allSlokas')}
                </Button>
                <Button
                  variant={activeTab === 'speakers' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('speakers')}
                  className="rounded-full"
                >
                  {t('speakers')}
                </Button>
              </nav>

              <div className="flex items-center gap-2">
                <LanguageSelector />
                <Badge variant="outline" className="hidden sm:flex divine-border">
                  <Sparkles className="w-3 h-3 mr-1 text-primary" />
                  700 {t('slokas')}
                </Badge>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setActiveTab('home'); clearFilters(); }}
                className="rounded-full whitespace-nowrap"
              >
                {t('home')}
              </Button>
              <Button
                variant={activeTab === 'chapters' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('chapters')}
                className="rounded-full whitespace-nowrap"
              >
                {t('chapters')}
              </Button>
              <Button
                variant={activeTab === 'slokas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('slokas')}
                className="rounded-full whitespace-nowrap"
              >
                {t('slokas')}
              </Button>
              <Button
                variant={activeTab === 'speakers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('speakers')}
                className="rounded-full whitespace-nowrap"
              >
                {t('speakers')}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <ScrollArea className="h-[calc(100vh-80px)]" onScroll={handleScroll}>
          <main className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Hero Section */}
                  <section className="relative py-12 text-center">
                    {/* Krishna Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-48 h-48 mx-auto mb-8"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                      <div className="relative w-full h-full rounded-full overflow-hidden divine-glow divine-border">
                        <Image
                          src="/images/krishna-hero.jpg"
                          alt="Lord Krishna"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl md:text-6xl font-bold mb-4"
                    >
                      <span className="divine-text">Bhagavad Gita</span>
                    </motion.h1>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                    >
                      {t('heroDesc')}
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-8"
                    >
                      <SearchBar 
                        allSlokas={searchableResults}
                        onSearch={handleSearchResults}
                        onSelectSloka={handleSelectSloka}
                      />
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap justify-center gap-4"
                    >
                      <Badge variant="outline" className="px-4 py-2 text-sm divine-border">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {t('chapters')}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm divine-border">
                        <Sparkles className="w-4 h-4 mr-2" />
                        700 {t('slokas')}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-2 text-sm divine-border">
                        10 {t('languages')}
                      </Badge>
                    </motion.div>
                  </section>

                  {/* Divine Darshan - Now with click functionality */}
                  <DivineDarshan onSelectImage={handleDarshanSelect} />

                  {/* Topics Section */}
                  <TopicsSection 
                    topics={enhancedTopics}
                    onSelectTopic={handleSelectTopic}
                  />

                  {/* Chapters Section */}
                  <ChaptersSection 
                    chapters={chapters}
                    onSelectChapter={handleSelectChapter}
                  />

                  {/* Speakers Section */}
                  <SpeakersSection 
                    onSelectSpeaker={handleSelectSpeaker}
                  />

                  {/* Featured Sloka */}
                  {featuredSloka && (
                    <section className="py-12">
                      <h2 className="text-3xl font-bold divine-text mb-8 text-center">
                        {t('featuredSloka')}
                      </h2>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="divine-card rounded-3xl p-8 max-w-3xl mx-auto"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                            {featuredSloka.speaker}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Chapter 2, Verse 47</span>
                        </div>
                        
                        <p className="sanskrit-text text-xl mb-4 leading-relaxed">
                          {featuredSloka.sanskrit}
                        </p>
                        
                        <p className="text-muted-foreground mb-6">
                          {getTranslation(featuredSloka)}
                        </p>

                        <div className="flex items-center justify-between">
                          <SlokaAudioPlayer sloka={featuredSloka} />
                          <Button
                            onClick={() => setSelectedSloka(featuredSloka)}
                            className="rounded-full"
                          >
                            {t('readFullExplanation')}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    </section>
                  )}

                  {/* Meditation Image */}
                  <section className="relative py-16 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0">
                      <Image
                        src="/images/krishna-meditation.jpg"
                        alt="Krishna Meditation"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
                    </div>
                    <div className="relative z-10 max-w-xl px-8">
                      <h2 className="text-3xl font-bold mb-4">{t('beginJourney')}</h2>
                      <p className="text-muted-foreground mb-6">
                        {t('beginJourneyDesc')}
                      </p>
                      <Button 
                        onClick={() => setActiveTab('chapters')}
                        size="lg"
                        className="rounded-full"
                      >
                        {t('startReading')}
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'chapters' && (
                <motion.div
                  key="chapters"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold divine-text mb-2">
                      {t('chaptersOfGita')}
                    </h1>
                    <p className="text-muted-foreground">
                      {t('exploreChapters')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapters.map((chapter, index) => (
                      <motion.button
                        key={chapter.number}
                        onClick={() => handleSelectChapter(chapter.number)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="divine-card rounded-2xl p-6 text-left group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-primary-foreground">
                              {chapter.number}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {chapter.nameEnglish}
                            </h3>
                            <p className="text-sm text-primary/80 sanskrit-text mb-2">
                              {chapter.nameSanskrit}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {chapter.totalVerses} {t('verses')}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {chapter.summary}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'slokas' && (
                <motion.div
                  key="slokas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h1 className="text-3xl font-bold divine-text mb-2">
                        {filterChapter 
                          ? `Chapter ${filterChapter} ${t('slokas')}`
                          : filterSpeaker
                          ? `${t('slokas')} by ${filterSpeaker}`
                          : filterTopic
                          ? `${t('slokas')} on ${topics.find(t => t.id === filterTopic)?.name || filterTopic}`
                          : t('allSlokas')
                        }
                      </h1>
                      <p className="text-muted-foreground">
                        {filteredSlokas.length} {t('slokasFound')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(filterChapter || filterSpeaker || filterTopic) && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="rounded-full"
                        >
                          {t('clearFilters')}
                        </Button>
                      )}
                      <Button variant="outline" className="rounded-full">
                        <Filter className="w-4 h-4 mr-2" />
                        {t('filter')}
                      </Button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="h-auto flex-wrap justify-start bg-transparent gap-2 p-0">
                        <TabsTrigger
                          value="all"
                          onClick={clearFilters}
                          className="rounded-full data-[state=active]:bg-primary"
                        >
                          {t('all')}
                        </TabsTrigger>
                        {chapters.map(ch => (
                          <TabsTrigger
                            key={ch.number}
                            value={`ch-${ch.number}`}
                            onClick={() => { setFilterChapter(ch.number); setFilterSpeaker(null); setFilterTopic(null); }}
                            className="rounded-full data-[state=active]:bg-primary"
                          >
                            {t('ch')} {ch.number}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Slokas Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSlokas.map((sloka, index) => (
                      <motion.button
                        key={sloka.id}
                        onClick={() => setSelectedSloka(sloka)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.02, 0.5) }}
                        whileHover={{ scale: 1.01 }}
                        className="divine-card rounded-xl p-4 text-left group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {sloka.chapter}.{sloka.verse}
                            </span>
                            <Badge 
                              variant="secondary"
                              className="text-xs"
                            >
                              {sloka.speaker}
                            </Badge>
                          </div>
                          <AudioPlayer chapterVerse={sloka.id} compact text={getTranslation(sloka)} />
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {sloka.brief}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {(sloka.topics || []).slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topics.find(t => t.id === topic)?.name || topic}
                            </Badge>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'speakers' && (
                <motion.div
                  key="speakers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SpeakersSection onSelectSpeaker={handleSelectSpeaker} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </ScrollArea>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center shadow-lg"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sloka Detail Modal */}
        <AnimatePresence>
          {selectedSloka && (
            <SlokaDetail 
              sloka={selectedSloka}
              onClose={() => setSelectedSloka(null)}
            />
          )}
        </AnimatePresence>

        {/* Divine Darshan Modal */}
        <AnimatePresence>
          {selectedDarshanItem && (
            <DivineDarshanModal
              item={selectedDarshanItem}
              slokas={allSlokas}
              onClose={() => setSelectedDarshanItem(null)}
              onSelectSloka={(sloka) => {
                setSelectedDarshanItem(null);
                setSelectedSloka(sloka);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GitaWisdomHub() {
  return (
    <LanguageProvider>
      <GitaWisdomHubContent />
    </LanguageProvider>
  );
}
