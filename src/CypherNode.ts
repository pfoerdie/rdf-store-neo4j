import type { Term } from '@rdfjs/types';

function $param(name: string): string {
  return '$' + name.replace(/_/g, '.')
}

export function term(name: string): string {
  return `(${name}:Term)`
}

export function namedNode(name: string): string {
  return `(${name}:NamedNode {value = ${$param(name)}.value})`
}

export function blankNode(name: string): string {
  return `(${name}:BlankNode {value = ${$param(name)}.value})`
}

export function literal(name: string): string {
  return `(${name}:Literal {value = ${$param(name)}.value, language = ${$param(name)}})-[:datatype]->${namedNode(name + '_datatype')}`
}

export function variable(name: string): string {
  return `(${name}:Variable {value = ${$param(name)}.value})`
}

export function defaultGraph(name: string): string {
  return `(${name}:DefaultGraph)`
}

export default function CypherNode(name: string, termType?: Term['termType']) {
  switch (termType) {
    case 'NamedNode': return namedNode(name)
    case 'BlankNode': return blankNode(name)
    case 'Literal': return literal(name)
    case 'Variable': return variable(name)
    case 'DefaultGraph': return defaultGraph(name)
    case 'Quad': throw new Error('not supported')
    default: return term(name)
  }
}