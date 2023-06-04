import axios from 'axios';

const ENDPOINTS = {
    LINKS: '/onos/v1/links',
    DEVICES: '/onos/v1/devices',
    HOSTS: '/onos/v1/hosts',
}
const address = "192.168.242.131";
const port = "8181";
const url = `http://${address}:${port}`;
const username = "onos";
const password = "rocks";
const baseHeaders = {
    Authorization: `Basic ${btoa(`${username}:${password}`).toString(`base64`)}`
}

export function doGet(endpoint, headers, params) {
    let sendHeaders = {};
    Object.assign(sendHeaders, baseHeaders, headers);
    return axios.get(`${url}${endpoint}`, {
        headers: sendHeaders,
        params: params
    });
}

export function getDevices()
{
    return doGet(ENDPOINTS.DEVICES, {}, {});
}

export function getLinks()
{
    return doGet(ENDPOINTS.LINKS, {}, {});
}

export function getHosts()
{
    return doGet(ENDPOINTS.HOSTS, {}, {});
}
