export interface Related {
  title: string
  content: RelatedContentSection[]
}

export interface RelatedContentSection {
  type: string
  title: string
  titleAlign: string
  titleMargin: string
  backgroundImage: string
  index: number
  subtitle: string
  content: Avatar[]
}

export interface Avatar {
  avatar: string
  name: string
  avatarTitle: string
  link: string
}
