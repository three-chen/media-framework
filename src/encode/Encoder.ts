const { ipcRenderer } = require('electron')

import { EncoderHls } from 'media-hls'
import { EncoderHttpflv } from 'media-httpflv'
import { EncoderRtmp } from 'media-rtmp'
import { EncoderSrt } from 'media-srt'
import { EncoderWebrtc } from 'media-webrtc'
import type { EncodeProtocol, EncoderOptions, EncoderType } from './types'
import { EncodeProtocolEnum } from './types'

export class Encoder {
  public static plat: string = process.platform
  public static room: string = ''
  public static protocol: EncodeProtocol = ''
  public static encoder: EncoderType | null = null

  public static async getSupportedProtocols(cb?: Function): Promise<EncodeProtocol[]> {
    return new Promise(resolve => {
      // 通过回调的方式，json字符串传递回来，执行回调 cb
      // runWithExec 是不是子进程无法结束，用 spawn 代替
      this.runWithExec('ffmpeg -protocols', 'main-ffmpeg-protocols')
      ipcRenderer.on('main-ffmpeg-protocols-response', (event: any, arg: any) => {
        const supports: (keyof typeof EncodeProtocolEnum)[] = JSON.parse(arg)
        if (window.RTCPeerConnection) {
          supports.push(EncodeProtocolEnum.WEBRTC)
        }
        console.log('supports', supports)
        resolve(supports)
      })
    })
  }

  public static init(option: EncoderOptions) {
    Encoder.room = option.room
    Encoder.protocol = option.protocol
    Encoder.initEncoder()
  }

  public static initEncoder() {
    console.log('Encoder protocol', Encoder.protocol)
    switch (Encoder.protocol) {
      case EncodeProtocolEnum.RTMP:
        Encoder.encoder = new EncoderRtmp(Encoder.plat, Encoder.room)
        break
      case EncodeProtocolEnum.HLS:
        Encoder.encoder = new EncoderHls(Encoder.plat, Encoder.room)
        break
      case EncodeProtocolEnum.HTTPFLV:
        Encoder.encoder = new EncoderHttpflv(Encoder.plat, Encoder.room)
        break
      case EncodeProtocolEnum.SRT:
        Encoder.encoder = new EncoderSrt(Encoder.plat, Encoder.room)
        break
      case EncodeProtocolEnum.WEBRTC:
        Encoder.encoder = new EncoderWebrtc(Encoder.plat, Encoder.room)
        break
      default:
        console.log('not support protocol')
        break
    }
  }

  public static async changeEncoder(options: { protocol?: EncodeProtocolEnum; room?: string }) {
    let change = false
    if (options.room && options.room !== Encoder.room) {
      Encoder.room = options.room
      change = true
    }
    if (options.protocol && options.protocol !== Encoder.protocol) {
      Encoder.protocol = options.protocol
      change = true
    }
    if (change) {
      Encoder.destroy()
      Encoder.initEncoder()
    }
  }

  public static destroy() {
    // 因为是 encoder destroy 了，所以所有观众都要 destroy
    // 这里需要通知到观众，观众也要 destroy
    // 这是服务器端推送，所以需要一个 webSocket
    Encoder.encoder?.destroy()
  }

  public static async runWithExec(command: string, channel: string) {
    ipcRenderer.send(channel, command)
  }

  public static async runWithSpawn(command: string, args: string[]) {
    ipcRenderer.send('ffmpegCommandSpawn', JSON.stringify({ command, args }))
  }
}
