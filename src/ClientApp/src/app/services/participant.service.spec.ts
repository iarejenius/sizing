import { TestBed } from '@angular/core/testing';

import { ParticipantService } from './participant.service';
import { SignalRConnection } from './signalr-connection.service';
import { Participant } from '../models/participant';

describe('ParticipantService', () => {

  let sut: ParticipantService;

  const signalrSpy = jasmine.createSpyObj('SignalRConnection', ['send', 'start', 'stop', 'on']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SignalRConnection, useValue: signalrSpy }]
    });

    signalrSpy.on.calls.reset();

    sut = TestBed.get(ParticipantService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should call send correctly when createParticipant is called', () => {
    const testKey = 'test key';
    const testName = 'test name';
    signalrSpy.send.and.returnValue({
      catch: (reason: any) => { }
    });

    sut.createParticipant(testKey, testName);

    expect(signalrSpy.send).toHaveBeenCalledWith('createParticipant', testKey, testName);
  });

  it('should call send correctly when updateParticipant is called', () => {
    const testParticipant = new Participant();
    testParticipant.id = 'testId';
    testParticipant.name = 'testName';
    testParticipant.sessionKey = 'testKey';
    testParticipant.size = 'testSize';

    signalrSpy.send.and.returnValue({
      catch: (reason: any) => { }
    });

    sut.updateParticipant(testParticipant);
    expect(signalrSpy.send).toHaveBeenCalledWith('updateParticipant', testParticipant);

  });

  it('should use connection as expected when connected is observed', () => {
    signalrSpy.start.and.callFake(() => {
      return Promise.resolve();
    });

    sut.connected.subscribe((value: boolean) => {
      expect(value).toBe(true);
    });

    expect(signalrSpy.start).toHaveBeenCalled();
  });

  it('should use connection as expected when participantCreated is observed', () => {
    const testParticipant = new Participant();

    signalrSpy.on.and.callThrough();

    sut.participantCreated.subscribe((result) => {
      expect(result).toBe(testParticipant);
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('participantCreated', jasmine.any(Function));
  });

  it('should use connection as expected when sizeCleared is observed', () => {
    signalrSpy.on.and.callThrough();

    sut.sizeCleared.subscribe(() => {
      // Nothing to assert
    });

    expect(signalrSpy.on).toHaveBeenCalledWith('clearSize', jasmine.any(Function));
  });

});
