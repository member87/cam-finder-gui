import { useNavigate, useLocation } from 'react-router-dom'



type Props = {
  text: string,
  page: string
}


function NavBarButton(props: Props) {

  const navigate = useNavigate()


  const isActive = () => {
    if (props.page == "/" && useLocation().pathname == "/")
      return true
    else if (props.page == "/")
      return false
    return useLocation().pathname.startsWith(props.page);
  }



  return (
    <button onClick={() => navigate(props.page)} className={`${isActive() && "bg-stone-800 rounded-lg text-white"}  px-5 py-1`}> {props.text}</ button >
  )
}

export default NavBarButton;
