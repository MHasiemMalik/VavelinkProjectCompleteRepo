//import './style.css'
//Not using the vite dependancies for now.. using the sdk files direactly form the previouse projects 
//import AgoraRTC from "agora-rtc-sdk-ng"
//import AgoraRTM from "agora-rtm-sdk"

import appid from './appId.js'
const token = null

const rtcUid =  Math.floor(Math.random() * 2032)
const rtmUid =  String(Math.floor(Math.random() * 2032))

const getRoomId = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.get('room')){
    return urlParams.get('room').toLowerCase()
  }
}

let roomId = getRoomId() || null
document.getElementById('form').roomname.value = roomId


let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {},
};

let micMuted = true

let rtcClient;
let rtmClient;
let channel;


const initRtm = async (name) => {

  rtmClient = AgoraRTM.createInstance(appid)
  await rtmClient.login({'uid':rtmUid, 'token':token})

  channel = rtmClient.createChannel(roomId)
  await channel.join()

  await rtmClient.addOrUpdateLocalUserAttributes({'name':name, 'userRtcUid':rtcUid.toString()})

  getChannelMembers()

  window.addEventListener('beforeunload', leaveRtmChannel)

  channel.on('MemberJoined', handleMemberJoined)
  channel.on('MemberLeft', handleMemberLeft)
}



const initRtc = async () => {
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


  //rtcClient.on('user-joined', handleUserJoined)
  rtcClient.on("user-published", handleUserPublished)
  rtcClient.on("user-left", handleUserLeft);
  

  await rtcClient.join(appid, roomId, token, rtcUid)
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  audioTracks.localAudioTrack.setMuted(micMuted)
  await rtcClient.publish(audioTracks.localAudioTrack);


  //document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${rtcUid}" id="${rtcUid}"><p>${rtcUid}</p></div>`)

  initVolumeIndicator()
}

let initVolumeIndicator = async () => {

  //1
  AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
  rtcClient.enableAudioVolumeIndicator();
  
  //2
  rtcClient.on("volume-indicator", volumes => {
    volumes.forEach((volume) => {
      console.log(`UID ${volume.uid} Level ${volume.level}`);

      //3
      try{
          let item = document.getElementsByClassName(`user-rtc-${volume.uid}`)[0]

          if (volume.level >=40) {
            item.style.boxShadow = '0 0 30px #00ff00';
          }else if(volume.level >= 20 && volume.level <40){
            item.style.boxShadow = '0 0 20px #00ff00';
          } else if(volume.level >= 5 && volume.level <20){
            item.style.boxShadow = '0 0 10px #00ff00';
          } 
          else if(volume.level >= 3 && volume.level <5){
            item.style.boxShadow = '0 0 7px #00ff00';
          } 
          else {
            item.style.boxShadow = '0 0 3px #fff';
          }
      }catch(error){
        console.error(error)
      }


    });
  })
}


// let handleUserJoined = async (user) => {
//   document.getElementById('members').insertAdjacentHTML('beforeend', `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`)
// } 

let handleUserPublished = async (user, mediaType) => {
  await  rtcClient.subscribe(user, mediaType);

  if (mediaType == "audio"){
    audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
    user.audioTrack.play();
  }
}

let handleUserLeft = async (user) => {
  delete audioTracks.remoteAudioTracks[user.uid]
  //document.getElementById(user.uid).remove()
}

let handleMemberJoined = async (MemberId) => {

  let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid'])

  let newMember = `
  <div class="speaker user-rtc-${userRtcUid}" id="${MemberId}">
      <p>${name}</p>
  </div>`

  document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
}

let handleMemberLeft = async (MemberId) => {
  document.getElementById(MemberId).remove()
}

let getChannelMembers = async () => {
  let members = await channel.getMembers()

  for (let i = 0; members.length > i; i++){

    let {name, userRtcUid} = await rtmClient.getUserAttributesByKeys(members[i], ['name', 'userRtcUid'])

    let newMember = `
    <div class="speaker user-rtc-${userRtcUid}" id="${members[i]}">
        <p>${name}</p>
    </div>`
  
    document.getElementById("members").insertAdjacentHTML('beforeend', newMember)
  }
}

const toggleMic = async (e) => {
  if (micMuted){
    e.target.src = 'icons/mic.svg'
    e.target.style.backgroundColor = '#b3de24'
    micMuted = false
  }else{
    e.target.src = 'icons/mic-off.svg'
    e.target.style.backgroundColor = 'rgba(102, 109, 101, 0.801)'
    
    micMuted = true
  }
  audioTracks.localAudioTrack.setMuted(micMuted)
}


let lobbyForm = document.getElementById('form')

const enterRoom = async (e) => {
  e.preventDefault()

  roomId = e.target.roomname.value.toLowerCase();
  window.history.replaceState(null, null, `?room=${roomId}`);

  initRtc()

  let displayName = e.target.displayname.value;
  initRtm(displayName)

  lobbyForm.style.display = 'none'
  document.getElementById('room-header').style.display = "flex"
}

let leaveRtmChannel = async () => {
  await channel.leave()
  await rtmClient.logout()
}

let leaveRoom = async () => {
  audioTracks.localAudioTrack.stop()
  audioTracks.localAudioTrack.close()
  rtcClient.unpublish()
  rtcClient.leave()

  leaveRtmChannel()

  document.getElementById('form').style.display = 'block'
  document.getElementById('room-header').style.display = 'none'
  document.getElementById('members').innerHTML = ''
}

lobbyForm.addEventListener('submit', enterRoom)
document.getElementById('leave-icon').addEventListener('click', leaveRoom)
document.getElementById('mic-icon').addEventListener('click', toggleMic)