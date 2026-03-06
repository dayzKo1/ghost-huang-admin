export interface Chronicle {
  title: string
  year: string
  content: ChronicleContentSection[]
}

export interface ChronicleContentSection {
  type: string
  title: string
  titleAlign: string
  titleMargin: string
  backgroundImage: string
  index: number
  eventImage: string
  songImage: string
}
