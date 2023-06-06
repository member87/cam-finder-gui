import { Drive, User } from "../CameraInfo"

type Props = {
  storage: Drive[],
  users: User[]
}


export function CameraInfoPage(props: Props) {

  return (
    <>
      <div className="flex gap-2">
        <InfoBox name="Users" value={props.users.length} />
        <InfoBox name="Drives" value={props.storage.length} />
        <InfoBox name="Cameras" value={props.storage.length} />
      </div>
    </>
  )
}

function InfoBox(props: { name: string, value: number | string }) {
  return (
    <div className="bg-stone-900 h-36 flex justify-center items-center rounded flex-col gap-3 flex-grow">
      <h4 className="text-white/60">{props.name}</h4>
      <span className="text-3xl">{props.value}</span>
    </div>

  )
}
