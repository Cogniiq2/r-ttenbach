/**
 * FACTUAL club information (verified context, September 2026).
 * Sources: tennis-roettenbach.de and the BTV club profile.
 * Do not change without re-verifying against those sources.
 */
export const club = {
  name: 'Tennisclub Röttenbach e.V.',
  shortName: 'TC Röttenbach',
  address: { street: 'Lohmühlweg 11A', zip: '91341', city: 'Röttenbach' },
  website: 'https://tennis-roettenbach.de',
  tennisCourts: 6,
  padel: {
    courts: 1,
    location: 'Sportpark der Gemeinde Röttenbach',
    /** Public times exist for Röttenbach residents; separate times exist for TC members. The actual schedule is NOT known here. */
    publicTimesForResidents: true,
    memberTimes: true,
    highUtilization: true,
    demandForMoreCourtsInvestigated: true,
  },
  members: { total: 269, adults: 199, juniors: 70 },
  board: [
    { name: 'Günter Hess', role: '1. Vorsitzender' },
    { name: 'Tobias Herzog', role: 'Sportwart' },
  ],
  /** Published event from the brief. */
  youthTournament: { title: '42. Röttenbacher Jugendturnier', dates: '18.–20. September 2026' },
} as const

export const fullAddress = `${club.address.street}, ${club.address.zip} ${club.address.city}`
