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
    descriptor.value = wrap(descriptor.value, name)
    return
  }

  // Wrap constructor functions.
  if (typeof value === 'function') {
    return wrap(value)
  }

  // Enable or disable debugging.
  return value ? debug : undefined
}

function wrap <T extends Function> (fn: T, name?: string): T {
  name = name || (<any> fn).name

  function debug (...args: any[]) {
    const isNew = this instanceof debug
    const start = now()
    const result = isNew ? new (<any> fn)(...args) : fn.apply(this, args)
    const end = now()
    const time = end - start
    const context = isNew ? result : this
    const output: Debug = { name, result, args, time, context }

    console.log(output)

    return result
  }

  // Set the `displayName` for better debugging.
  (<any> debug).displayName = name

  return <T> <any> debug
}

export = debug
