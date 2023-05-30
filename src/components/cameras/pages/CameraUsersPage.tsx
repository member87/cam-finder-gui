import { User } from "../CameraInfo"

type Props = {
  users: User[]
}


export function CameraUsersPage(props: Props) {



  return (
    <>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-stone-900 child:py-4 child:px-2 rounded-t-md child:text-left sticky -top-4">
            <th>Username</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(props.users)) && props.users.map((user: User, i: number) => {
            return (
              <tr key={i} className={`border-b border-x border-stone-800 child:p-2 hover:bg-stone-900/50`}>
                <td>{user.Name}</td>
                <td className="capitalize">{user.UserGroups.UserGroup.id}</td>
              </tr>
            )
          })}

        </tbody>
      </table>
    </>
  )
}
