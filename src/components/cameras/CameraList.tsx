import { useEffect, useState } from "react"
import { DBRow } from "electron/main/listeners/DatabaseQuery"
import { SingleCamera } from "./SingleCamera"


export function CameraList() {

  const [cameras, setCameras] = useState<DBRow[]>([])

  useEffect(() => {
    window.electronAPI.ipcRenderer.invoke("database:getCameraList").then((result: string) => {
      const rows: DBRow[] = JSON.parse(result);
      setCameras(rows);
    })
  }, [])

  return (
    <div className="flex flex-col p-3 gap-3">
      {cameras.map((camera: DBRow, i: number) => {
        return (
          <SingleCamera camera={camera} key={i} />
        )
      })}
    </div>
  )
} 
