// Utility functions for JSON transformations

export const minifyJson = (input: string): string => {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Invalid JSON")
  }
}

export const sortJsonKeys = (input: string, ascending: boolean = true): string => {
  try {
    const parsed = JSON.parse(input)
    
    const sortObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => typeof item === "object" && item !== null ? sortObject(item) : item)
      }
      
      if (typeof obj !== "object" || obj === null) {
        return obj
      }
      
      const sortedKeys = Object.keys(obj).sort((a, b) => {
        return ascending ? a.localeCompare(b) : b.localeCompare(a)
      })
      
      const sortedObj: any = {}
      for (const key of sortedKeys) {
        sortedObj[key] = typeof obj[key] === "object" && obj[key] !== null
          ? sortObject(obj[key])
          : obj[key]
      }
      
      return sortedObj
    }
    
    const sorted = sortObject(parsed)
    return JSON.stringify(sorted, null, 2)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Invalid JSON")
  }
}

export const removeNullAndEmpty = (input: string): string => {
  try {
    const parsed = JSON.parse(input)
    
    const cleanObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj
          .map(item => typeof item === "object" && item !== null ? cleanObject(item) : item)
          .filter(item => item !== null && item !== "")
      }
      
      if (typeof obj !== "object" || obj === null) {
        return obj
      }
      
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === "") {
          continue
        }
        if (typeof value === "object") {
          const cleanedValue = cleanObject(value)
          if (cleanedValue !== null && cleanedValue !== "") {
            cleaned[key] = cleanedValue
          }
        } else {
          cleaned[key] = value
        }
      }
      
      return cleaned
    }
    
    const cleaned = cleanObject(parsed)
    return JSON.stringify(cleaned, null, 2)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Invalid JSON")
  }
}

export const jsonToPlainText = (input: string): string => {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Invalid JSON")
  }
}

export const plainTextToJson = (input: string): string => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, 2)
  } catch {
    // If not valid JSON, treat as plain text and create a JSON string
    try {
      return JSON.stringify(input, null, 2)
    } catch (error) {
      throw new Error("Could not convert plain text to JSON")
    }
  }
}

export const validateJson = (input: string): { valid: boolean; message: string } => {
  if (!input.trim()) {
    return { valid: false, message: "Input is empty" }
  }
  
  try {
    JSON.parse(input)
    return { valid: true, message: "Valid JSON" }
  } catch (error) {
    if (error instanceof Error) {
      return { valid: false, message: `Invalid JSON: ${error.message}` }
    }
    return { valid: false, message: "Invalid JSON format" }
  }
}

export const getJsonSize = (json: string): { characters: number; bytes: number } => {
  const characters = json.length
  const bytes = new Blob([json]).size
  return { characters, bytes }
}
