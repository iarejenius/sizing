using System.Collections.Generic;
using sizing.Models;
namespace sizing.DataAccess
{
    public class MemorySessionRepository : ISessionRepository
    {
        private Dictionary<string, sizing.Models.Session> Sessions { get; set; }

        public MemorySessionRepository()
        {
            Sessions = new Dictionary<string, sizing.Models.Session>();
        }

        public sizing.Models.Participant CreateParticipant(string sessionKey, string name)
        {
            var session = GetSession(sessionKey);
            var participant = new sizing.Models.Participant(name);
            participant.SessionKey = sessionKey;
            session.Participants.Add(participant);
            return participant;
        }

        public sizing.Models.Session CreateSession(string connectionId)
        {
            var session = new sizing.Models.Session(connectionId);
            Sessions.Add(session.Key, session);
            return session;
        }

        public sizing.Models.Session GetSession(string key)
        {
            return Sessions[key];
        }

        public void RemoveSession(string key)
        {
            Sessions.Remove(key);
        }

        public void UpdateParticipant(Participant updatedParticipant)
        {
            var session = this.GetSession(updatedParticipant.SessionKey);
            var participant = session.Participants.Find(p => p.Id == updatedParticipant.Id);
            participant.Size = updatedParticipant.Size;
        }

        public void RemoveParticipant(Participant removedParticipant)
        {
            var session = this.GetSession(removedParticipant.SessionKey);
            session.Participants.RemoveAll(p => p.Id == removedParticipant.Id);
        }

        public Participant FindParticipantByConnectionId(string connectionId)
        {
            foreach (var session in Sessions.Values)
            {
                foreach (var participant in session.Participants)
                {
                    if (participant.ConnectionId == connectionId)
                    {
                        return participant;
                    }
                }
            }
            return null;
        }

    }
}