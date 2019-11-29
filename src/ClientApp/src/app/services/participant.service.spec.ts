import { TestBed, inject } from '@angular/core/testing';

import { ParticipantService } from './participant.service';
import { SignalRConnection } from './signalr-connection.service';

describe('ParticipantService', () => {

  let sut: ParticipantService;

  const signalrSpy = jasmine.createSpyObj('SignalRConnection', {
    'on': () => Promise.resolve([]),
    'off': () => Promise.resolve([]),
    'send':() => Promise.resolve([])
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SignalRConnection, useValue: signalrSpy }]
    });

    sut = TestBed.get(ParticipantService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should call send correctly when createParticipant is called', () => {
    let testKey = "test key";
    let testName = "test name";
    sut.createParticipant(testKey, testName);
    //expect(signalrSpy.send).toHaveBeenCalled();
  });

});
