export function capitalize(alertType: string) {
  const words = alertType.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    result.push(word[0].toUpperCase() + word.slice(1));
  }
  return result.join(" ");
}
