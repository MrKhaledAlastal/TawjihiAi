import React from 'react';
import { Branch } from '../types';
import { BRANCHES } from '../constants';
import { VextronicLogo } from './icons';

interface BranchSelectorProps {
  onSelectBranch: (branch: Branch) => void;
  translations: any;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ onSelectBranch, translations }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="text-center">
        <VextronicLogo className="mb-6 justify-center" />
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">
          {translations.title}
        </h1>
        <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
          {translations.subtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {BRANCHES.map((branch) => (
            <button
              key={branch.id}
              onClick={() => onSelectBranch(branch)}
              className="flex flex-col items-start justify-between p-6 bg-[var(--ai-bubble-bg)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--accent)]/20 hover:border-[var(--accent)] transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-right"
            >
              <div className="w-full">
                <span className="font-bold text-lg text-[var(--text-primary)] mb-2 block">{branch.name}</span>
                <span className="text-sm text-[var(--text-secondary)]">{branch.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;