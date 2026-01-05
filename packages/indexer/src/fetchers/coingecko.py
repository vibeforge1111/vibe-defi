import aiohttp
from typing import Optional
from ..config import config


class CoinGeckoFetcher:
    """Fetcher for CoinGecko price API"""

    def __init__(self):
        self.base_url = config.COINGECKO_API_URL
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()

    async def fetch_prices(self, token_ids: list[str]) -> dict[str, dict]:
        """Fetch prices for multiple tokens.

        Args:
            token_ids: List of CoinGecko token IDs

        Returns:
            Dict mapping token_id to price data
        """
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")

        if not token_ids:
            return {}

        # CoinGecko allows max 250 tokens per request
        batch_size = 250
        all_prices = {}

        for i in range(0, len(token_ids), batch_size):
            batch = token_ids[i : i + batch_size]
            ids = ",".join(batch)

            url = f"{self.base_url}/simple/price"
            params = {
                "ids": ids,
                "vs_currencies": "usd",
                "include_24hr_change": "true",
                "include_market_cap": "true",
            }

            async with self.session.get(url, params=params) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    all_prices.update(data)

        return all_prices

    async def search_token(self, query: str) -> list[dict]:
        """Search for a token by name or symbol."""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")

        url = f"{self.base_url}/search"
        params = {"query": query}

        async with self.session.get(url, params=params) as resp:
            if resp.status != 200:
                return []
            data = await resp.json()

        return data.get("coins", [])
