﻿!function(e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    ("undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : this).QBMediaRecorder = e()
  }
}(function() {
  return function e(t, o, r) {
    function i(s, a) {
      if (!o[s]) {
        if (!t[s]) {
          var d = "function" == typeof require && require;
          if (!a && d) return d(s, !0);
          if (n) return n(s, !0);
          var c = new Error("Cannot find module '" + s + "'");
          throw c.code = "MODULE_NOT_FOUND", c
        }
        var u = o[s] = { exports: {} };
        t[s][0].call(u.exports,
          function(e) {
            var o = t[s][1][e];
            return i(o || e)
          },
          u,
          u.exports,
          e,
          t,
          o,
          r)
      }
      return o[s].exports
    }

    for (var n = "function" == typeof require && require, s = 0; s < r.length; s++) i(r[s]);
    return i
  }({
      1: [
        function(e, t, o) {
          "use strict";
          t.exports = {
            unsupport: "QBMediaRecorder is not supported this environment.",
            unsupportCustomAudioRecorder: "qbAudioRecorderWorker.js wasn't found.",
            unsupportAudioContext: "AudioContext API is not supported this environment.",
            unsupportMediaRecorderWithOptions:
              "Got a warning when creating a MediaRecorder, trying to create MediaRecorder without options.",
            requreArgument: "1 argument required, but only 0 present.",
            callbackError: "Founded an error in callback:",
            actionFailed: "QBMediaRecorder is not created or has an invalid state.",
            no_recorded_chunks: "Does not have any recording data.",
            streamRequired: "MediaStream is required.",
            InvalidState:
              "QBMediaRecorder is not in a state in which the proposed operation is allowed to be executed.",
            OutOfMemory:
              "The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.",
            IllegalStreamModification:
              "A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.",
            OtherRecordingError:
              "Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.",
            GenericError: "The UA cannot provide the codec or recording option that has been requested"
          }
        }, {}
      ],
      2: [
        function(e, t, o) {
          "use strict";

          function r(e) {
            this.toggleMimeType(e.mimeType), e.workerPath && this._setCustomRecorderTools(e.workerPath),
              this.timeslice =
                e && e.timeslice && isNaN(+e.timeslice) ? e.timeslice : 1e3, this.callbacks =
                e ? this._getCallbacks(e) : {}, this.recordedBlobs = [], this.ignoreMutedMedia =
                !e || "boolean" != typeof e.ignoreMutedMedia || e.ignoreMutedMedia, this._stream =
                null, this._mediaRecorder = null, this._recordedChunks = [], this._keepRecording = !1
          }

          var i = e("./errors");
          r.prototype.toggleMimeType = function(e) {
            var t = e || !1;
            if (this._customMimeType =
              "audio/wav" === t ? "audio/wav" : "audio/mp3" === t && "audio/mp3", !r.isAvailable() &&
              !this._customMimeType) throw new Error(i.unsupport);
            this.mimeType = this._customMimeType ? this._customMimeType : this._getMimeType(t)
          }, r.prototype._setCustomRecorderTools = function(e) {
            var t = this;
            try {
              if (t._worker =
                new Worker(e), t._postMessageToWorker({ cmd: "init", mimeType: t.mimeType }), t._worker.onmessage =
                function(e) { t._createBlob(e.data), t._closeAudioProcess() }, !r.isAudioContext())
                throw new Error(i.unsupportAudioContext);
              t.BUFFER_SIZE = 2048, t.INPUT_CHANNELS = 1, t.OUTPUT_CHANNELS = 1, t._audioContext = null
            } catch (e) {
              throw new Error(i.unsupportCustomAudioRecorder, e)
            }
          }, r.prototype._getMimeType = function(e) {
            var t, o = "video";
            return e && r.isTypeSupported(e)
              ? t = e
              : e
              ? (o = -1 === e.toString().toLowerCase().indexOf("audio") ? "video" : "audio", t =
                r.getSupportedMimeTypes(o)[0])
              : t = r.getSupportedMimeTypes(o)[0], t
          }, r.prototype._getCallbacks = function(e) {
            var t = {};
            return ["onstart", "onstop", "onpause", "onresume", "onerror", "onchange", "ondataavailable"].forEach(
              function(o) { o in e && (t[o] = e[o]) }), t
          }, r._mimeTypes = e("./mimeTypes"), r._STATES = ["inactive", "recording", "paused"], r.isAvailable =
            function() {
              return !!(window &&
                window.MediaRecorder &&
                "function" == typeof window.MediaRecorder.isTypeSupported &&
                window.Blob)
            }, r.isAudioContext =
            function() { return !(!window || !window.AudioContext && !window.webkitAudioContext) }, r.isTypeSupported =
            function(e) {
              var t = !1;
              if (!r.isAvailable()) throw new Error(i.unsupport);
              if (!e) throw new Error(i.requreArgument);
              switch (e) {
              case "audio/wav":
              case "audio/mp3":
                r.isAudioContext() && (t = !0);
                break;
              default:
                t = window.MediaRecorder.isTypeSupported(e)
              }
              return t
            }, r.getSupportedMimeTypes = function(e) {
            var t = e || "video";
            if (!r.isAvailable()) throw new Error(i.unsupport);
            return r._mimeTypes[t].filter(function(e) { return r.isTypeSupported(e) })
          }, r.prototype.getState =
            function() { return this._mediaRecorder ? this._mediaRecorder.state : r._STATES[0] }, r.prototype.start =
            function(e) {
              if (!e) throw new Error(i.requreArgument);
              var t = this.getState();
              t !== r._STATES[1] && t !== r._STATES[2] || this._mediaRecorder.stop(),
                this._stream && (this._stream = null), this._stream = e, this._mediaRecorder =
                  null, this._recordedChunks.length =
                  0, this._customMimeType ? this._setCustomRecorder() : this._setMediaRecorder(), this._setEvents()
            }, r.prototype._setMediaRecorder = function() {
            var e = this;
            try {
              e._mediaRecorder =
                new window.MediaRecorder(e._stream, { mimeType: e.mimeType, ignoreMutedMedia: e.ignoreMutedMedia })
            } catch (t) {
              console.warn(i.unsupportMediaRecorderWithOptions, t), e._mediaRecorder =
                new window.MediaRecorder(e._stream)
            }
          }, r.prototype._setCustomRecorder = function() {
            var e = this;
            e._closeAudioProcess(), e._mediaRecorder = {
              start: function() {
                try {
                  this.state = r._STATES[1], e._startAudioProcess(), this.onstart()
                } catch (e) {
                  this.onerror(e)
                }
              },
              stop: function() {
                try {
                  this.state = r._STATES[0], e._stopAudioProcess(), this.onstop()
                } catch (e) {
                  this.onerror(e)
                }
              },
              pause: function() {
                try {
                  this.state = r._STATES[2], this.onpause()
                } catch (e) {
                  this.onerror(e)
                }
              },
              resume: function() {
                try {
                  this.state = r._STATES[1], this.onresume()
                } catch (e) {
                  this.onerror(e)
                }
              },
              onstart: function() { "recording" !== this.state && (this.state = r._STATES[1]) },
              onstop: function() { "inactive" !== this.state && (this.state = r._STATES[0]) },
              onpause: function() { "paused" !== this.state && (this.state = r._STATES[2]) },
              onresume: function() { "recording" !== this.state && (this.state = r._STATES[1]) },
              onerror: function() {
                try {
                  e._closeAudioProcess()
                } catch (e) {
                  throw new Error(e)
                }
              }
            }
          }, r.prototype._fireCallback = function(e, t) {
            if (0 !== Object.keys(this.callbacks).length && "function" == typeof this.callbacks[e])
              try {
                this.callbacks[e](t)
              } catch (t) {
                console.error("Founded an error in callback:" + e, t)
              }
          }, r.prototype._setEvents = function() {
            var e = this;
            e._customMimeType ||
              (e._mediaRecorder.ondataavailable = function(t) {
                t.data && t.data.size > 0 && (e._recordedChunks.push(t.data), e._fireCallback("ondataavailable", t))
              }), e._mediaRecorder.onpause = function() { e._fireCallback("onpause") }, e._mediaRecorder.onresume =
                function() { e._fireCallback("onresume") }, e._mediaRecorder.onerror = function(t) {
                switch (t.name) {
                case "InvalidState":
                case "OutOfMemory":
                case "IllegalStreamModification":
                case "OtherRecordingError":
                case "GenericError":
                  console.error(i[t.name]);
                  break;
                default:
                  console.error("MediaRecorder Error", t)
                }
                "inactive" !== e._mediaRecorder.state && e._mediaRecorder.stop(), e._userCallbacks &&
                  "function" == typeof e._userCallbacks.onErrorRecording &&
                  e._fireCallback("onerror", t)
              }, e._mediaRecorder.onstop =
                function() { e._customMimeType ? e._stopAudioProcess() : e._createBlob(e._recordedChunks) },
              e._mediaRecorder.start(e.timeslice), e._fireCallback("onstart")
          }, r.prototype.stop = function() {
            var e = this._mediaRecorder, t = e && e.state ? e.state : "inactive";
            !e || "recording" !== t && "paused" !== t ? console.warn(i.actionFailed) : e.stop()
          }, r.prototype.pause =
            function() {
              this._mediaRecorder && "recording" === this._mediaRecorder.state
                ? this._mediaRecorder.pause()
                : console.warn(i.actionFailed)
            }, r.prototype.resume =
            function() {
              this._mediaRecorder && "paused" === this._mediaRecorder.state
                ? this._mediaRecorder.resume()
                : console.warn(i.actionFailed)
            }, r.prototype.change = function(e) {
            if (!e) throw new Error(i.requreArgument);
            this._keepRecording = !0, this.stop(), this._stream = null, this._mediaRecorder = null, this._stream =
              e, this._customMimeType ? this._setCustomRecorder() : this._setMediaRecorder(), this._setEvents()
          }, r.prototype.download = function(e, t) {
            var o = this.getState();
            o !== r._STATES[1] && o !== r._STATES[2] || this._mediaRecorder.stop();
            var i = URL.createObjectURL(t || this._getBlobRecorded()), n = document.createElement("a");
            n.style.display = "none", n.href = i, n.download =
              (e || Date.now()) + "." + this._getExtension(), document.body.appendChild(n), n.click(), setTimeout(
              function() { document.body.removeChild(n), window.URL.revokeObjectURL(i) },
              100)
          }, r.prototype._createBlob = function(e) {
            var t = new Blob(e, { type: this.mimeType });
            this.recordedBlobs.push(t), this._keepRecording ||
            (this.recordedBlobs.length > 1
              ? this._fireCallback("onstop", t)
              : this._fireCallback("onstop", this.recordedBlobs[0])), this._keepRecording = !1
          }, r.prototype._getBlobRecorded = function(e) {
            var t = e || this._recordedChunks;
            return t.length ? new Blob(t, { type: this.mimeType }) : (console.warn(i.no_recorded_chunks), !1)
          }, r.prototype._getExtension = function() {
            var e = this.mimeType.indexOf("/"), t = this.mimeType.substring(e + 1), o = t.indexOf(";");
            return -1 !== o && (t = t.substring(0, o)), t
          }, r.prototype._startAudioProcess = function() {
            if (!r.isAudioContext()) throw new Error(i.unsupport);
            var e, t, o, n, s = this;
            s._closeAudioProcess(), e = window.AudioContext || window.webkitAudioContext, s._audioContext = new e, n =
                s._audioContext.createGain(), t = s._audioContext.createMediaStreamSource(s._stream), o =
                s._audioContext.createScriptProcessor(s.BUFFER_SIZE, s.INPUT_CHANNELS, s.OUTPUT_CHANNELS), t.connect(n),
              s._postMessageToWorker({ cmd: "init", mimeType: s.mimeType, sampleRate: t.context.sampleRate }),
              o.onaudioprocess =
                function(e) {
                  s._mediaRecorder.state === r._STATES[1] &&
                    s._postMessageToWorker({
                      cmd: "record",
                      bufferChunk: e.inputBuffer.getChannelData(0),
                      bufferSize: s.BUFFER_SIZE
                    })
                }, n.connect(o), o.connect(s._audioContext.destination)
          }, r.prototype._closeAudioProcess = function() {
            var e = this;
            e._audioContext &&
              e._audioContext.close().then(function() {
                e._audioContext = null, e._postMessageToWorker({ cmd: "init", mimeType: "" })
              })
          }, r.prototype._stopAudioProcess =
            function() { this._postMessageToWorker({ cmd: "finish" }) }, r.prototype._postMessageToWorker =
            function(e) { this._worker && this._worker.postMessage(e) }, t.exports = r
        }, { "./errors": 1, "./mimeTypes": 3 }
      ],
      3: [
        function(e, t, o) {
          "use strict";
          t.exports = {
            audio: ["audio/webm;codecs=opus", "audio/webm", "audio/ogg", "audio/mp3", "audio/wav"],
            video: [
              "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm;codecs=h264", "video/webm;codecs=opus",
              "video/webm", "video/mp4", "video/mpeg"
            ]
          }
        }, {}
      ]
    },
    {},
    [2])(2)
});