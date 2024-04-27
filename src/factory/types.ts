import type { ExecException } from 'child_process'

export interface LogEvent {
  type: string
  message: string
}

export type LogEventCallback = (event: LogEvent) => void

export type ExecCallback = (error: ExecException | null, stdout: string, stderr: string) => void
