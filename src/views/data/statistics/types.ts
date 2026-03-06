export interface Statistic {
  title: string
  content: StatisticContentSection[]
}

export interface StatisticContentSection {
  type: string
  title: string
  titleAlign: string
  titleMargin: string
  backgroundImage: string
  index: number
  subtitle: string
}
