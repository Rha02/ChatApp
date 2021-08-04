import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

const server = "http://localhost:8080";
let user = "Anonymous";

function App () {
  return (
    <Router>
      <div class="">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link class="nav-link" to="/">Home</Link>
                </li>
                <li class="nav-item">
                  <Link class="nav-link" to="/messages">Messages</Link>
                </li>
              </ul>
              <ul class="navbar-nav">
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Anonymous
                  </a>
                  <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item nav-item" href="#">
                      <Link to="/">Change Nickname</Link>
                    </a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/messages">
            <Messages />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

class Home extends React.Component{
  render() {
    return (
      <div class="container">
        <label>Enter Nickname</label>
        <br />
        <input type="text" name="nickname" placeholder="Nickname"></input>
        <br />
        <Link class="btn btn-primary" to="/messages">
          Enter
        </Link>
      </div>
    )
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], newMessage: "", interval: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div class="container">
        <h3>Messages</h3>
        <MessageList messages={this.state.messages} />
        <form onSubmit={this.handleSubmit}>
          <input
            id="message"
            onChange={this.handleChange}
            value={this.state.newMessage}
          />
          <button type="submit" class="btn btn-primary">
            Enter
          </button>
        </form>
      </div>
    );
  }

  async componentDidMount() {
    // initialize messages
    let res = await fetch(`${server}/messages`);
    let data = await res.json();
    this.setState({ messages: data })

    // receive messages from the server every 5 seconds
    try {
      this.state.interval = setInterval(async () => {
        res = await fetch(`${server}/messages`);
        data = await res.json();
        console.log(data);
        this.setState({
          messages: data
        })
      }, 5000)
    } catch (e) {
      console.log(e)
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  handleChange(e) {
    this.setState({ newMessage: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const newMessage = {
      text: this.state.newMessage,
      username: user
    };

    // POST to the server
    await fetch(`${server}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    })

    // GET from the server
    const res = await fetch(`${server}/messages`)
    const data = await res.json();

    this.setState({
      messages: data,
      newMessage: ''
    })
  }
}

class MessageList extends React.Component {
  render() {
    return (
      <div>
        {this.props.messages.map(message => (
          <div key={message.created_at}>{message.username}: {message.text}</div>
        ))}
      </div>
    );
  }
}

export default App;
