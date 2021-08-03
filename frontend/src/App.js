import './App.css';
import React from 'react';

const server = "http://localhost:8080"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], newMessage: "", interval: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.fetchMessages = this.fetchMessages.bind(this);
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

  // receives messages from the server every 5 seconds
  // fetchMessages() {
  //   setInterval(async function () {
  //     const res = await fetch(`${server}/messages`);
  //     const data = await res.json();
  //     console.log(data);
  //     this.setState({
  //       messages: data
  //     });
  //   }, 5000);
  // }

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
      username: "Anonymous"
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
          <p key={message.created_at}>{message.username}: {message.text}</p>
        ))}
      </div>
    );
  }
}

export default App;
