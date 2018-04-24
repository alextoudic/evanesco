import React, { Component, Children } from 'react'

import SingleTransition from '~/components/SingleTransition'

type Props = {
  tag: React.Node
}

export default class extends Component<Props> {
  state = {
    options: {},
    child: null
  }

  constructor (props, context) {
    super(props, context)

    this.state.options = { ...props }
    delete this.state.options.children
    this.state.child = props.children ? Children.only(props.children) : null
  }

  componentWillReceiveProps ({ children, ...options }) {
    this.setState({ options, child: children ? Children.only(children) : null })
  }

  render () {
    const { options, child } = this.state

    return <SingleTransition {...options}>{child}</SingleTransition>
  }
}
