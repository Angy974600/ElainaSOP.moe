from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pymysql
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS per React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    character_id: int  # ID del personaggio
    url: str
    tag: str  # Una stringa con i tag separati da virgola
    artist: Optional[str] = None
    snslink: Optional[str] = None
    nsfw: int  # 1 per NSFW, 0 per non NSFW

class Database:
    def __init__(self, host, user, password, db):
        self.host = host
        self.user = user
        self.password = password
        self.db = db
        self.connection = None
        
    def connect(self):
        try:
            self.connection = pymysql.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.db,
                charset="utf8mb4",
                cursorclass=pymysql.cursors.DictCursor
            )
        except Exception as e:
            print(f"Errore durante la connessione al database: {e}")
            raise

    def insert_image(self, data: ImageRequest):
        try:
            with self.connection.cursor() as cur:
                query = """
                    INSERT INTO smashorpass (character_id, url, tag, artist, snslink, nsfw)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cur.execute(
                    query,
                    (data.character_id, data.url, data.tag, data.artist, data.snslink, data.nsfw)
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante l'inserimento: {str(e)}")

    def fetch_images(self):
        try:
            with self.connection.cursor() as cur:
                cur.execute(
                    """
                    SELECT c.name, sp.url
                    FROM smashorpass sp
                    JOIN characters c ON sp.character_id = c.mal_id
                    ORDER BY RAND()
                    LIMIT 20
                    """
                )
                return cur.fetchall()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante il recupero delle immagini: {str(e)}")

    def fetch_characters(self, query: str):
        try:
            with self.connection.cursor() as cur:
                like_query = f"%{query}%"
                cur.execute(
                    """
                    SELECT mal_id, name
                    FROM characters 
                    WHERE name LIKE %s
                    ORDER BY favorites DESC
                    LIMIT 10
                    """,
                    (like_query,)
                )
                result = cur.fetchall()
                return [{"mal_id": row["mal_id"], "name": row["name"]} for row in result]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante il recupero dei personaggi: {str(e)}")

    def fetch_images_by_character(self, mal_id: int):
        try:
            with self.connection.cursor() as cur:
                cur.execute("SELECT * FROM smashorpass WHERE character_id = %s", (mal_id,))
                return cur.fetchall()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante il recupero delle immagini: {str(e)}")

# Configura il tuo DB
db = Database(
    host="db-fde-02.sparkedhost.us",
    user="u100606_G9BI7oelnr",
    password="bwJ+bK.+PR3MUUaY6w1YTdMc",
    db="s100606_ElainaDatabase"
)

@app.on_event("startup")
def startup():
    db.connect()

@app.post("/addImage")
async def add_image(image_data: ImageRequest):
    try:
        db.insert_image(image_data)
        return {"message": "Immagine aggiunta con successo"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/images")
async def get_images():
    images = db.fetch_images()
    return [{"url": row["url"], "name": row["name"]} for row in images]

@app.get("/characters")
async def get_characters(query: str):
    characters = db.fetch_characters(query)
    return characters

@app.get("/images_by_character")
async def images_by_character(name: str):
    images = db.fetch_images_by_character(name)
    if not images:
        raise HTTPException(status_code=404, detail="Nessuna immagine trovata per questo personaggio")
    return images

@app.on_event("shutdown")
def shutdown():
    if db.connection:
        db.connection.close()
