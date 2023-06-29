// jimi hendrix
// Jimi    hendrix
// Jimi. hendrix
// à => a

module.exports = (name) => {
  if (typeof name !== 'string') return '';

  const handledArray = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(' ');

  const resultArray = [];

  for (const item of handledArray) {
    if (item) resultArray.push(item.charAt(0).toUpperCase() + item.slice(1));
  }

  return resultArray.join(' ');
};
