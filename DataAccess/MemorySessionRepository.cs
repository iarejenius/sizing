using System.Collections.Generic;
using Models;
namespace DataAccess
{
    class MemorySessionRepository : ISessionRepository
    {
        private Dictionary<string, Models.Session> Sessions { get; set; }

        public MemorySessionRepository()
        {
            Sessions = new Dictionary<string, Models.Session>();
        }

        public Models.Participant CreateParticipant(string sessionKey, string name)
        {
            var session = GetSession(sessionKey);
            var participant = new Models.Participant(name);
            session.Participants.Add(participant);
            return participant;
        }

        public Models.Session CreateSession(string connectionId)
        {
            var session = new Models.Session(connectionId);
            Sessions.Add(session.Key, session);
            return session;
        }

        public Models.Session GetSession(string key)
        {
            return Sessions[key];
        }

        public void RemoveSession(string key)
        {
            Sessions.Remove(key);
        }
    }
}