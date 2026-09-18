declare module "aladin-lite" {
  export interface AladinOptions {
    target?: string;
    fov?: number;
    survey?: string;
    projection?: string;
    cooFrame?: string;
  }

  export interface Aladin {
    setCenter(coords: [number, number]): void;
    gotoRaDec(ra: number, dec: number): void;
    setFoV(fov: number): void;
  }

  export interface AladinStatic {
    init: Promise<void>;

    aladin(element: HTMLElement | string, options?: AladinOptions): Aladin;
  }

  const A: AladinStatic;

  export default A;
}
