import { atom, useAtom } from "jotai/index";

export const webUrlOpenAtom = atom<boolean>(false);

export const useModalState = () => {
  const [isWebUrlModalOpen, setIsWebUrlModalOpen] = useAtom(webUrlOpenAtom);

  const openWebUrlModal = () => {
    setIsWebUrlModalOpen(true);
  };

  const closeWebUrlModal = () => {
    setIsWebUrlModalOpen(false);
  };

  return {
    isWebUrlModalOpen,
    setIsWebUrlModalOpen,
    openWebUrlModal,
    closeWebUrlModal,
  };
};
