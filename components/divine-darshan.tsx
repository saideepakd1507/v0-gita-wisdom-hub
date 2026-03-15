'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language-context';

interface DivineDarshanItem {
  id: string;
  src: string;
  title: string;
  titleKey: string;
  description: string;
  slokaIds: string[]; // Related sloka IDs
  color: string;
}

interface DivineDarshanProps {
  onSelectImage: (item: DivineDarshanItem) => void;
}

const DIVINE_DARSHAN_ITEMS: DivineDarshanItem[] = [
  {
    id: 'krishna',
    src: '/images/krishna-hero.jpg',
    title: 'Lord Krishna',
    titleKey: 'krishna',
    description: 'The Supreme Lord and divine teacher who speaks the essence of the Gita.',
    slokaIds: ['2.47', '2.48', '4.7', '9.22', '18.66'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'arjuna',
    src: '/images/arjuna.jpg',
    title: 'Arjuna',
    titleKey: 'arjuna',
    description: 'The mighty warrior prince who represents humanity\'s quest for truth.',
    slokaIds: ['1.28', '2.7', '6.33', '11.1', '18.73'],
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'chariot',
    src: '/images/krishna-arjuna-chariot.jpg',
    title: 'Divine Chariot',
    titleKey: 'divineChariot',
    description: 'The sacred chariot on the battlefield of Kurukshetra where divine wisdom was revealed.',
    slokaIds: ['1.21', '1.24', '2.10', '11.9', '18.74'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'vishwaroop',
    src: '/images/krishna-vishwaroop.jpg',
    title: 'Vishwaroop',
    titleKey: 'vishwaroop',
    description: 'The cosmic universal form of Lord Krishna, revealing His infinite divine nature.',
    slokaIds: ['11.5', '11.9', '11.12', '11.16', '11.45'],
    color: 'from-purple-500 to-violet-500',
  },
];

export function DivineDarshan({ onSelectImage }: DivineDarshanProps) {
  const { t } = useLanguage();

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold divine-text mb-6 text-center">
        {t('divineDarshan')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DIVINE_DARSHAN_ITEMS.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onSelectImage(item)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative aspect-square rounded-2xl overflow-hidden divine-border group text-left"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-background/95 via-background/70 to-background/30" />
            
            {/* Default state */}
            <div className="absolute bottom-0 left-0 right-0 p-3 transition-opacity group-hover:opacity-0">
              <p className="text-sm font-medium text-center">{t(item.titleKey)}</p>
            </div>
            
            {/* Hover state */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge className={`bg-gradient-to-r ${item.color} text-white mb-2 w-fit`}>
                {item.slokaIds.length} {t('slokas')}
              </Badge>
              <h3 className="font-bold text-white mb-1">{t(item.titleKey)}</h3>
              <p className="text-xs text-white/80 line-clamp-2 mb-2">{item.description}</p>
              <div className="flex items-center text-primary text-xs font-medium">
                {t('viewAllSlokas')}
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export { DIVINE_DARSHAN_ITEMS };
export type { DivineDarshanItem };
