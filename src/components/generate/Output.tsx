import { useState, useEffect } from 'react';

function Output() {

  const [ipList, setIps] = useState<string[]>([])
  const [failed, setFailed] = useState(0)
  const [success, setSuccess] = useState(0)
  const [error, setError] = useState(0)

  useEffect(() => {

    const removeListner = window.electronAPI.ipcRenderer.on("generate:message", (value: any) => {
      console.log(value)
      const data = JSON.parse(value)

      setIps(ipList => [...ipList, data.message]);
      setFailed(data.failed);
      setSuccess(data.success)
      setError(data.error)
    })

    return () => {
      removeListner();
    }
  }, [])

  return (
    <>
      <div className="flex flex-wrap">

        <div className="sticky top-0 bg-stone-900 px-4 py-3 w-full">IP</div>
        <ul className="flex-auto min-w-[1px]">
          {ipList.map((ip: string, i: number) => (
            <li key={i} className="my-2 mx-4">{ip}</li>
          ))}

        </ul>
        <div className="">
          <div className="sticky top-14">
            <button onClick={() => window.electronAPI.ipcRenderer.sendMessage("generate:start")}>Generate Cameras</button>
          </div>
        </div>
      </div>
    </>
  )
}


export default Output;
