/* JSHint inline rules */
/* jshint node: true, browser: true */
/* globals QBMediaRecorder, Promise */

'use strict';

var rec;
var canvas;

var notify = {
    ui: document.querySelector('.j-notify'),
    hide: function () {
        this.ui.classList.remove('notify-active');
    },
    show: function (txt) {
        var n = this;

        n.ui.textContent = txt;
        n.ui.classList.add('notify-active');

        var timerId = setTimeout(function () {
            n.hide();
        }, 5000);
    }
};

var pictureCard = {
    blob: null,
    ui: { 
        takePicture: document.querySelector('.j-picture'), 
        downloadPicture: document.querySelector('.j-downloadPicture')
    },
  toggleBtn: function (state) {
    console.log("estado:" + state);
        this.ui.takePicture.disabled = state;
        this.ui.downloadPicture.disabled = state;
    }
};

pictureCard.ui.takePicture.addEventListener('click', function () {
    pictureCard.ui.downloadPicture.disabled = false;
    const vid = document.getElementById('videoRecord');
    console.log('takeASnap');
    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0, 0); // the video
});

pictureCard.ui.downloadPicture.addEventListener('click', function () {
  downloadPicture();
});

function dateFormat() {
    let now = new Date();
    let year = '' + now.getFullYear();
    let month = '' + (now.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
    let day = '' + now.getDate(); if (day.length == 1) { day = '0' + day; }
    let hour = '' + now.getHours(); if (hour.length == 1) { hour = '0' + hour; }
    let minute = '' + now.getMinutes(); if (minute.length == 1) { minute = '0' + minute; }
    let second = '' + now.getSeconds(); if (second.length == 1) { second = '0' + second; }
    return year + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + second;
}

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var blobIos;
if (isChrome) {
var userAgent = navigator.userAgent || navigator.vendor || window.opera;
//if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
  var classNameArray = ['video', 'source', 'card-footer', 'btn-group-block'];
  
  classNameArray.forEach(function (className) {
    for (var i = 0; i < 3; i++) {
      if (typeof (document.getElementsByClassName(className)[i]) !==  'undefined') {
        document.getElementsByClassName(className)[i].style.visibility = 'hidden';
        document.getElementsByClassName(className)[i].style.display = 'none';
      }
    }
  });

  var idNameArrayIOS = ['btnVideoIos', 'videoIOS', 'btnPictureIos','cameraIOS'];
  idNameArrayIOS.forEach(function(idName) {
    document.getElementById(idName).style.visibility = 'visible';
    document.getElementById(idName).style.display = 'block';
  });

  $('.video-responsive.photo').css('padding-bottom', '50%');

  var canvas = document.getElementById('canvas');

  //canvas.setAttribute('style', 'position:relative;');
  /*
  var btnPlay = document.createElement("BUTTON");
  var textPlay = document.createTextNode("Play");
  btnPlay.appendChild(textPlay);
  btnPlay.setAttribute('id', 'playVideoIos');
  btnPlay.setAttribute('class', 'btn');
  btnPlay.setAttribute('onclick', SeeVideo());
  document.getElementsByClassName('card-image')[2].appendChild(btnPlay);
 
  let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

  btnPlay.addEventListener(touchEvent, function (event) {
    console.log("evento2: " + event);
    var video = document.getElementById('videoSee');
    //var tmppath = URL.createObjectURL(event.target.files[0]);
    debugger;
    blobIos = video.files[0];
    debugger;
    alert("bajando");
    video.src = URL.createObjectURL(blobIos);
    debugger;
    document.querySelector('.j-download').disable = true;
  });
   */
  /*
  var btnDownload = document.createElement("BUTTON");
  var textPlay = document.createTextNode("Donwload");
  btnDownload.appendChild(textPlay);
  btnDownload.setAttribute('id', 'donwloadVideoIos');
  btnDownload.setAttribute('class', 'btn');
  document.getElementsByClassName('card-image')[2].appendChild(btnDownload);

  btnDownload.addEventListener('click',function() {
    var opts = {
      onstop: function onStoppedRecording(blobIos) {
        resultCard.blob = blobIos;
        resultCard.attachVideo(blobIos);
      },
      workerPath: 'js/qbAudioRecorderWorker.js'
    };

    rec = new QBMediaRecorder(opts);
    rec.download(null, blobIos);
  });
  */
}

function seeVideo(event, element) {
  alert("click see");
  console.log("evento: " + Object.keys(event));
  var video = document.getElementById('videoSee');
  var inputVideo = document.getElementById('videoIOS').files[0];
  //debugger;
  blobIos = inputVideo;
  var blobURL = (window.URL || window.webkitURL).createObjectURL(blobIos);
  video.src = blobURL;
  document.querySelector('.j-download').disable = true;
  video.play();
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    (window.URL || window.webkitURL).revokeObjectURL(blobURL);
  }, 100);
}

function downloadVideo(event, element) {
  alert("click downloand");
  var opts = {
    onstop: function onStoppedRecording(blobIos) {
      resultCard.blob = blobIos;
      resultCard.attachVideo(blobIos);
    },
    workerPath: 'js/qbAudioRecorderWorker.js'
  };

  rec = new QBMediaRecorder(opts);
  rec.download(null, blobIos);
}

function seePicture(event, element) {
  console.log("ver foto");
  var inputPicture = document.getElementById('cameraIOS').files[0];
  var myCanvas = document.getElementById('canvas');
  var ctx = myCanvas.getContext('2d');
  var img = new Image();
  img.onload = function () {
    myCanvas.width = img.width;
    myCanvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    console.log(myCanvas.toDataURL('image/jpeg'));
  };
  console.log("carga");
  img.src = URL.createObjectURL(inputPicture);
  //ctx.drawImage(img, 0, 0);
  //canvas.setAttribute('style', 'position:relative');
  //var inputPicture = document.getElementById('cameraIOS').files[0];
  ////var tmppath = URL.createObjectURL(event.target.files[0]);
  //debugger;
  //var blobPictureIos = inputPicture;
  //var blobURL = (window.URL || window.webkitURL).createObjectURL(blobPictureIos);
  //canvas.src = blobURL;
  //debugger;
  //alert("bajando");
  //console.log("typeof: " + typeof blobIos);
  //var blobUrl = (window.URL || window.webkitURL).createObjectURL(blobPictureIos);
  //canvas.src = blobUrl;
  //debugger;
  document.querySelector('.j-download').disable = true;
  /*setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    (window.URL || window.webkitURL).revokeObjectURL(blobURL);
  }, 100);*/
  //const vid = document.getElementById('videoRecord');
  //console.log('takeASnap');
  //const ctx = canvas.getContext('2d'); // get its context
  //canvas.width = inputPicture.videoWidth; // set its size to the one of the video
  //canvas.height = inputPicture.videoHeight;
  //ctx.drawImage(inputPicture, 0, 0); // the video
}

function downloadPicture(event, element) {
  alert("descargar foto");
  canvas = document.getElementById('canvas');
  const a = document.createElement('a');
  const dateImage = dateFormat();
  if (/Edge/.test(navigator.userAgent) || /Trident/.test(navigator.userAgent)) {
    const blob = canvas.msToBlob();
    window.navigator.msSaveBlob(blob, 'screenshot_' + dateImage + '.png');
  }
  else {
    a.href = canvas.toDataURL('image/png');
    const dateImage = dateFormat();
    a.download = 'screenshot_' + dateImage + '.jpg';
    document.body.appendChild(a);
    a.click();
  }
}

/*
var videoIOS = document.getElementById('videoIOS');
function loadVideo(event, elemt) {
  console.log("evento click " + event + ' ' + elemt);
  debugger;
    var video = document.getElementById('videoSee');
    //var fileVideo = videoIOS.target.files[0];
    //debugger;
    blobIos = elemt.files[0];
    // alert("bajando");
    //debugger;
    //video.srcObject = blobIos;
    //debugger;
    document.querySelector('.j-download').disable = true;
}
*/
/*
var inputVideoIOS = document.getElementById('videoIOS');
inputVideoIOS.addEventListener('change', function (event) {
  console.log("evento: " + Object.keys(event));
  var video = document.getElementById('videoSee');
  //var tmppath = URL.createObjectURL(event.target.files[0]);
  blobIos = this.files[0];
  debugger;
  alert("bajando");
  video.src = URL.createObjectURL(blobIos);
  debugger;
  document.querySelector('.j-download').disable = true;
});
*/
/*
  $('#videoIOS').on('change',
    function(event) {
      console.log("evento: " + Object.keys(event));
      var video = document.getElementById('videoSee');
      //var tmppath = URL.createObjectURL(event.target.files[0]);
      blobIos = this.files[0];
      alert("bajando");
      video.src = URL.createObjectURL(blobIos);
      document.querySelector('.j-download').disable = true;
    });
    */
var resultCard = {
    blob: null, // saved a blob after stopped a record
    ui: {
        wrap: document.querySelector('.j-result-card'),
        video: document.querySelector('.j-video_result'),
        clear: document.querySelector('.j-clear'),
        download: document.querySelector('.j-download')
    },
    toggleBtn: function (state) {
        this.ui.clear.disabled = state;
        this.ui.download.disabled = state;
    },
    attachVideo: function (blob) {
        this.ui.video.src = URL.createObjectURL(blob);

        this.ui.clear.disabled = false;
        this.ui.download.disabled = false;
    },
    detachVideo: function () {
        this.blob = null;
        this.ui.video.src = '';

        this.ui.clear.disabled = true;
        this.ui.download.disabled = true;
    },
    setupListeners: function (rec) {
        var self = this;

        var evClear = new CustomEvent('clear');
        var evDownload = new CustomEvent('download');

        self.ui.clear.addEventListener('click', function () {
            self.ui.video.pause();
            self.detachVideo();

            self.ui.wrap.dispatchEvent(evClear);
        });

        self.ui.download.addEventListener('click', function () {
            self.ui.wrap.dispatchEvent(evDownload);
        });
    }
};

var inputCard = {
    audioRecorderWorkerPath: 'js/qbAudioRecorderWorker.js',
    stream: null,
    devices: {
        audio: [],
        video: []
    },
    ui: {
        wrap: document.querySelector('.j-card'),
        video: document.querySelector('.j-video_local'),

        start: document.querySelector('.j-start'),
        stop: document.querySelector('.j-stop'),
        pause: document.querySelector('.j-pause'),
        resume: document.querySelector('.j-resume'),

        takePicture: document.querySelector('.j-picture'), 

        selectAudioSource: document.getElementById('j-audioSource'),
        selectVideoSource: document.getElementById('j-videoSource'),
        selectMimeTypeFormats: document.getElementById('j-mimeTypes')
    },
    _createOptions: function (type) {
        var docfrag = document.createDocumentFragment();

        /* create a default option */
        var optDef = document.createElement('option');
        optDef.textContent = `Choose an input ${type}-device`;
        optDef.value = 'default';

        docfrag.appendChild(optDef);

        /* create a options with available sources */
        this.devices[type].forEach(function (device, index) {
            var option = document.createElement('option');

            option.value = device.deviceId;
            option.textContent = device.label || `${index + 1} ${type} source`;

            docfrag.appendChild(option);
        });

        /* create a option which off a type a media */
        var optOff = document.createElement('option');
        optOff.textContent = `Off ${type} source`;
        optOff.value = 0;

        docfrag.appendChild(optOff);

        return docfrag;
    },
    _createMimeTypesOptions: function (mimeTypes) {
        var docfrag = document.createDocumentFragment();

        mimeTypes.forEach(function (mimeType) {
            var option = document.createElement('option');

            option.value = mimeType;
            option.textContent = mimeType;

            if (mimeType.includes('video')) {
                option.classList.add('j-videoMimeType');
            } else {
                option.classList.add('j-audioMimeType');
                option.disabled = true;
            }

            docfrag.appendChild(option);
        });

        return docfrag;
    },
    _processDevices: function (devices) {
        var self = this;

        var docfragAudio = document.createDocumentFragment(),
            docfragVideo = document.createDocumentFragment();

        devices.forEach(function (device) {
            if (device.kind.indexOf('input') !== -1) {
                if (device.kind === 'audioinput') {
                    /* set audio source to collection */
                    self.devices.audio.push(device);
                }

              if (device.kind === 'videoinput') {
                    /* set video source to collection */
                  self.devices.video.push(device);
              }
            }
        });

        //console.log(Object.keys(self.devices));

        if (self.devices.audio.length > 0) {
            self.ui.selectAudioSource.appendChild(self._createOptions('audio'));
            self.ui.selectAudioSource.classList.remove('invisible');
        }

        if (self.devices.video.length > 0) {
            self.ui.selectVideoSource.appendChild(self._createOptions('video'));
            self.ui.selectVideoSource.classList.remove('invisible');
        }

        if (QBMediaRecorder.getSupportedMimeTypes().length) {
            var audioMimeTypes = QBMediaRecorder.getSupportedMimeTypes('audio'),
                videoMimeTypes = QBMediaRecorder.getSupportedMimeTypes('video'),
                allMimeTypes = videoMimeTypes.concat(audioMimeTypes);

            self.ui.selectMimeTypeFormats.appendChild(self._createMimeTypesOptions(allMimeTypes));
            self.ui.selectMimeTypeFormats.classList.remove('invisible');
        }
    },
    getDevices: function () {
        var self = this;

        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                self._processDevices(devices);
            });
    },
    attachStreamToSource: function () {
        this.ui.video.pause();

        try {
            this.ui.video.srcObject = null;
            this.ui.video.srcObject = this.stream;
        } catch (error) {
            this.ui.video.src = '';
            this.ui.video.src = URL.createObjectURL(this.stream);
        }

        this.ui.video.play();
    },
    getUserMedia: function (attrs) {
      var constraints = attrs || { audio: true, video: true };

      return navigator.mediaDevices.getUserMedia(constraints);
    },
    _getSources: function () {
        var sVideo = this.ui.selectVideoSource,
            sAudio = this.ui.selectAudioSource,
            selectedAudioSource = sAudio.options[sAudio.selectedIndex].value,
            selectedVideoSource = sVideo.options[sVideo.selectedIndex].value;

        var constraints = {};

        if (selectedAudioSource === 'default') {
            constraints.audio = true;
        } else if (selectedAudioSource === '0') {
            constraints.audio = false;
            this._toggleAudioTypesSelect(true);
        } else {
            constraints.audio = { deviceId: selectedAudioSource };
        }
      console.log("selectedVideoSource: " + selectedVideoSource);
        if (selectedVideoSource === 'default') {
            constraints.video = true;
        } else if (selectedVideoSource === '0') {
            constraints.video = false;
        } else {
            constraints.video = { deviceId: selectedVideoSource };
        }

        this._toggleAudioTypesSelect(constraints.audio);
        this._toggleVideoTypesSelect(!constraints.video);

        return constraints;
    },
    _toggleAudioTypesSelect: function (state) {
        var audioTypes = document.getElementsByClassName('j-audioMimeType');

        for (var i = 0; i < audioTypes.length; i++) {
            audioTypes[i].disabled = state;
        }
    },
    _toggleVideoTypesSelect: function (state) {
        var videoTypes = document.getElementsByClassName('j-videoMimeType');

        for (var i = 0; i < videoTypes.length; i++) {
            videoTypes[i].disabled = state;
        }
    },
    _stopStreaming: function () {
        this.stream.getTracks().forEach(function (track) {
            track.stop();
        });
    },
    _setupListeners: function () {
        var self = this;

        var evStart = new CustomEvent('started');
        var evPause = new CustomEvent('paused');
        var evResume = new CustomEvent('resumed');
        var evStop = new CustomEvent('stopped');
        var evChange = new CustomEvent('changed');

        self.ui.start.addEventListener('click', function () {
            self.ui.start.disabled = true;
            self.ui.resume.disabled = true;

            self.ui.stop.disabled = false;
            self.ui.pause.disabled = false;

            self.ui.selectMimeTypeFormats.disabled = true;

            self.ui.wrap.dispatchEvent(evStart);
        });

        self.ui.stop.addEventListener('click', function () {
            self.ui.start.disabled = false;

            self.ui.stop.disabled = true;
            self.ui.pause.disabled = true;
            self.ui.resume.disabled = true;

            self.ui.selectMimeTypeFormats.disabled = false;

            self.ui.wrap.dispatchEvent(evStop);
        });

        self.ui.pause.addEventListener('click', function () {
            self.ui.start.disabled = true;
            self.ui.pause.disabled = true;

            self.ui.resume.disabled = false;
            self.ui.stop.disabled = false;

            self.ui.wrap.dispatchEvent(evPause);
        });

        self.ui.resume.addEventListener('click', function () {
            self.ui.start.disabled = true;
            self.ui.resume.disabled = true;

            self.ui.pause.disabled = false;
            self.ui.stop.disabled = false;

            self.ui.wrap.dispatchEvent(evResume);
        });
    
        function handleSources() {
            var constrains = self._getSources();

            self._stopStreaming();
            self.stream = null;

            self.getUserMedia(constrains).then(function (stream) {
                self.stream = stream;
                self.attachStreamToSource();

                self.ui.wrap.dispatchEvent(evChange);
            });
        }

        function handleRecordMimeType() {
            var sMimeType = self.ui.selectMimeTypeFormats,
                selectedMimeType = sMimeType.options[sMimeType.selectedIndex].value;

            rec.toggleMimeType(selectedMimeType);
        }

        self.ui.selectAudioSource.addEventListener('change', handleSources);
        self.ui.selectVideoSource.addEventListener('change', handleSources);
        self.ui.selectMimeTypeFormats.addEventListener('change', handleRecordMimeType);
    },
    init: function () {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getUserMedia()
                .then(function (stream) {
                    self.stream = stream;
                    self.attachStreamToSource();
                    self.getDevices();
                    self._setupListeners();
                    self.ui.takePicture.disabled = false;
          
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
        });
    }
};

/* Start !FUN */
inputCard.init()
    .then(function () {
        initRecorder();
    })
    .catch(function (error) {
        notify.show(`Error: ${error.name}`);
    });

function initRecorder() {
    const opts = {
      onstop: function onStoppedRecording(blob) {
        resultCard.blob = blob;
        resultCard.attachVideo(blob);
      },
      workerPath: inputCard.audioRecorderWorkerPath
    };

    rec = new QBMediaRecorder(opts);

    resultCard.setupListeners();

    inputCard.ui.wrap.addEventListener('started', function () {
        rec.start(inputCard.stream);
    }, false);

    inputCard.ui.wrap.addEventListener('paused', function () {
        rec.pause();
    }, false);

    inputCard.ui.wrap.addEventListener('resumed', function () {
        rec.resume();
    }, false);

    inputCard.ui.wrap.addEventListener('changed', function () {
        if (rec.getState() === 'recording') {
            rec.change(inputCard.stream);
        }
    }, false);

    inputCard.ui.wrap.addEventListener('stopped', function () {
        rec.stop();
        resultCard.toggleBtn(false);
    }, false);

    resultCard.ui.wrap.addEventListener('download', function () {
        rec.download(null, resultCard.blob);
    }, false);

}
