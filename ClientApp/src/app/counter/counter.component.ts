import { Component } from '@angular/core';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;

  constructor(private sessionServer: SessionService) {
    this.sessionServer.newSessions.subscribe((session: any) => {
      console.log(session);
    });
  }

  public; incrementCounter() {
    this.sessionServer.createSession();
    this.currentCount++;
  }
}
