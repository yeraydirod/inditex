interface Label {
  label: string;
}

export interface ItunesTopPodcastEntryDto {
  'im:name': Label;
  'im:image': (Label & { attributes: { height: string } })[];
  'im:artist': Label;
  summary?: Label;
  id: Label & { attributes: { 'im:id': string } };
}

export interface ItunesTopPodcastsDto {
  feed: {
    entry?: ItunesTopPodcastEntryDto[];
  };
}
