export interface SocialAccounts {
  artist: Artist
}

export interface Artist {
  name: string
  accounts: Platform[]
}

export interface Platform {
  platform: string
  platformName: string
  accountsList: Account[]
}

export interface Account {
  name: string
  title: string
  avatar: string
  link: string
}
