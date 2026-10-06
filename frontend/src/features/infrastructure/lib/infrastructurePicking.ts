import * as Cesium from "cesium";

const PICK_OFFSETS = [
  [0, 0],
  [-4, 0],
  [4, 0],
  [0, -4],
  [0, 4],
  [-8, 0],
  [8, 0],
  [0, -8],
  [0, 8],
] as const;

function isInfrastructureFeature(
  value: unknown,
): value is Cesium.Cesium3DTileFeature {
  return (
    value instanceof Cesium.Cesium3DTileFeature &&
    typeof value.getProperty === "function"
  );
}

export function pickInfrastructure(
  viewer: Cesium.Viewer,
  position: Cesium.Cartesian2,
): Cesium.Cesium3DTileFeature | undefined {
  for (const [x, y] of PICK_OFFSETS) {
    const picked = viewer.scene.pick(
      new Cesium.Cartesian2(position.x + x, position.y + y),
    );

    if (isInfrastructureFeature(picked)) {
      return picked;
    }
  }

  return undefined;
}
