const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')
////const name_x = document.getElementById('name_x').textContent
//console.log(name_x)

myVideo.muted = true
const peers = {}
let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})



myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id,NAME)
  console.log("gg")
  console.log(id)
  console.log(ROOM_ID)
  console.log(NAME)
  console.log("gg")

})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



socket.on("participants", (name,users,roomId) => {
  const user = { name, roomId }
 const gh= users.filter((user)=>user.roomId===roomId)
 console.log(gh.length)
 $("ol").replaceWith("<ol></ol>");
 for(i=0;i<gh.length;i++){  
 
  $("ol").append(`<li><b>${gh[i].name}</b><br/></li>`);
 
 }
 
});


socket.on("createMessage", (message,name) => {
  $("ul").append(`<li class="message"><b>${name}</b/><br/>${message}</li>`);
  console.log("yy")
  scrollToBottom();
});


const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};




//Mute our video

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
   
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
   
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
   
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};