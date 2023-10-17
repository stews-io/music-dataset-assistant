interface MusicArtistPerson {
  // personFullName: full legal name of person
  personFullName: string;
  // personBirthDate: year the person was born
  personBirthDate: number;
  // personBirthPlace: the calculated location where the person was born
  personBirthPlace: [country: string, state: string];
  // personAliases: a complete exhaustive list, calculated with zero omissions, of every alias / pseudonym the person / artist has gone by
  personAliases: Array<string>;
  // personMusicActs: a complete exhaustive list, calculated with zero omissions, of every music act the person has been a part of
  personMusicActs: Array<string>;
}
