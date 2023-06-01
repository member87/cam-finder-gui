import { Drive } from "../CameraInfo"
import { StorageList } from "../StorageList"


type Props = {
  storage: Drive[]
}

export function CameraStoragePage(props: Props) {
  return (
    <StorageList storage={props.storage} />
  )
}


