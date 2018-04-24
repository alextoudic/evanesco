/* eslint-env jest */

import { wait, render } from 'react-testing-library'
import 'dom-testing-library/extend-expect'
import React from 'react'

import sleep from './__utils__/sleep'
import { SingleTransition } from '../src'

const createWrapper = (options = {}) => {
  let done
  const spy = jest.fn()
  const Wrapper = props => (
    <SingleTransition {...props}>
      {({ phase, step, callback }) => {
        done = callback
        spy(phase, step)

        return <p>foo</p>
      }}
    </SingleTransition>
  )

  const { container, ...other } = render(<Wrapper {...options} />)

  return {
    ...other,
    container,
    spy,
    done: () => done(),
    update: props => render(<Wrapper {...options} {...props} />, { container })
  }
}

describe('<SingleTransition />', () => {
  describe('toggling visible option', () => {
    it('works when visible on start', () => {
      const { update, done, spy } = createWrapper({
        visible: true
      })

      update({ visible: false })
      done()
      update({ visible: true })
      done()
      expect(spy.mock.calls).toEqual([
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.DONE],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.INIT],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.ACTIVE],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.DONE],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.INIT],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.ACTIVE],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.DONE]
      ])
    })

    it('works when not visible on start', () => {
      const { update, done, spy } = createWrapper()

      done() // useless callbacks calls
      update({ visible: true })
      done()
      done() // useless callbacks calls
      update({ visible: false })
      done()
      done() // useless callbacks calls
      expect(spy.mock.calls).toEqual([
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.DONE],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.INIT],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.ACTIVE],
        [SingleTransition.PHASE.ENTER, SingleTransition.STEP.DONE],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.INIT],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.ACTIVE],
        [SingleTransition.PHASE.LEAVE, SingleTransition.STEP.DONE]
      ])
    })
  })

  describe('with appear option', () => {
    it('apply appear steps', () => {
      const { done, spy } = createWrapper({
        appear: true,
        visible: true
      })

      done()
      done() // useless callbacks calls
      done() // useless callbacks calls
      expect(spy.mock.calls).toEqual([
        [SingleTransition.PHASE.APPEAR, SingleTransition.STEP.INIT],
        [SingleTransition.PHASE.APPEAR, SingleTransition.STEP.ACTIVE],
        [SingleTransition.PHASE.APPEAR, SingleTransition.STEP.DONE]
      ])
    })
  })

  describe('with duration option', () => {
    it('accept a number', async () => {
      const { update, spy } = createWrapper({
        visible: true,
        duration: 200
      })

      update({ visible: false })
      await wait(() =>
        expect(spy).lastCalledWith(
          SingleTransition.PHASE.LEAVE,
          SingleTransition.STEP.DONE
        )
      )
    })

    it('can be shortcutted using callback', async () => {
      const { update, done, spy } = createWrapper({
        visible: true,
        duration: 200
      })

      update({ visible: false })
      await sleep(100)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
      done()
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.DONE
      )
    })

    it('accept an object', async () => {
      const { update, spy } = createWrapper({
        visible: true,
        duration: { leave: 200, enter: 400 }
      })

      update({ visible: false })
      await sleep(100)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.DONE
      )
      update({ visible: true })
      await sleep(300)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.ACTIVE
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.DONE
      )
    })

    it('accept an object with one property only', async () => {
      const { update, done, spy } = createWrapper({
        visible: true,
        duration: { leave: 200 }
      })

      update({ visible: false })
      await sleep(100)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.DONE
      )
      update({ visible: true })
      await sleep(201)
      expect(spy).not.lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.DONE
      )
      done()
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.DONE
      )
    })
  })

  describe('with delay option', () => {
    it('accept a number', async () => {
      const { update, spy } = createWrapper({
        visible: true,
        delay: 200
      })

      update({ visible: false })
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.INIT
      )
      await sleep(201)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
    })

    it('accept an object', async () => {
      const { update, spy } = createWrapper({
        visible: true,
        delay: { leave: 200, enter: 400 }
      })

      update({ visible: false })
      await sleep(100)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.INIT
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
      update({ visible: true })
      await sleep(300)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.INIT
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.ACTIVE
      )
    })

    it('accept an object with one property only', async () => {
      const { update, spy } = createWrapper({
        visible: true,
        delay: { leave: 200 }
      })

      update({ visible: false })
      await sleep(100)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.INIT
      )
      await sleep(101)
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.LEAVE,
        SingleTransition.STEP.ACTIVE
      )
      update({ visible: true })
      expect(spy).lastCalledWith(
        SingleTransition.PHASE.ENTER,
        SingleTransition.STEP.ACTIVE
      )
    })
  })

  describe('with hooks', () => {
    it('should call JS hooks according to visible prop', async () => {
      const spy = jest.fn()

      const { update } = createWrapper({
        appear: true,
        visible: true,
        onBeforeAppear: () => spy('onBeforeAppear'),
        onAppear: done => {
          spy('onAppear')
          done()
        },
        onAfterAppear: () => spy('onAfterAppear'),
        onBeforeEnter: () => spy('onBeforeEnter'),
        onEnter: done => {
          spy('onEnter')
          done()
        },
        onAfterEnter: () => spy('onAfterEnter'),
        onBeforeLeave: () => spy('onBeforeLeave'),
        onLeave: done => {
          spy('onLeave')
          done()
        },
        onAfterLeave: () => spy('onAfterLeave')
      })

      update({ visible: false })
      update({ visible: true })
      await wait(() =>
        expect(spy.mock.calls).toEqual([
          ['onBeforeAppear'],
          ['onAppear'],
          ['onAfterAppear'],
          ['onBeforeLeave'],
          ['onLeave'],
          ['onAfterLeave'],
          ['onBeforeEnter'],
          ['onEnter'],
          ['onAfterEnter']
        ])
      )
    })
  })
})
