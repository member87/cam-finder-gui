import { DBRow } from "electron/main/listeners/DatabaseQuery"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faServer } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { faMap } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

type Props = {
  camera: DBRow
}


export function SingleCamera(props: Props) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(`/view/${props.camera.ip}:${props.camera.port}`)}>
      <div className="bg-stone-900 p-5 flex gap-3 shadow text-left hover:bg-stone-800">
        <FontAwesomeIcon icon={faServer} className="mt-1" />
        <div className="flex flex-col gap-1">
          <div className="text-lg font-mono">{props.camera.ip}</div>
          <div className="opacity-80 whitespace-nowrap">{props.camera.city}, {props.camera.country}</div>
          <div className="flex gap-4 text-stone-400">
            <div className="opacity-80">
              <FontAwesomeIcon icon={faCamera} className="mr-2 text-stone-100" />
              {props.camera.count ?? "N/A"}
            </div>
            <div className="opacity-80">
              <FontAwesomeIcon icon={faMap} className="mr-2 text-stone-100" />
              {props.camera.country_code}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

