import { usePlayerProgress } from "../providers/PlayerProgress.tsx";
import { useEffect, useState } from "react";
import Utils from "../utils/utils.ts";

function VictoryModal() {

  const {percentGlobal, resetProgress} = usePlayerProgress();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (percentGlobal >= 100) {
      setShowModal(true);
    }
  }, [percentGlobal]);

  const resetProgressHandler = () => {
    if (window.confirm('Réinitialiser la progression ?')) {
      resetProgress();
    }
  }

  const Modal = () => {
    return (
      <div id="victory-modal" tabIndex={-1} aria-hidden="true"
           className={`${showModal ? '' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex justify-center items-center">
                VICTOIRE 🎉
              </h3>
              <button type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="victory-modal"
                      onClick={() => setShowModal(false)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Félicitations ! Vous avez trouvé les {Utils.totalNumberOfStations()} stations de métros à Lyon !
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Dans une prochaine mise à jour seront ajoutées les 7 lignes de tramways du réseau TCL 🚊
              </p>
            </div>
            {/* Modal footer */}
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="victory-modal"
                      type="button"
                      onClick={resetProgressHandler}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Recommencer
              </button>
              <button data-modal-hide="victory-modal"
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal/>
  );
}

export default VictoryModal;
