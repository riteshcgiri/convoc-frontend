
export const wordPrettier = (str = '') => str?.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, char => char.toUpperCase());