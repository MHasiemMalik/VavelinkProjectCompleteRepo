let APP_ID = "8b43b8d1864e40d59cd868ce9cd55d7a";

let token = null;
let uid = String(Math.floor(Math.random() * 100000));

let client;
let channel;

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get('room');

if (!roomId) {
    window.location = 'lobby.html';
}

let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
};

let constraints = {
    video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: true
};

let init = async () => {
    client = await AgoraRTM.createInstance(APP_ID);
    await client.login({ uid, token });

    channel = client.createChannel(roomId);
    await channel.join();

    channel.on('MemberJoined', handleUserJoined);
    channel.on('MemberLeft', handleUserLeft);

    client.on('MessageFromPeer', handleMessageFromPeer);

    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    document.getElementById('user-1').srcObject = localStream;

    // Additional change: Display local video
    document.getElementById('user-1').style.display = 'block';
}

let handleUserLeft = (MemberId) => {
    document.getElementById('user-2').style.display = 'none';
    document.getElementById('user-1').classList.remove('smallFrame');

    // Stop and remove the remote stream
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        document.getElementById('user-2').srcObject = null;
        remoteStream = null;
    }
};

let handleMessageFromPeer = async (message, MemberId) => {
    message = JSON.parse(message.text);

    if (message.type === 'offer') {
        createAnswer(MemberId, message.offer);
    }

    if (message.type === 'answer') {
        addAnswer(message.answer);
    }

    if (message.type === 'candidate') {
        if (peerConnection && peerConnection.remoteDescription) {
            try {
                await peerConnection.addIceCandidate(message.candidate);
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        }
    }
};

let handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId);
    createOffer(MemberId);
};

let createPeerConnection = async (MemberId) => {
    console.log('Creating peer connection...');
    try {
        peerConnection = new RTCPeerConnection(servers);

        remoteStream = new MediaStream();
        document.getElementById('user-2').srcObject = remoteStream;
        document.getElementById('user-2').style.display = 'block';

        document.getElementById('user-1').classList.add('smallFrame');

        if (!localStream) {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('user-1').srcObject = localStream;
        }

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            console.log('ontrack event triggered:', event);
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'candidate', 'candidate': event.candidate }) }, MemberId);
            }
        };

        console.log('Peer connection created successfully.');
    } catch (error) {
        console.error('Error creating peer connection:', error);
    }
};


let createOffer = async (MemberId) => {
    console.log('Creating offer...');
    try { 
    await createPeerConnection(MemberId);

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'offer', 'offer': offer }) }, MemberId);
    console.log('Offer created successfully.');
 } catch (error) {
    console.error('Error creating offer:', error);
 }
};

let createAnswer = async (MemberId, offer) => {
    console.log('Creating answer...');
    try {
    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer({ text: JSON.stringify({ 'type': 'answer', 'answer': answer }) }, MemberId);
    console.log('Answer created successfully.');
} catch (error) {
    console.error('Error creating answer:', error);
}
};

let addAnswer = async (answer) => {
    console.log('Adding answer...');
    try {
    if (!peerConnection.currentRemoteDescription) {
        try {
            await peerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error setting remote description:', error);
        }
    }
    console.log('Answer added successfully.');
 } catch (error) {
    console.error('Error adding answer:', error);
 }
};

let leaveChannel = async () => {
    await channel.leave();
    await client.logout();
};

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video');

    if (videoTrack.enabled) {
        videoTrack.enabled = false;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80)';
    } else {
        videoTrack.enabled = true;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(131, 4, 251, 0.9)';
    }
};

let toggleMic = async () => {
    await requestMicrophonePermissions();

    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio' || track.kind === 'microphone');

    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        document.getElementById('mic-btn').style.backgroundColor = audioTrack.enabled
            ? 'rgb(131, 4, 251, 0.9)'
            : 'rgb(255, 80, 80)';

        if (peerConnection && peerConnection.getReceivers().length > 0) {
            let remoteAudioTrack = peerConnection.getReceivers()[0].track;
            if (remoteAudioTrack) {
                remoteAudioTrack.enabled = audioTrack.enabled;
            }
        }
    }
};

async function requestMicrophonePermissions() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // You can handle logic after obtaining permission if needed
    } catch (error) {
        console.error('Error requesting microphone permissions:', error);
        // Handle permission error (e.g., display a message to the user)
    }
}

window.addEventListener('beforeunload', leaveChannel);

document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('mic-btn').addEventListener('click', toggleMic);

init();
