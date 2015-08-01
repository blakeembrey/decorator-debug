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

    new Demo().method('test')

    const arg = s.getCall(0).args[0]

    s.restore()

    expect(arg.name).to.deep.equal('method')
    expect(arg.args).to.deep.equal(['test'])
    expect(arg.result).to.equal(true)
    expect(arg.time).to.be.a('number')
  })

  it('should debug constructors', () => {
    @debug
    class Demo {
      constructor (...numbers: number[]) {}
      method () {}
    }

    const s = spy(console, 'log')

    new Demo(1, 2, 3)

    const arg = s.getCall(0).args[0]

    s.restore()

    expect(arg.name).to.deep.equal('Demo')
    expect(arg.args).to.deep.equal([1, 2, 3])
    expect(arg.result.method).to.be.a('function')
    expect(arg.time).to.be.a('number')
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
})
