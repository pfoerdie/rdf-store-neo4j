import { Stream, Quad } from '@rdfjs/types'
import EventEmitter from 'node:events'

export default class QuadStream extends EventEmitter implements Stream {

  push(quad: Quad) {

  }

  read(): Quad | null {

  }

}