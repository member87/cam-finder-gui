import { Drive } from "../CameraInfo"
import { StorageList } from "../StorageList"


type Props = {
  storage: Drive[]
}

export function CameraStoragePage(props: Props) {
  console.log(props.storage)
  return (
    <StorageList storage={props.storage} />
  )
}


