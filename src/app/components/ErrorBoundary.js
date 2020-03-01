import React, { Component } from 'react';
import NotFound from '../containers/NotFound';
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, counter: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props, state) {
    if(state.hasError && state.counter==0) {
      return {
        counter:state.counter+1
      }
    } else if(state.hasError) {
      return {
        hasError:false,
        counter: 0
      }
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      if(this.props.blank){
        return null;
      }
      return <NotFound message="Something went wrong!!!" />;
    }

    return this.props.children; 
  }
}
export default ErrorBoundary;