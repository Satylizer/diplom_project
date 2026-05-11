import math

def build_user_tensor(context, embedding_length):

    result = []

    pad = [0.0] * (embedding_length + 2)

    for i in range(10):

        event = context[i] if i < len(context) else None

        if event is None:
            result.append(pad)
            continue

        type = [0.0, 1.0] if event["eventType"] == 1 else [1.0, 0.0]

        result.append([
            *event["songEmbedding"],
            *type,
            math.log1p(event["timeDeltaHours"]) / 5.0
        ])

    return result