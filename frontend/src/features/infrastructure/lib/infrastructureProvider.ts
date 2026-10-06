import * as Cesium from "cesium";

export function destroyInfrastructureProvider(
  viewer: Cesium.Viewer,
  provider: Cesium.MVTDataProvider | null,
) {
  if (!provider) {
    return;
  }

  viewer.scene.primitives.remove(provider);

  provider.tileset?.destroy();
}
