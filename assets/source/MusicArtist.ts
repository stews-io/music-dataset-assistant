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
  // artistStartDate: when the artist's career began
  artistStartDate: DateTuple;
  // artistRegions: regions the artist is associated with
  artistRegions: Array<LocationTuple>;
  // artistTags: a list of descriptive tags representive of the artist's style (omit words "hip-hop" and "rap" from all entries)
  artistTags: Array<string>;
}

interface MusicArtistPerson {
  // personFullName: full legal name of person
  personFullName: string;
  // personBirthDate: date person was born
  personBirthDate: DateTuple;
  // personBirthPlace: location person was born
  personBirthPlace: LocationTuple;
  // personAliases: other names the person goes by
  personAliases: Array<string>;
  // personMusicArtist: music artist the person is a part of
  personMusicGroups: Array<string>;
}

type DateTuple =
  | [year: number, month: number, day: number]
  | [year: number, month: number];

type LocationTuple = [country: string, state: string, city: string];
