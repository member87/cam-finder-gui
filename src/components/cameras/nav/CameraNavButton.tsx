import { useNavigate, useParams } from "react-router-dom"

type Props = {
  text: string,
  page: string,
}


export function CamerNavButton(props: Props) {
  const nav = useNavigate()
  const params = useParams()

  return (
    <>
      <button onClick={() => { nav(`/view/${params.camera}/${props.page}`) }}>{props.text}</button>
    </>
  )
}
