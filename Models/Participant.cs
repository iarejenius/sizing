using System;

namespace Models
{
    class Participant
    {
        public Participant(string name)
        {
            Name = name;
            Id = Guid.NewGuid();
        }
        public string Name { get; set; }
        public string SessionKey { get; set; }
        public string Size { get; set; }
        public Guid Id { get; set; }

        public string ConnectionId { get; set; }
    }
}