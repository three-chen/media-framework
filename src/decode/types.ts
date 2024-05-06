import { DecoderHls } from 'media-hls'
import { DecoderHttpflv } from 'media-httpflv'
import { DecoderWebrtc } from 'media-webrtc'

export type DecoderType = DecoderHttpflv | DecoderHls | DecoderWebrtc // other decoder types

export enum DecodeProtocolEnum {
  HTTPFLV = 'HTTPFLV',
  HLS = 'HLS',
  WEBRTC = 'WEBRTC'
}

export type DecodeProtocol = keyof typeof DecodeProtocolEnum // other protocol types

export type DecoderOptions = {
  // decoder specific options
  room: string
  protocol: DecodeProtocol
  videoElement?: HTMLVideoElement
  audioElement?: HTMLAudioElement
}
