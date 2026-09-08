export const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const cleanName = name.trim();
  
  if (cleanName.length === 0) {
    return '';
  }

  const words = cleanName.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return '';
  }

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  
  const firstInitial = words[0][0];
  const lastInitial = words[words.length - 1][0];
  
  return (firstInitial + lastInitial).toUpperCase();
};