import { useEffect, useState } from "react";
import { useAnimationFrame } from "framer-motion";
import { IconButton } from "@chakra-ui/react";
import { TiMicrophoneOutline } from "react-icons/ti";
import SpeechRecognition from "react-speech-recognition";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";

const appId = process.env.NEXT_PUBLIC_SPEECHLY_APP_ID;
if (appId) {
  const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
  SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);
}

const startListening = () =>
  SpeechRecognition.startListening({ continuous: true });

export const MicButton = (props: { listening: boolean; reset: () => void }) => {
  const [volume, setVolume] = useState(0);
  const [audio, setAudio] = useState<{
    stream: MediaStream;
    analyser: AnalyserNode;
    pcmData: Float32Array;
    mediaNode: MediaStreamAudioSourceNode;
  } | null>(null);

  useEffect(() => {
    if (audio?.stream || !props.listening) return;
    const getStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const audioContext = new AudioContext();
      const mediaStreamAudioSourceNode =
        audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      mediaStreamAudioSourceNode.connect(analyserNode);
      const pcmData = new Float32Array(analyserNode.fftSize);

      setAudio({
        stream: stream,
        analyser: analyserNode,
        pcmData: pcmData,
        mediaNode: mediaStreamAudioSourceNode,
      });
    };
    void getStream();
  }, [audio, props]);

  useAnimationFrame(() => {
    if (!audio || !props.listening) return;

    audio.analyser.getFloatTimeDomainData(audio.pcmData);
    let sumSquares = 0.0;
    for (const amplitude of audio.pcmData) {
      sumSquares += amplitude * amplitude;
    }
    setVolume(Math.sqrt(sumSquares / audio.pcmData.length) / 0.2);
  });

  useEffect(() => {
    if (!props.listening) {
      setVolume(0);
      audio?.stream.getTracks()[0].stop();
      setAudio(null);
    }
  }, [props, audio]);

  return (
    <IconButton
      className={"mic-button"}
      position={"relative"}
      aria-label={"Toggle Microphone"}
      icon={<TiMicrophoneOutline size={"4em"} />}
      onClick={() => {
        if (props.listening) {
          SpeechRecognition.stopListening();
        } else {
          props.reset();
          void startListening();
        }
      }}
      p={4}
      rounded={"2xl"}
      color={"yellow.600"}
      height={"auto"}
      // _hover={{ bg: "yellow.400" }}
      style={{
        background: `linear-gradient(0deg, var(--chakra-colors-yellow-400) ${
          volume * 100
        }%, var(--chakra-colors-yellow-300) 0%)`,
      }}
      // bgGradient={`linear(to-t, red.100 ${volume * 100}%, yellow.300 0%)`}
      data-volume={volume}
    />
  );
};
