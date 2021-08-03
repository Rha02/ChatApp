const messages = [
  {
    "username": "Admin",
    "text": "Admin here!",
    "created_at": Date.now()
  }
]

module.exports = class Message {
  constructor(username, text) {
    this.username = username
    this.text = text
    this.created_at = Date.now()
  }

  /* save() saves the object (itself) in the messages array */
  save() {
    messages.push(this);
  }

  /* fetch(number) returns the lastest (number of) messages. */
  static fetch(number) {
    const output = [];
    let counter = 1;

    // Reverse iterate through the array
    while (counter <= number) {
      const index = messages.length - counter

      // if index is out of range, break!
      if (index < 0) {
          break
      }

      // Push the message to the beginning of output array
      output.unshift(messages[index])
      counter++
    }

    return output
  }
}
