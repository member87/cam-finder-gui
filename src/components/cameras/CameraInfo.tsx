import { useEffect, useRef, useState } from "react"
import convert from 'xml-js';
import { CameraNav } from "./nav";
import { CamerNavButton } from "./nav/CameraNavButton";
import { CameraInfoPage } from "./pages/CameraInfoPage";
import { CameraUsersPage } from "./pages/CameraUsersPage";
import { useNavigate, useParams } from "react-router-dom";
import { CameraStoragePage } from "./pages/CameraStoragePage";

type Props = {
  camera: string
}


type UserResponse = {
  UserConfig: {
    Users: {
      User: User | User[]
    }
  }
}

export type User = {
  Description: string,
  Name: string,
  UserGroups: UserGroup

}


export type UserGroup = {
  UserGroup: {
    id: string,
    domainid: string,
  }
}


type DriveResponse = {
  Drives: {
    Drive: Drive[]
  }
}

export type Drive = {
  CodeName: {
    _text: string
  },
  TotalSize: {
    _text: string,
  },
  AvailSize: {
    _text: string
  }
}


export function CameraInfo(props: Props) {

  const [users, setUsers] = useState<User[]>([]);
  const [storage, setStorage] = useState<Drive[]>([]);
  const subpage = useParams();

  const getUsers = async (): Promise<UserResponse> => {
    const resp = await fetch(`http://${props.camera}/Media/UserGroup/getUser?response_format=json`, {
      headers: {
        "Authorization": "Basic YWRtaW46MTIzNDU2"
      }
    })
    const json: UserResponse = await resp.json();
    return json;
  }

  const getStorage = async (): Promise<Drive[]> => {
    const resp = await fetch(`http://${props.camera}/Media/Storage/getDrive`, {
      headers: {
        "Authorization": "Basic YWRtaW46MTIzNDU2"
      }
    })
    const xml = await resp.text();
    const drives: DriveResponse = JSON.parse(convert.xml2json(xml, {
      compact: true
    }))

    return drives.Drives.Drive;
  }


  useEffect(() => {
    getUsers().then(res => {
      const users = res.UserConfig.Users.User;
      let output: User[];
      if (!Array.isArray(users))
        output = [users]
      else
        output = users;
      setUsers(output)
    })
    getStorage().then(res => {
      let drives: Drive[] = res;
      setStorage(drives);
    });

  }, [props.camera]);




  return (
    <>
      <div className="bg-stone-900 h-80 rounded flex justify-center items-center">map</div>
      <div className="text-xl my-4 font-mono">
        {props.camera}
      </div>
      <CameraNav>
        <CamerNavButton text="Info" page="info" />
        <CamerNavButton text="Users" page="users" />
        <CamerNavButton text="Storage" page="storage" />
      </CameraNav>
      {subpage?.subpage ? (
        <>
          {subpage.subpage == "info" && (<CameraInfoPage />)}
          {subpage.subpage == "users" && (<CameraUsersPage users={users} />)}
          {subpage.subpage == "storage" && (<CameraStoragePage storage={storage} />)}
        </>
      ) : (
        <div><CameraInfoPage /></div>
      )}
    </>
  )

}
