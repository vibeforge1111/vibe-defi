from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from enum import Enum


class ILRisk(Enum):
    NONE = "None"
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


@dataclass
class RawPool:
    """Raw pool data from DeFiLlama"""
    chain: str
    project: str
    symbol: str
    tvl_usd: float
    apy: float
    apy_base: float
    apy_reward: float
    pool_id: str
    reward_tokens: list[str]
    underlying_tokens: list[str]
    stablecoin: bool


@dataclass
class RiskFactors:
    smart_contract: int
    impermanent_loss: int
    protocol: int
    liquidity: int
    reward_token: int


@dataclass
class RiskAssessment:
    score: int
    factors: RiskFactors
    il_risk: ILRisk
    warnings: list[str]


@dataclass
class Pool:
    """Normalized pool data"""
    id: str
    chain: str
    protocol: str
    name: str
    pool_address: str
    pool_type: str
    tokens: list[str]
    tvl: float
    base_apy: float
    reward_apy: float
    total_apy: float
    risk_score: int
    il_risk: ILRisk
    farm_url: str
    is_audited: bool
    age_days: int
    reward_token: Optional[str]
    defillama_id: str
    updated_at: datetime
