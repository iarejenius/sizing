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
            return participant;
        }

        public Models.Session CreateSession()
        {
            var session = new Models.Session();
            Sessions.Add(session.Key, session);
            return session;
        }

        public Models.Session GetSession(string key)
        {
            return Sessions[key];
        }
    }
}