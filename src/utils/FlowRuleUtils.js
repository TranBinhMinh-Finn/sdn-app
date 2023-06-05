﻿import { getDevices, getHosts, getLinks, postBatchFlows } from "./NetworkUtils";
/*
    return: [Object] && Object = {
        src: [String],
        src_port_out: [String],
        dst: [String],
        dst_port_in: [String],
        path: [Object] && Object = {
            id: [String],
            port_in: [String],
            port_out: [String],
        } 
    }
 */

const ONOS_APPID = "org.onosproject.proxyarp";
const DEFAULT_FLOW_PRIORITY = 10;
const CUSTOM_FLOW_PRIORITY = 55;

export function MinDistanceRule(hostList, deviceList, linkList) {
    // create adjacent list
    let adList = {};
    let distances = {};
    let trace = {};

    const MAX_DISTANCE = 1000000000;

    deviceList.forEach((device) => {
        adList[device.id] = [];
    });

    hostList.forEach((host) => {
        adList[host.mac] = [];
        host.locations.forEach((link) => {
            adList[host.mac].push({
                id: link["elementId"],
                port: link.port,
            });

            adList[link["elementId"]].push({
                id: host.mac,
                port: link.port,
            });
        });
    });

    linkList.forEach((link) => {
        if (link.state == "ACTIVE") {
            adList[link.src.device].push({
                id: link.dst.device,
                port: link.src.port,
            });
        }
    });

    // console.log(adList);

    // create a map for distance
    for (let id in adList) {
        distances[id] = {};
        trace[id] = {};
        for (let _id in adList) {
            distances[id][_id] = MAX_DISTANCE;
            trace[id][_id] = {
                id: id,
                port: null,
            };
        }
        distances[id][id] = 0;

        adList[id].forEach((element) => {
            distances[id][element.id] = 1;
            trace[id][element.id].id = id;
            trace[id][element.id].port = element.port;
        });
    }

    // calculate distance
    for (let k in adList) {
        for (let src in adList) {
            for (let dst in adList) {
                if (
                    distances[src][dst] >
                    distances[src][k] + distances[k][dst]
                ) {
                    distances[src][dst] = distances[src][k] + distances[k][dst];
                    trace[src][dst] = JSON.parse(JSON.stringify(trace[k][dst]));
                }
            }
        }
    }

    let output = [];
    for (let i = 0; i < hostList.length; i++) {
        let src = hostList[i].mac;
        for (let j = 0; j < hostList.length; j++) {
            let dst = hostList[j].mac;
            let path = [];
            if (i !== j && distances[src][dst] !== MAX_DISTANCE) {
                let v = dst;
                let child = v;
                while (v !== src) {
                    let parent = trace[src][v].id;
                    path.push({
                        id: v,
                        port_out: trace[v][child].port,
                        port_in: trace[v][parent].port,
                    });
                    child = v;
                    v = parent;
                }
                path.push({
                    id: v,
                    port_out: trace[src][v].port,
                    port_in: trace[v][src].port,
                });

                path = path.reverse();

                let rule = {
                    src: null,
                    src_port_out: null,
                    dst: null,
                    dst_port_in: null,
                    path: [],
                };

                for (let k = 0; k < path.length; k++) {
                    if (k === 0 || k === path.length - 1) {
                        if (k === 0) {
                            rule.src = path[k].id;
                            rule.src_port_out = path[k + 1].port_in;
                        } else {
                            rule.dst = path[k].id;
                            rule.dst_port_in = path[k].port_in;
                        }
                    } else {
                        rule.path.push({
                            id: path[k].id,
                            port_in: path[k].port_in,
                            port_out: path[k].port_out,
                        });
                    }
                }

                output.push(rule);
            }
        }
    }

    // console.log(output);

    return output;
}

export async function MinDistanceRoute(timeout) {
    let hostList = await getHosts();
    let deviceList = await getDevices();
    let linkList = await getLinks();
    let result = MinDistanceRule(
        hostList.data["hosts"],
        deviceList.data["devices"],
        linkList.data["links"]
    );

    let flows = [];
    // console.log(JSON.stringify(result[15]));
    result.forEach((pathObject) => {
        pathObject.path.forEach((path) => {
            flows.push({
                // appId: ONOS_APPID,
                priority: DEFAULT_FLOW_PRIORITY,
                isPermanent: false,
                timeout: isNaN(timeout) ? 60 : timeout,
                deviceId: path.id,
                treatment: {
                    instructions: [
                        {
                            type: "OUTPUT",
                            port: path.port_out,
                        },
                    ],
                },
                selector: {
                    criteria: [
                        {
                            type: "ETH_DST",
                            mac: pathObject.dst,
                        },
                    ],
                },
            });
        });
    });
    // console.log(flows)
    postBatchFlows({ flows: flows });
}

export async function addCustomFlowByMacdstAndPortout(pathObject, timeout) {
    let flows = [];
    pathObject.path.forEach((path) => {
        flows.push({
            priority: CUSTOM_FLOW_PRIORITY,
            isPermanent: false,
            timeout: isNaN(timeout) ? 60 : timeout,
            deviceId: path.id,
            treatment: {
                instructions: [
                    {
                        type: "OUTPUT",
                        port: path.port_out,
                    },
                ],
            },
            selector: {
                criteria: [
                    {
                        type: "ETH_DST",
                        mac: pathObject.dst,
                    },
                ],
            },
        });
    });

    postBatchFlows({ flows: flows });
}
/* region example 
addCustomFlowByMacdstAndPortout(
    {
        src: "00:00:00:00:00:09",
        src_port_out: "1",
        dst: "00:00:00:00:00:01",
        dst_port_in: "1",
        path: [
            { id: "of:0000000000000009", port_out: "3" },
            { id: "of:0000000000000003", port_out: "4" },
            { id: "of:000000000000000a", port_out: "3" },
            { id: "of:0000000000000001", port_out: "1" },
        ],
    },
    60
); */
//MinDistanceRoute();
// test();
