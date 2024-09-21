import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

type Metadata = {
       title: string,
 description: string
}

type ContextType = {
           token: string | null;
        setToken: Dispatch<SetStateAction<string | null>>;
        metadata: Metadata | null;
     setMetadata: Dispatch<SetStateAction<Metadata | null>>;
     isAnimating: boolean,
  setIsAnimating: Dispatch<SetStateAction<boolean>>,
           navTo: (path: string) => void;
};

export const Context = createContext<ContextType>({
           token: null,
        setToken: () => {},
        metadata: null,
     setMetadata: () => {},
     isAnimating: false,
  setIsAnimating: () => {},
           navTo: () => {},
});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [      token,       setToken] = useState<string   | null>(localStorage.getItem('token'));
  const [   metadata,    setMetadata] = useState<Metadata | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const                     navigate  = useNavigate();

  const navTo = (path: string) => {
    if (!isAnimating) {
      setIsAnimating(true);
         setMetadata(null);
            navigate(path);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 1400);
    }
  };

  const ctxValue = {
    token,
    setToken,
    metadata,
    setMetadata,
    isAnimating,
    setIsAnimating,
    navTo,
  };

  return <Context.Provider value={ctxValue}>{children}</Context.Provider>;
}
