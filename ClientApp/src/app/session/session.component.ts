import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Session } from '../models/session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html'
})
export class SessionComponent implements OnInit {

  private key: string;

  constructor(private activatedRoute: ActivatedRoute, private sessionService: SessionService) {

    this.sessionService.sessionCreated.subscribe((session: Session) => {
      console.log(session);
      this.key = session.key;
    });

    this.sessionService.connected.subscribe(success => {
      if (success) {
        if (this.activatedRoute.snapshot.paramMap.has('key')) {
          this.key = this.activatedRoute.snapshot.paramMap.get('key');
        } else {
          this.sessionService.createSession();
        }
      } else {
        console.error('Failed to connect');
      }
    });

    // Set up participant handlers here.
  }

  ngOnInit() { }

}
