import { useState } from "react"
import { Device, Drive, User } from "../CameraInfo"
import { ServerCamera } from "../ServerCamera"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


type Props = {
  devices: Device[],
  ip: string,
}


export function CameraListPage(props: Props) {

  return (
    <div className="flex flex-col gap-3">
      {props.devices.map((device: Device) => {
        return (
          <SingleCamera device={device} ip={props.ip} />
        )
        //<ServerCamera ip={props.ip} camera={device.id} />

      })}
    </div>
  )
}

type SingleCamProps = {
  device: Device,
  ip: string,
}

function SingleCamera(props: SingleCamProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-stone-900 px-5 py-4 rounded">
      <div className="flex">
        <h1 className="flex-grow">{props.device.Name}</h1>
        <button onClick={() => setOpen(!open)}>
          {!open ? (
            <FontAwesomeIcon icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon icon={faChevronUp} />
          )}
        </button>
      </div>
      {open ? (
        <>
          <ServerCamera ip={props.ip} camera={props.device.id} />
        </>
      ) : ("")}
    </div>
  )
}
