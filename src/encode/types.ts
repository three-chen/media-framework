import type { ExecException } from 'child_process'

export interface LogEvent {
  type: string
  message: string
}

export type LogEventCallback = (event: LogEvent) => void

export type ExecCallback = (error: ExecException | null, stdout: string, stderr: string) => void

export enum EncodeProtocolEnum {
  RTMP = 'RTMP',
  // HTTPFLV = 'HTTPFLV',
  // HLS = 'HLS',
  WEBRTC = 'WEBRTC',
  SRT = 'SRT'
}
export type EncodeProtocol = keyof typeof EncodeProtocolEnum | '' // other protocol types

export type EncoderOptions = {
  // decoder specific options
  room: string
  protocol: EncodeProtocol
}
