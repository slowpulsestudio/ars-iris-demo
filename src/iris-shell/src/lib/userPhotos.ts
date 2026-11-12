import { hash } from './sampleData.js';

/** Portraits in public/avatars/people/ (randomuser.me, free to use), by the look of the person. */
const MEN = [32, 46, 11, 52, 75, 86, 22, 61];
const WOMEN = [12, 44, 65, 33, 68, 90, 25, 51];

const MEN_NAMES = new Set([
  'Liam', 'Noah', 'Mason', 'Ethan', 'Lucas', 'Aiden', 'Elijah', 'Benjamin', 'James', 'Henry', 'Alexander',
  'Sebastian', 'Jack', 'Owen', 'Daniel', 'Matthew', 'Joseph', 'Samuel', 'David', 'Wyatt', 'Julian', 'Leo',
  'Gabriel', 'Anthony', 'Dylan', 'Lincoln', 'Isaac', 'Hudson', 'Ezra', 'Nathan', 'Adrian', 'Christian',
  'Colton', 'Elias', 'Aaron', 'Eli', 'Landon', 'Jonathan', 'Nolan', 'Cameron', 'Connor', 'Jeremiah',
  'Easton', 'Miles', 'Robert', 'Greyson', 'Peter', 'Oliver', 'Aron', 'Markus', 'Carter',
]);
const WOMEN_NAMES = new Set([
  'Isabella', 'Sophia', 'Olivia', 'Ava', 'Mia', 'Harper', 'Amelia', 'Charlotte', 'Evelyn', 'Abigail', 'Emily',
  'Elizabeth', 'Sofia', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Aria', 'Lily', 'Zoe', 'Nora', 'Hazel',
  'Layla', 'Aurora', 'Savannah', 'Bella', 'Claire', 'Lucy', 'Anna', 'Caroline', 'Emilia', 'Maya', 'Willow',
  'Naomi', 'Elena', 'Clara', 'Nadia', 'Natalie',
]);

/** Share of people (in tenths) who have a photo; the rest keep their initials, as real directories do. */
const PHOTO_TENTHS = 6;

/** A face for this person, or undefined when they keep initials. The same name always gets the same answer. */
export function photoFor(name: string): string | undefined {
  const first = name.trim().split(/\s+/)[0] ?? '';
  const pool = MEN_NAMES.has(first) ? ['men', MEN] : WOMEN_NAMES.has(first) ? ['women', WOMEN] : null;
  if (!pool) return undefined;
  const h = hash(name);
  if (h % 10 >= PHOTO_TENTHS) return undefined;
  const [folder, ids] = pool as [string, number[]];
  return `/avatars/people/${folder}-${ids[hash(`${name}:face`) % ids.length]}.jpg`;
}
