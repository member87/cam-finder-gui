import { IpcMainInvokeEvent, ipcMain } from "electron"
import { DatabaseQuery } from "./DatabaseQuery";


type Listners = {
  [x: string]: (event: IpcMainInvokeEvent, ...args: any[]) => unknown,
}



export class BaseListener {

  public listeners: Listners = {};

  constructor() {
    this.setupListeners()
    this.registerListeners()
  }

  setupListeners() { }

  registerListeners() {

    for (const key in this.listeners) {
      ipcMain.handle(key, this.listeners[key])
    }
  }

  static createAllListeners() {
    new DatabaseQuery();
  }

}

