export interface LogEvent {
  type: string
  message: string
}

export type LogEventCallback = (event: LogEvent) => void
