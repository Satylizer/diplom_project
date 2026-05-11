import requests

BASE_URL = "http://localhost:5000/api/ml"


def load_dataset():

    users_response = requests.get(f"{BASE_URL}/users")
    users_response.raise_for_status()
    users = users_response.json()

    songs_response = requests.get(f"{BASE_URL}/songs")
    songs_response.raise_for_status()
    songs = songs_response.json()

    sequences = {}

    for user_id in users:

        seq_response = requests.get(
            f"{BASE_URL}/sequence/{user_id}"
        )

        seq_response.raise_for_status()

        sequences[str(user_id)] = seq_response.json()

    return users, songs, sequences