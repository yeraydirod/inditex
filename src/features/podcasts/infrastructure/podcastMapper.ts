import { Podcast } from '../domain/Podcast';
import type { ItunesTopPodcastEntryDto, ItunesTopPodcastsDto } from './ItunesTopPodcastsDto';

function largestImage(images: ItunesTopPodcastEntryDto['im:image']): string {
  const sorted = [...images].sort(
    (a, b) => Number(b.attributes.height) - Number(a.attributes.height),
  );
  return sorted[0]?.label ?? '';
}

export function toPodcast(entry: ItunesTopPodcastEntryDto): Podcast {
  return new Podcast({
    id: entry.id.attributes['im:id'],
    title: entry['im:name'].label,
    author: entry['im:artist'].label,
    imageUrl: largestImage(entry['im:image']),
    summary: entry.summary?.label ?? '',
  });
}

export function toPodcasts(dto: ItunesTopPodcastsDto): Podcast[] {
  return (dto.feed.entry ?? []).map(toPodcast);
}
