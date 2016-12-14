import React from 'react';
import ReactDOM from 'react-dom';

class Home extends React.Component {
  render() {
    return (<div>
      <h1>Hello World!</h1>
      <img src="assets/images/close.svg" alt="" />
    </div>);
  }
}

export default Home;

ReactDOM.render(
    <Home />,
    document.getElementById('root')
);
