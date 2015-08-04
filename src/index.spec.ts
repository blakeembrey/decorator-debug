import { spy } from 'sinon'
import { expect } from 'chai'
import debug = require('./index')

describe('decorator debug', () => {
  it('should debug methods', () => {
    class Demo {
      @debug
      method (x: string) {
        return true
      }
    }

    const s = spy(console, 'log')
    const instance = new Demo()

    instance.method('test')

    const name = s.getCall(0).args[0]
    const arg = s.getCall(0).args[1]

    s.restore()

    expect(s.callCount).to.equal(1)

    expect(name).to.equal('Demo#method')

    expect(arg.name).to.deep.equal('method')
    expect(arg.args).to.deep.equal(['test'])
    expect(arg.result).to.equal(true)
    expect(arg.time).to.be.a('number')
    expect(arg.context).to.equal(instance)
  })

  it('should debug constructors', () => {
    @debug
    class Demo {
      constructor (...numbers: number[]) {}
      method () {}
    }

    const s = spy(console, 'log')
    const result = new Demo(1, 2, 3)
    const name = s.getCall(0).args[0]
    const arg = s.getCall(0).args[1]

    s.restore()

    expect(s.callCount).to.equal(1)

    expect(name).to.equal('new Demo')

    expect(arg.name).to.deep.equal('Demo')
    expect(arg.args).to.deep.equal([1, 2, 3])
    expect(arg.result.method).to.be.a('function')
    expect(arg.time).to.be.a('number')
    expect(arg.context).to.equal(arg.result)
  })

  describe('conditional', () => {
    it('should enable debug', () => {
      class Demo {
        @debug(true)
        method () {}
      }

      const s = spy(console, 'log')

      new Demo().method()

      const arg = s.getCall(0).args[0]

      s.restore()

      expect(s.callCount).to.equal(1)
    })

    it('should disable debug', () => {
      class Demo {
        @debug(false)
        method () {}
      }

      const s = spy(console, 'log')

      new Demo().method()

      s.restore()

      expect(s.callCount).to.equal(0)
    })
  })

  it('should keep function properties', () => {
    @debug
    class Demo {
      static foo = 'bar'
    }

    expect(Demo.foo).to.equal('bar')
  })

  it('should work with setters/getters', () => {
    class Demo {
      @debug
      get prop () { return true}
      set prop (x: boolean) {}
    }

    const s = spy(console, 'log')
    const instance = new Demo()

    instance.prop = false
    instance.prop

    s.restore()

    expect(s.callCount).to.equal(2)

    const name1 = s.getCall(0).args[0]
    const arg1 = s.getCall(0).args[1]

    const name2 = s.getCall(1).args[0]
    const arg2 = s.getCall(1).args[1]

    expect(name1).to.equal('set Demo#prop')

    expect(arg1.name).to.deep.equal('prop')
    expect(arg1.args).to.deep.equal([false])
    expect(arg1.result).to.be.undefined
    expect(arg1.time).to.be.a('number')
    expect(arg1.context).to.equal(instance)

    expect(name2).to.equal('get Demo#prop')

    expect(arg2.name).to.deep.equal('prop')
    expect(arg2.args).to.deep.equal([])
    expect(arg2.result).to.be.true
    expect(arg2.time).to.be.a('number')
    expect(arg2.context).to.equal(instance)
  })
})
