import type { Store, DataFactory, Quad, Stream, Term } from '@rdfjs/types'
import { Driver as Neo4jDriver } from 'neo4j-driver'
import { DataFactory as DefaultDataFactory } from 'rdf-data-factory'
import QuadStream from './QuadStream'

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
    const query = ''
    const param = {}
    const stream = new QuadStream()
    const session = this.driver.session()
    session.run(query, param).subscribe({
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

}