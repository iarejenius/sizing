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
        public async Task UpdateParticipant(Participant participant)
        {
            
        }

        // Endpoint to handle when participant leaves
        // Add observable to session service for when a particular participant exits

        // Endpoint to handle when session clears sizes
        // Add observable to participant service for when size is cleared

    }
}