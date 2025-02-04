import type { Edge, Tree, Node, Utility, WrappedEdge, WrappedNode, WrappedUtility } from "./types";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import ELK from 'elkjs/lib/elk.bundled.js'
import {v4 as uuid} from 'uuid'

const FONT_SIZE = 16
const SYM_WIDTH = FONT_SIZE * 1.2
export const ROW_HEIGHT = FONT_SIZE

function getNodeText(node: Node | WrappedNode) {
  return node.utility ? JSON.stringify(node.utility.reduce((acc, util) => {
    acc[util.player] = util.value
    return acc
  }, {} as Record<string, string>)) : node.player ?? ''
}

const elk = new ELK()

async function wrapTree(tree: Tree) {
  const nodes: Record<string, WrappedNode> = {}
  const edges: Record<string, WrappedEdge> = {}
  
  const wrapEdge = (edge: Edge, from: string, depth: number): WrappedEdge => {
    const child = wrapNode(edge.child, depth + 1)
    
    const newEdge = {
      ...edge,
      id: uuid(),
      child,
      sources: [from],
      targets: [child.id]
    }

    edges[newEdge.id] = newEdge

    return newEdge
  }

  const wrapUtility = (utility: Utility): WrappedUtility => {
    return {
      ...utility,
      id: uuid(),
    }
  }

  const wrapNode = (node: Node, depth: number = 0): WrappedNode => {
    const id = uuid()
    const text = getNodeText(node)
    const newNode: WrappedNode = {
      ...node,
      id,
      children: node.children?.map(edge => wrapEdge(edge, id, depth)),
      utility: node.utility?.map(wrapUtility),
      width: text.length * SYM_WIDTH,
      text,
      height: ROW_HEIGHT * 5,
      x: undefined,
      y: undefined,
      depth
    }

    nodes[newNode.id] = newNode

    return newNode
  }
  
  const wrappedTree = wrapNode(tree)

  const elkNode = await elk.layout({
    id: "root",
    layoutOptions: { 'elk.algorithm': 'mrtree' },
    children: Object.values(nodes).map((node) => ({
      id: node.id,
      width: node.width,
      height: node.height
    })),
    edges: Object.values(edges).map((edge) => ({
      id: edge.id,
      sources: edge.sources,
      targets: edge.targets
    }))
  })

  if (!elkNode.children) {
    throw new Error('elk layout failed')
  }

  for (const node of elkNode.children) {
    nodes[node.id].x = node.x
    nodes[node.id].y = node.y ?? 0 + nodes[node.id].depth * ROW_HEIGHT * 5
  }

  return {
    wrappedTree,
    nodes,
    edges,
  }
}

export async function checkmateTreeToExcalidrawSkeleton(tree: Tree) {
  const elements: ExcalidrawElementSkeleton[] = []

  const {nodes, edges} = await wrapTree(tree)
  
  for (const node of Object.values(nodes)) {
    if (node.x === undefined || node.y === undefined || node.height === undefined || node.width === undefined) {
      throw new Error('Shape is not defined')
    }
    
    // console.log(`Node: d=${node.depth}, x=${node.x}, y=${node.y}, h=${node.height}`)
    const element: ExcalidrawElementSkeleton = {
      id: node.id,
      type: 'text',
      text: node.text ?? getNodeText(node),
      x: node.x,
      y: node.y,
      fontSize: FONT_SIZE,
      // width: node.width,
      // height: node.height,
      strokeColor: '#f00',
    }

    elements.push(element)
  }

  for (const edge of Object.values(edges)) {
    const startNode = nodes[edge.sources[0]]
    const endNode = nodes[edge.targets[0]]

    const x = startNode.x!
    const y = startNode.y!

    const width = endNode.x! - startNode.x!
    const height = endNode.y! - startNode.y! - ROW_HEIGHT
    
    const element: ExcalidrawElementSkeleton = {
      id: edge.id,
      x,
      y,
      width,
      height,
      type: 'arrow',
      label: {text: edge.action},
      strokeWidth: 2,
      start: {
        id: startNode.id,
      },
      end: {
        id: endNode.id,
      },
      startArrowhead: null,
      endArrowhead: 'arrow',
    }

    elements.push(element)
  }
  
  return {skeleton: elements, nodes, edges}
}

export function fixExcalidrawElements(elements: ExcalidrawElement[], nodes: Record<string, WrappedNode>): ExcalidrawElement[] {
  return elements.map(element => {
    if (element.type === 'text' && nodes[element.id]) {
      return {
        ...element,
        y: (nodes[element.id].y ?? 0) - ROW_HEIGHT
      }
    }
    if (element.type === 'arrow') {
      return {
        ...element,
        // startBinding: {
        //   ...element.startBinding,
        //   gap: 1
        // },
        endBinding: element.endBinding ? {
          ...element.endBinding,
          gap: 1,
          focus: -0.5
        } : null
      }
    }
    return element
  })
}
