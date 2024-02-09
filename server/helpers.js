//import * as marvel from './data/marvel.js';
import axios from 'axios';
import redis from 'redis';
const client = redis.createClient();

async function getuserdata(objtype, objid) {
	if(!client.isReady) {
		await client.connect();
	}
//	let key = objtype + "_" + objid;
//	let clientExists = await client.exists(key);
	let retdata = null;
/*	if(!clientExists) {
		console.log("Getting from the Marvel Portal");
		let publick = marvel.getpublickey();
		const ts = new Date().getTime();
		const hash = marvel.gethash(ts);
		const gatewayurl = marvel.gatewayurl();
		let baseUrl = gatewayurl + '/' + objtype + '/' + objid;
		let url = baseUrl + '?ts=' + ts + '&apikey=' + publick + '&hash=' + hash;
		let response = await axios.get(url);
		retdata = response.data.data.results[0];	
		await client.set(key, JSON.stringify(retdata));	
	} else { //client does exist
		console.log("Retrieving from cache");
		let str = await client.get(key);
		retdata = JSON.parse(str); //converting back to object
	} */
//	http://gateway.marvel.com/v1/public/characters/1011334 ->resource url
	return retdata;
}