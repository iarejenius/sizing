namespace test
{
    using Xunit;
    using Moq;
    using Microsoft.AspNetCore.SignalR;
    using sizing.Hubs;
    using sizing.DataAccess;
    using sizing.Models;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    public class UnitTest1
    {
        [Fact]
        public async Task Test1()
        {
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.Caller).Returns(mockClientProxy.Object);
            Mock<HubCallerContext> mockContext = new Mock<HubCallerContext>();

            var testSession = new Session {
                ConnectionId = "test connection id",
                Key = "test key",
                Participants = new List<Participant>()
            };

            var repo = new Mock<ISessionRepository>();
            repo.Setup(x => x.CreateSession(It.IsAny<string>()))
                .Returns(testSession);

            var sut = new SessionHub(repo.Object) {
                Clients = mockClients.Object,
                Context = mockContext.Object
            };

            await sut.CreateSession();
        }
    }
}
