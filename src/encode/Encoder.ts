const { ipcRenderer } = require('electron')

import type { EncodeProtocol, EncoderOptions, ExecCallback } from './types'
import { EncodeProtocolEnum } from './types'

export class Encoder {
  public static plat: string = process.platform
  public static room: string = ''
  public static url: string = ''
  public static protocol: EncodeProtocol = ''

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
    switch (Encoder.protocol) {
      case EncodeProtocolEnum.RTMP:
        Encoder.url = `rtmp://localhost/live/${option.room}`
        break
      case EncodeProtocolEnum.SRT:
        Encoder.url = `srt://localhost:10080?streamid=#!::r=live/${option.room},m=publish`
        break
      case EncodeProtocolEnum.WEBRTC:
        Encoder.url = ``
        break
      default:
        break
    }
    console.log('Encoder.url', Encoder.url)
  }

  public static async checkInit() {}

  public static async runWithExec(command: string, channel?: string, cb?: ExecCallback) {
    await Encoder.checkInit()
    console.log('runWithExec', command)
    ipcRenderer.send(channel, command)
  }

  public static async runWithSpawn(command: string, args: string[], cb?: ExecCallback) {
    await Encoder.checkInit()

    ipcRenderer.send('ffmpegCommandSpawn', JSON.stringify({ command, args }))
  }

  public static async listDevices() {
    if (Encoder.plat == 'linux') {
      Encoder.runWithExec('ffmpeg -v info -f avfoundation -list_devices true -i')
    } else if (Encoder.plat == 'win32') {
      Encoder.runWithExec('ffmpeg -list_devices true -f dshow -i dummy')
    }
  }

  // public static async cameraStreamExec(cb?: ExecCallback) {
  //   if (Encoder.plat == 'linux') {
  //     Encoder.runWithExec(
  //       'ffmpeg -f v4l2 -i /dev/video0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
  //       cb
  //         ? cb
  //         : (error, stdout: string, stderr: string) => {
  //             console.log('error', error)
  //             console.log('stdout', stdout)
  //             console.log('stderr', stderr)
  //           }
  //     )
  //   } else if (Encoder.plat == 'win32') {
  //     Encoder.runWithExec(
  //       'ffmpeg -f dshow -i video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
  //       cb
  //         ? cb
  //         : (error, stdout: string, stderr: string) => {
  //             console.log('error', error)
  //             console.log('stdout', stdout)
  //             console.log('stderr', stderr)
  //           }
  //     )
  //   }
  // }
  // public static async desktopStreamExec(cb?: ExecCallback) {
  //   if (Encoder.plat == 'linux') {
  //     Encoder.runWithExec(
  //       'ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
  //       cb
  //         ? cb
  //         : (error, stdout: string, stderr: string) => {
  //             console.log('error', error)
  //             console.log('stdout', stdout)
  //             console.log('stderr', stderr)
  //           }
  //     )
  //   } else if (Encoder.plat == 'win32') {
  //     Encoder.runWithExec(
  //       'ffmpeg -f gdigrab -i desktop -f dshow -i audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 1920x1080 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
  //       cb
  //         ? cb
  //         : (error, stdout: string, stderr: string) => {
  //             console.log('error', error)
  //             console.log('stdout', stdout)
  //             console.log('stderr', stderr)
  //           }
  //     )
  //   }
  // }

  public static async cameraStreamSpawn(cb?: ExecCallback) {
    if (Encoder.plat == 'linux') {
      Encoder.runWithSpawn('ffmpeg', [
        '-f',
        'v4l2',
        '-i',
        '/dev/video0',
        '-f',
        'alsa',
        '-ac',
        '2',
        '-i',
        'hw:1,0',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-s',
        '640x480',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'flv',
        'rtmp://localhost/live/livestream'
      ])
    } else if (Encoder.plat == 'win32') {
      switch (this.protocol) {
        case EncodeProtocolEnum.RTMP:
          Encoder.runWithSpawn('ffmpeg', [
            '-f',
            'dshow',
            '-rtbufsize',
            '100M',
            '-i',
            'video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)"',
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-maxrate',
            '3000k',
            '-bufsize',
            '6000k',
            '-pix_fmt',
            'yuv420p',
            '-g',
            '50',
            '-r',
            '30',
            '-s',
            '640x480',
            '-c:a',
            'aac',
            '-b:a',
            '160k',
            '-ac',
            '2',
            '-ar',
            '44100',
            '-f',
            'flv',
            Encoder.url
          ])
          break
        case EncodeProtocolEnum.SRT:
          break
        case EncodeProtocolEnum.WEBRTC:
          break
        default:
          console.log('unsupported protocol')
          break
      }
    }
  }
  public static async desktopStreamSpawn(cb?: ExecCallback) {
    if (Encoder.plat == 'linux') {
      Encoder.runWithSpawn('ffmpeg', [
        '-f',
        'x11grab',
        '-s',
        '1920x1080',
        '-i',
        ':0.0',
        '-f',
        'alsa',
        '-ac',
        '2',
        '-i',
        'hw:1,0',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'flv',
        'rtmp://localhost/live/livestream'
      ])
    } else if (Encoder.plat == 'win32') {
      switch (this.protocol) {
        case EncodeProtocolEnum.RTMP:
          Encoder.runWithSpawn('ffmpeg', [
            '-f',
            'gdigrab',
            '-rtbufsize',
            '100M',
            '-i',
            'desktop',
            '-f',
            'dshow',
            '-i',
            'audio="麦克风阵列 (英特尔® 智音技术)"',
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-maxrate',
            '3000k',
            '-bufsize',
            '6000k',
            '-pix_fmt',
            'yuv420p',
            '-g',
            '50',
            '-r',
            '30',
            '-s',
            '1920x1080',
            '-c:a',
            'aac',
            '-b:a',
            '160k',
            '-ac',
            '2',
            '-ar',
            '44100',
            '-f',
            'flv',
            Encoder.url
          ])
          break
        case EncodeProtocolEnum.SRT:
          break
        case EncodeProtocolEnum.WEBRTC:
          break
        default:
          console.log('unsupported protocol')
          break
      }
    }
  }

  public static async test(command: string) {
    console.log('test', command)
  }
}
