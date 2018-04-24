import React, { Component, Children } from 'react'

import capitalize from '~/utils/capitalize'
import getOption from '~/utils/getOption'

const PHASE = {
  APPEAR: 'appear',
  ENTER: 'enter',
  LEAVE: 'leave'
}

const STEP = {
  INIT: 'init',
  ACTIVE: 'active',
  DONE: 'done'
}

const STEP_TO_HOOK = {
  [STEP.INIT]: 'Before',
  [STEP.ACTIVE]: '',
  [STEP.DONE]: 'After'
}

export type Props = {
  children: ({ phase: string, step: string }) => ?React.Node,
  visible?: boolean,
  appear?: boolean,
  duration?: number | { enter: number, leave: number },
  delay?: number | { enter: number, leave: number },
  onBeforeAppear?: () => void,
  onAppear?: (done: () => void) => void,
  onAppearCancelled?: () => void,
  onAfterAppear?: () => void,
  onBeforeEnter?: () => void,
  onEnter?: (done: () => void) => void,
  onEnterCancelled?: () => void,
  onAfterEnter?: () => void,
  onBeforeLeave?: () => void,
  onLeave?: (done: () => void) => void,
  onLeaveCancelled?: () => void,
  onAfterLeave?: () => void
}

const noop = () => {}

export default class extends Component<Props> {
  static PHASE = PHASE

  static STEP = STEP

  static defaultProps = {
    visible: false,
    appear: false,
    duration: null,
    delay: null,
    onBeforeAppear: noop,
    onAppear: noop,
    onAppearCancelled: noop,
    onAfterAppear: noop,
    onBeforeEnter: noop,
    onEnter: noop,
    onEnterCancelled: noop,
    onAfterEnter: noop,
    onBeforeLeave: noop,
    onLeave: noop,
    onLeaveCancelled: noop,
    onAfterLeave: noop
  }

  state = {
    first: true,
    phase: null,
    step: STEP.DONE,
    callback: () => {}
  }

  static getDerivedStateFromProps ({ appear, visible }, { first }) {
    if (first) {
      return appear && visible
        ? {
          first: false,
          phase: PHASE.APPEAR,
          step: STEP.INIT
        }
        : {
          first: false,
          phase: visible ? PHASE.ENTER : PHASE.LEAVE,
          step: STEP.DONE
        }
    }

    return {
      phase: visible ? PHASE.ENTER : PHASE.LEAVE,
      step: STEP.INIT
    }
  }

  toggleActive (phase, step) {
    if (step === STEP.INIT) {
      const toggle = () => {
        const callback = () => {
          this.setState({
            step: STEP.DONE,
            callback: () => {}
          })
        }

        this.setState(
          {
            callback,
            step: STEP.ACTIVE
          },
          () => {
            const duration = getOption(this.props.duration, phase)

            if (typeof duration === 'number') {
              setTimeout(callback, duration)
            }
          }
        )
      }

      const delay = getOption(this.props.delay, phase)

      if (typeof delay === 'number') {
        setTimeout(toggle, delay)
      } else toggle()
    }
  }

  componentDidMount () {
    const { phase, step, callback } = this.state
    this.update(phase, step, callback)
  }

  componentDidUpdate (_, prevState) {
    const { phase, step, callback } = this.state

    if (prevState.phase !== phase || prevState.step !== step) {
      this.update(phase, step, callback)
    }
  }

  update = (phase, step, callback) => {
    this.toggleActive(phase, step)
    this.props[`on${STEP_TO_HOOK[step]}${capitalize(phase)}`](callback)
  }

  render = () =>
    this.props.children({
      ...this.state,
      visible: this.props.visible
    })
}
