export interface Cheer {
  title: string
  content: CheerContentSection[]
}

export interface CheerContentSection {
  type: string
  title: string
  titleAlign: string
  titleMargin: string
  backgroundImage: string
  index: number
  subtitle: string
  items: CheerItem[]
}

export interface CheerItem {
  songName: string
  align: string
  link: string
  videoPath: string
  lyric: string
}
