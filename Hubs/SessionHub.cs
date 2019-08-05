using Microsoft.AspNetCore.SignalR;
using System;
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
            var session = SessionRepository.CreateSession();
            await Clients.Caller.SendAsync("sessionCreated", session);
        }

    }
}