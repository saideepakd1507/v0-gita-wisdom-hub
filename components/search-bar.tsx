'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  chapter: number;
  verse: number;
  brief: string;
  topics: string[];
  speaker: string;
}

interface SearchBarProps {
  onSearch: (results: SearchResult[]) => void;
  onSelectSloka: (id: string) => void;
  allSlokas: SearchResult[];
}

const SUGGESTED_TOPICS = [
  'Love', 'Karma', 'Dharma', 'Meditation', 'Peace', 'Wisdom',
  'Devotion', 'Fear', 'Success', 'Relationships', 'Self-Realization', 'Spiritual'
];

export function SearchBar({ onSearch, onSelectSloka, allSlokas }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchSlokas = useCallback((searchQuery: string): SearchResult[] => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    // Map common search terms to topics
    const topicAliases: Record<string, string[]> = {
      'love': ['love', 'devotion', 'relationships', 'bhakti'],
      'peace': ['mindfulness', 'meditation', 'spiritual', 'stress'],
      'anxiety': ['stress', 'fear', 'mindfulness'],
      'work': ['karma', 'duty', 'success'],
      'money': ['success', 'karma', 'detachment'],
      'family': ['relationships', 'duty'],
      'death': ['death', 'immortality', 'self'],
      'god': ['devotion', 'spiritual', 'love'],
      'krishna': ['devotion', 'spiritual', 'wisdom'],
      'action': ['karma', 'duty', 'detachment'],
      'meditation': ['mindfulness', 'spiritual', 'self'],
      'yoga': ['mindfulness', 'karma', 'spiritual'],
      'soul': ['self', 'death', 'spiritual'],
      'atman': ['self', 'spiritual', 'wisdom'],
      'dharma': ['duty', 'karma', 'wisdom'],
      'happiness': ['mindfulness', 'detachment', 'spiritual'],
      'suffering': ['stress', 'depression', 'detachment'],
      'sadness': ['depression', 'stress', 'mindfulness'],
      'motivation': ['depression', 'success', 'karma'],
      'focus': ['mindfulness', 'wisdom', 'success'],
      'fear': ['fear', 'stress', 'spiritual'],
      'worry': ['stress', 'fear', 'mindfulness'],
    };

    const expandedTopics = topicAliases[q] || [];

    return allSlokas.filter(sloka => {
      // Check if topics array exists and is valid
      const topics = sloka.topics && Array.isArray(sloka.topics) ? sloka.topics : [];
      
      const matchesTopic = topics.some(topic => 
        topic.toLowerCase().includes(q) || q.includes(topic.toLowerCase())
      );
      const matchesExpandedTopic = expandedTopics.some(alias => 
        topics.some(topic => topic.toLowerCase() === alias)
      );
      const matchesBrief = sloka.brief && sloka.brief.toLowerCase().includes(q);
      const matchesSpeaker = sloka.speaker && sloka.speaker.toLowerCase().includes(q);
      const matchesId = sloka.id && sloka.id.includes(q);
      const matchesChapter = q.includes('chapter') && sloka.chapter.toString() === q.replace(/[^0-9]/g, '');
      
      return matchesTopic || matchesExpandedTopic || matchesBrief || matchesSpeaker || matchesId || matchesChapter;
    });
  }, [allSlokas]);

  const validateAndSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    
    if (!trimmed) {
      setResults([]);
      setIsInvalid(false);
      setErrorMessage('');
      return;
    }

    if (trimmed.length < 2) {
      setIsInvalid(true);
      setErrorMessage('Please enter at least 2 characters');
      setResults([]);
      return;
    }

    // Check for only special characters
    if (/^[^a-zA-Z0-9\u0900-\u097F]+$/.test(trimmed)) {
      setIsInvalid(true);
      setErrorMessage('Invalid search term. Try these topics:');
      setResults([]);
      return;
    }

    const searchResults = searchSlokas(trimmed);
    
    if (searchResults.length === 0) {
      setIsInvalid(true);
      setErrorMessage('No results found. Try these topics:');
      setResults([]);
    } else {
      setIsInvalid(false);
      setErrorMessage('');
      setResults(searchResults.slice(0, 10));
    }
  }, [searchSlokas]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      validateAndSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, validateAndSearch]);

  const handleSuggestionClick = (topic: string) => {
    setQuery(topic);
    validateAndSearch(topic);
    setIsOpen(true);
  };

  const handleSelectResult = (id: string) => {
    onSelectSloka(id);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsInvalid(false);
    setErrorMessage('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search slokas by topic, verse number, or keyword..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`pl-12 pr-12 h-14 text-lg rounded-2xl divine-border bg-card/50 backdrop-blur-sm ${
            isInvalid ? 'border-destructive' : ''
          }`}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || isInvalid) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 divine-card rounded-2xl overflow-hidden"
          >
            {isInvalid ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Suggested Topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS.map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => handleSuggestionClick(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleSelectResult(result.id)}
                    className="w-full p-4 text-left hover:bg-primary/10 transition-colors border-b border-border/50 last:border-0"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">
                            Chapter {result.chapter}, Verse {result.verse}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {result.speaker}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.brief}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {result.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query.length >= 2 && !isInvalid ? (
              <div className="p-6 text-center text-muted-foreground">
                Searching...
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Topic Suggestions below search */}
      {!isOpen && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {SUGGESTED_TOPICS.slice(0, 6).map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="cursor-pointer hover:bg-primary/20 transition-colors px-3 py-1"
              onClick={() => handleSuggestionClick(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
