INSERT INTO rules (
    name,
    description,
    definition
)
VALUES (
    'Search and Report',
    'Search an area and report when a target is detected.',
    '{
        "nodes": [
            {
                "id": "start",
                "type": "trigger",
                "position": {
                    "x": 100,
                    "y": 100
                },
                "data": {
                    "label": "Start Mission",
                    "trigger": "mission_started",
                    "ports": {
                        "inputs": [],
                        "outputs": [
                            {
                                "id": "output"
                            }
                        ]
                    }
                }
            },
            {
                "id": "navigate",
                "type": "navigate",
                "position": {
                    "x": 400,
                    "y": 100
                },
                "data": {
                    "label": "Navigate to Search Area",
                    "area": "search-area-1",
                    "altitude_m": 120,
                    "ports": {
                        "inputs": [
                            {
                                "id": "input"
                            }
                        ],
                        "outputs": [
                            {
                                "id": "output"
                            }
                        ]
                    }
                }
            },
            {
                "id": "search",
                "type": "search",
                "position": {
                    "x": 700,
                    "y": 100
                },
                "data": {
                    "label": "Search Area",
                    "pattern": "lawn_mower",
                    "spacing_m": 80,
                    "ports": {
                        "inputs": [
                            {
                                "id": "input"
                            }
                        ],
                        "outputs": [
                            {
                                "id": "output"
                            }
                        ]
                    }
                }
            },
            {
                "id": "detect",
                "type": "condition",
                "position": {
                    "x": 1000,
                    "y": 100
                },
                "data": {
                    "label": "Target Detected",
                    "event": "object_detected",
                    "object_type": "vehicle",
                    "minimum_confidence": 0.8,
                    "ports": {
                        "inputs": [
                            {
                                "id": "input"
                            }
                        ],
                        "outputs": [
                            {
                                "id": "true",
                                "label": "True"
                            },
                            {
                                "id": "false",
                                "label": "False"
                            }
                        ]
                    }
                }
            },
            {
                "id": "report",
                "type": "action",
                "position": {
                    "x": 1300,
                    "y": 100
                },
                "data": {
                    "label": "Report Detection",
                    "action": "publish_event",
                    "event_type": "target_detected",
                    "include": [
                        "location",
                        "object_type",
                        "confidence",
                        "source_drone"
                    ],
                    "ports": {
                        "inputs": [
                            {
                                "id": "input"
                            }
                        ],
                        "outputs": []
                    }
                }
            }
        ],
        "edges": [
            {
                "id": "e-start-navigate",
                "source": "start",
                "sourceHandle": "output",
                "target": "navigate",
                "targetHandle": "input"
            },
            {
                "id": "e-navigate-search",
                "source": "navigate",
                "sourceHandle": "output",
                "target": "search",
                "targetHandle": "input"
            },
            {
                "id": "e-search-detect",
                "source": "search",
                "sourceHandle": "output",
                "target": "detect",
                "targetHandle": "input"
            },
            {
                "id": "e-detect-report",
                "source": "detect",
                "sourceHandle": "true",
                "target": "report",
                "targetHandle": "input"
            }
        ]
    }'::jsonb
);