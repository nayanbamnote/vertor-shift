import { useState, useRef, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import type { Variable } from '../lib/variableUtils';
import { parseVariables, validateVariables, getVariableSuggestions, getVariableTypeColor, getVariableTypeIcon } from '../lib/variableUtils';

interface VariableInputProps {
  value: string;
  onChange: (value: string) => void;
  availableVariables: Variable[];
  placeholder?: string;
  className?: string;
}

export function VariableInput({ 
  value, 
  onChange, 
  availableVariables, 
  placeholder = "Enter text with {{variables}}...",
  className = ""
}: VariableInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentVariableInput, setCurrentVariableInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Parse and validate variables in the current text
  const variableMatches = validateVariables(
    parseVariables(value),
    availableVariables
  );

  // Get suggestions based on current input
  const suggestions = getVariableSuggestions(currentVariableInput, availableVariables);

  // Handle input change
  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    // Check if we're typing inside {{ }}
    const beforeCursor = newValue.slice(0, cursorPosition);
    const afterCursor = newValue.slice(cursorPosition);
    
    // Find if cursor is inside a variable
    const openBrace = beforeCursor.lastIndexOf('{{');
    const closeBrace = beforeCursor.lastIndexOf('}}');
    const nextCloseBrace = afterCursor.indexOf('}}');
    
    if (openBrace > closeBrace && nextCloseBrace !== -1) {
      // We're inside a variable
      const variableStart = openBrace + 2;
      const variableText = beforeCursor.slice(variableStart);
      setCurrentVariableInput(variableText);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setCurrentVariableInput('');
    }
  };

  // Handle cursor position change
  const handleCursorChange = () => {
    if (inputRef.current) {
      setCursorPosition(inputRef.current.selectionStart || 0);
    }
  };

  // Insert variable suggestion
  const insertVariable = (variable: Variable) => {
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    
    const openBrace = beforeCursor.lastIndexOf('{{');
    const nextCloseBrace = afterCursor.indexOf('}}');
    
    if (openBrace !== -1) {
      const before = value.slice(0, openBrace);
      const after = nextCloseBrace !== -1 ? value.slice(cursorPosition + nextCloseBrace + 2) : afterCursor;
      const newValue = `${before}{{${variable.name}}}${after}`;
      onChange(newValue);
      setShowSuggestions(false);
      
      // Focus back to input
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = before.length + variable.name.length + 4;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        // Handle arrow navigation in suggestions
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertVariable(suggestions[0]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={handleCursorChange}
          onClick={handleCursorChange}
          placeholder={placeholder}
          className={`w-full text-sm min-h-8 max-w-96 max-h-32 font-mono resize-none ${className}`}
        />
        
        {/* Variable highlights overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="relative h-full flex items-start px-3 py-2 text-sm font-mono whitespace-pre-wrap">
            {value.split('').map((char, index) => {
              const match = variableMatches.find(m => index >= m.start && index < m.end);
              if (match) {
                return (
                  <span
                    key={index}
                    className={`${match.isValid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'} ${
                      index === match.start ? 'rounded-l' : ''
                    } ${index === match.end - 1 ? 'rounded-r' : ''}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              }
              return <span key={index} className="text-transparent">{char === ' ' ? '\u00A0' : char}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((variable) => (
            <button
              key={variable.name}
              onClick={() => insertVariable(variable)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{variable.name}</span>
                <span className="text-xs text-gray-500">= {variable.value}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-1 py-0.5 rounded ${getVariableTypeColor(variable.type)}`}>
                  {getVariableTypeIcon(variable.type)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Variable validation feedback */}
      {variableMatches.length > 0 && (
        <div className="mt-1 text-xs">
          {variableMatches.map((match, index) => (
            <div
              key={index}
              className={`inline-flex items-center gap-1 mr-2 px-1 py-0.5 rounded ${
                match.isValid ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
              }`}
            >
              <span className="font-mono">{match.variable}</span>
              {!match.isValid && <span>❌</span>}
              {match.isValid && <span>✅</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
