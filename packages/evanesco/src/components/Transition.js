import React, { Component } from 'react'
// import React, { Component, Children, Fragment } from 'react'

import type { Props as SingleTransitionProps } from '~/components/SingleTransition'
import SingleTransition from '~/components/SingleTransition'

import type { Props as HookProps } from './components/HookHandler'

const MODE_BOTH = 'both'
const MODE_IN_OUT = 'in-out'
const MODE_OUT_IN = 'out-in'

type Props = SingleTransitionProps &
  HookProps & {
    mode: MODE_BOTH | MODE_IN_OUT | MODE_OUT_IN
  }

export default class extends Component<Props> {
  // state = {
  //   options: {},
  //   child: null
  // }

  // constructor (props, context) {
  //   super(props, context)

  //   this.state.options = { ...props }
  //   delete this.state.options.children
  //   this.state.child = props.children ? Children.only(props.children) : null
  // }

  // componentWillReceiveProps ({ children, ...options }) {
  //   this.setState({ options, child: children ? Children.only(children) : null })
  // }

  render () {
    const { props } = this

    return <SingleTransition {...props} />
  }
}
