import type { Term, NamedNode, BlankNode, Literal, Variable, DefaultGraph, Quad } from '@rdfjs/types'

export function isNull(value: unknown): value is null | undefined {
  return (value ?? null) === null
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isObject(value: unknown): value is {} {
  return typeof value === 'object' && value !== null
}

export function isArray(value: unknown): value is Array<any> {
  return Array.isArray(value)
}

export function isRecord(value: unknown): value is Record<any, any> {
  return isObject(value) && !isArray(value)
}

export function isTerm(term: unknown): term is Term {
  return isRecord(term)
    && isString(term.termType)
}

export function isNamedNode(term: unknown): term is NamedNode {
  return isRecord(term)
    && term.termType === 'NamedNode'
    && isString(term.value)
}

export function isBlankNode(term: unknown): term is BlankNode {
  return isRecord(term)
    && term.termType === 'BlankNode'
    && isString(term.value)
}

export function isLiteral(term: unknown): term is Literal {
  return isRecord(term)
    && term.termType === 'Literal'
    && isString(term.value)
    && isString(term.language)
    && isNamedNode(term.datatype)
}

export function isVariable(term: unknown): term is Variable {
  return isRecord(term)
    && term.termType === 'Variable'
    && isString(term.value)
}

export function isDefaultGraph(term: unknown): term is DefaultGraph {
  return isRecord(term)
    && term.termType === 'DefaultGraph'
}

export type QuadSubject = NamedNode | BlankNode

export function isQuadSubject(term: unknown): term is QuadSubject {
  return isRecord(term) && (
    term.termType === 'NamedNode' && isString(term.value) ||
    term.termType === 'BlankNode' && isString(term.value))
}

export type QuadPredicate = NamedNode

export function isQuadPredicate(term: unknown): term is QuadPredicate {
  return isNamedNode(term)
}

export type QuadObject = NamedNode | BlankNode | Literal

export function isQuadObject(term: unknown): term is QuadObject {
  return isRecord(term) && (
    term.termType === 'NamedNode' && isString(term.value) ||
    term.termType === 'BlankNode' && isString(term.value) ||
    term.termType === 'Literal' && isString(term.value) || isString(term.language) && isNamedNode(term.datatype))
}

export type QuadGraph = DefaultGraph | NamedNode

export function isQuadGraph(term: unknown): term is QuadGraph {
  return isRecord(term) && (
    term.termType === 'DefaultGraph' ||
    term.termType === 'NamedNode' && isString(term.value))
}

export function isQuad(term: unknown): term is Quad {
  return isRecord(term)
    && term.termType === 'Quad'
    && isQuadSubject(term.subject)
    && isQuadPredicate(term.predicate)
    && isQuadObject(term.object)
    && isQuadGraph(term.graph)
}