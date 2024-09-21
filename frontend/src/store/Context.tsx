import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

type Metadata = {
       title: string,
 description: string
}

type ContextType = {
           token: string | null;
        setToken: Dispatch<SetStateAction<string | null>>;
        expanded: boolean;
     setExpanded: Dispatch<SetStateAction<boolean>>;
        metadata: Metadata | null;
     setMetadata: Dispatch<SetStateAction<Metadata | null>>;
     isAnimating: boolean,
  setIsAnimating: Dispatch<SetStateAction<boolean>>,
           navTo: (path: string) => void;
};

export const Context = createContext<ContextType>({
           token: null,
        setToken: () => {},
        expanded: false,
     setExpanded: () => {},
        metadata: null,
     setMetadata: () => {},
     isAnimating: false,
  setIsAnimating: () => {},
           navTo: () => {},
});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [      token,       setToken] = useState<string   | null>(localStorage.getItem('token'));
  const [   metadata,    setMetadata] = useState<Metadata | null>(null);
  const [   expanded,    setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const                     navigate  = useNavigate();

  const navTo = (path: string) => {
    if (!isAnimating) {
      setIsAnimating(true);
         setMetadata(null);
            navigate(path);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
           setExpanded(false);
        setIsAnimating(false);
        document.body.style.overflow = '';
      }, 1400);
    }
  };

  const ctxValue = {
    token,
    setToken,
    expanded,
    setExpanded,
    metadata,
    setMetadata,
    isAnimating,
    setIsAnimating,
    navTo,
  };

  return <Context.Provider value={ctxValue}>{children}</Context.Provider>;
}
