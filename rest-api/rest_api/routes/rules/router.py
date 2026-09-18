import httpx
from database.models.generated import Rules
from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from rest_api.dependencies import DbSession
from rest_api.routes.rules.schemas import RuleResponse
from rest_api.services.rule_compiler import compile_rule

router = APIRouter(prefix="/rules", tags=["rules"],)

@router.get(
    "",
    response_model=list[RuleResponse],
)
def list(db: DbSession):

    statement = select(Rules)

    result = db.execute(statement)

    return result.scalars().all()

@router.get(
    "/{rule_id}",
    response_model=RuleResponse,
)
def get(rule_id: str, db: DbSession):
    statement = select(Rules).where(Rules.id == rule_id)

    result = db.execute(statement)

    rule = result.scalar_one_or_none()

    if rule is None:
        raise HTTPException(
            status_code=404,
            detail="Rule not found",
        )

    return rule

@router.post("/{rule_id}/deploy")
def deploy_rule(
    rule_id: str,
    db: DbSession,
):
    statement = select(Rules).where(Rules.id == rule_id)

    result = db.execute(statement)
    rule = result.scalar_one_or_none()

    if rule is None:
        raise HTTPException(
            status_code=404,
            detail="Rule not found",
        )

    flow = compile_rule(rule.definition)

    response = httpx.post(
        "http://localhost:1880/flows",
        json=flow,
        timeout=10.0,
    )

    response.raise_for_status()

    return {
        "status": "deployed",
        "rule_id": rule.id,
    }

@router.post("/test-deploy")
def test_deploy():
    definition = {
        "nodes": [],
        "edges": [],
    }

    flow = compile_rule(definition)

    response = httpx.post(
        "http://localhost:1880/flows",
        json=flow,
        timeout=10.0,
    )

    response.raise_for_status()

    return {
        "status": "deployed",
        "flow": flow,
    }