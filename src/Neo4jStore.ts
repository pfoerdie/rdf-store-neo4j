import type { Store, DataFactory, Quad, Stream, Term } from '@rdfjs/types'
import { Driver as Neo4jDriver } from 'neo4j-driver'
import { DataFactory as DefaultDataFactory } from 'rdf-data-factory'
import QuadStream from './QuadStream'
import { Readable } from 'node:stream'
import EventEmitter from 'node:events'
import { isNull, isQuadGraph, isQuadObject, isQuadPredicate, isQuadSubject } from './util'

type DOMString = string

interface ConstructorOptions {
  neo4jDriver: Neo4jDriver
  dataFactory?: DataFactory
  baseIRI?: DOMString
}

class Neo4jStore implements Store {

  driver: Neo4jDriver
  factory: DataFactory
  baseIRI: string

  constructor(options: ConstructorOptions) {
    this.driver = options?.neo4jDriver
    this.factory = options?.dataFactory ?? new DefaultDataFactory()
    this.baseIRI = options?.baseIRI ?? ''
  }

  match(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): Stream<Quad> {
    if (!isNull(subject) && !isQuadSubject(subject)) throw new TypeError('invalid subject')
    if (!isNull(predicate) && !isQuadPredicate(predicate)) throw new TypeError('invalid predicate')
    if (!isNull(object) && !isQuadObject(object)) throw new TypeError('invalid object')
    if (!isNull(graph) && !isQuadGraph(graph)) throw new TypeError('invalid graph')

    const queryChunks = []
    const queryParams: Record<string, string> = {}

    queryChunks.push('MATCH ')

    switch (subject?.termType) {
      case 'NamedNode':
        queryParams.subjectIRI = subject.value
        queryChunks.push('(subject:NamedNode {iri: $subjectIRI})')
        break;
      case 'BlankNode':
        queryParams.subjectId = subject.value
        queryChunks.push('(subject:BlankNode {id: $subjectId})')
        break;
      default:
        queryChunks.push('(subject)')
    }

    queryChunks.push('-[')

    switch (predicate?.termType) {
      case 'NamedNode':
        queryChunks.push(`predicate:\`${predicate.value}\``)
        break;
      default:
        queryChunks.push(`predicate`)
        break;
    }

    switch (graph?.termType) {
      case 'NamedNode':
        queryParams.graphIRI = graph.value
        queryChunks.push(' {graph: $graphIRI}')
        break;
      case 'DefaultGraph':
        queryChunks.push(' {graph: ""}')
        break;
    }

    queryChunks.push(']->')

    switch (object?.termType) {
      case 'NamedNode':
        queryParams.objectIRI = object.value
        queryChunks.push('(object:NamedNode {iri: $objectIRI})')
        break;
      case 'BlankNode':
        queryParams.objectId = object.value
        queryChunks.push('(object:BlankNode {id: $objectId})')
        break;
      case 'Literal':
        queryParams.objectValue = object.value
        queryChunks.push('(object:Literal {value: $objectValue')
        if (object.language) {
          queryParams.objectLanguage = object.language
          queryChunks.push(', language: $objectLanguage')
        } else {
          queryParams.objectDatatype = object.datatype.value
          queryChunks.push(', datatype: $objectDatatype')
        }
        queryChunks.push('})')
        break;
      default:
        queryChunks.push('(object)')
    }

    queryChunks.push(' RETURN subject, predicate, object')

    const stream = new QuadStream()
    const session = this.driver.session()

    session.run(queryChunks.join(''), queryParams).subscribe({
      onKeys(keys) {

      },
      onNext(record) {
        // TODO
      },
      onCompleted(summary) {
        session.close()
        stream.emit('end')
      },
      onError(error) {
        stream.emit('error', error)
      }
    })

    return stream
  }

  import(stream: QuadStream): EventEmitter<[never]> {
    const emitter = new EventEmitter()
    const session = this.driver.session()

    stream.on('data', (quad) => {

    }).on('error', (error) => {

    }).on('end', () => {

    })

    return emitter
  }

}