from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import aiomysql
from pydantic import BaseModel
from typing import Optional
import asyncio
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
    # name: str
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
        self.pool = None
        self.connection_timeout = 10  # Timeout per la connessione (in secondi)
        self.query_timeout = 5  # Timeout per le query (in secondi)

    async def connect(self):
        try:
            if not self.pool:
                # Timeout di connessione
                self.pool = await asyncio.wait_for(
                    aiomysql.create_pool(
                        host=self.host,
                        user=self.user,
                        password=self.password,
                        db=self.db,
                        charset="utf8mb4",
                        minsize=1,
                        maxsize=2,  # Più connessioni nella pool
                        pool_recycle=1800,
                        autocommit=True
                        
                        
                    ), self.connection_timeout
                )
        except TimeoutError:
            print(f"Timeout durante il tentativo di connessione al database.")
            raise
        except Exception as e:
            print(f"Errore durante la connessione al database: {e}")
            raise
    async def insert_image(self, data: ImageRequest):
        try:
            async with self.pool.acquire() as conn:
                async with conn.cursor() as cur:
                    query = """
                        INSERT INTO smashorpass (character_id, url, tag, artist, snslink, nsfw)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    await cur.execute(
                        query,
                        (data.character_id, data.url, data.tag, data.artist, data.snslink, data.nsfw)
                    )
                    await conn.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante l'inserimento: {str(e)}")
    async def fetch_images(self, nsfw: int = 0):
        try:
            async with self.pool.acquire() as conn:
                async with conn.cursor(aiomysql.DictCursor) as cur:
                    # Aggiungi la condizione per il filtro delle immagini NSFW
                    if nsfw == 0:
                        nsfw_condition = "AND sp.nsfw = 0"  # Solo immagini non NSFW
                    else:
                        nsfw_condition = ""  # Senza filtro, restituisce sia immagini NSFW che non NSFW
                    query = f"""
                        SELECT c.name, sp.url
                        FROM smashorpass sp
                        JOIN characters c ON sp.character_id = c.mal_id
                        WHERE 1=1 {nsfw_condition}
                        ORDER BY RAND()
                        LIMIT 20
                    """
                    await cur.execute(query)
                    return await cur.fetchall()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante il recupero delle immagini: {str(e)}")
    async def fetch_characters(self, query: str):
        try:
            async with db.pool.acquire() as conn:
                async with conn.cursor(aiomysql.DictCursor) as cur:
                    like_query = f"%{query}%"
                    await cur.execute(
                        """
                        SELECT 
                            c.mal_id,
                            c.name,
                            COALESCE(a.title, m.title) AS source_title
                        FROM characters c
                        LEFT JOIN anime a ON c.anime = a.mal_id
                        LEFT JOIN manga m ON c.manga = m.mal_id
                        WHERE c.name LIKE %s
                        ORDER BY c.favorites DESC
                        LIMIT 10
                        """,
                        (like_query,)
                    )
                    result = await cur.fetchall()
                    return [
                        {
                            "mal_id": row["mal_id"],
                            "name": row["name"],
                            "source_title": row["source_title"]
                        }
                        for row in result
                    ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Errore durante il recupero dei personaggi: {str(e)}")

    async def fetch_images_by_character(self, mal_id: int, nsfw: int = 0):
        try:
            if nsfw == 0:
                nsfw_condition = "AND nsfw = 0"  # Solo immagini non NSFW
            else:
                nsfw_condition = ""  # Senza filtro, restituisce sia immagini NSFW che non NSFW
            async with db.pool.acquire() as conn:
                async with conn.cursor(aiomysql.DictCursor) as cur:
                    await cur.execute("SELECT * FROM smashorpass WHERE character_id = %s " + nsfw_condition, (mal_id,))
                    return await cur.fetchall()
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
async def startup():
    await db.connect()
@app.post("/addImage")
async def add_image(image_data: ImageRequest):
    try:
        await db.insert_image(image_data)
        return {"message": "Immagine aggiunta con successo"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/images")
async def get_images(nsfw: int = 0):
    images = await db.fetch_images(nsfw)
    return [{"url": row["url"], "name": row["name"]} for row in images]
@app.get("/characters")
async def get_characters(query: str):
    characters= await db.fetch_characters(query)
    return characters

@app.get("/images_by_character")
async def images_by_character(character_id: str, nsfw: int = 0):
    print(f"Fetching images for character: {character_id}, NSFW: {nsfw}")
    images = await db.fetch_images_by_character(character_id, nsfw)
    if not images:
        raise HTTPException(status_code=404, detail="Nessuna immagine trovata per questo personaggio")
    return images
@app.on_event("shutdown")
async def shutdown():
    db.pool.close()
    await db.pool.wait_closed()