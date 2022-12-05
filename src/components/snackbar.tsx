import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import cn from "../utils";

interface Props {
  children: ReactNode;
}

const SnackbarContext = createContext({ isOpen: false, handleOpen: () => {} });

const SnackbarProvider = ({ children }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    const timer = setTimeout(handleClose, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <SnackbarContext.Provider value={{ isOpen, handleOpen }}>
      {children}
    </SnackbarContext.Provider>
  );
};
function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackProvider");
  }
  return context;
}

const Snackbar = ({ children }: Props) => {
  const { isOpen } = useSnackbar();

  return (
    <div
      className={cn(
        "fixed transition-opacity duration-300 ease-in-out bottom-0 right-0 m-4 py-2 px-6 rounded bg-green-700 shadow-2xl max-w-full w-64",
        isOpen ? "opacity-100" : "opacity-0"
      )}
    >
      <span className="text-white">{children}</span>
    </div>
  );
};

export { Snackbar, SnackbarProvider, useSnackbar };
