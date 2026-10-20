export const SITE = {
  name: 'QuizSlip',
  dataSource: { name: 'Open Trivia DB', url: 'https://opentdb.com' },
} as const;

export interface Profile {
  name: string;
  role: string;
  bio: string;
  links: {
    github: string;
    linkedin: string;
    x: string;
    website: string;
  };
}

/**
 * Fill this in with your own details. Anything left empty is hidden from the
 * footer and the About page, so nothing placeholder ever shows up.
 */
export const PROFILE: Profile = {
  name: '',
  role: '',
  bio: '',
  links: {
    github: '',
    linkedin: '',
    x: '',
    website: '',
  },
};
