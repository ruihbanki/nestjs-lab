import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FieldNode } from 'graphql';

/**
 * Find the relations using the graphql info. E.g. { clients: { country: true } }
 */
export const Relations = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    // get the graphql query info
    const context = GqlExecutionContext.create(ctx);
    const info = context.getInfo();

    // get the query field
    const nodes = info.fieldNodes as FieldNode[];
    const queryField = nodes.find((node) => node.name.value === info.fieldName);

    // return the relations
    const relations = getRelations(queryField);
    return typeof relations === 'boolean' ? {} : relations;
  },
);

function getRelations(node: FieldNode) {
  const result = {};
  const selections = node?.selectionSet?.selections;
  const hasChildren = selections?.length > 0;
  let isNested = false;
  selections?.forEach((childNode: FieldNode) => {
    const childRelation = getRelations(childNode);
    if (childRelation) {
      isNested = true;
      result[childNode.name.value] = childRelation;
    }
  });
  if (hasChildren) {
    return isNested ? result : true;
  }
}
