import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    REDIS_URL = os.getenv("REDIS_URL", "")

    # API endpoints
    DEFILLAMA_YIELDS_URL = "https://yields.llama.fi"
    COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

    # Supported chains
    SUPPORTED_CHAINS = ["ethereum", "arbitrum", "base", "bsc", "solana"]

    # Chain name mapping (DeFiLlama -> internal)
    CHAIN_MAP = {
        "ethereum": "ethereum",
        "Ethereum": "ethereum",
        "arbitrum": "arbitrum",
        "Arbitrum": "arbitrum",
        "arbitrum_one": "arbitrum",
        "base": "base",
        "Base": "base",
        "bsc": "bnb",
        "BSC": "bnb",
        "Binance": "bnb",
        "solana": "solana",
        "Solana": "solana",
    }

    # Indexing intervals (seconds)
    POOL_INDEX_INTERVAL = 300  # 5 minutes
    PRICE_UPDATE_INTERVAL = 60  # 1 minute
    HISTORY_SNAPSHOT_INTERVAL = 3600  # 1 hour

    # Minimum TVL to include a pool
    MIN_TVL = 10_000


config = Config()
