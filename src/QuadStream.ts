import { Stream, Quad, NamedNode } from '@rdfjs/types'
import EventEmitter from 'node:events'
import { Readable } from 'node:stream'

export type StreamEvents = {
  'readable': []
  'end': []
  'error': [Error]
  'data': [Quad]
  'prefix': [string, NamedNode]
}

export default class QuadStream extends EventEmitter<StreamEvents> implements Stream {

  push(quad: Quad) {

  }

  read(): Quad | null {

  }

}