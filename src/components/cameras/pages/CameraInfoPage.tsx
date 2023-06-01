import { useRef } from "react"
import { Drive, User } from "../CameraInfo"

type Props = {
  storage: Drive[],
  users: User[]
}


export function CameraInfoPage(props: Props) {
  const img = useRef<HTMLImageElement>(null)
  console.log("HERE")
  /*
  fetch(`http://98.102.221.146:4003/Media/Streaming?deviceid=29&streamid=1`, {
    headers: {
      "Authorization": "Basic YWRtaW46MTIzNDU2"
    }
  })
    .then(resp => {
      console.log("H2")
    })
    */

  const test = async () => {
    const response = await fetch("http://98.102.221.146:4003/Media/Streaming?deviceid=29&streamid=1", {
      headers: {
        "Authorization": "Basic YWRtaW46MTIzNDU2"
      }

    });
    const reader = response.body.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log('Received', value);
      if (!img.current) continue;
      const blob = new Blob([value], { type: 'image/png' });

      const url = URL.createObjectURL(blob);
      img.current.src = url;
    }
  }
  test()




  return (
    <>
      <div className="flex gap-2">
        <InfoBox name="Users" value={props.users.length} />
        <InfoBox name="Drives" value={props.storage.length} />
        <InfoBox name="Cameras" value={props.storage.length} />
      </div>
      <img src="" alt="no image" ref={img} />
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
