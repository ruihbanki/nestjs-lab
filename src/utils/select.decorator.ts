import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FieldNode } from 'graphql';

export const Select = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx);
    const info = context.getInfo();
    const queryName = info.fieldName;
    const relations = {} as any;
    const nodes = info.fieldNodes;
    nodes.forEach((node) => {
      deep(relations, node);
    });
    return relations[queryName];
  },
);

function deep(rel: any, node: FieldNode) {
  const selections = node?.selectionSet?.selections;
  if (selections?.length) {
    const childRel = {};
    rel[node.name.value] = childRel;
    selections.forEach((sel) => {
      deep(childRel, sel as FieldNode);
    });
  } else {
    rel[node.name.value] = true;
  }
}
