import * as Cesium from "cesium";
import {
  createContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface CesiumContextValue {
  viewer: Cesium.Viewer | null;
  setViewer: (viewer: Cesium.Viewer | null) => void;
  getViewer: () => Cesium.Viewer | null;
}

export const CesiumContext = createContext<CesiumContextValue | null>(null);

interface CesiumProviderProps {
  children: ReactNode;
}

export function CesiumProvider({ children }: CesiumProviderProps) {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [viewer, setViewerState] = useState<Cesium.Viewer | null>(null);

  const setViewer = useCallback((viewer: Cesium.Viewer | null) => {
    viewerRef.current = viewer;
    setViewerState(viewer);
  }, []);

  const getViewer = useCallback(() => {
    const viewer = viewerRef.current;

    if (!viewer || viewer.isDestroyed()) {
      return null;
    }
    return viewer;
  }, []);

  return (
    <CesiumContext.Provider value={{ viewer, setViewer, getViewer }}>
      {children}
    </CesiumContext.Provider>
  );
}
