'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage, type LanguageCode } from '@/lib/language-context';

interface Speaker {
  name: string;
  roleKey: string;
  slokaCount: number;
  descriptionKey: string;
  image: string;
  color: string;
}

interface SpeakersSectionProps {
  onSelectSpeaker: (speaker: string) => void;
}

const speakers: Speaker[] = [
  {
    name: 'Krishna',
    roleKey: 'theSupremeLord',
    slokaCount: 574,
    descriptionKey: 'krishnaDesc',
    image: '/images/krishna-hero.jpg',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Arjuna',
    roleKey: 'theSeeker',
    slokaCount: 84,
    descriptionKey: 'arjunaDesc',
    image: '/images/arjuna.jpg',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Sanjaya',
    roleKey: 'theNarrator',
    slokaCount: 41,
    descriptionKey: 'sanjayaDesc',
    image: '/images/krishna-arjuna-chariot.jpg',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Dhritarashtra',
    roleKey: 'theBlindKing',
    slokaCount: 1,
    descriptionKey: 'dhritarashtraDesc',
    image: '/images/krishna-vishwaroop.jpg',
    color: 'from-purple-500 to-violet-500',
  },
];

// Translated speaker names
const speakerNames: Record<LanguageCode, Record<string, string>> = {
  english: { Krishna: 'Krishna', Arjuna: 'Arjuna', Sanjaya: 'Sanjaya', Dhritarashtra: 'Dhritarashtra' },
  hindi: { Krishna: 'श्री कृष्ण', Arjuna: 'अर्जुन', Sanjaya: 'संजय', Dhritarashtra: 'धृतराष्ट्र' },
  telugu: { Krishna: 'శ్రీ కృష్ణుడు', Arjuna: 'అర్జునుడు', Sanjaya: 'సంజయుడు', Dhritarashtra: 'ధృతరాష్ట్రుడు' },
  tamil: { Krishna: 'ஸ்ரீ கிருஷ்ணர்', Arjuna: 'அர்ஜுனன்', Sanjaya: 'சஞ்சயன்', Dhritarashtra: 'திருதராஷ்டிரன்' },
  marathi: { Krishna: 'श्री कृष्ण', Arjuna: 'अर्जुन', Sanjaya: 'संजय', Dhritarashtra: 'धृतराष्ट्र' },
  kannada: { Krishna: 'ಶ್ರೀ ಕೃಷ್ಣ', Arjuna: 'ಅರ್ಜುನ', Sanjaya: 'ಸಂಜಯ', Dhritarashtra: 'ಧೃತರಾಷ್ಟ್ರ' },
  bengali: { Krishna: 'শ্রী কৃষ্ণ', Arjuna: 'অর্জুন', Sanjaya: 'সঞ্জয়', Dhritarashtra: 'ধৃতরাষ্ট্র' },
  gujarati: { Krishna: 'શ્રી કૃષ્ણ', Arjuna: 'અર્જુન', Sanjaya: 'સંજય', Dhritarashtra: 'ધૃતરાષ્ટ્ર' },
  malayalam: { Krishna: 'ശ്രീ കൃഷ്ണൻ', Arjuna: 'അർജ്ജുനൻ', Sanjaya: 'സഞ്ജയൻ', Dhritarashtra: 'ധൃതരാഷ്ട്രർ' },
  punjabi: { Krishna: 'ਸ਼੍ਰੀ ਕ੍ਰਿਸ਼ਨ', Arjuna: 'ਅਰਜੁਨ', Sanjaya: 'ਸੰਜੈ', Dhritarashtra: 'ਧ੍ਰਿਤਰਾਸ਼ਟਰ' },
  sanskrit: { Krishna: 'श्रीकृष्णः', Arjuna: 'अर्जुनः', Sanjaya: 'संजयः', Dhritarashtra: 'धृतराष्ट्रः' },
};

export function SpeakersSection({ onSelectSpeaker }: SpeakersSectionProps) {
  const { t, currentLanguage } = useLanguage();

  const getSpeakerName = (name: string) => {
    return speakerNames[currentLanguage]?.[name] || name;
  };

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold divine-text mb-2">
          {t('speakersOfGita')}
        </h2>
        <p className="text-muted-foreground">
          700 {t('slokas')} {t('spokenBy')} 4 {t('speakers').toLowerCase()}
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
                  alt={getSpeakerName(speaker.name)}
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
                      {getSpeakerName(speaker.name)}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t(speaker.roleKey)}</p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${speaker.color} text-white`}>
                    {speaker.slokaCount} {t('slokas')}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {t(speaker.descriptionKey)}
                </p>

                <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('viewAllSlokas')} {getSpeakerName(speaker.name)}
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
          <span>{getSpeakerName('Krishna')} (82%)</span>
          <span>{getSpeakerName('Arjuna')} (12%)</span>
          <span>{getSpeakerName('Sanjaya')} (5.9%)</span>
          <span>{getSpeakerName('Dhritarashtra')} (0.1%)</span>
        </div>
      </div>
    </section>
  );
}
