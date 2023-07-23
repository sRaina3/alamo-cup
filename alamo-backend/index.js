require('dotenv').config()
const axios = require('axios')
const {loginUbi, loginTrackmaniaUbi, 
       loginTrackmaniaNadeo, getMaps} = require('trackmania-api-node')

var loggedIn;
var credentials;
var nadeoTokens;
var loginAttempts = 0;

var fs = require('fs');

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

mySetHeaders = (auth, type) => type === 'basic'
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
    return getMapRecordsFromTMIO(groupId, mapId);
  }
};

const getPlayerName = async (playerIdList) => {
  try {
    const headers = mySetHeaders(loggedIn.accessToken, 'nadeo');
    const response = await axios.default({
      url: myUrls.prodTrackmania + '/accounts/displayNames/?accountIdList=' + playerIdList,
      method: 'GET',
      headers
    });

    return response['data'];
  } catch (error) {
    await loginAgain()
    return getPlayerName(playerIdList);
  }
};

const getTrackData = async loggedIn => {
  const { accessToken, accountId, username } = loggedIn
  myAccessToken = accessToken;
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
          playerList = playerList.concat(',' + mapsDetail[i].author)
        }
        const arrPL = playerList.split(',')
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
    for (var camp of camps) {
      for (var mapDet of camp.mapsDetail) {
        console.log("Downloading records for map", mapDet.mapUid)
        camp.mapsRecords[mapDet.mapUid] = []
        let mapRecords
        let offset = 0;
        do {
        mapRecords = await getMapRecordsFromTMIO(camp.groupId, mapDet.mapUid, offset)
        console.log(offset)
        camp.mapsRecords[mapDet.mapUid] = camp.mapsRecords[mapDet.mapUid].concat(mapRecords.tops)
        offset += mapRecords.tops.length
        } while (offset < mapRecords.playercount && offset < 10000)

        var waitTill = new Date(new Date().getTime() + 1500);
        while (waitTill > new Date()) { }
      }
      data.campaigns.push(camp)
    }

    // 5. write the data.json file
    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
      if (err) throw err;
    })
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

console.log("Done")