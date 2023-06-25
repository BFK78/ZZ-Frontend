import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const AudioRecorder = ({ socket }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recordAudio = useRef(null);
  const speechRecognition = useRef(null);
  const speechTimeoutRef = useRef(null);
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    socket.on("results", (audio, text) => {
      setCurrentState(0);
      console.log(audio, text);
      playOutput(audio);
    });
  }, []);

  useEffect(() => {
    if (!isRecording) {
      // Stop the speech recognition when not recording
      stopSpeechRecognition();
    }
  }, [isRecording]);

  async function playOutput(audio) {
    let audioContext = new AudioContext();
    let outputSource;
    try {
      if (audio.byteLength > 0) {
        console.log(audio.byteLength);
        audioContext.decodeAudioData(
          audio,
          (buffer) => {
            audioContext.resume();
            outputSource = audioContext.createBufferSource();
            outputSource.connect(audioContext.destination);
            outputSource.buffer = buffer;
            outputSource.start(0);
          },
          () => {
            console.log("something happened");
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const startRecording = () => {
    setCurrentState(1);
    setIsRecording(true);
    startSpeechRecognition();
    // Start recording logic
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recordAudio.current = RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          sampleRate: 44100,
          desiredSampRate: 16000,
          recorderType: StereoAudioRecorder,
          numberOfAudioChannels: 1,
        });
        recordAudio.current.startRecording();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const stopRecording = () => {
    setCurrentState(2);
    setIsRecording(false);
    stopSpeechRecognition();
    clearTimeout(speechTimeoutRef.current);
    if (recordAudio.current) {
      recordAudio.current.stopRecording(() => {
        recordAudio.current.getDataURL(function (audioDataURL) {
          const files = {
            audio: {
              type: recordAudio.current.getBlob().type || "audio/wav",
              dataURL: audioDataURL,
            },
          };
          socket.emit("audio", files);
        });
      });
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording && currentState == 0) {
      startRecording();
    }
  };

  function showText() {
    switch (currentState) {
      case 0:
        return "Start Recording";

      case 1:
        return "Recording...";

      case 2:
        return "Processing, please wait...";

      default:
        break;
    }
  }

  const startSpeechRecognition = () => {
    speechRecognition.current = new window.webkitSpeechRecognition();
    speechRecognition.current.continuous = true;
    speechRecognition.current.interimResults = true;
    speechRecognition.current.onresult = handleSpeechRecognitionResult;
    speechRecognition.current.start();
  };

  const stopSpeechRecognition = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
      speechRecognition.current = null;
    }
  };

  const handleSpeechRecognitionResult = (event) => {
    clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(stopRecording, 1000);

    let liveTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const transcript = result[0].transcript;
      liveTranscript += transcript;
    }

    setTranscript(liveTranscript);
  };

  return (
    <div className="audio-recorder">
      <h1>Audio Recorder</h1>
      <div className="buttons-container">
        <Button
          variant={isRecording ? "danger" : "primary"}
          onClick={handleToggleRecording}
          className="center-button"
        >
          {showText()}
        </Button>
      </div>
      <div className="transcript-field">{transcript}</div>
    </div>
  );
};

export default AudioRecorder;
