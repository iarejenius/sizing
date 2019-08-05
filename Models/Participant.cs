namespace Models
{
    class Participant
    {
        public Participant(string name)
        {
            Name = name;
        }
        public string Name { get; set; }
        public string SessionKey { get; set; }
        public Size Size { get; set; }
    }
}