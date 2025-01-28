/**
 * Checkmate types
 * @see checkmate/input.schema.json
 */

export type Utility = {
  player: string
  value: string
}

export type Edge = {
  action: string
  child: Node
}

export type Node = {
  player?: string
  children?: Edge[]
  utility?: Utility[]
}

export type Tree = Node

/** Helpers */

export type WrappedUtility = Utility & {
  id: string
}

export type WrappedEdge = Omit<Edge, 'child'> & {
  id: string
  child: WrappedNode
  sources: string[]
  targets: string[]
}

export type WrappedNode = Omit<Node, 'children'> & {
  id: string
  children?: WrappedEdge[]
  utility?: WrappedUtility[]
  width: number | undefined;
  height: number | undefined;
  x: number | undefined;
  y: number | undefined;
  depth: number;
}

export type WrappedTree = WrappedNode
