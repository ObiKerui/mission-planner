from typing import Any


def compile_rule(
    definition: dict[str, Any],
) -> list[dict[str, Any]]:

    nodes = definition["nodes"]
    edges = definition["edges"]

    wires = build_wires(nodes, edges)

    compiled = [
        compile_node(node, wires[node["id"]])
        for node in nodes
    ]

    compiled.insert(
        0,
        {
            "id": "rule-flow",
            "type": "tab",
            "label": "Compiled Rule",
            "disabled": False,
            "info": "",
            "env": [],
        },
    )

    return compiled


def compile_node(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    node_type = node["type"]

    compiler = NODE_COMPILERS.get(node_type)

    if compiler is None:
        raise ValueError(
            f"Unsupported rule node type: {node_type}"
        )

    return compiler(node, wires)


def build_wires(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
) -> dict[str, list[list[str]]]:

    nodes_by_id = {
        node["id"]: node
        for node in nodes
    }

    output_indexes = {
        node["id"]: {
            port["id"]: index
            for index, port in enumerate(
                node["data"]["ports"]["outputs"]
            )
        }
        for node in nodes
    }

    wires = {
        node["id"]: [
            []
            for _ in node["data"]["ports"]["outputs"]
        ]
        for node in nodes
    }

    for edge in edges:
        source = edge["source"]
        source_handle = edge.get("sourceHandle")
        target = edge["target"]

        if source not in nodes_by_id:
            raise ValueError(
                f"Unknown source node '{source}'"
            )

        output_index = output_indexes[source].get(source_handle)

        if output_index is None:
            raise ValueError(
                f"Unknown output handle '{source_handle}' "
                f"on node '{source}'"
            )

        wires[source][output_index].append(target)

    return wires


def compile_trigger(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    data = node["data"]

    return {
        "id": node["id"],
        "type": "inject",
        "z": "rule-flow",
        "name": data["label"],
        "props": [
            {
                "p": "payload",
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": False,
        "onceDelay": 0.1,
        "topic": "",
        "payload": data.get("trigger"),
        "payloadType": "str",
        "x": node["position"]["x"],
        "y": node["position"]["y"],
        "wires": wires,
    }


def compile_navigate(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    data = node["data"]

    return {
        "id": node["id"],
        "type": "function",
        "z": "rule-flow",
        "name": data["label"],
        "func": (
            f"msg.navigation = {{"
            f"area: {data.get('area')!r}, "
            f"altitude_m: {data.get('altitude_m')!r}"
            f"}};\n"
            "return msg;"
        ),
        "outputs": 1,
        "x": node["position"]["x"],
        "y": node["position"]["y"],
        "wires": wires,
    }


def compile_search(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    data = node["data"]

    return {
        "id": node["id"],
        "type": "function",
        "z": "rule-flow",
        "name": data["label"],
        "func": (
            f"msg.search = {{"
            f"pattern: {data.get('pattern')!r}, "
            f"spacing_m: {data.get('spacing_m')!r}"
            f"}};\n"
            "msg.payload = { detected: true };\n"
            "return msg;"
        ),
        "outputs": 1,
        "x": node["position"]["x"],
        "y": node["position"]["y"],
        "wires": wires,
    }


def compile_condition(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    data = node["data"]

    return {
        "id": node["id"],
        "type": "switch",
        "z": "rule-flow",
        "name": data["label"],
        "property": "payload.detected",
        "propertyType": "msg",
        "rules": [
            {
                "t": "true",
            },
            {
                "t": "false",
            },
        ],
        "checkall": "true",
        "repair": False,
        "outputs": 2,
        "x": node["position"]["x"],
        "y": node["position"]["y"],
        "wires": wires,
    }


def compile_action(
    node: dict[str, Any],
    wires: list[list[str]],
) -> dict[str, Any]:

    data = node["data"]

    return {
        "id": node["id"],
        "type": "debug",
        "z": "rule-flow",
        "name": data["label"],
        "active": True,
        "tosidebar": True,
        "console": False,
        "tostatus": False,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": node["position"]["x"],
        "y": node["position"]["y"],
        "wires": [],
    }


NODE_COMPILERS = {
    "trigger": compile_trigger,
    "navigate": compile_navigate,
    "search": compile_search,
    "condition": compile_condition,
    "action": compile_action,
}