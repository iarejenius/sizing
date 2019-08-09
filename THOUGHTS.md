# Server
## SignalR
- Uses Hubs to
    - Receive requests from clients
    - Send messages to clients

# Client
## Angular
- Uses SignalR client to
    - Send request to Hub
    - Receive messages from Hub
- Angular service
    - Injected into components
    - Typically used to abstract http calls to remote services

# Server-Client integration
## Workflow
1. Host Client tells Server to create session
2. Server tells Host Client that session was created
3. New Client tells Server to join session
4. Server tells New Client they've joined as participant
5. Server tells Host Client that they have a new participant
6. Host Client tells Server to clear participant scores
7. Server tells all Participant Clients to clear their scores
8. Host Client closes it's browser which sends a message to Server to remove participant

## Server bits
### Hub endpoint for new session
- Creates new Session
- Sends message to Caller with Session content
### Hub endpoint for new participant
- Takes session key
- Creates new participant associated with that session
- Sends message to Caller with Participant content
- Sends message to associated session
    - How to find this specific client?
### Hub endpoint for participant update

## Client bits
### Host service
- Creates SignalR client
- Has method for creating session that takes callback for when session is successfully created
- How to set up callback for when participant is added/updated?
    - Could require participant callbacks to create session
    - What about creating Observable?

### Participant service
- Creates SignalR client
- Has method for creating participant that takes callback for when participant is successfully created
- Has method for updating participant
- How to set up call back for when server tells participants to clear size?
    - Same as above...
    - Could require all participants to provide callbacks on creation of participant
    - What about creating Observable
- Has a way to inform the server that it's left the session.
    - Use observable onclose method.

### Using observables to handle messages from SignalR

``` typescript
function fromSignalR(connection, message) {
    return new Observable((observer) => {
        const messageHandler = (messageContent) 
            => observer.next(messageContent);

        connection.on(message, messageHandler);
        connection.onclose(() => {
            // Tell server to remove participant
        })

        return () => {
            connection.off(message, messageHandler);
        };
    });
}

// Can then use it like this inside the participant component
let subscription = fromSignalR(connection, 'participantUpdate')
    .subscribe((participantUpdate: Participant) => {
        // Replace the component's participant record.
    });

```