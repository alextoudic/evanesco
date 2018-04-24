import 'dom-testing-library/extend-expect'
import { render, wait } from 'react-testing-library'
import React from 'react'

import sleep from './sleep'

export default Context => {
  const createWrapper = (options = {}) => {
    const spy = jest.fn()
    const Wrapper = props => (
      <Context {...props}>
        <p>foo</p>
      </Context>
    )

    const { container, ...other } = render(<Wrapper {...options} />)

    return {
      ...other,
      container,
      spy,
      update: props =>
        render(<Wrapper {...options} {...props} />, { container })
    }
  }

  // it("shouldn't do anything if children content change", async () => {
  //   const onEnter = jest.fn(done => done())
  //   const onLeave = jest.fn(done => done())

  //   const Wrapper = ({ content }: { content: String }) => (
  //     <Context onEnter={onEnter} onLeave={onLeave}>
  //       <p data-testid='content'>{content}</p>
  //     </Context>
  //   )

  //   const { container, queryByTestId } = render(<Wrapper content='foo' />)

  //   expect(queryByTestId('content')).toHaveTextContent('foo')
  //   render(<Wrapper content='bar' />, { container })
  //   expect(queryByTestId('content')).toHaveTextContent('bar')
  //   await wait(expect(onEnter).not.toHaveBeenCalled)
  //   await wait(expect(onLeave).not.toHaveBeenCalled)
  // })

  it('should call JS hooks according to visible prop', async () => {
    const spy = jest.fn()

    const { update } = createWrapper({
      visible: true,
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
    await sleep(200)
    expect(spy.mock.calls).toEqual([
      ['onBeforeLeave'],
      ['onLeave'],
      ['onAfterLeave'],
      ['onBeforeEnter'],
      ['onEnter'],
      ['onAfterEnter']
    ])
  })

  // it('should call JS hooks according to child existance', async () => {
  //   const spy = jest.fn()

  //   const onBeforeEnter = () => spy('onBeforeEnter')
  //   const onEnter = done => {
  //     spy('onEnter')
  //     done()
  //   }
  //   const onAfterEnter = () => spy('onAfterEnter')
  //   const onBeforeLeave = () => spy('onBeforeLeave')
  //   const onLeave = done => {
  //     spy('onLeave')
  //     done()
  //   }
  //   const onAfterLeave = () => spy('onAfterLeave')

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       onBeforeEnter={onBeforeEnter}
  //       onEnter={onEnter}
  //       onAfterEnter={onAfterEnter}
  //       onBeforeLeave={onBeforeLeave}
  //       onLeave={onLeave}
  //       onAfterLeave={onAfterLeave}
  //     >
  //       {visible && <p>foo</p>}
  //     </Context>
  //   )
  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(() => render(<Wrapper visible />, { container }))
  //   await wait(() =>
  //     expect(spy.mock.calls).toEqual([
  //       ['onBeforeLeave'],
  //       ['onLeave'],
  //       ['onAfterLeave'],
  //       ['onBeforeEnter'],
  //       ['onEnter'],
  //       ['onAfterEnter']
  //     ])
  //   )
  // })

  // it('should remove child after transition based on prop', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context visible={visible} onLeave={done => setTimeout(done, 100)}>
  //       <p data-testid='child'>foo</p>
  //     </Context>
  //   )

  //   const { container, queryByTestId } = render(<Wrapper visible />)

  //   expect(queryByTestId('child')).toBeInTheDOM()
  //   render(<Wrapper visible={false} />, { container })
  //   await wait(() => expect(queryByTestId('child')).toBeInTheDOM(), 20)
  //   await wait(() => expect(queryByTestId('child')).not.toBeInTheDOM(), 120)
  // })

  // it('should remove child after transition based on children', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context onLeave={done => setTimeout(done, 100)}>
  //       {visible && <p data-testid='child'>foo</p>}
  //     </Context>
  //   )

  //   const { container, queryByTestId } = render(<Wrapper visible />)

  //   expect(queryByTestId('child')).toBeInTheDOM()
  //   render(<Wrapper visible={false} />, { container })
  //   await wait(() => expect(queryByTestId('child')).toBeInTheDOM(), 20)
  //   await wait(() => expect(queryByTestId('child')).not.toBeInTheDOM(), 120)
  // })

  // it('should be cancelable via prop', async () => {
  //   const spy = jest.fn()

  //   const onBeforeEnter = () => spy('onBeforeEnter')
  //   const onEnter = done => {
  //     spy('onEnter')
  //     done()
  //   }
  //   const onAfterEnter = () => spy('onAfterEnter')
  //   const onLeaveCancelled = () => spy('onLeaveCancelled')
  //   const onBeforeLeave = () => spy('onBeforeLeave')
  //   const onLeave = done => {
  //     spy('onLeave')
  //     setTimeout(done, 200)
  //   }
  //   const onAfterLeave = () => spy('onAfterLeave')

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       onBeforeEnter={onBeforeEnter}
  //       onEnter={onEnter}
  //       onAfterEnter={onAfterEnter}
  //       onBeforeLeave={onBeforeLeave}
  //       onLeave={onLeave}
  //       onAfterLeave={onAfterLeave}
  //       onLeaveCancelled={onLeaveCancelled}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   render(<Wrapper visible />, { container })
  //   await wait(() =>
  //     expect(spy.mock.calls).toEqual([
  //       ['onBeforeLeave'],
  //       ['onLeaveCancelled'],
  //       ['onBeforeEnter'],
  //       ['onEnter'],
  //       ['onAfterEnter']
  //     ])
  //   )
  // })

  // it('should be cancelable via existance', async () => {
  //   const spy = jest.fn()

  //   const onBeforeEnter = () => spy('onBeforeEnter')
  //   const onEnter = done => {
  //     spy('onEnter')
  //     setTimeout(done, 200)
  //   }
  //   const onAfterEnter = () => spy('onAfterEnter')
  //   const onEnterCancelled = () => spy('onEnterCancelled')
  //   const onBeforeLeave = () => spy('onBeforeLeave')
  //   const onLeave = done => {
  //     spy('onLeave')
  //     done()
  //   }
  //   const onAfterLeave = () => spy('onAfterLeave')

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       onBeforeEnter={onBeforeEnter}
  //       onEnter={onEnter}
  //       onAfterEnter={onAfterEnter}
  //       onBeforeLeave={onBeforeLeave}
  //       onLeave={onLeave}
  //       onAfterLeave={onAfterLeave}
  //       onEnterCancelled={onEnterCancelled}
  //     >
  //       {visible && <p>foo</p>}
  //     </Context>
  //   )
  //   const { container } = render(<Wrapper visible={false} />)

  //   render(<Wrapper visible />, { container })
  //   await wait(() => render(<Wrapper visible={false} />, { container }), 100)
  //   await wait(() =>
  //     expect(spy.mock.calls).toEqual([
  //       ['onBeforeEnter'],
  //       ['onEnter'],
  //       ['onEnterCancelled'],
  //       ['onBeforeLeave'],
  //       ['onLeave'],
  //       ['onAfterLeave']
  //     ])
  //   )
  // })

  // it('should call enter on mount with appear', async () => {
  //   const spy = jest.fn()

  //   const onBeforeAppear = () => spy('onBeforeAppear')
  //   const onAppear = done => {
  //     spy('onAppear')
  //     done()
  //   }
  //   const onAfterAppear = () => spy('onAfterAppear')

  //   render(
  //     <Context
  //       appear
  //       onBeforeAppear={onBeforeAppear}
  //       onAppear={onAppear}
  //       onAfterAppear={onAfterAppear}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   await wait(() =>
  //     expect(spy.mock.calls).toEqual([
  //       ['onBeforeAppear'],
  //       ['onAppear'],
  //       ['onAfterAppear']
  //     ])
  //   )
  // })

  // it('should call enter on mount with appear with fallback to enter', async () => {
  //   const spy = jest.fn()

  //   const onBeforeEnter = () => spy('onBeforeEnter')
  //   const onEnter = done => {
  //     spy('onEnter')
  //     done()
  //   }
  //   const onAfterEnter = () => spy('onAfterEnter')

  //   render(
  //     <Context
  //       appear
  //       onBeforeEnter={onBeforeEnter}
  //       onEnter={onEnter}
  //       onAfterEnter={onAfterEnter}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   await wait(() =>
  //     expect(spy.mock.calls).toEqual([
  //       ['onBeforeEnter'],
  //       ['onEnter'],
  //       ['onAfterEnter']
  //     ])
  //   )
  // })

  // it('should handle durations', async () => {
  //   const onAfterLeave = jest.fn()

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context visible={visible} duration={200} onAfterLeave={onAfterLeave}>
  //       <p data-testid='child'>foo</p>
  //     </Context>
  //   )

  //   const { container, queryByTestId } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onAfterLeave).not.toHaveBeenCalled)
  //   await wait(expect(onAfterLeave).toHaveBeenCalled, 210)
  //   expect(queryByTestId('child')).not.toBeInTheDOM()
  // })

  // it('should handle durations objects', async () => {
  //   const onAfterEnter = jest.fn()
  //   const onAfterLeave = jest.fn()

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       duration={{ leave: 200, enter: 400 }}
  //       onAfterEnter={onAfterEnter}
  //       onAfterLeave={onAfterLeave}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onAfterLeave).not.toHaveBeenCalled)
  //   await wait(expect(onAfterLeave).toHaveBeenCalled, 210)
  //   render(<Wrapper visible />, { container })
  //   await wait(expect(onAfterEnter).not.toHaveBeenCalled)
  //   await wait(expect(onAfterEnter).not.toHaveBeenCalled, 210)
  //   await wait(expect(onAfterEnter).toHaveBeenCalled, 210)
  // })

  // it('should handle durations object with one property only', async () => {
  //   const onAfterEnter = jest.fn()
  //   const onAfterLeave = jest.fn()

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       duration={{ leave: 200 }}
  //       onEnter={done => done()}
  //       onAfterEnter={onAfterEnter}
  //       onAfterLeave={onAfterLeave}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onAfterLeave).not.toHaveBeenCalled)
  //   await wait(expect(onAfterLeave).toHaveBeenCalled, 210)
  //   render(<Wrapper visible />, { container })
  //   await wait(expect(onAfterEnter).toHaveBeenCalled)
  // })

  // it('should handle delays', async () => {
  //   const onLeave = jest.fn(done => done())

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context visible={visible} delay={200} onLeave={onLeave}>
  //       <p data-testid='child'>foo</p>
  //     </Context>
  //   )

  //   const { container, queryByTestId } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onLeave).not.toHaveBeenCalled)
  //   await wait(expect(onLeave).toHaveBeenCalled, 210)
  //   expect(queryByTestId('child')).not.toBeInTheDOM()
  // })

  // it('should handle delays objects', async () => {
  //   const onEnter = jest.fn(done => done())
  //   const onLeave = jest.fn(done => done())

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       delay={{ leave: 200, enter: 400 }}
  //       onEnter={onEnter}
  //       onLeave={onLeave}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onLeave).not.toHaveBeenCalled)
  //   await wait(expect(onLeave).toHaveBeenCalled, 210)
  //   render(<Wrapper visible />, { container })
  //   await wait(expect(onEnter).not.toHaveBeenCalled)
  //   await wait(expect(onEnter).not.toHaveBeenCalled, 210)
  //   await wait(expect(onEnter).toHaveBeenCalled, 210)
  // })

  // it('should handle delays object with one property only', async () => {
  //   const onEnter = jest.fn(done => done())
  //   const onLeave = jest.fn(done => done())

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       delay={{ leave: 200 }}
  //       onEnter={onEnter}
  //       onLeave={onLeave}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onLeave).not.toHaveBeenCalled)
  //   await wait(expect(onLeave).toHaveBeenCalled, 210)
  //   render(<Wrapper visible />, { container })
  //   await wait(expect(onEnter).toHaveBeenCalled)
  // })

  // it('should handle delays objects', async () => {
  //   const onEnter = jest.fn(done => done())
  //   const onLeave = jest.fn(done => done())

  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       delay={{ leave: 200, enter: 400 }}
  //       onEnter={onEnter}
  //       onLeave={onLeave}
  //     >
  //       <p>foo</p>
  //     </Context>
  //   )

  //   const { container } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   await wait(expect(onLeave).not.toHaveBeenCalled)
  //   await wait(expect(onLeave).toHaveBeenCalled, 210)
  //   render(<Wrapper visible />, { container })
  //   await wait(expect(onEnter).not.toHaveBeenCalled)
  //   await wait(expect(onEnter).not.toHaveBeenCalled, 210)
  //   await wait(expect(onEnter).toHaveBeenCalled, 210)
  // })

  // it('should inject classnames when name is provided', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context visible={visible} name='test' duration={200}>
  //       <p data-testid='child' className='foo'>
  //         foo
  //       </p>
  //     </Context>
  //   )

  //   const { container, getByTestId } = render(<Wrapper visible />)

  //   render(<Wrapper visible={false} />, { container })
  //   expect(getByTestId('child').className).toBe('test-leave test-leave-active')
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'test-leave-to test-leave-active'
  //     )
  //   )
  //   await wait(() => render(<Wrapper visible />, { container }))
  //   expect(getByTestId('child').className).toBe('test-enter test-enter-active')
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'test-enter-to test-enter-active'
  //     )
  //   )
  // })

  // it('should inject classnames for appear when name is provided', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context appear visible={visible} name='test' duration={200}>
  //       <p data-testid='child' className='foo'>
  //         foo
  //       </p>
  //     </Context>
  //   )

  //   const { container, getByTestId } = render(<Wrapper visible />)

  //   expect(getByTestId('child').className).toBe('test-enter test-enter-active')
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'test-enter-to test-enter-active'
  //     )
  //   )
  // })

  // it('should inject classnames with custom classes', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       visible={visible}
  //       appear
  //       name='test'
  //       appearClassName='appear-from-props'
  //       appearActiveClassName='appear-active-from-props'
  //       appearToClassName='appear-to-from-props'
  //       enterClassName='enter-from-props'
  //       enterActiveClassName='enter-active-from-props'
  //       enterToClassName='enter-to-from-props'
  //       leaveClassName='leave-from-props'
  //       leaveActiveClassName='leave-active-from-props'
  //       leaveToClassName='leave-to-from-props'
  //       duration={200}
  //     >
  //       <p data-testid='child' className='foo'>
  //         foo
  //       </p>
  //     </Context>
  //   )

  //   const { container, getByTestId } = render(<Wrapper visible />)

  //   expect(getByTestId('child').className).toBe(
  //     'appear-from-props appear-active-from-props'
  //   )
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'appear-to-from-props appear-active-from-props'
  //     )
  //   )
  //   render(<Wrapper visible={false} />, { container })
  //   expect(getByTestId('child').className).toBe(
  //     'leave-from-props leave-active-from-props'
  //   )
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'leave-to-from-props leave-active-from-props'
  //     )
  //   )
  //   await wait(() => render(<Wrapper visible />, { container }))
  //   expect(getByTestId('child').className).toBe(
  //     'enter-from-props enter-active-from-props'
  //   )
  //   await wait(() =>
  //     expect(getByTestId('child').className).toBe(
  //       'enter-to-from-props enter-active-from-props'
  //     )
  //   )
  // })

  // it('should inject styles', async () => {
  //   const Wrapper = ({ visible }: { visible: boolean }) => (
  //     <Context
  //       appear
  //       visible={visible}
  //       style={{ color: 'red' }}
  //       appearStyle={{ color: 'blue' }}
  //       appearActiveStyle={{ transition: 'color 0.4s' }}
  //       enterStyle={{ color: 'blue' }}
  //       enterActiveStyle={{ transition: 'color 0.4s' }}
  //       enterToStyle={{ color: 'green' }}
  //       leaveStyle={{ color: 'blue' }}
  //       leaveActiveStyle={{ transition: 'color 0.4s' }}
  //       leaveToStyle={{ color: 'green' }}
  //       duration={400}
  //     >
  //       <p data-testid='child'>foo</p>
  //     </Context>
  //   )

  //   const { container, getByTestId, queryByTestId } = render(
  //     <Wrapper visible />
  //   )

  //   const { style: appearStyle } = getByTestId('child')
  //   expect(appearStyle).toHaveProperty('color', 'blue')
  //   expect(appearStyle).toHaveProperty('transition', 'color 0.4s')
  //   await wait(() => {
  //     expect(getByTestId('child').style).toHaveProperty('color', 'red')
  //     render(<Wrapper visible={false} />, { container })
  //     const { style: leaveStyle } = getByTestId('child')
  //     expect(leaveStyle).toHaveProperty('color', 'blue')
  //     expect(leaveStyle).toHaveProperty('transition', 'color 0.4s')
  //   }, 405)
  //   await wait(() => {
  //     const { style: leaveToStyle } = getByTestId('child')
  //     expect(leaveToStyle).toHaveProperty('color', 'green')
  //     expect(leaveToStyle).toHaveProperty('transition', 'color 0.4s')
  //   })
  //   await wait(() => {
  //     expect(queryByTestId('child')).not.toBeInTheDOM()
  //   }, 405)
  //   render(<Wrapper visible />, { container })
  //   const { style: enterStyle } = getByTestId('child')
  //   expect(enterStyle).toHaveProperty('color', 'blue')
  //   expect(enterStyle).toHaveProperty('transition', 'color 0.4s')
  //   await wait(() => {
  //     const { style: enterToStyle } = getByTestId('child')
  //     expect(enterToStyle).toHaveProperty('color', 'green')
  //     expect(enterToStyle).toHaveProperty('transition', 'color 0.4s')
  //   })
  //   await wait(() => {
  //     const { style: enteredStyle } = getByTestId('child')
  //     expect(enteredStyle).toHaveProperty('color', 'red')
  //     expect(enteredStyle).not.toHaveProperty('transition', 'color 0.4s')
  //   }, 405)
  // })
}
