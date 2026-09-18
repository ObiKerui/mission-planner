from sqlalchemy import Boolean, Column, DateTime, Index, PrimaryKeyConstraint, Text, Uuid, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, declarative_base, mapped_column
from sqlalchemy.orm.base import Mapped

Base = declarative_base()


class Rules(Base):
    __tablename__ = 'rules'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='rules_pkey'),
        Index('idx_rules_definition', 'definition'),
        Index('idx_rules_enabled', 'enabled'),
        {'schema': 'public'}
    )

    id = mapped_column(Uuid, server_default=text('gen_random_uuid()'))
    name = mapped_column(Text, nullable=False)
    definition = mapped_column(JSONB, nullable=False)
    enabled = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    updated_at = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    description = mapped_column(Text)
