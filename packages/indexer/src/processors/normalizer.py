from datetime import datetime
from typing import Optional
from ..models import RawPool, Pool, ILRisk
from ..config import config


class PoolNormalizer:
    """Normalize raw pool data from different sources"""

    # Known audited protocols
    AUDITED_PROTOCOLS = {
        "uniswap", "aave", "curve", "compound", "balancer",
        "sushiswap", "pancakeswap", "raydium", "orca", "yearn",
        "convex", "lido", "rocket-pool", "marinade", "jito",
    }

    # Pool type detection
    LENDING_PROTOCOLS = {"aave", "compound", "venus", "morpho", "kamino", "spark"}
    STAKING_PROTOCOLS = {"lido", "rocket-pool", "jito", "marinade", "frax"}
    VAULT_PROTOCOLS = {"yearn", "convex", "beefy", "sommelier", "harvest"}

    def normalize(self, raw_pool: RawPool) -> Pool:
        """Normalize a raw pool into standard format."""
        # Determine pool type
        pool_type = self._detect_pool_type(raw_pool.project)

        # Parse tokens from symbol
        tokens = self._parse_tokens(raw_pool.symbol)

        # Determine IL risk
        il_risk = self._determine_il_risk(tokens, raw_pool.stablecoin)

        # Generate pool ID
        pool_id = f"{raw_pool.chain}:{raw_pool.project}:{raw_pool.pool_id}"

        # Generate farm URL
        farm_url = self._generate_farm_url(raw_pool.project, raw_pool.chain)

        # Check if audited
        is_audited = raw_pool.project.lower() in self.AUDITED_PROTOCOLS

        return Pool(
            id=pool_id,
            chain=raw_pool.chain,
            protocol=self._format_protocol_name(raw_pool.project),
            name=raw_pool.symbol,
            pool_address=raw_pool.pool_id,
            pool_type=pool_type,
            tokens=tokens,
            tvl=raw_pool.tvl_usd,
            base_apy=raw_pool.apy_base,
            reward_apy=raw_pool.apy_reward,
            total_apy=raw_pool.apy,
            risk_score=50,  # Will be calculated by RiskCalculator
            il_risk=il_risk,
            farm_url=farm_url,
            is_audited=is_audited,
            age_days=365,  # Default, should be looked up
            reward_token=raw_pool.reward_tokens[0] if raw_pool.reward_tokens else None,
            defillama_id=raw_pool.pool_id,
            updated_at=datetime.utcnow(),
        )

    def _detect_pool_type(self, protocol: str) -> str:
        """Detect pool type based on protocol."""
        protocol_lower = protocol.lower()

        if protocol_lower in self.LENDING_PROTOCOLS:
            return "Lending"
        if protocol_lower in self.STAKING_PROTOCOLS:
            return "Staking"
        if protocol_lower in self.VAULT_PROTOCOLS:
            return "Vault"
        return "AMM"

    def _parse_tokens(self, symbol: str) -> list[str]:
        """Parse token symbols from pool name."""
        # Remove common suffixes
        clean = symbol.replace("-LP", "").replace(" LP", "")

        # Split by common delimiters
        for delimiter in ["-", "/", "_"]:
            if delimiter in clean:
                return [t.strip().upper() for t in clean.split(delimiter)]

        return [clean.upper()]

    def _determine_il_risk(self, tokens: list[str], is_stablecoin: bool) -> ILRisk:
        """Determine IL risk level."""
        if is_stablecoin:
            return ILRisk.NONE
        if len(tokens) == 1:
            return ILRisk.NONE

        stablecoins = {"USDC", "USDT", "DAI", "FRAX", "BUSD", "TUSD", "USDB"}
        stable_count = sum(1 for t in tokens if t in stablecoins)

        if stable_count >= 2:
            return ILRisk.NONE
        if stable_count == 1:
            return ILRisk.MEDIUM
        return ILRisk.HIGH

    def _format_protocol_name(self, protocol: str) -> str:
        """Format protocol name for display."""
        name_map = {
            "uniswap-v3": "Uniswap V3",
            "uniswap-v2": "Uniswap V2",
            "aave-v3": "Aave V3",
            "aave-v2": "Aave V2",
            "curve-dex": "Curve",
            "pancakeswap-amm-v3": "PancakeSwap V3",
        }
        return name_map.get(protocol.lower(), protocol.title())

    def _generate_farm_url(self, protocol: str, chain: str) -> str:
        """Generate URL to the farm/pool page."""
        urls = {
            "uniswap": "https://app.uniswap.org/pools",
            "aave": "https://app.aave.com/",
            "curve": "https://curve.fi/",
            "pancakeswap": "https://pancakeswap.finance/liquidity",
            "raydium": "https://raydium.io/liquidity/",
            "aerodrome": "https://aerodrome.finance/liquidity",
        }

        for key, url in urls.items():
            if key in protocol.lower():
                return url

        return f"https://defillama.com/protocol/{protocol}"
