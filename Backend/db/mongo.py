import motor.motor_asyncio
from bson.objectid import ObjectId
import pydantic
from engine_api import api_requests

from PIL import Image
from io import BytesIO
import requests
from colorthief import ColorThief

from datetime import date

pydantic.json.ENCODERS_BY_TYPE[ObjectId]=str



client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://mongo:27017/')

if client is not None:
    print("Conexão com o banco de dados MongoDB estabelecida com sucesso!")
else:
    print("Não foi possível estabelecer conexão com o banco de dados MongoDB.")

database = client['spotify']
collection = database['user_playlists']

async def fetch_all_playlists():
    cursor = collection.find()
    playlists = []
    async for playlist in cursor:
        playlists.append(playlist)
    return playlists


async def fetch_one_playlist(id: str):
    document = await collection.find_one({"_id": ObjectId(id)})
    return document


async def create_user_playlist():
    id = await collection.count_documents({}) + 1
    document = {"name": "Minha playlist nº " + str(id), "color_theme": [83, 83, 83], "cover": [], "songs": [], "songs_add_date": []}
    result = await collection.insert_one(document)
    created_document = await collection.find_one({"_id": result.inserted_id})
    return created_document


async def delete_playlist(id: str):
    result = await collection.delete_one({"_id": ObjectId(id)})
    return True

async def add_song(id: str, song: object):
    today = str(date.today())

    # add new song
    old_document = await collection.find_one({'_id': ObjectId(id)})
    songs = old_document['songs']
    songs.append(song)
    dates = old_document['songs_add_date']
    dates.append(today)
    song_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs': songs}})
    date_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs_add_date': dates}})

    # add to "songs_cover"
    covers = old_document['cover']
    if (len(songs) <= 4):
        img = api_requests.get_cover_by_id(song['id']) #get image with greater resolution
        covers.append(img)
        cover_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'cover': covers}})
    
    if (len(songs) == 1):
        color_theme = get_dominant_color(covers[0])
        print(color_theme)
        color_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'color_theme': color_theme}})

    if (len(songs) == 4):
        colors = []
        for image in covers:
            color = get_dominant_color(image)
            colors.append(color)
        
        r = (colors[0][0] + colors[1][0] + colors[2][0] + colors[3][0]) // 4
        g = (colors[0][1] + colors[1][1] + colors[2][1] + colors[3][1]) // 4
        b = (colors[0][2] + colors[1][2] + colors[2][2] + colors[3][2]) // 4
        mean_color = [r, g, b]

        print(colors)
        print(mean_color)

        color_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'color_theme': mean_color}})
   
    return True

def get_dominant_color(url):
    # get predominant color in the middle of the image

    response1 = requests.get(url)
    img = Image.open(BytesIO(response1.content))

    width, height = img.size

    # center square dimensions
    crop_width = int(width * 0.75)
    crop_height = int(height * 0.75)

    # get center
    center_x = width // 2
    center_y = height // 2

    # get central square
    left = center_x - crop_width // 2
    top = center_y - crop_height // 2
    right = center_x + crop_width // 2
    bottom = center_y + crop_height // 2

    # get cropped image
    cropped_img = img.crop((left, top, right, bottom))

    cropped_bytes  = BytesIO()
    cropped_img.save(cropped_bytes, format='PNG')
    cropped_bytes = cropped_bytes.getvalue()

    ct = ColorThief(BytesIO(cropped_bytes))
    dominant_color = ct.get_color(quality=1)

    return list(dominant_color)

async def rename_playlist(id, name):
    name_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'name': name}})
    return True

async def remove_song(id, song_index):
    old_document = await collection.find_one({'_id': ObjectId(id)})
    songs = old_document['songs']
    dates = old_document['songs_add_date']

    if (len(songs) == 4):
        covers = old_document['cover']
        color_theme = get_dominant_color(covers[0])
        color_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'color_theme': color_theme}})
    if (len(songs) > 1 and len(songs) <= 4):
        covers = old_document['cover']
        del covers[song_index]
        # covers.remove(covers[song_index])
        covers_updated = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'cover': covers}})
    if (len(songs) == 1):
        covers_updated = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'cover': []}})
        songs_updated = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs': []}})
        date_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs_add_date': []}})
        color_added = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'color_theme': [83, 83, 83]}})
        return True
        
    del songs[song_index]
    del dates[song_index]

    songs_updated = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs': songs}})
    date_updated = await collection.update_one({'_id': ObjectId(id)}, {'$set': {'songs_add_date': dates}})
    return True

async def fetch_liked_songs_playlist():
    liked_songs = database['liked_songs']

    cursor = liked_songs.find()
    songs = []
    async for song in cursor:
        songs.append(song)

    return songs

async def like_song(song):
    liked_songs = database['liked_songs']
    today = str(date.today())

    document = {"song": song.song, "date": today}
    print("\n\n\n\oi\n\n\n\n\n\n")
    try:
       result = await liked_songs.insert_one(document)
    except Exception as e:
        print(f"\n\n\n\n{e}\n\n\n\n")

    print("\n\n\n\oi2\n\n\n\n\n\n")
    return result

async def unlike_song(id: str):
    liked_songs = database['liked_songs']
    print(f"\n\n\n\n\ntesteeeeeeeee\n\n\n\n\n\n")
    result = await liked_songs.delete_one({"_id": ObjectId(id)})
    return True

async def fetch_one_liked_song_id(id: int):
    liked_songs = database['liked_songs']
    document = await liked_songs.find_one({"song.id": int(id)})
    return document['_id']