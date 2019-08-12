using Microsoft.AspNetCore.SignalR;
using Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace sizing.Hubs
{
    class SessionHub : Hub
    {
        public DataAccess.ISessionRepository SessionRepository { get; set; }

        public SessionHub(DataAccess.ISessionRepository sessionRepository)
        {
            SessionRepository = sessionRepository;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var participant = SessionRepository.FindParticipantByConnectionId(Context.ConnectionId);
            await RemoveParticipant(participant);
        }

        public async Task CreateSession()
        {
            var session = SessionRepository.CreateSession(Context.ConnectionId);
            Console.WriteLine(session);
            await Clients.Caller.SendAsync("sessionCreated", session);
        }

        public async Task CreateParticipant(string sessionKey, string name)
        {
            var parentSession = SessionRepository.GetSession(sessionKey);
            var participant = SessionRepository.CreateParticipant(sessionKey, name);
            participant.ConnectionId = Context.ConnectionId;
            Console.WriteLine(participant);
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantJoined", participant);
        }

        // Endpoint to handle when session is terminated
        // Add observable to participant service for when terminated
        public async Task EndSession(string sessionKey)
        {
            // Send message to session group that session has ended
            await Clients.Group(sessionKey).SendAsync("sessionEnded");
            var session = SessionRepository.GetSession(sessionKey);
            // Delete session from repository
            SessionRepository.RemoveSession(sessionKey);
        }

        // Endpoint to handle when participant is updated
        // Add observable to session service for when a particular participant updates
        public async Task UpdateParticipant(Participant updatedParticipant)
        {
            Console.WriteLine("Updating participant");
            SessionRepository.UpdateParticipant(updatedParticipant);
            var parentSession = SessionRepository.GetSession(updatedParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantUpdated", updatedParticipant);
        }

        // Endpoint to handle when participant leaves
        // Add observable to session service for when a particular participant exits
        public async Task RemoveParticipant(Participant removeParticipant)
        {
            Console.WriteLine("Removing participant");
            SessionRepository.RemoveParticipant(removeParticipant);
            var parentSession = SessionRepository.GetSession(removeParticipant.SessionKey);
            await Groups.RemoveFromGroupAsync(removeParticipant.ConnectionId, removeParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantLeft", removeParticipant);
        }

        // Endpoint to handle when session clears sizes
        // Add observable to participant service for when size is cleared
        public async Task ClearSize(Session session)
        {
            SessionRepository.GetSession(session.Key);
            await Clients.Group(session.Key).SendAsync("clearSize");
        }

    }
}