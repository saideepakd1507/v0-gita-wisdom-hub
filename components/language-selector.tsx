'use client';

import { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useLanguage, LANGUAGES, type LanguageCode } from '@/lib/language-context';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { currentLanguage, setCurrentLanguage, t, getCurrentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLang = getCurrentLanguage();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="rounded-full divine-border gap-2"
        >
          <Globe className={compact ? "w-3 h-3" : "w-4 h-4"} />
          {compact ? (
            <span className="font-medium">{currentLang.flag}</span>
          ) : (
            <>
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
              <span className="sm:hidden">{currentLang.flag}</span>
            </>
          )}
          <ChevronDown className={`${compact ? "w-3 h-3" : "w-4 h-4"} opacity-50`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 divine-card border-border/50"
      >
        <DropdownMenuLabel className="text-muted-foreground">
          {t('selectLanguage')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setCurrentLanguage(lang.code);
                setOpen(false);
              }}
              className="flex items-center justify-between cursor-pointer hover:bg-primary/10"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-6">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                </div>
              </div>
              <AnimatePresence>
                {currentLanguage === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
