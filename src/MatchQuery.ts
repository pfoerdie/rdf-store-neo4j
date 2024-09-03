import { Term } from '@rdfjs/types'

type Query = string
type Param = Record<string, string>

export default function MatchQuery(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): { query: Query, param: Param } {
  return {
    query: [
      'MATCH (q:Quad)',
      nodeMatches('s', subject),
      subject && `(q)-[:subject]->(s)`,
      nodeMatches('p', predicate),
      predicate && `(q)-[:predicate]->(p)`,
      nodeMatches('o', object),
      object && `(q)-[:object]->(o)`,
      nodeMatches('g', graph),
      graph && `(q)-[:graph]->(g)`,
      'RETURN s AS subject, p AS predicate, o AS object, g AS graph'
    ].filter(Boolean).join('\n'),
    param: {
      ...nodeParam('s', subject),
      ...nodeParam('p', predicate),
      ...nodeParam('o', object),
      ...nodeParam('g', graph)
    }
  }
}

function nodeMatches(prefix: string, term?: Term | null): string {
  if (!term) return `MATCH (${prefix}:Term)`
  switch (term.termType) {
    case 'Literal':
      return `MATCH (${prefix}:Literal {value = $${prefix}v, language = $${prefix}l})-[:datatype]->(${prefix}d:NamedNode)`
    case 'NamedNode':
    case 'BlankNode':
    case 'Variable':
      return `MATCH (${prefix}:${term.termType} {value = $${prefix}v})`
    case 'DefaultGraph':
      return `MATCH (${prefix}:DefaultGraph)`
    case 'Quad':
      return [
        `MATCH (${prefix}:Quad)`,
        nodeMatches(prefix + 's', term.subject),
        `MATCH (${prefix})-[:subject]->(${prefix}s)`,
        nodeMatches(prefix + 'p', term.predicate),
        `MATCH (${prefix})-[:predicate]->(${prefix}p)`,
        nodeMatches(prefix + 'o', term.object),
        `MATCH (${prefix})-[:object]->(${prefix}o)`,
        nodeMatches(prefix + 'g', term.graph),
        `MATCH (${prefix})-[:graph]->(${prefix}g)`,
      ].join('\n')
  }
}

function nodeParam(prefix: string, term?: Term | null): Param {
  const param: Param = {}
  if (!term) return param
  switch (term.termType) {
    case 'Literal':
      param[prefix + 'l'] = term.language
      param[prefix + 'd'] = term.datatype.value
    case 'NamedNode':
    case 'BlankNode':
    case 'Variable':
      param[prefix + 'v'] = term.value
    case 'DefaultGraph':
      break;
    case 'Quad':
      Object.assign(
        param,
        nodeParam(prefix + 's', term.subject),
        nodeParam(prefix + 'p', term.predicate),
        nodeParam(prefix + 'o', term.object),
        nodeParam(prefix + 'g', term.graph)
      )
      break;
  }
  return param
}