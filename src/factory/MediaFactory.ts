const { ipcRenderer } = require('electron')

import type { ExecCallback } from './types'

export class MediaFactory {
  public static plat: string = process.platform

  public static async init() {}

  public static async checkInit() {}

  public static async runWithExec(command: string, cb?: ExecCallback) {
    await MediaFactory.checkInit()
    console.log('runWithExec', command)
    ipcRenderer.send('ffmpegCommandExec', command)
  }

  public static async runWithSpawn(command: string, args: string[], cb?: ExecCallback) {
    await MediaFactory.checkInit()

    ipcRenderer.send('ffmpegCommandSpawn', JSON.stringify({ command, args }))
    // const ChildProcess = spawn(command, args)
    // console.log('ChildProcess', ChildProcess)
  }

  public static async listDevices() {
    if (MediaFactory.plat == 'linux') {
      MediaFactory.runWithExec('ffmpeg -v info -f avfoundation -list_devices true -i')
    } else if (MediaFactory.plat == 'win32') {
      MediaFactory.runWithExec('ffmpeg -list_devices true -f dshow -i dummy')
    }
  }

  public static async cameraStreamExec(cb?: ExecCallback) {
    if (MediaFactory.plat == 'linux') {
      MediaFactory.runWithExec(
        'ffmpeg -f v4l2 -i /dev/video0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    } else if (MediaFactory.plat == 'win32') {
      MediaFactory.runWithExec(
        'ffmpeg -f dshow -i video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    }
  }
  public static async desktopStreamExec(cb?: ExecCallback) {
    if (MediaFactory.plat == 'linux') {
      MediaFactory.runWithExec(
        'ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    } else if (MediaFactory.plat == 'win32') {
      MediaFactory.runWithExec(
        'ffmpeg -f gdigrab -i desktop -f dshow -i audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 1920x1080 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    }
  }

  public static async cameraStreamSpawn(cb?: ExecCallback) {
    if (MediaFactory.plat == 'linux') {
      MediaFactory.runWithSpawn(
        'ffmpeg',
        // ['-f v4l2 -i /dev/video0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream'],
        [
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
        ],
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    } else if (MediaFactory.plat == 'win32') {
      MediaFactory.runWithSpawn(
        'ffmpeg',
        [
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
        ],
        // 'ffmpeg -f dshow -i video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    }
  }
  public static async desktopStreamSpawn(cb?: ExecCallback) {
    if (MediaFactory.plat == 'linux') {
      MediaFactory.runWithSpawn(
        'ffmpeg',
        [
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
        ],
        // 'ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f alsa -ac 2 -i hw:1,0 -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    } else if (MediaFactory.plat == 'win32') {
      MediaFactory.runWithSpawn(
        'ffmpeg',
        [
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
          'rtmp://localhost/live/livestream'
        ],
        // 'ffmpeg -f gdigrab -i desktop -f dshow -i audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 1920x1080 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
        cb
          ? cb
          : (error: ExecException | null, stdout: string, stderr: string) => {
              console.log('error', error)
              console.log('stdout', stdout)
              console.log('stderr', stderr)
            }
      )
    }
  }

  public static async test(command: string) {
    console.log('test', command)
  }
}
