import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'
import { ffmpegBaseUrl } from '../constants'
import type { LogEventCallback } from './types'
// const os = require('os')

export class MediaFactory {
  private static ffmpeg = new FFmpeg()

  //   public static plat = os.platform()

  public static isLoadFfmpegCore = false

  public static async init() {
    if (!MediaFactory.isLoadFfmpegCore) {
      await MediaFactory.ffmpeg.load({
        coreURL: await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${ffmpegBaseUrl}/ffmpeg-core.worker.js`, 'text/javascript')
      })
      MediaFactory.isLoadFfmpegCore = true
    }
  }

  public static async checkInit() {
    if (!MediaFactory.isLoadFfmpegCore) {
      await MediaFactory.init()
    }
  }

  public static async run(command: string[]) {
    await MediaFactory.checkInit()
    MediaFactory.ffmpeg.on('log', logEvent => {
      console.log(logEvent)
    })
    // 执行FFmpeg命令
    const result = await MediaFactory.ffmpeg.exec(command)

    if (result === 0) {
      console.log('FFmpeg命令执行成功')
    }

    return result
  }

  public static async runWithLog(command: string[], cb: LogEventCallback) {
    await MediaFactory.checkInit()
    MediaFactory.ffmpeg.on('log', cb)
    // 执行FFmpeg命令
    const result = await MediaFactory.ffmpeg.exec(command)

    if (result === 0) {
      console.log('FFmpeg命令执行成功')
    }
    MediaFactory.ffmpeg.off('log', cb)
  }

  public static async listDevices(cb: LogEventCallback) {
    // if (MediaFactory.plat == 'darwin') {
    //   MediaFactory.run(['-v', 'info', '-f', 'avfoundation', '-list_devices', 'true', '-i'])
    // } else if (MediaFactory.plat == 'win32') {
    // MediaFactory.runWithLog(['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'], cb)
    MediaFactory.runWithLog(['ffmpeg', '-v', 'info', '-f', 'avfoundation', '-list_devices', 'true', '-i', 'dummy'], cb)
    // }
  }

  public static async cameraStream(cb?: LogEventCallback) {
    // if (MediaFactory.plat == 'darwin') {
    // } else if (MediaFactory.plat == 'win32') {
    MediaFactory.run([
      '-f',
      'dshow',
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
      '1280x720',
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
    // }
  }
  public static async desktopStream(cb?: LogEventCallback) {
    // if (MediaFactory.plat == 'darwin') {
    // } else if (MediaFactory.plat == 'win32') {
    MediaFactory.run([
      '-f',
      'gdigrab',
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
      '1280x720',
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
    // }
  }

  public static async test(command: string[]) {
    await MediaFactory.checkInit()
    console.log('test', command)
  }
}
