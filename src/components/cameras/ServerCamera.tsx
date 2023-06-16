import { useEffect, useRef } from "react"
import JMuxer from "jmuxer";

type Props = {
  ip: string,
  camera: string,
}


export function ServerCamera(props: Props) {

  const playerId = `${props.ip}-${props.camera}`
  const c = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const j: any = new JMuxer({
      node: playerId,
      mode: 'video',
      clearBuffer: false,
      onError: () => j.reset()
    });


    const controller = new AbortController();
    const signal = controller.signal;

    async function readData(url: string) {
      fetch(url, {
        signal, headers: {
          "Authorization": "Basic YWRtaW46MTIzNDU2"
        }
      })
        .then((response) => {
          if (!response.body) return;
          const reader = response.body.getReader();
          reader.read().then(function pump({ done, value }): any {
            if (done) {
              return;
            }
            j.feed({ video: value })
            return reader.read().then(pump);
          });
        })
        .catch((err) => console.error(err));
    }
    readData(`http://${props.ip}/Media/Streaming?deviceid=${props.camera}`)
    return () => {
      j.destroy()
      controller.abort();
    }
  }, [])



  return (
    <>
      <video id={playerId} ref={c} autoPlay></video>
    </>
  )
}


