import { DecoderHls } from 'media-hls'
import { DecoderHttpflv } from 'media-httpflv'
import type { DecodeProtocol, DecoderOptions, DecoderType } from './types'
import { DecodeProtocolEnum } from './types'

export class Decoder {
  public static room: string = ''
  public static videoElement: HTMLVideoElement | undefined = undefined
  public static audioElement: HTMLAudioElement | undefined = undefined
  // 根据协议，动态切换 decoder
  public static protocol: DecodeProtocol = ''
  public static decoder: DecoderType | null = null

  public static async getSupportedProtocols(): Promise<DecodeProtocol[]> {
    return new Promise(resolve => {
      const protocols: DecodeProtocol[] = []
      if (DecoderHls.isSupported()) protocols.push(DecodeProtocolEnum.HLS)
      if (DecoderHttpflv.isSupported()) protocols.push(DecodeProtocolEnum.HTTPFLV)
      resolve(protocols)
    })
  }

  public static init(options: DecoderOptions) {
    Decoder.room = options.room
    Decoder.videoElement = options.videoElement
    Decoder.audioElement = options.audioElement
    Decoder.protocol = options.protocol
    switch (Decoder.protocol) {
      case DecodeProtocolEnum.HTTPFLV:
        Decoder.decoder = new DecoderHttpflv(Decoder.room, Decoder.videoElement)
        console.log('protocol: ', Decoder.protocol)
        break
      case DecodeProtocolEnum.HLS:
        Decoder.decoder = new DecoderHls(Decoder.room, Decoder.videoElement)
        console.log('protocol: ', Decoder.protocol)
        break
      default:
        console.log('unknown protocol: ', Decoder.protocol)
        break
    }
  }

  // public static decoderHls = new DecoderHls()
  // public static decoderHttpflv = new DecoderHttpflv(Decoder.url, Decoder.videoElement)
}
