import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Observable, observable } from 'rxjs';
import { Session } from '../models/session';
import { Participant } from '../models/participant';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private connection: signalR.HubConnection;
  public sessionCreated: Observable<Session>;
  public participantJoined: Observable<Participant>;
  public participantUpdated: Observable<Participant>;
  public participantLeft: Observable<Participant>;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hub')
      .build();

    this.connection.start().catch(err => console.error(err));

    this.sessionCreated = new Observable<Session>((observer) => {
      this.connection.on('sessionCreated', (session: Session) => {
        observer.next(session);
        observer.complete();
      });
      return () => {
        this.connection.off('sessionCreated', observer.next);
      };
    });

    this.participantJoined = new Observable<Participant>((observer) => {
      this.connection.on('participantJoined', (participant: Participant) => {
        observer.next(participant);
      });
      return () => {
        this.connection.off('participantJoined', observer.next);
      };
    });

    this.participantUpdated = new Observable<Participant>((observer) => {
      this.connection.on('participantUpdated', (participant: Participant) => {
        observer.next(participant);
      });
    });

    this.participantLeft = new Observable<Participant>((observer) => {
      this.connection.on('participantLeft', (participant: Participant) => {
        observer.next(participant);
      });
      return () => {
        this.connection.off('participantLeft', observer.next);
      };
    });

  }

  createSession() {
    this.connection.send('createSession')
      .then(() => console.log('message sent'))
      .catch((err) => console.error(err));
  }

}
