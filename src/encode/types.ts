import type { ExecException } from 'child_process'
import { EncoderHls } from 'media-hls'
import { EncoderHttpflv } from 'media-httpflv'
import { EncoderRtmp } from 'media-rtmp'
import { EncoderSrt } from 'media-srt'
import { EncoderWebrtc } from 'media-webrtc'

export interface LogEvent {
  type: string
  message: string
}

export type LogEventCallback = (event: LogEvent) => void

export type ExecCallback = (error: ExecException | null, stdout: string, stderr: string) => void

export type EncoderType = EncoderRtmp | EncoderHls | EncoderHttpflv | EncoderSrt | EncoderWebrtc // other decoder types

export enum EncodeProtocolEnum {
  RTMP = 'RTMP',
  HTTPFLV = 'HTTPFLV',
  HLS = 'HLS',
  WEBRTC = 'WEBRTC',
  SRT = 'SRT'
}
export type EncodeProtocol = keyof typeof EncodeProtocolEnum | '' // other protocol types

export type EncoderOptions = {
  room: string
  protocol: EncodeProtocol
}
