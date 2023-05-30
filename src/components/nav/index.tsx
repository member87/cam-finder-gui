import NavBarButton from "./button";

function NavBar() {
  return (
    <div className="py-3 px-2 border-b border-stone-600 flex gap-2 sticky top-0">
      <NavBarButton text="View" page="/" />
      <NavBarButton text="Generate" page="/generate" />
      <NavBarButton text="Stats" page="/stats" />
    </div>
  )
}

export default NavBar;
