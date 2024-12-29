import { Node as ProseMirrorNode } from 'prosemirror-model'

export const findTopLevelNode = (doc: ProseMirrorNode, pos: number) => {
  let node = doc.nodeAt(pos)
  let resolvedPos = doc.resolve(pos)
  while (node && resolvedPos.depth > 0) {
    // eslint-disable-next-line no-param-reassign
    pos = resolvedPos.before(1)
    resolvedPos = doc.resolve(pos)
    node = doc.nodeAt(pos)
  }
  return { node, pos }
}
