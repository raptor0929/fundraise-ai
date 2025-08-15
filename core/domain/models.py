# core/domain/models.py
from dataclasses import dataclass, field
from typing import List, Optional

@dataclass
class StartupProfile:
    """A detailed, structured model of a startup from its pitch deck."""
    companyName: str
    description: str
    problem: str
    solution: str
    marketSize: Optional[str] = None
    team: Optional[List[str]] = None
    revenueModel: Optional[str] = None
    fundingInfo: Optional[str] = None # e.g., "$2M Seed Round" or "Series A"
    sectors: List[str] = field(default_factory=list) # e.g., ["FinTech", "B2B SaaS"]