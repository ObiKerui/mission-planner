import * as Cesium from "cesium";

export function createInfrastructureStyle() {
  return new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        // POWER LINES
        [
          '${_layer} === "power_line" && ${construction} === true',
          'color("#90a4ae", 0.35)',
        ],
        [
          '${_layer} === "power_line" && ${disused} === true',
          'color("#607d8b", 0.35)',
        ],
        [
          '${_layer} === "power_line" && ${voltage} === "400"',
          'color("#ff1744", 0.95)',
        ],
        [
          '${_layer} === "power_line" && ${voltage} === "275"',
          'color("#ff6d00", 0.9)',
        ],
        [
          '${_layer} === "power_line" && ${voltage} === "132"',
          'color("#ffd600", 0.9)',
        ],
        [
          '${_layer} === "power_line" && ${voltage} === "66"',
          'color("#76ff03", 0.85)',
        ],
        [
          '${_layer} === "power_line" && ${voltage} === "33"',
          'color("#00e5ff", 0.8)',
        ],
        [
          '${_layer} === "power_line" && ${location} === "underwater"',
          'color("#00bcd4", 0.8)',
        ],
        ['${_layer} === "power_line"', 'color("#78909c", 0.65)'],

        // POWER PLANTS
        [
          '${_layer} === "power_plant" && ${source} === "wind" && ${construction} === true',
          'color("#00bcd4", 0.35)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "wind"',
          'color("#00bcd4", 0.9)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "solar"',
          'color("#ffc107", 0.9)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "hydro"',
          'color("#2196f3", 0.9)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "nuclear"',
          'color("#9c27b0", 0.9)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "gas"',
          'color("#ff9800", 0.9)',
        ],
        [
          '${_layer} === "power_plant" && ${source} === "coal"',
          'color("#424242", 0.9)',
        ],
        ['${_layer} === "power_plant"', 'color("#f44336", 0.85)'],

        // OTHER INFRASTRUCTURE
        ['${_layer} === "petroleum"', 'color("#795548", 0.7)'],
        ['${_layer} === "telecoms"', 'color("#7e57c2", 0.7)'],
        ['${_layer} === "water"', 'color("#2196f3", 0.7)'],
        ['${_layer} === "solar_heatmap"', 'color("#ffca28", 0.7)'],
        ['${_layer} === "other_pipeline"', 'color("#78909c", 0.7)'],

        ["true", 'color("#9e9e9e", 0.5)'],
      ],
    },
  });
}
