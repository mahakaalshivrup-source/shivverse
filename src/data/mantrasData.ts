export interface Mantra { id: number; title: string; subtitle: string; audio: string; thumbnail: string; captionFile: string; caption_en?: string; caption_hi?: string; image_url?: string; audio_url?: string; lyrics?: string[]; lyricsEn?: string[]; audioSrc?: string; }

const mantrasData: Mantra[] = [];

export default mantrasData;
