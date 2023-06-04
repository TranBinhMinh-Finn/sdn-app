import axios from "axios";

const ENDPOINTS = {
    LINKS: "/onos/v1/links",
    DEVICES: "/onos/v1/devices",
    HOSTS: "/onos/v1/hosts",
    FLOWS: "/onos/v1/flows",
};
const address = "192.168.59.151";
const port = "8181";
const url = `http://${address}:${port}`;
const username = "onos";
const password = "rocks";
const baseHeaders = {
    Authorization: `Basic ${btoa(`${username}:${password}`).toString(
        `base64`
    )}`,
};

export function doGet(endpoint, headers, params) {
    let sendHeaders = {};
    Object.assign(sendHeaders, baseHeaders, headers);
    return axios.get(`${url}${endpoint}`, {
        headers: sendHeaders,
        params: params,
    });
}

export function getDevices() {
    return doGet(ENDPOINTS.DEVICES, {}, {});
}

export function getLinks() {
    return doGet(ENDPOINTS.LINKS, {}, {});
}

export function getHosts() {
    return doGet(ENDPOINTS.HOSTS, {}, {});
}

export function doPost(endpoint, headers, params, data) {
    let sendHeaders = {};
    Object.assign(sendHeaders, baseHeaders, headers);

    var config = {
        method: "post",
        url: `${url}${endpoint}`,
        headers: sendHeaders,
        data: data,
    };
    return axios(config)
}

export function postBatchFlows(data) {
    // console.log(JSON.stringify(data).length);
    console.log(data);
    return doPost(
        ENDPOINTS.FLOWS,
        {'Content-Type': "application/json"},
        {},
        data
    );
}
