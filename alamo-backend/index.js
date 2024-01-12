require('dotenv').config()

const fs = require('fs');
const axios = require('axios')
const {loginUbi, loginTrackmaniaUbi, 
       loginTrackmaniaNadeo, getMaps} = require('trackmania-api-node')
let OAuthToken

var loggedIn;
var credentials;
var nadeoTokens;
var loginAttempts = 0;

const login = async credentials => {
  try {
    console.log('attemping login')
    const { ticket } = await loginUbi(credentials) // login to ubi, level 0
    return await loginTrackmaniaUbi(ticket) // login to trackmania, level 1
  } catch (e) {
    console.log('login failed')
    console.log(e.toJSON())
  }
}

const myUrls = {
    auth: {
        ubisoft: 'https://public-ubiservices.ubi.com/v3/profiles/sessions',
        trackmaniaUbi: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices',
        trackmaniaNadeo: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/nadeoservices',
        refreshToken: 'https://prod.trackmania.core.nadeo.online/v2/authentication/token/refresh',
    },
    prodTrackmania: 'https://prod.trackmania.core.nadeo.online',
    liveServices: 'https://live-services.trackmania.nadeo.live',
    matchmaking: 'https://matchmaking.trackmania.nadeo.club/api/matchmaking/2/',
};

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Ubi-AppId': '86263886-327a-4328-ac69-527f0d20a237',
    'Ubi-RequestedPlatformType': 'uplay',
};

const mySetHeaders = (auth, type) => type === 'basic'
  ? Object.assign(Object.assign({}, defaultHeaders), { Authorization: 'Basic ' + auth }) : type === 'ubi'
    ? Object.assign(Object.assign({}, defaultHeaders), { Authorization: 'ubi_v1 t=' + auth }) : type === 'nadeo' && Object.assign(Object.assign({}, defaultHeaders), { Authorization: 'nadeo_v1 t=' + auth });

const getClubActivity = async (clubId, offset = 0, length = 100) => {
  const headers = mySetHeaders(nadeoTokens.accessToken, 'nadeo');
  const response = await axios.default({
    url: myUrls.liveServices +
      '/api/token/club/' + clubId + '/activity?active=1&offset=' +
      offset +
      '&length=' +
      length,
    method: 'GET',
    headers,
  });
  return response['data'];
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const loginAgain = async () => {
  await delay(120000);

  loginAttempts = loginAttempts + 1;
  if (loginAttempts >= 3) {
    console.log("Logging in too many times")
    process.exit();
  }

  loggedIn = await login(credentials)
  const { accessToken, accountId, username } = loggedIn
  myAccessToken = accessToken;
  console.log("token", myAccessToken);
  nadeoTokens = await loginTrackmaniaNadeo(accessToken, 'NadeoLiveServices')
  console.log("nadeoTokens", nadeoTokens);
}

const getCampaign = async (clubId, campaignId) => {
  try {
    const headers = mySetHeaders(nadeoTokens.accessToken, 'nadeo');
    const response = await axios.default({
      url: 'https://live-services.trackmania.nadeo.live/api/token/club/' + clubId + '/campaign/' + campaignId,
      method: 'GET',
      headers,
    });
    return response['data'];
  } catch (error) {
    await loginAgain()
    return getCampaign(nadeoTokens.accessToken, clubId, campaignId)
  }
};

var retry = 0;
const getMapRecordsFromTMIO = async (groupId, mapId, offset) => {
  try {
    const response = await axios.default({
      url: 'https://trackmania.io/api/leaderboard/' + groupId + '/' + mapId + '?offset=' + offset + '&length=100',
      method: 'GET',
      headers: {
        'User-Agent': 'Alamo Cup AT Tracker: saranshraina1@gmail.com'
      },
    });

    retry = 0;
    return response['data'];
  } catch (error) {
    retry = retry + 1;
    if (retry > 3) {
      process.exit()
    }
    return getMapRecordsFromTMIO(groupId, mapId, offset);
  }
};

// Function to obtain the OAuth access token
async function getAccessToken() {
  const clientId = '2833471905484e0b25df';
  const clientSecret = '92ecfcf6fa2b00dd700a8360f49e64e544497d57';
  const accessTokenUrl = 'https://api.trackmania.com/api/access_token';

  try {
    const response = await axios.post(
      accessTokenUrl,
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Extracting the access token from the response
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error obtaining access token:', error.message);
    throw error;
  }
}

const getPlayerName = async (playerIdList) => {
  const displayNameUrl = 'https://api.trackmania.com/api/display-names';
  try {
    const response = await axios.get(`${displayNameUrl}?accountId[]=${playerIdList}`, {
      headers: {
        Authorization: `Bearer ${OAuthToken}`,
      },
    });
    return Object.values(response.data);
  } catch (error) {
    await loginAgain()
    return getPlayerName(playerIdList);
  }
};

const getTrackData = async loggedIn => {
  const { accessToken, accountId, username } = loggedIn
  myAccessToken = accessToken;
  OAuthToken = await getAccessToken();
  try {
    var data = {
      campaigns: [],
      activity: {}
    }

    nadeoTokens = await loginTrackmaniaNadeo(accessToken, 'NadeoLiveServices')
    
    var AlamoId = '48466';
    
    // 1. get all Alamo campaigns in the club
    const activity = await getClubActivity(AlamoId);
    data.activity = activity;
    var camps = [];
    // list campaigns
    for (var item of activity.activityList) {
      if (item.activityType == "campaign" && item.name.includes("Alamo Cup Maps")) {
        console.log("Downloading data for campaign: ", item.campaignId);
        // 2. for each Alamo campaign, list all the maps
        const AlamoCampaignId = item.campaignId;
        const campaign = await getCampaign(AlamoId, AlamoCampaignId);

        var camp = {
          detail: campaign,
          mapsDetail: {},
          mapsRecords: {},
          groupId: ""
        }

        var mapUids = []
        for (var map of campaign.campaign.playlist) {
          mapUids.push(map.mapUid)
        }

        console.log("Downloading maps for mapUids: ", mapUids);

        // 3. for each campaign, pass the list of maps to get the map details
        let mapsDetail = await getMaps(myAccessToken, mapUids)
        let playerList = mapsDetail[0].author
        for (let i = 1; i < mapsDetail.length; i++) {
          playerList = playerList.concat('&accountId[]=' + mapsDetail[i].author)
        }
        const arrPL = playerList.split('&accountId[]=')
        const mapAuthorNames = await getPlayerName(playerList)
        for (let i = 0; i < arrPL.length; i++) {
          const dName = mapAuthorNames.find(n => n.accountId === arrPL[i])
          if (dName) {
            mapsDetail[i].authorName = dName.displayName
          }
        }
        camp.mapsDetail = mapsDetail;
        // 4. for each campaign, pass the list of maps to get the records 
        camp.groupId = campaign.campaign.leaderboardGroupUid;
        camps.push(camp);
      }
    }
    let APIcount = 0;
    let count = 1;
    const startTime = new Date().getTime()
    for (var camp of camps) {
      for (var mapDet of camp.mapsDetail) {        
        console.log("Downloading records for map: ", count)
        count++;
        camp.mapsRecords[mapDet.mapUid] = []
        let mapRecords
        let offset = 0;
        do {
        mapRecords = await getMapRecordsFromTMIO(camp.groupId, mapDet.mapUid, offset)
        APIcount++;
        var timer = new Date(new Date().getTime() + 2000)
        while (timer > new Date()) { }
        camp.mapsRecords[mapDet.mapUid] = camp.mapsRecords[mapDet.mapUid].concat(mapRecords.tops)
        offset += mapRecords.tops.length
        } while (mapRecords.tops[mapRecords.tops.length - 1].time <= mapDet.authorScore 
                  && offset < mapRecords.playercount && offset < 10000)
        
      } 
      console.log('camp done')
      data.campaigns.push(camp)
    }
    const endTime = new Date().getTime()
    const timeTaken = (endTime - startTime)/60000
    console.log(APIcount/timeTaken + " TMIO Calls/min")

    //API CALLS DONE SO PROCESS DATA NEXT
    
    let mapATList = []
    for (const c in data.campaigns) {
      const camp = data.campaigns[c]
      for (let i = 0; i < camp.mapsDetail.length; i++) {
        const mapUID = camp.mapsDetail[i].mapUid
        const newMap = {
          _id: mapUID,
          name: camp.mapsDetail[i].name.replace(/\$[0-9a-fA-F]{3}/g, '').replace(/\$[oiwntsgzOIWNTSGZ$]/g, ''),
          mapperName: camp.mapsDetail[i].authorName,
          AT: camp.mapsDetail[i].authorScore,
          ATHolders: []
        }

        const mapRecords = camp.mapsRecords[mapUID];
        for (const record of mapRecords) {
          if (record.time <= newMap.AT) {
            newMap.ATHolders.push(record.player.name);
          }
        }
        mapATList.push(newMap)
      }
    }

    // Add AT Stats
    let playerArr = []
    for (let i = 0; i < mapATList.length; i++) {
      const curMap = mapATList[i]
      for (let j = 0; j < curMap.ATHolders.length; j++) {
        let player = playerArr.find(player => player._id === curMap.ATHolders[j])
        if (player) {
          player.ATcount++
        } else {
          let newPlayer = {
            _id: curMap.ATHolders[j],
            ATcount: 1,
            WRcount: 0,
            Mapcount: 0
          }
          if (newPlayer._id) {
            playerArr.push(newPlayer)
          }
        }
      }
    }

    // Add WR Stats
    for (let i = 0; i < mapATList.length; i++) {
      let player = playerArr.find(player => player._id === mapATList[i].ATHolders[0])
      if (player) {
        player.WRcount++
      }
    }

    // Add Mapping Stats
    for (let i = 0; i < mapATList.length; i++) {
      let mapper = playerArr.find(player => player._id === mapATList[i].mapperName)
      if (mapper) {
        mapper.Mapcount++
      } else {
        let newMapper = {
          _id: mapATList[i].mapperName,
          ATcount: 0,
          WRcount: 0,
          Mapcount: 1
        }
        if (newMapper._id) {
          playerArr.push(newMapper)
        }
      }
    }

    // Add Track Stats
    let trackArr = []
    for (let i = 0; i < mapATList.length; i++) {
      const curMap = mapATList[i]
      const newTrack = {
        _id: curMap.name,
        AT: curMap.AT,
        ATcount: curMap.ATHolders.length
      }
      if (newTrack._id) {
        trackArr.push(newTrack)
      }
    }

    // Save playerArr data to a JSON file
    const playerArrData = JSON.stringify(playerArr, null, 2); // 2 is for indentation
    fs.writeFileSync('playerArr.json', playerArrData);
    console.log('playerArr.json created successfully!');

    // Save trackArr data to a JSON file
    const trackArrData = JSON.stringify(trackArr, null, 2); // 2 is for indentation
    fs.writeFileSync('trackArr.json', trackArrData);
    console.log('trackArr.json created successfully!');

    /*
    // Send Data to Database
    console.log('uploading player data')
    for (let i = 0; i < playerArr.length; i += 1000) {
      let batchArr = playerArr.slice(i,i+1000)
      axios.post('https://ey39vc0xjb.execute-api.us-east-1.amazonaws.com/prod/api/players', batchArr)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log("error with player data: ", error.response.data)
        })
    }
    console.log('uploading track data')
    for (let i = 0; i < trackArr.length; i += 1000) {
      let batchArr = trackArr.slice(i,i+1000)
      axios.post('https://ey39vc0xjb.execute-api.us-east-1.amazonaws.com/prod/api/tracks', batchArr)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log("error with track data", error.response.data)
        })
    }*/
  } catch (e) {
    console.log(e)
  }
}

(async () => {
  console.log("Logging in...");
  if (process.env.TM_PW && process.env.TM_PW.length > 0) {
    if (process.env.TM_EMAIL && process.env.TM_EMAIL.length > 0) {
      credentials = Buffer.from(process.env.TM_EMAIL + ':' + process.env.TM_PW).toString('base64')
      console.log("Got credentials");
      loggedIn = await login(credentials)
      if (loggedIn) {
        try {
          console.log('logged in, attempting data')
          await getTrackData(loggedIn)
        } catch (e) {
            console.log(e)
        }
      } else {
        console.log("Failed to log in, aborting")
      }
    } else {
      console.log("TM_EMAIL must be set")
    }
  } else {
    console.log("TM_PW must be set")
  }
})()