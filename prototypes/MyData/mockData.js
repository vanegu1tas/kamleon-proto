export const CURRENT_USER = {
  initials: 'DA',
};

export const URINE_COLORS = [
  null,
  '#FEFACC',
  '#FCF28A',
  '#F5E330',
  '#F0C015',
  '#E09208',
  '#B86A05',
  '#8B4504',
  '#5C2803',
];

export const LAST_SAMPLE = {
  date:         'May 14',
  time:         '9:23 am',
  score:        78,
  status:       'Hydrated',
  electrolytes: '4.2 mS/cm',
  volume:       '180 mL',
  colorLevel:   3,
};

export const THIS_WEEK = {
  streak:       4,
  hydratedDays: 5,
  totalDays:    7,
  days: [
    { day: 'Mon', score: 78,   sampled: true },
    { day: 'Tue', score: 65,   sampled: true },
    { day: 'Wed', score: 81,   sampled: true },
    { day: 'Thu', score: 72,   sampled: true },
    { day: 'Fri', score: null, sampled: false },
    { day: 'Sat', score: 58,   sampled: true },
    { day: 'Sun', score: null, sampled: false },
  ],
};

export const DISTRIBUTION = {
  hydrated:   52,
  dehydrated: 32,
  over:       12,
  severe:      4,
};

export const SAMPLES = [
  { id: 1, date: 'May 14, 9am',  electrolytes: '4.2 mS/cm', volume: '180 mL', colorLevel: 3, score: 78 },
  { id: 2, date: 'May 13, 2pm',  electrolytes: '5.1 mS/cm', volume: '150 mL', colorLevel: 4, score: 65 },
  { id: 3, date: 'May 12, 8am',  electrolytes: '3.8 mS/cm', volume: '210 mL', colorLevel: 2, score: 81 },
  { id: 4, date: 'May 11, 11am', electrolytes: '4.7 mS/cm', volume: '165 mL', colorLevel: 3, score: 72 },
  { id: 5, date: 'May 9, 7am',   electrolytes: '4.1 mS/cm', volume: '175 mL', colorLevel: 3, score: 70 },
];
