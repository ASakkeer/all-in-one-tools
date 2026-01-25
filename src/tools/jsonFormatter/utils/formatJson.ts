// Utility function to safely parse and format JSON
export const formatJson = (input: string): string => {
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Invalid JSON")
  }
}
