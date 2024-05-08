import { DecoderHls } from 'media-hls'
import { DecoderHttpflv } from 'media-httpflv'
import { DecoderWebrtc } from 'media-webrtc'
import type { DecodeProtocol, DecoderOptions, DecoderType } from './types'
import { DecodeProtocolEnum } from './types'

export class Decoder {
  public static room: string = ''
  public static videoElement: HTMLVideoElement | undefined = undefined
  public static audioElement: HTMLAudioElement | undefined = undefined
  // 根据协议，动态切换 decoder
  public static protocol: DecodeProtocol = DecodeProtocolEnum.WEBRTC
  public static decoder: DecoderType | null = null
  public static httpFlvDecoder: DecoderHttpflv | null = null
  public static hlsDecoder: DecoderHls | null = null

  public static async getSupportedProtocols(): Promise<DecodeProtocol[]> {
    return new Promise(resolve => {
      const protocols: DecodeProtocol[] = []
      if (DecoderHls.isSupported()) protocols.push(DecodeProtocolEnum.HLS)
      if (DecoderHttpflv.isSupported()) protocols.push(DecodeProtocolEnum.HTTPFLV)
      if (DecoderWebrtc.isSupported()) protocols.push(DecodeProtocolEnum.WEBRTC)
      resolve(protocols)
    })
  }

  public static init(options: DecoderOptions) {
    Decoder.room = options.room
    Decoder.videoElement = options.videoElement
    Decoder.audioElement = options.audioElement
    Decoder.protocol = options.protocol
    console.log('Decode protocol: ', Decoder.protocol)
    switch (Decoder.protocol) {
      case DecodeProtocolEnum.HTTPFLV:
        // if (Decoder.httpFlvDecoder === null) {
        //   Decoder.httpFlvDecoder = new DecoderHttpflv(Decoder.room, Decoder.videoElement)
        // }
        Decoder.decoder = new DecoderHttpflv(Decoder.room, Decoder.videoElement)
        break
      case DecodeProtocolEnum.HLS:
        // if (Decoder.hlsDecoder === null) {
        //   Decoder.hlsDecoder = new DecoderHls(Decoder.room, Decoder.videoElement)
        // }
        Decoder.decoder = new DecoderHls(Decoder.room, Decoder.videoElement)
        break
      case DecodeProtocolEnum.WEBRTC:
        Decoder.decoder = new DecoderWebrtc(Decoder.room, Decoder.videoElement)
        break
      default:
        console.log('unknown protocol: ', Decoder.protocol)
        break
    }
  }

  public static destroy() {
    Decoder.decoder?.destroy()
  }
}
