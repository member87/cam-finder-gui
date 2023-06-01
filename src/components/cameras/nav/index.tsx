type Props = {
  children: JSX.Element | JSX.Element[],
}


export function CameraNav(props: Props) {

  return (
    <>
      <div className="flex gap-2 mb-3">
        {props.children}
      </div>
    </>
  )
}
