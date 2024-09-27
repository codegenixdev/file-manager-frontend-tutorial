import { createContext, useContext } from "react";

type ConfirmOptions = {
  handleConfirm: () => void;
};

type ConfirmContextType = (options: ConfirmOptions) => Promise<void>;

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

function useConfirm() {
  const context = useContext(ConfirmContext);

  if (context === undefined) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

export { useConfirm, ConfirmContext, type ConfirmOptions };
