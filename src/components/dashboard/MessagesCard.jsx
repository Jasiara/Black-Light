import './MessagesCard.css';

const MessagesCard = () => {
  const messages = [
    { id: 1, customer: 'John D.', message: 'Do you have availability on Saturday?', time: '2 hours ago', unread: true },
    { id: 2, customer: 'Lisa K.', message: 'What are your hours today?', time: '4 hours ago', unread: true },
    { id: 3, customer: 'Mike R.', message: 'Thanks for the great service!', time: '1 day ago', unread: false },
  ];

  return (
    <div className="messages-card">
      <h3>💬 Customer Messages</h3>
      
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-item ${msg.unread ? 'unread' : ''}`}>
            <div className="message-header">
              <p className="customer-name">{msg.customer}</p>
              <span className="message-time">{msg.time}</span>
            </div>
            <p className="message-text">{msg.message}</p>
            <button className="reply-btn">Reply</button>
          </div>
        ))}
      </div>

      <button className="view-all-messages-btn">View All Messages</button>
    </div>
  );
};

export default MessagesCard;
