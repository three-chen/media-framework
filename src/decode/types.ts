import { DecoderHls } from 'media-hls'
import { DecoderHttpflv } from 'media-httpflv'

export type DecoderType = DecoderHttpflv | DecoderHls // other decoder types

export enum DecodeProtocolEnum {
  HTTPFLV = 'HTTPFLV',
  HLS = 'HLS'
}

export type DecodeProtocol = keyof typeof DecodeProtocolEnum | '' // other protocol types

export type DecoderOptions = {
  // decoder specific options
  room: string
  protocol: DecodeProtocol
  videoElement?: HTMLVideoElement
  audioElement?: HTMLAudioElement
}
