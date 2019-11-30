import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Observable } from 'rxjs';
import { Session } from '../models/session';
import { Participant } from '../models/participant';
import { SignalRConnection } from './signalr-connection.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public sessionCreated: Observable<Session>;
  public participantJoined: Observable<Participant>;
  public participantUpdated: Observable<Participant>;
  public participantLeft: Observable<Participant>;
  public connected: Observable<boolean>;

  constructor(private connection: SignalRConnection) {

    this.connected = new Observable<boolean>((observer) => {
      this.connection.start()
        .then(() => observer.next(true), () => observer.next(false))
        .catch(err => console.error(err));
      return () => {
        this.connection.stop();
      };
    });

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

  public createSession() {
    this.connection.send('createSession')
      .catch((err) => console.error(err));
  }

  public clearSizes(sessionKey: string) {
    this.connection.send('clearSize', sessionKey)
      .catch((err) => console.error(err));
  }

}
