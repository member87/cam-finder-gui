import NavBar from "@/components/nav";
import './app.css';


type Props = {
  children: JSX.Element | JSX.Element[]
}

function MainTemplate({ children }: Props) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}

export default MainTemplate;
