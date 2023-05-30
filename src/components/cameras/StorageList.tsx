import { Drive } from "./CameraInfo"


type Props = {
  storage: Drive[]
}


export function StorageList(props: Props) {

  const prettyFormat = (n: number): [string, string] => {
    const gb = (n / 1024);
    if (gb > 1024) {
      const tb = (gb / 1024).toFixed(1);
      return [tb, "TB"]
    }
    return [gb.toFixed(1), "GB"];
  }

  const getColour = (value: number) => {
    var hue = ((1 - value) * 120).toString(10);
    return ["hsl(", hue, ", 50%, 30%)"].join("");
  }

  return (
    <>
      {props.storage.map((drive: Drive) => {
        const avail: number = parseFloat(drive.AvailSize._text);
        const total: number = parseFloat(drive.TotalSize._text);
        const used: number = total - avail;

        const [usedSize, usedLabel] = prettyFormat(used)
        const [totalSize, totalLabel] = prettyFormat(total)


        const percentage = (used / total)
        const col = getColour(percentage);

        return (
          <div className="bg-stone-900 mb-5 px-5 py-3 rounded">
            <div className="flex">
              <span className="flex-grow">{drive.CodeName._text}\</span>
              <span>{usedSize}{usedLabel} / {totalSize}{totalLabel}</span>
            </div>
            <div className="relative bg-stone-700 h-5 rounded overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0" style={{ width: `${percentage * 100}%`, backgroundColor: col }}></div>
            </div>
          </div>
        )
      })}
    </>
  )
}
