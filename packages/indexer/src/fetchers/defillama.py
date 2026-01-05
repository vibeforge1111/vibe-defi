import aiohttp
from typing import Optional
from ..config import config
from ..models import RawPool


class DeFiLlamaFetcher:
    """Fetcher for DeFiLlama yields API"""

    def __init__(self):
        self.base_url = config.DEFILLAMA_YIELDS_URL
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()

    async def fetch_pools(self, chains: Optional[list[str]] = None) -> list[RawPool]:
        """Fetch all pools from DeFiLlama yields API."""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")

        async with self.session.get(f"{self.base_url}/pools") as resp:
            if resp.status != 200:
                raise Exception(f"DeFiLlama API error: {resp.status}")
            data = await resp.json()

        target_chains = chains or config.SUPPORTED_CHAINS
        chain_set = {c.lower() for c in target_chains}

        pools = []
        for item in data.get("data", []):
            # Normalize chain name
            raw_chain = item.get("chain", "")
            chain = config.CHAIN_MAP.get(raw_chain, raw_chain.lower())

            # Filter by chain
            if chain not in chain_set:
                continue

            # Skip pools with no TVL or very low TVL
            tvl = item.get("tvlUsd", 0)
            if not tvl or tvl < config.MIN_TVL:
                continue

            pools.append(
                RawPool(
                    chain=chain,
                    project=item.get("project", ""),
                    symbol=item.get("symbol", ""),
                    tvl_usd=tvl,
                    apy=item.get("apy") or 0,
                    apy_base=item.get("apyBase") or 0,
                    apy_reward=item.get("apyReward") or 0,
                    pool_id=item.get("pool", ""),
                    reward_tokens=item.get("rewardTokens") or [],
                    underlying_tokens=item.get("underlyingTokens") or [],
                    stablecoin=item.get("stablecoin", False),
                )
            )

        return pools

    async def fetch_pool_history(self, pool_id: str) -> list[dict]:
        """Fetch historical APY for a specific pool."""
        if not self.session:
            raise RuntimeError("Session not initialized. Use async context manager.")

        async with self.session.get(f"{self.base_url}/chart/{pool_id}") as resp:
            if resp.status != 200:
                return []
            data = await resp.json()

        return data.get("data", [])
