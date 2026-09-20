from database.models.generated import Rules
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select

from rest_api.dependencies import DbSession
from rest_api.routes.rules.schemas import RuleResponse
from rest_api.services.node_red_service import NodeRedService
from rest_api.services.rule_compiler import compile_rule

router = APIRouter(prefix="/rules", tags=["rules"],)

def get_node_red_service(
    request: Request,
) -> NodeRedService:
    return request.app.state.node_red_service

@router.get(
    "",
    response_model=list[RuleResponse],
)
def list_rules(db: DbSession):

    statement = select(Rules)

    result = db.execute(statement)

    return result.scalars().all()

@router.get(
    "/{rule_id}",
    response_model=RuleResponse,
)
def get_rule(rule_id: str, db: DbSession):
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
    node_red_service: NodeRedService = Depends(
        get_node_red_service
    ),
):
    statement = select(Rules).where(Rules.id == rule_id)

    result = db.execute(statement)
    rule = result.scalar_one_or_none()

    if rule is None:
        raise HTTPException(
            status_code=404,
            detail="Rule not found",
        )

    flow = compile_rule(
        rule.definition,
        rule_id,
    )

    node_red_service.deploy_flow(flow)

    return {
        "status": "deployed",
        "rule_id": rule.id,
    }
    