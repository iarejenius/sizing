import { Component } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;

  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .build();

    this.connection.start().catch(err => console.error(err));
    this.connection.on('sessionCreated', (session: any) => {
      console.log(session);
    });
  }

  public incrementCounter() {
    this.currentCount++;

    this.connection.send('createSession')
      .then(() => console.log('message sent'))
      .catch((err) => console.error(err));
  }
}
