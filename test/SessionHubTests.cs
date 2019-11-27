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
    using System.Threading;
    using System;

    public class SessionHubTests
    {
        [Fact]
        public async Task CreateSession_Success()
        {
            // Given
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.Caller).Returns(mockClientProxy.Object);
            Mock<HubCallerContext> mockContext = new Mock<HubCallerContext>();

            var testSession = new Session
            {
                ConnectionId = "test connection id",
                Key = "test key",
                Participants = new List<Participant>()
            };

            var mockRepo = new Mock<ISessionRepository>();
            mockRepo.Setup(x => x.CreateSession(It.IsAny<string>()))
                .Returns(testSession);

            var sut = new SessionHub(mockRepo.Object)
            {
                Clients = mockClients.Object,
                Context = mockContext.Object
            };

            // When
            await sut.CreateSession();

            // Then
            mockRepo.Verify(x => x.CreateSession(It.IsAny<string>()), Times.AtLeastOnce());
        }

        [Fact]
        public async Task CreateParticipant_Success()
        {
            //Given
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.Caller).Returns(mockClientProxy.Object);
            mockClients.Setup(clients => clients.Client(It.IsAny<string>())).Returns(mockClientProxy.Object);
            Mock<HubCallerContext> mockContext = new Mock<HubCallerContext>();
            Mock<IGroupManager> mockGroup = new Mock<IGroupManager>();

            var mockRepo = new Mock<ISessionRepository>();
            var testSession = new Session
            {
                ConnectionId = "test connection id",
                Key = "test key",
                Participants = new List<Participant>()
            };
            mockRepo
                .Setup(x => x.GetSession(It.Is<string>(s => s == testSession.Key)))
                .Returns(testSession)
                .Verifiable();

            var testName = "test participant";
            var testParticipant = new Participant {
                ConnectionId = "test participant connection id",
                Id = Guid.NewGuid(),
                Name = testName,
                SessionKey = testSession.Key
            };
            mockRepo
                .Setup(x => x.CreateParticipant(
                    It.Is<string>(key => key == testSession.Key),
                    It.Is<string>(name => name == testName)
                    ))
                .Returns(testParticipant)
                .Verifiable();

            var sut = new SessionHub(mockRepo.Object)
            {
                Clients = mockClients.Object,
                Context = mockContext.Object,
                Groups = mockGroup.Object
            };

            //When
            await sut.CreateParticipant(testSession.Key, testName);

            //Then
            mockRepo.Verify();
        }

        [Fact]
        public async Task EndSession_Success()
        {
            //Given
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.Group(It.IsAny<string>())).Returns(mockClientProxy.Object);
            Mock<HubCallerContext> mockContext = new Mock<HubCallerContext>();
     
            var mockRepo = new Mock<ISessionRepository>();
            var testSession = new Session
            {
                ConnectionId = "test connection id",
                Key = "test key",
                Participants = new List<Participant>()
            };
            mockRepo
                .Setup(x => x.GetSession(It.Is<string>(s => s == testSession.Key)))
                .Returns(testSession)
                .Verifiable();

            mockRepo
                .Setup(x => x.RemoveSession(It.Is<string>(s => s == testSession.Key)))
                .Verifiable();

            var sut = new SessionHub(mockRepo.Object)
            {
                Clients = mockClients.Object,
                Context = mockContext.Object
            };

            // When
            await sut.EndSession(testSession.Key);

            // Test
            mockRepo.Verify();
        }

        
        [Fact]
        public async Task EndSession_NullSuccess()
        {
            //Given
            Mock<IHubCallerClients> mockClients = new Mock<IHubCallerClients>();
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(clients => clients.Group(It.IsAny<string>())).Returns(mockClientProxy.Object);
            Mock<HubCallerContext> mockContext = new Mock<HubCallerContext>();
     
            var mockRepo = new Mock<ISessionRepository>();
            var testSessionKey = "test session key";

            mockRepo
                .Setup(x => x.GetSession(It.Is<string>(s => s == testSessionKey)))
                .Returns<Session>(null)
                .Verifiable();

            var sut = new SessionHub(mockRepo.Object)
            {
                Clients = mockClients.Object,
                Context = mockContext.Object
            };

            // When
            await sut.EndSession(testSessionKey);

            // Test
            mockRepo.Verify();
            mockRepo.Verify(repo => repo.RemoveSession(It.Is<string>(s => s == testSessionKey)), Times.Never());

        }
    }
}
