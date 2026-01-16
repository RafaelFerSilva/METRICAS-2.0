import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface SidebarDrawerProviderProps {
  children: ReactNode;
}

interface SidebarDrawerContextData extends UseDisclosureReturn {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({
  children,
}: SidebarDrawerProviderProps) {
  const disclosure = useDisclosure();
  const router = useRouter()
  // Initial state could be read from localStorage if needed
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    disclosure.onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])


  return (
    <SidebarDrawerContext.Provider value={{ ...disclosure, isCollapsed, toggleCollapse }}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);
