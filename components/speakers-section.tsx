'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language-context';

interface Speaker {
  name: string;
  role: string;
  slokaCount: number;
  description: string;
  image: string;
  color: string;
}

interface SpeakersSectionProps {
  onSelectSpeaker: (speaker: string) => void;
}

const speakers: Speaker[] = [
  {
    name: 'Krishna',
    role: 'The Supreme Lord',
    slokaCount: 574,
    description: 'Lord Krishna, the divine charioteer and supreme teacher, speaks the majority of the Gita, revealing the path to liberation.',
    image: '/images/krishna-hero.jpg',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Arjuna',
    role: 'The Seeker',
    slokaCount: 84,
    description: 'The mighty warrior prince who represents humanity, asking the questions we all have about duty, life, and purpose.',
    image: '/images/arjuna.jpg',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Sanjaya',
    role: 'The Narrator',
    slokaCount: 41,
    description: 'The blessed narrator with divine vision who relates the sacred dialogue to King Dhritarashtra.',
    image: '/images/krishna-arjuna-chariot.jpg',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Dhritarashtra',
    role: 'The Blind King',
    slokaCount: 1,
    description: 'The blind king whose single question sets the entire Gita in motion, representing attachment and spiritual blindness.',
    image: '/images/krishna-vishwaroop.jpg',
    color: 'from-purple-500 to-violet-500',
  },
];

export function SpeakersSection({ onSelectSpeaker }: SpeakersSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold divine-text mb-2">
          {t('speakersOfGita')}
        </h2>
        <p className="text-muted-foreground">
          700 {t('slokas')} spoken by four distinct voices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {speakers.map((speaker, index) => (
          <motion.button
            key={speaker.name}
            onClick={() => onSelectSpeaker(speaker.name)}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group divine-card rounded-2xl overflow-hidden text-left"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r ${speaker.color} opacity-40`} />
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{speaker.role}</p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${speaker.color} text-white`}>
                    {speaker.slokaCount} {t('slokas')}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {speaker.description}
                </p>

                <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('viewAllSlokas')} {speaker.name}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Speaker Stats Bar */}
      <div className="mt-8 divine-card rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-4">
          {t('slokaDistribution')}
        </h4>
        <div className="relative h-8 rounded-full overflow-hidden bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '82%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '12%' }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute left-[82%] top-0 h-full bg-gradient-to-r from-amber-500 to-orange-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '5.85%' }}
            transition={{ duration: 1, delay: 0.9 }}
            className="absolute left-[94%] top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '0.15%' }}
            transition={{ duration: 1, delay: 1.1 }}
            className="absolute left-[99.85%] top-0 h-full bg-gradient-to-r from-purple-500 to-violet-500"
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>Krishna (82%)</span>
          <span>Arjuna (12%)</span>
          <span>Sanjaya (5.9%)</span>
          <span>Dhritarashtra (0.1%)</span>
        </div>
      </div>
    </section>
  );
}
