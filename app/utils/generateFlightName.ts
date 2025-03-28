const generateFlightName = (): string => {
  const concepts = [
    'Happy',
    'Energetic',
    'Calm',
    'Excited',
    'Joyful',
    'Confident',
    'Relaxed',
    'Peaceful',
    'Adventurous',
    'Euphoric',
    'Playful',
    'Exhilarating',
    'Daring',
    'Courageous',
    'Fearless',
    'Independent',
    'Curious',
    'Optimistic',
    'Determined',
    'Ambitious',
    'Resourceful',
    'Light',
    'Vigorous',
    'Smooth',
    'Fast',
    'Fresh',
    'Chilly',
    'Quick',
    'Brisk',
    'Speedy',
    'Dynamic',
  ];

  const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];

  return `${randomConcept} flight`;
};

export default generateFlightName;
