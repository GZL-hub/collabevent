# CollabEvent - Team Collaboration Platform

A modern, real-time team collaboration platform built with React, TypeScript, Node.js, and MongoDB. CollabEvent enables teams to manage activities, events, comments, and mentions in one centralized hub.

## 🚀 Features

### 📱 **Activity Management**
- **Real-time Activity Feed** - View all team activities in chronological order
- **Activity Types** - Support for comments, events, and mentions
- **Interactive Actions** - Like, pin, and reply to activities
- **Smart Filtering** - Filter by activity type (all, comments, events, mentions)
- **Search Functionality** - Find activities quickly with built-in search

### 💬 **Communication**
- **Threaded Replies** - Reply to activities with nested conversations
- **Mentions System** - Tag team members with @mentions
- **Real-time Updates** - See activities and replies as they happen
- **User Authentication** - Secure login and user management

### 🎯 **User Experience**
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Optimistic UI Updates** - Instant feedback for user interactions
- **Error Handling** - Graceful error recovery and user feedback
- **TypeScript Support** - Full type safety throughout the application

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling

### **Development Tools**
- **ESLint** - Code linting for consistent code quality
- **Git** - Version control system
- **REST API** - RESTful API design for client-server communication

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/collabevent.git
   cd collabevent
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/collabevent
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start MongoDB**
   ```bash
   # Windows (if MongoDB is installed as service)
   net start MongoDB

   # MongoCompass
   request for clusterlink
   
   # macOS/Linux
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5001`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

### Activities
- `GET /api/activities` - Get all activities with pagination and filtering
- `POST /api/activities` - Create a new activity
- `GET /api/activities/:id` - Get a specific activity
- `POST /api/activities/:id/like` - Like/unlike an activity
- `POST /api/activities/:id/pin` - Pin/unpin an activity
- `POST /api/activities/:id/reply` - Add a reply to an activity
- `DELETE /api/activities/:id/reply/:replyId` - Delete a reply
- `GET /api/activities/stats` - Get activity statistics

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

## 🎮 Usage

### Creating Activities
1. Navigate to the team activity page
2. Select the activity type (comment, event, mention)
3. Write your message
4. Add mentions using @username
5. Submit to create the activity

### Interacting with Activities
- **Like**: Click the heart icon to like/unlike activities
- **Pin**: Click the pin icon to pin important activities
- **Reply**: Click "Reply" to add threaded responses
- **Delete**: Delete your own replies using the delete button

### Filtering and Search
- Use the filter tabs to view specific activity types
- Use the search bar to find activities by content
- Pinned activities appear at the top of the feed

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Build backend (if applicable)
cd backend
npm run build
```

### Code Quality
```bash
# Lint frontend code
cd frontend
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation for API changes
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/collabevent/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/collabevent) community

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the flexible database
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- Open source community for inspiration and tools

---

**Made with ❤️ for better team collaboration**