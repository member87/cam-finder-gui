import { Drive } from "../CameraInfo"


type Props = {
  storage: Drive[]
}

export function CameraStoragePage(props: Props) {

  return (
    <div>{props.storage.length}</div>
  )
}
