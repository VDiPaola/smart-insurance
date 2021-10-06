//imports
const { ethers } = require("ethers");
const axios = require("axios");
const BN = require('bn.js')
const config = require("./config.json");
const moment = require('moment');

//const vars
const ORACLE_ADDRESS = 	config.oracle.address;
const ORACLE_ABI = config.oracle.abi;
const PROVIDER = config.provider;
const IS_WEB3 = config.web3;
const PRIVATE_KEY = config.private_key;
const API_KEY = config.api_key;

//vars
let pendingRequests = [];
let oracleContract, provider, walletSigner;


async function getOracleContract(){
	//set contract var from oracle address and wallet signer
	oracleContract = new ethers.Contract(ORACLE_ADDRESS, ORACLE_ABI, walletSigner);
}

async function getWallet(){
	//get wallet signer object from private key and connect to provider
	if(IS_WEB3){
		provider = new ethers.providers.Web3Provider(PROVIDER);
	}else{
		provider = new ethers.providers.JsonRpcProvider(PROVIDER);
	}
	let wallet = new ethers.Wallet(PRIVATE_KEY);
	walletSigner = wallet.connect(provider);
}

async function handleRequest(callerAddress, id, cityCountry, insuredAddress){
	return new Promise((resolve, reject) => {
		//get lon/lat for location
		geoCoding(cityCountry)
		.then((data)=>{
			//get climate data
			getClimateData(data.lon,data.lat).then((data)=>{
				//check if a condition is met
				let climateReason = checkClimateCondition(data)
				if(climateReason != false){
					oracleContract.recieveWeatherData(id,insuredAddress, callerAddress, climateReason);
				}
				
				resolve(`climate reason:${climateReason.toString()}`)
			})
			.catch(err=>reject(err))
		})
		.catch(err=>reject(err))
	})
}

function checkClimateCondition(data){
	//check if any of the data meets criteria for
	for(obj of data){
		//wet-bulb air temperature measurement for potentially lethal heat
		let airTemp = obj.temp; //Celsius
		let humidity = obj.rhum; //percentage
		let tempCondition1 = airTemp > 35 && humidity == 100;
		let tempCondition2 = airTemp > 47 && humidity > 40;
		let tempCondition3 = airTemp > 70 && humidity > 10;
		if(tempCondition1 || tempCondition2 || tempCondition3){
			//too hot
			return "Dangerous Wet-Bulb Air Temperature";
		}
		//snow depth
		let snowLevel = obj.snow || 0;//mm
		let snowMax = 580;
		if(snowLevel > snowMax){
			//snow levels too high
			return "Damaging Snow Levels";
		}
		//wind speed
		let windSpeed = obj.wspd;//km/h
		let maxWindSpeed = 102;
		if(windSpeed > maxWindSpeed){
			//destructive wind speed
			return "Destructive Wind Speeds";
		}
		//weather condition
		let condition = obj.coco;//custom codes https://dev.meteostat.net/formats.html#weather-condition-codes
		let badConditions = [26,27]
		if(badConditions.includes(condition)){
			//storms
			return "Storm";
		}
	}
	//no claim
	return false;
}

async function getClimateData(lon, lat){
	//get climate data from api
	var options = {
	  method: 'GET',
	  url: 'https://meteostat.p.rapidapi.com/point/hourly',
	  params: {
		lat: lon,
		lon: lat,
		start: moment().subtract(3, 'days').format('YYYY-MM-DD'),
		end: moment().format('YYYY-MM-DD'),
	  },
	  headers: {
		'x-rapidapi-host': 'meteostat.p.rapidapi.com',
		'x-rapidapi-key': API_KEY
	  }
	};

	return new Promise((resolve,rej)=>{
		axios.request(options).then(function (response) {
			let data = response.data.data
			resolve(data)
		}).catch(function (error) {
			console.log(error)
			rej()
		});
	})
}

async function geoCoding(cityCountry){
	var options = {
	  method: 'GET',
	  url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search',
	  params: {q: cityCountry, 'accept-language': 'en', polygon_threshold: '0.0'},
	  headers: {
		'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com',
		'x-rapidapi-key': API_KEY
	  }
	};
	return new Promise((resolve,rej)=>{
		axios.request(options).then(function (response) {
			if(response.data.length <= 0){rej()}
			let data = response.data[0]
			let lon = data.lon;
			let lat = data.lat;
			resolve({lon,lat})
		}).catch(function (error) {
			console.log(error)
			rej()
		});
	})
	
}

//entry
(async ()=>{
	await getWallet();
	await getOracleContract();
	//event listener for requests for data
	oracleContract.removeAllListeners()
	let debounce = true;
	oracleContract.on("RequestWeatherData", async (callerAddress, id, cityCountry, insuredAddress)=>{
		//handle request
		if(pendingRequests.includes(id) || debounce){return}
		pendingRequests.push(id);
		await handleRequest(callerAddress, id, cityCountry, insuredAddress)
		.then(msg => console.log(msg))
		.catch(err => console.log(err))
		//remove id from array
		pendingRequests = pendingRequests.filter(el => el != id);
	})
	oracleContract.on("RecievedWeatherData", async (id, claimReason)=>{
		console.log(`(RecievedWeatherData) id:${id} claim reason:${claimReason}`);
	})
	setTimeout(()=>debounce = false, 5000)
})();