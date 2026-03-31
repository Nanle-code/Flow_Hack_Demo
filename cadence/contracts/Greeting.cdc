access(all) contract Greeting {
    access(all) var greeting: String

    // Event to be emitted when greeting is changed
    access(all) event GreetingChanged(newGreeting: String)

    init() {
        self.greeting = "Hello, Flow!"
    }

    // Public function to set a new greeting
    access(all) fun setGreeting(newGreeting: String) {
        self.greeting = newGreeting
        emit GreetingChanged(newGreeting: self.greeting)
    }

    // Public function to get current greeting
    view access(all) fun getGreeting(): String {
        return self.greeting
    }
}
