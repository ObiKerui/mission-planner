// import { useEffect, useRef } from "react";
// import A from "aladin-lite";

// export function SkyViewer() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     let cancelled = false;

//     A.init.then(() => {
//       if (cancelled || !containerRef.current) {
//         return;
//       }

//       A.aladin(containerRef.current, {
//         survey: "P/DSS2/color",
//         target: "187.7059 +12.3911",
//         fov: 1,
//       });
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         width: "100%",
//         height: "600px",
//       }}
//     />
//   );
// }

import { useEffect, useRef } from "react";
import A from "aladin-lite";

export function SkyViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    A.init.then(() => {
      if (cancelled || !containerRef.current) {
        return;
      }

      A.aladin(containerRef.current, {
        survey: "P/DSS2/color",
        target: "187.7059 +12.3911",
        fov: 1,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="min-h-[500px] overflow-hidden rounded-lg border">
      <div ref={containerRef} className="h-[500px] w-full" />
    </section>
  );
}
