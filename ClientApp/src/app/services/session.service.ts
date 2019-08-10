import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private connection: signalR.HubConnection;
  public newSessions: Observable<any>;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .build();

    this.connection.start().catch(err => console.error(err));

    this.newSessions = new Observable<any>((observer) => {
      this.connection.on('sessionCreated', (session: any) => {
        observer.next(session);

        // Calling this just means that subsequent calls to createSession
        // call us back here.
        observer.complete();
      });
      return () => {
        this.connection.off('sessionCreated', observer.next);
      };
    });
  }

  createSession() {
    this.connection.send('createSession')
      .then(() => console.log('message sent'))
      .catch((err) => console.error(err));
  }

}
