import React from 'react';
import { VextronicLogo, GenerateIcon, ExplainIcon } from './icons';

interface PromptSuggestionsProps {
    onSuggestionClick: (prompt: string) => void;
    translations: any;
}

const SuggestionCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full md:w-60 h-28 text-left p-4 bg-[var(--ai-bubble-bg)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--accent)]/10 transition-colors flex flex-col justify-between"
    >
        <div>
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
    </button>
);


const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSuggestionClick, translations }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center pt-16">
            <VextronicLogo />
            <h1 className="text-4xl font-bold mt-4 mb-8 text-[var(--text-primary)]">{translations.title}</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <SuggestionCard 
                    icon={<GenerateIcon className="w-5 h-5 text-[var(--accent)]" />}
                    title={translations.card1.title}
                    description={translations.card1.description}
                    onClick={() => onSuggestionClick(translations.card1.prompt)}
                />
                 <SuggestionCard 
                    icon={<ExplainIcon className="w-5 h-5 text-[var(--accent)]" />}
                    title={translations.card2.title}
                    description={translations.card2.description}
                    onClick={() => onSuggestionClick(translations.card2.prompt)}
                />
            </div>
        </div>
    );
};

export default PromptSuggestions;
