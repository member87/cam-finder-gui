import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'


contextBridge.exposeInMainWorld('electronAPI', {
  removeListner: (channel: string, callback: any) => { ipcRenderer.removeListener(channel, (event, ...args) => callback(...args)) },
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: string, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    invoke(channel: string) {
      return ipcRenderer.invoke(channel);
    },
  }
})
