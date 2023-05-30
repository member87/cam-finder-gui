import MainTemplate from '@/templates/MainTemplate';
import { CameraList } from '@/components/cameras/CameraList';
import { useParams } from 'react-router-dom';
import { CameraInfo } from '@/components/cameras/CameraInfo';

export function HomePage() {
  const { camera } = useParams();

  return (
    <>
      <MainTemplate>
        <div className="grid grid-cols-[max-content_1fr] relative">
          <div className="max-h-[calc(100vh-57px)] overflow-auto top-0 sticky">
            <CameraList />
          </div>
          <div className="border-l border-stone-600 p-3 max-h-[calc(100vh-57px)] overflow-auto top-0 sticky">
            <div className="">
              {!camera ? (
                <h1>WE ARE HERE</h1>
              ) : (
                <CameraInfo camera={camera} />
              )}
            </div>
          </div>
        </div>
      </MainTemplate>
    </>
  )
}
