from contextlib import asynccontextmanager
import joblib
from fastapi import FastAPI
from routes.predict_route import route as predict_route
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

origins = [
    "http://127.0.0.1:5500",
]

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "Mental_Health_Model.pkl"
FRONTEND_PATH = BASE_DIR / "frontend"

@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.model = joblib.load(MODEL_PATH)

    print('Server started successfully')

    print('Model loaded successfully')

    yield

    # Cleanup when application shuts down
    app.state.model = None
    print('Server is shut down')
    print('Model unloaded')

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],            # allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],            # allow all headers
)

app.include_router(predict_route)

app.mount(
    "/",
    StaticFiles(
        directory=FRONTEND_PATH,
        html=True
    ),
    name="frontend"
)