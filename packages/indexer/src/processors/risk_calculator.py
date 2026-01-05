from typing import Optional
from ..models import RiskFactors, RiskAssessment, ILRisk


class RiskCalculator:
    """Calculate risk scores for DeFi pools"""

    # Protocol trust scores (0-100, higher = safer)
    PROTOCOL_TRUST = {
        "uniswap": 95,
        "aave": 95,
        "curve": 90,
        "compound": 90,
        "balancer": 85,
        "sushiswap": 80,
        "pancakeswap": 80,
        "raydium": 75,
        "orca": 75,
        "aerodrome": 70,
        "default": 50,
    }

    # Stablecoin identifiers
    STABLECOINS = {
        "usdc", "usdt", "dai", "frax", "lusd", "gusd",
        "busd", "tusd", "usdp", "usdd", "crvusd", "gho",
        "usde", "usdb", "usdbc",
    }

    # Correlated pairs (low IL risk)
    CORRELATED_PAIRS = [
        ("eth", "steth"), ("eth", "wsteth"), ("eth", "reth"), ("eth", "cbeth"),
        ("btc", "wbtc"), ("btc", "tbtc"),
        ("sol", "msol"), ("sol", "jitosol"), ("sol", "bsol"),
    ]

    def calculate_risk(
        self,
        protocol: str,
        tvl: float,
        tokens: list[str],
        is_audited: bool,
        pool_age_days: int,
        reward_token: Optional[str] = None,
    ) -> RiskAssessment:
        """Calculate comprehensive risk score for a pool."""
        warnings = []

        # Calculate individual risk factors
        sc_risk = self._calculate_sc_risk(is_audited, pool_age_days, tvl)
        il_risk_score, il_risk_level = self._calculate_il_risk(tokens)
        protocol_risk = self._calculate_protocol_risk(protocol)
        liquidity_risk = self._calculate_liquidity_risk(tvl)
        reward_risk = self._calculate_reward_risk(reward_token)

        # Weighted average (matches PRD weights)
        total_score = int(
            sc_risk * 0.25 +
            il_risk_score * 0.25 +
            protocol_risk * 0.20 +
            liquidity_risk * 0.15 +
            reward_risk * 0.15
        )

        # Generate warnings
        if not is_audited:
            warnings.append("Unaudited smart contract")
        if pool_age_days < 30:
            warnings.append("Pool is less than 30 days old")
        if tvl < 100_000:
            warnings.append("Low TVL - high liquidity risk")
        if il_risk_level in [ILRisk.MEDIUM, ILRisk.HIGH]:
            warnings.append(f"Impermanent loss risk: {il_risk_level.value}")

        return RiskAssessment(
            score=max(1, min(100, total_score)),
            factors=RiskFactors(
                smart_contract=sc_risk,
                impermanent_loss=il_risk_score,
                protocol=protocol_risk,
                liquidity=liquidity_risk,
                reward_token=reward_risk,
            ),
            il_risk=il_risk_level,
            warnings=warnings,
        )

    def _calculate_sc_risk(self, is_audited: bool, age_days: int, tvl: float) -> int:
        """Calculate smart contract risk (0-100)."""
        score = 50

        # Audit status
        if is_audited:
            score -= 20
        else:
            score += 20

        # Pool age
        if age_days > 365:
            score -= 15
        elif age_days > 180:
            score -= 10
        elif age_days > 90:
            score -= 5
        elif age_days < 30:
            score += 15

        # TVL (battle-tested with more capital)
        if tvl > 100_000_000:
            score -= 10
        elif tvl > 10_000_000:
            score -= 5

        return max(1, min(100, score))

    def _calculate_il_risk(self, tokens: list[str]) -> tuple[int, ILRisk]:
        """Calculate impermanent loss risk."""
        token_symbols = [t.lower() for t in tokens]

        # Count stablecoins
        stable_count = sum(
            1 for t in token_symbols
            if any(s in t for s in self.STABLECOINS)
        )

        # Both stablecoins = no IL
        if len(tokens) >= 2 and stable_count >= 2:
            return 5, ILRisk.NONE

        # Single token (lending) = no IL
        if len(tokens) == 1:
            return 5, ILRisk.NONE

        # One stablecoin = medium IL
        if stable_count == 1:
            return 50, ILRisk.MEDIUM

        # Check for correlated pairs
        if self._are_correlated(token_symbols):
            return 25, ILRisk.LOW

        # Both volatile = high IL
        return 70, ILRisk.HIGH

    def _are_correlated(self, tokens: list[str]) -> bool:
        """Check if tokens are correlated (e.g., ETH-stETH)."""
        for t1, t2 in self.CORRELATED_PAIRS:
            has_t1 = any(t1 in t for t in tokens)
            has_t2 = any(t2 in t for t in tokens)
            if has_t1 and has_t2:
                return True
        return False

    def _calculate_protocol_risk(self, protocol: str) -> int:
        """Calculate protocol risk based on trust score."""
        trust = self.PROTOCOL_TRUST.get(
            protocol.lower(),
            self.PROTOCOL_TRUST["default"]
        )
        return 100 - trust  # Invert: high trust = low risk

    def _calculate_liquidity_risk(self, tvl: float) -> int:
        """Calculate liquidity risk based on TVL."""
        if tvl > 100_000_000:
            return 10
        elif tvl > 50_000_000:
            return 20
        elif tvl > 10_000_000:
            return 30
        elif tvl > 1_000_000:
            return 50
        elif tvl > 100_000:
            return 70
        return 90

    def _calculate_reward_risk(self, reward_token: Optional[str]) -> int:
        """Calculate reward token risk."""
        if not reward_token:
            return 20  # No reward token = lower risk

        # Major tokens = lower risk
        major_tokens = ["crv", "uni", "aave", "comp", "bal", "sushi", "ray", "cake"]
        if any(t in reward_token.lower() for t in major_tokens):
            return 30

        return 60  # Unknown reward token
