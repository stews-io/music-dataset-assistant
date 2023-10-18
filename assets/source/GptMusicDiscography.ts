interface GptDiscographyAlbums {
  // the complete list, with zero omissions, of every album title in the artist's discography
  discographyAlbums: Array<AlbumTitle>;
}

type AlbumTitle = string;

interface GptDiscographyMixtapes {
  // the complete list, with zero omissions, of every mixtape title in the artist's discography
  discographyMixtapes: Array<string>;
}

interface GptDiscographyEps {
  // the complete list, with zero omissions, of every ep title in the artist's discography
  discographyEps: Array<string>;
}

interface GptDiscographySingles {
  // the complete list, with zero omissions, of every single title in the artist's discography
  discographySingles: Array<string>;
}
