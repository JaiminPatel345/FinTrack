import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useDebounce } from '@hooks/useDebounce';

interface Option {
  value: string;
  label: string;
  meta?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    opt.meta?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-error' : 'border-neutral-300'
          } ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'hover:border-primary-400'}`}
        >
          <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`absolute right-3 top-3 w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-soft max-h-64 overflow-hidden"
            >
              <div className="p-2 border-b border-neutral-200">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-48">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-neutral-500 text-center">No results found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-primary-50 flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{option.label}</div>
                        {option.meta && <div className="text-xs text-neutral-500">{option.meta}</div>}
                      </div>
                      {option.value === value && <Check className="w-4 h-4 text-primary-500" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
};
