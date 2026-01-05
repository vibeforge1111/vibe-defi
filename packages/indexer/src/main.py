import asyncio
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from .config import config
from .fetchers import DeFiLlamaFetcher
from .processors import PoolNormalizer, RiskCalculator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Indexer:
    """Main indexer that orchestrates data fetching and processing"""

    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.normalizer = PoolNormalizer()
        self.risk_calculator = RiskCalculator()

    def start(self):
        """Start the indexer scheduler"""
        # Index pools every 5 minutes
        self.scheduler.add_job(
            self.index_pools,
            IntervalTrigger(seconds=config.POOL_INDEX_INTERVAL),
            id="index_pools",
            replace_existing=True,
        )

        # Run initial indexing
        self.scheduler.add_job(
            self.index_pools,
            id="initial_index",
            replace_existing=True,
        )

        self.scheduler.start()
        logger.info("Indexer started")

    async def index_pools(self):
        """Fetch and process all pools"""
        logger.info("Starting pool indexing...")

        try:
            async with DeFiLlamaFetcher() as fetcher:
                raw_pools = await fetcher.fetch_pools()

            logger.info(f"Fetched {len(raw_pools)} pools from DeFiLlama")

            processed = 0
            for raw_pool in raw_pools:
                try:
                    # Normalize pool data
                    pool = self.normalizer.normalize(raw_pool)

                    # Calculate risk score
                    risk = self.risk_calculator.calculate_risk(
                        protocol=pool.protocol,
                        tvl=pool.tvl,
                        tokens=pool.tokens,
                        is_audited=pool.is_audited,
                        pool_age_days=pool.age_days,
                        reward_token=pool.reward_token,
                    )

                    pool.risk_score = risk.score
                    pool.il_risk = risk.il_risk

                    # TODO: Store in database
                    processed += 1

                except Exception as e:
                    logger.error(f"Error processing pool {raw_pool.pool_id}: {e}")

            logger.info(f"Processed {processed} pools successfully")

        except Exception as e:
            logger.error(f"Pool indexing failed: {e}")


async def main():
    """Main entry point"""
    indexer = Indexer()
    indexer.start()

    # Keep running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down...")


if __name__ == "__main__":
    asyncio.run(main())
