type MusicArtist = IndividualMusicArtist | GroupMusicArtist;

interface IndividualMusicArtist extends MusicArtistBase<"individual"> {
  // artistPerson: personal details of the artist
  artistPerson: MusicArtistPerson;
}

interface GroupMusicArtist extends MusicArtistBase<"group"> {
  // artistMembers: personal details of the group members
  artistMembers: Array<MusicArtistPerson>;
}

interface MusicArtistBase<ArtistType extends string> {
  artistType: ArtistType;
  // artistName: the artist's name
  artistName: string;
  // artistStartDate: the earliest year the artist began working in the music industry
  artistStartDate: number;
}

interface MusicArtistPerson {
  // personFullName: full legal name of person
  personFullName: string;
  // personBirthDate: year the person was born
  personBirthDate: number;
  // personBirthPlace: the most precise location where the person was born
  personBirthPlace: LocationTuple;
  // personAliases: a complete and exhaustive list with zero omissions of aliases the person / artist goes by
  personAliases: Array<string>;
  // personMusicActs: a complete and exhaustive list with zero omissions of music acts the person is a part of
  personMusicActs: Array<string>;
}

type LocationTuple = [country: string, state: string, city: string];
