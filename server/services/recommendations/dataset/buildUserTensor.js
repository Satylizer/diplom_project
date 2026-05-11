export function buildUserTensor(context, embeddingLength) {

  const result = []
  const pad = Array(embeddingLength + 2).fill(0)

  for (let i = 0; i < 10; i++) {

    const event = context[i]

    if (!event) {
      result.push(pad)
      continue
    }

    const type = event.eventType === 1 ? [0, 1] : [1, 0]

    result.push([
      ...event.songEmbedding,
      ...type,
      Math.log1p(event.timeDeltaHours) / 5
    ])
  }

  return result
}