export function parseLog (txt) {
  const segments = txt.split('\n\n')
  return {
    trips: segments[0].trim(),
    statics: segments[1].trim()
  }
}
