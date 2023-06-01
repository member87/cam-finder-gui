import { useNavigate, useParams } from "react-router-dom"

type Props = {
  text: string,
  page: string,
}


export function CamerNavButton(props: Props) {
  const nav = useNavigate()
  const params = useParams()

  const isActive = () => {
    if (!params.subpage && props.page == "info")
      return true;
    return params.subpage == props.page;
  }

  return (
    <>
      <button onClick={() => { nav(`/view/${params.camera}/${props.page}`) }} className={`${isActive() ? "text-white border-b font-bold" : "text-white/60"} px-4 py-2`}>{props.text}</button>
    </>
  )
}
