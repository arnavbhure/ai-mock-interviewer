const { api } = require("../../config/axios");

const activeStreams = new Map();

const stopTts = (socketId) => {
  const controller = activeStreams.get(socketId);
  if (controller) {
    controller.abort();
    activeStreams.delete(socketId);
  }
};

const streamQuestionAudio = async (socket, { questionId, questionText }) => {
  stopTts(socket.id);
  const controller = new AbortController();
  activeStreams.set(socket.id, controller);
  try {
    const response = await api.post(
      "/audio/speech",
      {
        model: process.env.TTS_MODEL,
        voice: process.env.TTS_VOICE,
        input: questionText,
        response_format: process.env.TTS_RESPONSE_FORMAT || "pcm",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        responseType: "stream",
        signal: controller.signal,
      },
    );
    if (controller.signal.aborted || !socket.connected) {
      response.data.destroy();
      return;
    }
    socket.emit("interview:audio:start", {
      questionId,
      format: process.env.TTS_RESPONSE_FORMAT || "pcm",
      sampleRate: Number(process.env.TTS_SAMPLE_RATE),
      channels: Number(process.env.TTS_CHANNELS || 1),
    });

    let chunkIndex = 0;

    for await (const chunk of response.data) {
      if (
        controller.signal.aborted ||
        !socket.connected ||
        activeStreams.get(socket.id) !== controller
      ) {
        break;
      }
      socket.emit("interview:audio:chunk", {
        questionId,
        index: chunkIndex++,
        audio: Buffer.from(chunk),
      });
    }

    if (
      !controller.signal.aborted &&
      socket.connected &&
      activeStreams.get(socket.id) === controller
    ) {
      socket.emit("interview:audio:end", {
        questionId,
        totalChunks: chunkIndex,
      });
    }
  } catch (error) {
    if (!controller.signal.aborted && socket.connected) {
      console.error(
        "TTS streaming failed:",
        error.response?.data?.message || error.message,
      );
      socket.emit("interview:audio:error", {
        questionId,
        message: "Unable to generate interview question audio.",
      });
    }
  } finally {
    if (activeStreams.get(socket.id) === controller) {
      activeStreams.delete(socket.id);
    }
  }
};

module.exports = { streamQuestionAudio, stopTts };
