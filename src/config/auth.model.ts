export interface Auth {
  discord: {
    botUserToken: string
  },
  postgres: {
    connectionString: string
  }
}