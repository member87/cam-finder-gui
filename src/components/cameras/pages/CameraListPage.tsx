import { useEffect, useRef } from "react"
import { Device } from "../CameraInfo"
import JMuxer from "jmuxer";
console.log(JMuxer)
//import H264Player from 'broadwayjs/Player/Player';

//import { Decoder } from 'deco'


type Props = {
  devices: Device[]
}

window.global = window;

export function CameraListPage(props: Props) {


  /*
  const p = new H264Player({
    workerFile: "node_modules/broadwayjs/Player/Decoder.js",
    useWorker: true,
    webgl: "auto",
    render: true,
    size: {
      width: 200,
      height: 360
    }
  });
  */





  const c = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const j = new JMuxer({
      node: 'player',
      mode: 'video',
      fps: 7,
      clearBuffer: false,
      onError: () => j.reset()
    });


    async function readData(url) {
      fetch(url)
        .then((response) => {
          const reader = response.body.getReader();
          // read() returns a promise that resolves when a value has been received
          reader.read().then(function pump({ done, value }) {
            if (done) {
              // Do something with last chunk of data then exit reader
              return;
            }
            // Otherwise do something here to process current chunk



            j.feed({ video: value, duration: Number.POSITIVE_INFINITY, })

            // Read some more, and call this function again
            return reader.read().then(pump);
          });
        })
        .catch((err) => console.error(err));
      /*
      const response = await fetch(url);
      for await (const chunk of response.body) {
        // Do something with last chunk of data then exit reader
        j.feed({
          video: new Uint8Array(chunk),
        })
      }
      */
    }
    readData("http://localhost:3000/Media/Streaming?deviceid=1")

    return () => {
      j.destroy()
    }
  }, [])



  return (
    <>
      <video id="player" controls autoPlay></video>
    </>
  )
}


