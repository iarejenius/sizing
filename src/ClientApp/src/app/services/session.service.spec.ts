import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import { SignalRConnection } from './signalr-connection.service';
import { Session } from '../models/session';
import { Participant } from '../models/participant';

describe('SessionService', () => {

  const signalrSpy = jasmine.createSpyObj('SignalRConnection', ['send', 'start', 'stop', 'on']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        {provide: SignalRConnection, useValue: signalrSpy }
      ]
    });

    signalrSpy.on.calls.reset();
  });

  it('should be created', inject([SessionService], (sut: SessionService) => {
    expect(sut).toBeTruthy();
  }));

  it('should call send correctly when createSession is called', inject([SessionService], (sut:SessionService) => {
      signalrSpy.send.and.returnValue({
        catch: (reason: any) => { }
      });

      sut.createSession();

      expect(signalrSpy.send).toHaveBeenCalledWith('createSession');
    }));

    
  it('should call send correctly when clearSizes is called', inject([SessionService], (sut: SessionService) => {
    signalrSpy.send.and.returnValue({
      catch: (reason: any) => { }
    });

    const testKey = "testkey";

    sut.clearSizes(testKey);

    expect(signalrSpy.send).toHaveBeenCalledWith('clearSize', testKey);
  }));

  it('should use connection as expected when connected is observed', inject([SessionService], (sut: SessionService) => {
    signalrSpy.start.and.callFake(() => {
      return Promise.resolve();
    });

    sut.connected.subscribe((value: boolean) => {
      expect(value).toBe(true);
    });

    expect(signalrSpy.start).toHaveBeenCalled();
  }));

  it('should use connection as expected when sessionCreated is observed', inject([SessionService], (sut: SessionService) => {
    signalrSpy.on.and.callThrough();
    const testSession = new Session();

    sut.sessionCreated.subscribe((result) => {
      expect(result).toBe(testSession);
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('sessionCreated', jasmine.any(Function));
  }));

  it('should use connection as expected when participantJoined is observed',  inject([SessionService], (sut: SessionService) => {
    signalrSpy.on.and.callThrough();
    const testParticipant = new Participant();

    sut.participantJoined.subscribe((result) => {
      expect(result).toBe(testParticipant);
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('participantJoined', jasmine.any(Function));
  }));

  it('should use connection as expected when participantUpdated is observed',  inject([SessionService], (sut: SessionService) => {
    signalrSpy.on.and.callThrough();
    const testParticipant = new Participant();

    sut.participantUpdated.subscribe((result) => {
      expect(result).toBe(testParticipant);
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('participantUpdated', jasmine.any(Function));
  }));

  it('should use connection as expected when participantLeft is observed',  inject([SessionService], (sut: SessionService) => {
    signalrSpy.on.and.callThrough();
    const testParticipant = new Participant();

    sut.participantLeft.subscribe((result) => {
      expect(result).toBe(testParticipant);
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('participantLeft', jasmine.any(Function));
  }));

});
