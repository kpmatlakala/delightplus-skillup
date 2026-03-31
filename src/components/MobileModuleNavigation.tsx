import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavigationSection {
  id: string;
  title: string;
  type: 'intro' | 'session' | 'quiz' | 'assessment';
  isCompleted: boolean;
  isAccessible: boolean;
  order: number;
  sessionIndex?: number;
}

interface MobileModuleNavigationProps {
  sections: NavigationSection[];
  currentSection: string;
  onSectionSelect: (sectionId: string, sessionIndex?: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const getSectionIcon = (type: NavigationSection['type']) => {
  switch (type) {
    case 'intro':
      return <BookOpen size={16} />;
    case 'session':
      return <BookOpen size={16} />;
    case 'quiz':
      return <HelpCircle size={16} />;
    case 'assessment':
      return <FileText size={16} />;
    default:
      return <BookOpen size={16} />;
  }
};

const getSectionColor = (type: NavigationSection['type'], isCompleted: boolean, isCurrent: boolean) => {
  if (isCurrent) {
    return 'bg-primary/10 text-primary border-primary/20';
  }
  
  if (isCompleted) {
    return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
  }
  
  return 'bg-background text-muted-foreground border-border hover:bg-secondary/50';
};

export const MobileModuleNavigation: React.FC<MobileModuleNavigationProps> = ({
  sections,
  currentSection,
  onSectionSelect,
  isOpen,
  onToggle,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Group sessions together
  const groupedSections = sections.reduce((acc, section) => {
    if (section.type === 'session') {
      if (!acc.sessions) {
        acc.sessions = [];
      }
      acc.sessions.push(section);
    } else {
      acc[section.type] = section;
    }
    return acc;
  }, {} as Record<string, NavigationSection | NavigationSection[]>);

  return (
    <div className={`${className}`}>
      {/* Mobile Navigation Toggle */}
      <button
        onClick={onToggle}
        className="md:hidden w-full flex items-center justify-between p-3 bg-background border border-border rounded-lg mb-4"
        aria-label="Toggle navigation menu"
      >
        <span className="text-sm font-medium">Module Navigation</span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Navigation Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block space-y-2`}>
        {/* Module Introduction */}
        {groupedSections.intro && (
          <button
            onClick={() => onSectionSelect('intro')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${getSectionColor('intro', groupedSections.intro.isCompleted, currentSection === 'intro')}`}
            style={{ minHeight: '44px' }} // Touch-friendly minimum size
          >
            {getSectionIcon('intro')}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Module Introduction</div>
              <div className="text-xs opacity-75">Overview and objectives</div>
            </div>
            {groupedSections.intro.isCompleted && (
              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            )}
          </button>
        )}

        {/* Learning Sessions */}
        {groupedSections.sessions && Array.isArray(groupedSections.sessions) && (
          <div className="space-y-1">
            <button
              onClick={() => toggleSection('sessions')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border bg-background text-muted-foreground border-border hover:bg-secondary/50 transition-colors text-left"
              style={{ minHeight: '44px' }}
            >
              <BookOpen size={16} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Learning Sessions</div>
                <div className="text-xs opacity-75">
                  {groupedSections.sessions.filter(s => s.isCompleted).length} of {groupedSections.sessions.length} completed
                </div>
              </div>
              <ChevronRight 
                size={16} 
                className={`transform transition-transform ${expandedSections.has('sessions') ? 'rotate-90' : ''}`} 
              />
            </button>

            {/* Individual Sessions */}
            {expandedSections.has('sessions') && (
              <div className="ml-4 space-y-1">
                {groupedSections.sessions.map((session, index) => (
                  <button
                    key={session.id}
                    onClick={() => onSectionSelect('session', session.sessionIndex ?? index)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors text-left ${getSectionColor('session', session.isCompleted, currentSection === 'session' && session.sessionIndex === index)}`}
                    style={{ minHeight: '44px' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{session.title}</div>
                    </div>
                    {session.isCompleted && (
                      <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
        {groupedSections.quiz && (
          <button
            onClick={() => onSectionSelect('quiz')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${getSectionColor('quiz', groupedSections.quiz.isCompleted, currentSection === 'quiz')}`}
            style={{ minHeight: '44px' }}
          >
            {getSectionIcon('quiz')}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Knowledge Quiz</div>
              <div className="text-xs opacity-75">Test your understanding</div>
            </div>
            {groupedSections.quiz.isCompleted && (
              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            )}
          </button>
        )}

        {/* Assessment */}
        {groupedSections.assessment && (
          <button
            onClick={() => onSectionSelect('assessment')}
            disabled={!groupedSections.assessment.isAccessible}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
              !groupedSections.assessment.isAccessible 
                ? 'bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed'
                : getSectionColor('assessment', groupedSections.assessment.isCompleted, currentSection === 'assessment')
            }`}
            style={{ minHeight: '44px' }}
          >
            {getSectionIcon('assessment')}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Final Assessment</div>
              <div className="text-xs opacity-75">
                {groupedSections.assessment.isAccessible ? 'Submit your work' : 'Complete quiz to unlock'}
              </div>
            </div>
            {!groupedSections.assessment.isAccessible && (
              <Badge variant="secondary" className="text-xs">Locked</Badge>
            )}
            {groupedSections.assessment.isCompleted && (
              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};