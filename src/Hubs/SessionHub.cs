using Microsoft.AspNetCore.SignalR;
using sizing.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace sizing.Hubs
{
    public class SessionHub : Hub
    {
        public DataAccess.ISessionRepository SessionRepository { get; set; }

        public SessionHub(DataAccess.ISessionRepository sessionRepository)
        {
            SessionRepository = sessionRepository;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var participant = SessionRepository.FindParticipantByConnectionId(Context.ConnectionId);
            if (participant != null)
            {
                await RemoveParticipant(participant);
            }
        }

        public async Task CreateSession()
        {
            var session = SessionRepository.CreateSession(Context.ConnectionId);
            await Clients.Caller.SendAsync("sessionCreated", session);
        }

        public async Task CreateParticipant(string sessionKey, string name)
        {
            var parentSession = SessionRepository.GetSession(sessionKey);
            var participant = SessionRepository.CreateParticipant(sessionKey, name);
            participant.ConnectionId = Context.ConnectionId;

            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, sessionKey),
                Clients.Caller.SendAsync("participantCreated", participant),
                Clients.Client(parentSession.ConnectionId).SendAsync("participantJoined", participant));
        }

        // Endpoint to handle when session is terminated
        // Add observable to participant service for when terminated
        public async Task EndSession(string sessionKey)
        {
            var session = SessionRepository.GetSession(sessionKey);
            if (session != null)
            {
                // Send message to session group that session has ended
                await Clients.Group(sessionKey).SendAsync("sessionEnded");
                // Delete session from repository
                SessionRepository.RemoveSession(sessionKey);
            }
        }

        // Endpoint to handle when participant is updated
        // Add observable to session service for when a particular participant updates
        public async Task UpdateParticipant(Participant updatedParticipant)
        {
            SessionRepository.UpdateParticipant(updatedParticipant);
            var parentSession = SessionRepository.GetSession(updatedParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantUpdated", updatedParticipant);
        }

        // Endpoint to handle when participant leaves
        // Add observable to session service for when a particular participant exits
        public async Task RemoveParticipant(Participant removeParticipant)
        {
            SessionRepository.RemoveParticipant(removeParticipant);
            var parentSession = SessionRepository.GetSession(removeParticipant.SessionKey);
            await Groups.RemoveFromGroupAsync(removeParticipant.ConnectionId, removeParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantLeft", removeParticipant);
        }

        // Endpoint to handle when session clears sizes
        // Add observable to participant service for when size is cleared
        public async Task ClearSize(string sessionKey)
        {
            var session = SessionRepository.GetSession(sessionKey);
            if (session != null)
            {
                await Clients.Group(sessionKey).SendAsync("clearSize");
            }
        }

    }
}