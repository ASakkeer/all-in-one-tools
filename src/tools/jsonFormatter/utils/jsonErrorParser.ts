// JSON Error Parser - Extracts line and column from JSON parse errors
export interface JsonErrorInfo {
  line: number
  column: number
  message: string
}

export const parseJsonError = (error: Error, input: string): JsonErrorInfo | null => {
  const errorMessage = error.message

  // Try to extract line and column from error message
  // Common patterns:
  // "Unexpected token X in JSON at position Y"
  // "Expected property name or '}' in JSON at position Y"
  // "Unexpected end of JSON input"
  
  const positionMatch = errorMessage.match(/at position (\d+)/i)
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10)
    const lines = input.substring(0, position).split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    
    return {
      line,
      column,
      message: errorMessage,
    }
  }

  // Fallback: try to find line number in other error formats
  const lineMatch = errorMessage.match(/line (\d+)/i)
  if (lineMatch) {
    const line = parseInt(lineMatch[1], 10)
    const columnMatch = errorMessage.match(/column (\d+)/i)
    const column = columnMatch ? parseInt(columnMatch[1], 10) : 1
    
    return {
      line,
      column,
      message: errorMessage,
    }
  }

  // If we can't parse the error, return null
  return null
}
