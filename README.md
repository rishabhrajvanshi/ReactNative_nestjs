# AstroRoute - Astrology Application Backend

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

## 📖 Overview

**AstroRoute** is a modern astrology application backend built with NestJS, providing phone-based authentication, AI-powered astrological consultations, daily horoscopes, and personalized remedies.

### Key Features

- 🔐 **Phone-based Authentication**: OTP verification using Twilio
- 🤖 **AI Chat**: Real-time astrological consultations using Google's Agent Development Kit (ADK) via WebSockets
- 🌟 **Daily Horoscope**: Personalized daily horoscopes based on zodiac signs
- 💎 **Remedies**: Astrological remedies and recommendations
- 👤 **User Profiles**: Birth details, zodiac calculations, and profile management

---

## 🏗️ Architecture

### Planned Module Structure

```
src/
├── auth/          # Authentication (Phone OTP, JWT)
├── users/         # User management and profiles
├── ai-chat/       # AI chat with Google ADK + WebSockets
├── horoscope/     # Daily horoscope generation
├── remedies/      # Astrological remedies
├── common/        # Shared utilities, guards, decorators
└── database/      # MongoDB configuration and schemas
```

### Current Status

✅ **Implemented:**
- Phone OTP authentication via Twilio
- JWT token-based authorization
- User schema with birth details
- MongoDB integration

🚧 **In Progress:**
- Architecture restructuring (see Code Review Report)
- Security enhancements (rate limiting, validation)

❌ **Planned:**
- AI Chat module (Google ADK + WebSockets)
- Horoscope generation module
- Remedies recommendation module
- Common utilities and database layer

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ 
- **MongoDB**: v5.0+
- **npm** or **yarn**
- **Twilio Account**: For OTP verification

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ReactNative_nestjs

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/astroroute

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=1h

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid

# Google ADK (Coming Soon)
# GOOGLE_ADK_API_KEY=your-google-adk-api-key
# GOOGLE_ADK_PROJECT_ID=your-project-id
```

**⚠️ Security Note**: 
- Never commit `.env` to version control
- Use strong, randomly generated JWT secrets
- Rotate secrets regularly in production

---

## 🏃 Running the Application

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on `http://localhost:3000`

---

## 📡 API Endpoints

### Authentication

#### Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "phoneNumber": "+919876543210"
}
```

**Response:**
```json
{
  "phoneNumber": "+919876543210",
  "response": "OTP sent successfully to +919876543210"
}
```

#### Verify OTP
```http
POST /verify
Content-Type: application/json

{
  "phoneNumber": "+919876543210",
  "code": "123456"
}
```

**Response:**
```json
{
  "phoneNumber": "+919876543210",
  "response": "OTP verification status: verified",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h"
}
```

### User Management

#### Get User Profile
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Update User Profile
```http
PATCH /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "date_of_birth": "1990-05-15",
  "time_of_birth": "14:30",
  "place_of_birth": "New Delhi, India",
  "gender": "Male"
}
```

### Coming Soon
- `POST /ai-chat/connect` - WebSocket connection for AI chat
- `GET /horoscope/daily` - Get daily horoscope
- `GET /horoscope/daily/:zodiacSign` - Get horoscope by sign
- `GET /remedies` - Get personalized remedies
- `POST /remedies/:id/track` - Track remedy progress

---

## 🗄️ Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  name: string,                    // User's name
  username: string,                // Unique username
  phoneNumber: string,             // Phone (with country code)
  email: string,                   // Email (optional)
  date_of_birth: Date,            // Birth date
  time_of_birth: string,          // Birth time (HH:MM format)
  place_of_birth: string,         // Birth place
  gender: enum,                    // 'Male' | 'Female' | 'Other'
  createdAt: Date,                // Auto-generated
  updatedAt: Date                 // Auto-generated
}
```

### Planned Schemas

- **Horoscope**: Daily horoscopes with caching
- **Remedy**: Personalized astrological remedies
- **AIChatMessage**: Chat history for AI conversations

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

---

## 🛠️ Development

### Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

---

## 📊 Code Review

A comprehensive code review has been conducted. See [Code Review Report](./Code-Review-Report-Current-State.md) for:
- Architecture analysis
- Security assessment
- Performance recommendations
- Technical debt tracking
- Deployment checklist

**Current Status**: 🟡 **YELLOW** - Foundation exists, security fixes required before production

---

## 🔒 Security

### Implemented
- JWT-based authentication
- Twilio OTP verification
- Environment variable isolation

### Required (Before Production)
- [ ] Rate limiting on OTP endpoints
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] Helmet security headers
- [ ] Request logging and monitoring
- [ ] API versioning
- [ ] Secrets management

---

## 📈 Roadmap

### Phase 1: Foundation (Current)
- [x] Phone OTP authentication
- [x] JWT token management
- [x] User profile management
- [ ] Security hardening
- [ ] Architecture restructuring

### Phase 2: Core Features
- [ ] WebSocket integration
- [ ] Google ADK AI chat
- [ ] Daily horoscope generation
- [ ] Remedies recommendation engine
- [ ] Redis caching layer

### Phase 3: Enhancement
- [ ] Admin dashboard
- [ ] Analytics and insights
- [ ] Push notifications
- [ ] Premium features
- [ ] Multi-language support (i18n)

### Phase 4: Scale
- [ ] Horizontal scaling
- [ ] Microservices (if needed)
- [ ] CDN integration
- [ ] Performance optimization
- [ ] Load testing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

---

## 📝 Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **Twilio** | SMS OTP verification |
| **JWT** | Authentication tokens |
| **Passport** | Authentication middleware |
| **class-validator** | DTO validation |
| **TypeScript** | Type safety |

### Planned Integrations
- **Google ADK**: AI-powered chat
- **WebSockets**: Real-time communication
- **Redis**: Caching and session management
- **Bull**: Background job processing

---

## 📚 Resources

### NestJS Documentation
- [Official Documentation](https://docs.nestjs.com)
- [Authentication Guide](https://docs.nestjs.com/security/authentication)
- [WebSockets Guide](https://docs.nestjs.com/websockets/gateways)

### MongoDB Resources
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)

### Twilio Integration
- [Twilio Verify API](https://www.twilio.com/docs/verify/api)
- [Phone Number Formatting](https://www.twilio.com/docs/glossary/what-e164)

---

## 🐛 Known Issues

See [Code Review Report](./Code-Review-Report-Current-State.md) for detailed issues.

**Critical:**
- ⚠️ No rate limiting on OTP endpoints
- ⚠️ Authorization check disabled in user update
- ⚠️ Circular dependencies between modules

**Medium:**
- PhoneNumber type mismatch (number vs string)
- Empty CreateUserDto
- Excessive console logging

---

## 📄 License

This project is **UNLICENSED** and private.

---

## 👨‍💻 Author

**Rishabh Rajvanshi**

---

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework
- OTP verification powered by [Twilio](https://www.twilio.com/)
- Database by [MongoDB](https://www.mongodb.com/)

---

## 📞 Support

For issues and feature requests, please create an issue in the repository.

---

## 🔄 Recent Updates

### November 23, 2025
- Initial project setup
- Phone OTP authentication implemented
- JWT token integration
- User schema with birth details
- Comprehensive code review completed

---

**Note**: This project is under active development. See the [Code Review Report](./Code-Review-Report-Current-State.md) for current status and recommendations.
