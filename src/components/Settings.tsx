import { ChangeEvent, useRef, useState } from "react";
import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import IconSettings from "./icons/IconSettings.tsx";
import IconDownload from "./icons/IconDownload.tsx";
import IconUpload from "./icons/IconUpload.tsx";
import { useCookies } from "react-cookie";
import { saveAs } from 'file-saver';
import Utils from "../utils/utils.ts";

function Settings() {

  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(['foundStationsIds']);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {resetProgress, updateProgress} = usePlayerProgress();

  const resetProgressHandler = () => {
    if (window.confirm('Réinitialiser la progression ?')) {
      setOpen(false);
      resetProgress();
    }
  }

  const aboutHandler = () => {
    alert(`Retrouvez le plus de stations de métros de Lyon que vous pouvez. Essayez de tête pour voir combien vous pouvez en trouver :)
Ce site utilise des cookies pour stocker votre progression.

Inspiré du jeu memory.pour.paris créé par Benjamin TD (@_benjamintd) avec son accord explicite.

2024 - Rémi Martinez`);
  }

  const importProgressHandler = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files;

    if (!files?.length) return;

    const file: File = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.loaded && reader.result) {
        // Parse the CSV string into an array of IDs
        const importedIds = reader.result.toString().split(',');
        Utils.fetchStationsFromIds(importedIds).forEach((s) => updateProgress(s));
      }
    };

    reader.readAsText(file);
  }

  const exportProgressHandler = () => {
    const blobContent = cookies['foundStationsIds']?.join(',') || [''];
    const blob = new Blob(Array.from(blobContent), {type: 'text/plain;charset=utf-8'});
    saveAs(blob, 'progression.txt');
  }

  const OpenSettingsButton = () => {
    return (
      <button onClick={() => setOpen(!open)} id="dropdownMenuIconHorizontalButton"
              data-dropdown-toggle="dropdownDotsHorizontal"
              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:outline-none dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
              type="button">
        <IconSettings/>
      </button>
    );
  }

  const DropdownMenu = () => {
    const aClassNameStyles = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white";
    return (
      <div id="dropdownDotsHorizontal"
           className={`${open ? '' : 'hidden'} absolute w-fit right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconHorizontalButton">
          <li>
            <a href="#" onClick={resetProgressHandler} className={aClassNameStyles}>
              Réinitialiser
            </a>
          </li>
          <li>
            <a href="#" onClick={importProgressHandler} className={aClassNameStyles}>
              <div className="inline-flex items-center">
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e)}/>
                Importer progression <IconDownload className="ml-4"/>
              </div>
            </a>
          </li>
          <li>
            <a href="#" onClick={exportProgressHandler} className={aClassNameStyles}>
              <div className="inline-flex items-center">
                Exporter progression <IconUpload className="ml-4"/>
              </div>
            </a>
          </li>
          <li>
            <a href="#" onClick={aboutHandler} className={aClassNameStyles}>
              A propos
            </a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="">
      <OpenSettingsButton/>
      <DropdownMenu/>
    </div>
  );
}

export default Settings;