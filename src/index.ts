import now = require('performance-now')

interface Debug {
  name: string
  result: any
  args: any[]
  time: number
  context: any
}

function debug (value: boolean): typeof debug
function debug <T extends Function> (value: T): T
function debug (value: Object, name: string, descriptor: PropertyDescriptor): void
function debug (value: any, name?: string, descriptor?: PropertyDescriptor) {
  // Class properties.
  if (arguments.length === 3) {
    if (descriptor.get) {
      descriptor.get = wrap(descriptor.get, name, value, 'get')
    }

    if (descriptor.set) {
      descriptor.set = wrap(descriptor.set, name, value, 'set')
    }

    if (descriptor.value) {
      descriptor.value = wrap(descriptor.value, name, value)
    }

    return
  }

  // Wrap constructor functions.
  if (typeof value === 'function') {
    return wrap(value)
  }

  // Enable or disable debugging.
  return value ? debug : undefined
}

function wrap <T extends Function> (fn: T, property?: string, target?: any, type?: string): T {
  const name = property || (<any> fn).name
  const signature = `${type ? type + ' ' : ''}${target ? target.constructor.name + '#' : ''}${name}`

  function debug (...args: any[]) {
    const isNew = this instanceof debug
    const context = isNew ? Object.create(fn.prototype) : this
    const start = now()
    const out = fn.apply(context, args)
    const end = now()
    const result = isNew ? (out === Object(out) ? out : context) : out
    const time = end - start
    const output: Debug = { name, result, args, time, context }

    console.log(`${isNew ? 'new ' : ''}${signature}`, output)

    return result
  }

  // Set the `displayName` for better debugging.
  ;(<any> debug).displayName = name
  ;(<any> debug).prototype = fn.prototype

  // Copy all properties from function.
  for (let property in fn) {
    ;(<any> debug)[property] = (<any> fn)[property]
  }

  return <T> <any> debug
}

export = debug
