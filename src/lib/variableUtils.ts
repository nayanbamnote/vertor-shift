export interface Variable {
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean';
  nodeId: string;
}

export interface VariableMatch {
  variable: string;
  start: number;
  end: number;
  isValid: boolean;
}

/**
 * Parse text to find variable references in {{variable}} format
 */
export function parseVariables(text: string): VariableMatch[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches: VariableMatch[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      variable: match[1].trim(),
      start: match.index,
      end: match.index + match[0].length,
      isValid: true, // Will be validated against available variables
    });
  }

  return matches;
}

/**
 * Validate variables against available variables from input nodes
 */
export function validateVariables(
  matches: VariableMatch[], 
  availableVariables: Variable[]
): VariableMatch[] {
  const variableNames = new Set(availableVariables.map(v => v.name));
  
  return matches.map(match => ({
    ...match,
    isValid: variableNames.has(match.variable)
  }));
}

/**
 * Substitute variables in text with their actual values
 */
export function substituteVariables(text: string, variables: Variable[]): string {
  const variableMap = new Map(variables.map(v => [v.name, v.value]));
  
  return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim();
    return variableMap.has(trimmedName) ? variableMap.get(trimmedName)! : match;
  });
}

/**
 * Get variable suggestions based on partial input
 */
export function getVariableSuggestions(
  input: string, 
  availableVariables: Variable[]
): Variable[] {
  const query = input.toLowerCase();
  return availableVariables.filter(variable => 
    variable.name.toLowerCase().includes(query)
  );
}

/**
 * Get type color for variable display
 */
export function getVariableTypeColor(type: string): string {
  switch (type) {
    case 'number': return 'text-red-600 bg-red-50 border-red-200';
    case 'boolean': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'text':
    default: return 'text-green-600 bg-green-50 border-green-200';
  }
}

/**
 * Get type icon for variable display
 */
export function getVariableTypeIcon(type: string): string {
  switch (type) {
    case 'number': return '123';
    case 'boolean': return 'T/F';
    case 'text':
    default: return 'Aa';
  }
}
