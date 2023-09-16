import { FastifyInstance } from "fastify";
import { createReadStream } from "node:fs";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post("/videos/:videoId/transcription", async (request) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    });

    const { videoId } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      prompt: z.string(),
    });

    const { prompt } = bodySchema.parse(request.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    const videoPath = video.path;
    const audioReadStream = createReadStream(videoPath);
    audioReadStream.on("error", function (err) {
      console.error(err);
      throw new Error("Failed to read video file");
    });

    console.log(openai.apiKey)

    const response = await openai.audio.transcriptions
      .create({
        file: audioReadStream,
        model: "whisper-1",
        language: "en",
        response_format: "json",
        temperature: 0,
        prompt,
      })
      .catch((e) => {
        console.error(e);
        throw new Error("Failed to transcribe video");
      });

    const transcription = response.text;

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    });

    return { transcription };
  });
}
