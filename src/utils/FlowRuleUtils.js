
import {getDevices, getHosts, getLinks} from './NetworkUtils';
/*
    return: Object -> {
        
    }
 */
export function MinDistanceRule(hostList, deviceList, linkList)
{
    let adList = {};
    for (let host in hostList)
    {
        adList[host.mac] = {};
    }
    
    for (let device in deviceList)
    {
        adList[device.id] = {};
    }
}


async function test()
{
    let hostList = await getHosts();
    let deviceList = await getDevices();
    let linkList = await getLinks();
    MinDistanceRule(hostList.data['hosts'], deviceList.data['devices'], linkList.data['links']);
}

test();