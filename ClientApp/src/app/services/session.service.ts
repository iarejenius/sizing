import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

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

  createSession() {
    this.connection.send('createSession')
      .then(() => console.log('message sent'))
      .catch((err) => console.error(err));
  }

}
