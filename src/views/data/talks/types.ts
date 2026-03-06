export interface Talk {
  sessions: Session[]
}

export interface Session {
  id: string
  name: string
  talks: string[]
}
