import { app, BrowserWindow, shell, ipcMain, session } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import { Generate } from './generate/Generate'
import { DatabaseQuery } from './listeners/DatabaseQuery'
import { Database } from './utils/Database'
const proxy = require('express-http-proxy');
const express = require('express')
const a = express()
const port = 3000

// The built directory structure
//
//├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {

  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
      nodeIntegrationInWorker: true
    },
  })

  const devServerURL = createURLRoute(url!, "main")
  const fileRoute = createFileRoute(
    join(__dirname, indexHtml),
    "main"
  )

  process.env.NODE_ENV === 'development'
    ? win.loadURL(devServerURL)
    : win.loadFile(...fileRoute)

  win.setMenu(null)
  win.webContents.openDevTools()

  /*
  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
  */

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })


  const gen = new Generate(win);
  Database.loadDatabase()
  DatabaseQuery.createAllListeners();

  a.use('/', proxy('76.191.116.34:80', {
    https: false,
    proxyReqOptDecorator: function(proxyReqOpts: any, srcReq: any) {
      console.log(proxyReqOpts)
      proxyReqOpts.headers['Authorization'] = 'Basic YWRtaW46MTIzNDU2';
      proxyReqOpts.headers['Connection'] = 'keep-alive';
      return proxyReqOpts;
    },
    proxyReqBodyDecorator: function(bodyContent, srcReq) {
      return '';
    }
  }));

  a.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

