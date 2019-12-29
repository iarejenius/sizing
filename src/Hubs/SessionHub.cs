using Microsoft.AspNetCore.SignalR;
using sizing.Models;
using System;
using System.Threading.Tasks;

namespace sizing.Hubs
{
    /// <summary>
    /// Class for handling messages to and from sizing browser session.
    /// </summary>
    public class SessionHub : Hub
    {
        private DataAccess.ISessionRepository SessionRepository { get; set; }

        /// <summary>
        /// Creates an instance of <see cref="SessionHub"/>.
        /// </summary>
        /// <param name="sessionRepository">Respository for managing session related records.</param>  
        public SessionHub(DataAccess.ISessionRepository sessionRepository)
        {
            SessionRepository = sessionRepository;
        }

        /// <summary>
        /// Method for handling message that a connection has been ended.
        /// </summary>
        /// <param name="exception">Exception that caused the disconnection if available; null otherwise.</param>
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var participant = SessionRepository.FindParticipantByConnectionId(Context.ConnectionId);
            if (participant != null)
            {
                await RemoveParticipant(participant);
            }
        }

        /// <summary>
        /// Method for handling message that a new session has been initialized.
        /// </summary>
        public async Task CreateSession()
        {
            var session = SessionRepository.CreateSession(Context.ConnectionId);
            await Clients.Caller.SendAsync("sessionCreated", session);
        }

        /// <summary>
        /// Method for handling message that a new participant is trying to join a sizing session.
        /// </summary>
        /// <param name="sessionKey">The key of the session the participant wants to join.</param>
        /// <param name="name">The name of the participant that wants to join.</param>
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

        /// <summary>
        /// Method for handling message that a session has ended.
        /// </summary>
        /// <param name="sessionKey">The key of the session that is ending.</param>
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

        /// <summary>
        /// Method for handling message that a participant has been updated.
        /// </summary>
        /// <param name="updatedParticipant">The updated participant values.</param>
        public async Task UpdateParticipant(Participant updatedParticipant)
        {
            SessionRepository.UpdateParticipant(updatedParticipant);
            var parentSession = SessionRepository.GetSession(updatedParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantUpdated", updatedParticipant);
        }

        /// <summary>
        /// Method for handling message that a participant has left the session.
        /// </summary>
        /// <param name="removeParticipant">The participant to remove.</param>
        public async Task RemoveParticipant(Participant removeParticipant)
        {
            SessionRepository.RemoveParticipant(removeParticipant);
            var parentSession = SessionRepository.GetSession(removeParticipant.SessionKey);
            await Groups.RemoveFromGroupAsync(removeParticipant.ConnectionId, removeParticipant.SessionKey);
            await Clients.Client(parentSession.ConnectionId).SendAsync("participantLeft", removeParticipant);
        }

        /// <summary>
        /// Method for handling message that a session should clear its sizes.
        /// </summary>
        /// <param name="sessionKey">The key to the session that should clear its participants' sizes.</param>
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