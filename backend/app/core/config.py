from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "HSK Study Companion API"
    app_env: str = "development"
    frontend_origin: str = "http://localhost:3000"


settings = Settings()
