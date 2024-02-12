declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

/**
 * Convert M4A to MP3
 * @param videoFileData input file
 * @returns Promise<Blob>
 * https://github.com/suvro404/video-to-audio/blob/main/index.js
 */
export const convertM4aToMp3 = async (videoFileData: File): Promise<Blob> => {
  const sampleRate = 16000;
  const numberOfChannels = 1;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        if (reader.result === null || typeof reader.result === "string") {
          throw new Error("Reader result is null or string type.");
        }
        const decodedAudioData = await audioContext.decodeAudioData(
          reader.result
        );
        const duration = decodedAudioData.duration;
        const offlineAudioContext = new OfflineAudioContext(
          numberOfChannels,
          sampleRate * duration,
          sampleRate
        );
        const soundSource = offlineAudioContext.createBufferSource();
        soundSource.buffer = decodedAudioData;
        soundSource.connect(offlineAudioContext.destination);
        soundSource.start();
        try {
          const renderedBuffer: AudioBuffer =
            await offlineAudioContext.startRendering();
          resolve(
            new Blob([createWaveFileData(renderedBuffer)], {
              type: "audio/mp3",
            })
          );
        } catch (err) {
          throw new Error("Rendering failed: " + err);
        }
      } catch (e) {
        console.log("Error occurred while converting : ", e);
        reject();
      }
    };
    reader.readAsArrayBuffer(videoFileData);
  });
};

const createWaveFileData = (audioBuffer: any): Uint8Array => {
  const frameLength = audioBuffer.length;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numberOfChannels * bitsPerSample) / 8;
  const blockAlign = (numberOfChannels * bitsPerSample) / 8;
  const wavDataByteLength = frameLength * numberOfChannels * 2;
  const headerByteLength = 44;
  const totalLength = headerByteLength + wavDataByteLength;

  const waveFileData = new Uint8Array(totalLength);

  const subChunk1Size = 16;
  const subChunk2Size = wavDataByteLength;
  const chunkSize = 4 + (8 + subChunk1Size) + (8 + subChunk2Size);

  writeString("RIFF", waveFileData, 0);
  writeInt32(chunkSize, waveFileData, 4);
  writeString("WAVE", waveFileData, 8);
  writeString("fmt ", waveFileData, 12);

  writeInt32(subChunk1Size, waveFileData, 16);
  writeInt16(1, waveFileData, 20);
  writeInt16(numberOfChannels, waveFileData, 22);
  writeInt32(sampleRate, waveFileData, 24);
  writeInt32(byteRate, waveFileData, 28);
  writeInt16(blockAlign, waveFileData, 32);
  writeInt32(bitsPerSample, waveFileData, 34);

  writeString("data", waveFileData, 36);
  writeInt32(subChunk2Size, waveFileData, 40);

  writeAudioBuffer(audioBuffer, waveFileData, 44);

  return waveFileData;
};

const writeString = (str: string, array: Uint8Array, offset: number) => {
  array.set(new TextEncoder().encode(str), offset);
};

const writeInt16 = (num: number, array: Uint8Array, offset: number) => {
  num = Math.floor(num);
  for (let i = 0; i < 2; i++) {
    array[offset + i] = (num >> (8 * i)) & 255;
  }
};

const writeInt32 = (num: number, array: Uint8Array, offset: number) => {
  num = Math.floor(num);
  for (let i = 0; i < 4; i++) {
    array[offset + i] = (num >> (8 * i)) & 255;
  }
};

const MAX_SAMPLE_VALUE = 32767;
const MIN_SAMPLE_VALUE = -32768;

const writeAudioBuffer = (
  audioBuffer: any,
  array: Uint8Array,
  offset: number
) => {
  const num = audioBuffer.length;
  const channels = audioBuffer.numberOfChannels;

  for (let i = 0; i < num; ++i) {
    for (let k = 0; k < channels; ++k) {
      let sample = audioBuffer.getChannelData(k)[i] * 32768.0;

      sample = Math.max(sample, MIN_SAMPLE_VALUE);
      sample = Math.min(sample, MAX_SAMPLE_VALUE);

      writeInt16(sample, array, offset);
      offset += 2;
    }
  }
};
