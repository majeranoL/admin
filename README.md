# 🐾 Animal911 - Animal Rescue Management System

A comprehensive web-based platform designed to streamline animal rescue operations, connecting shelters, volunteers, and the public in one unified system. Animal911 helps save more lives by providing real-time coordination, efficient rescue management, and transparent adoption processes.

## 🌟 About Animal911

Animal911 is a full-featured animal rescue coordination platform that bridges the gap between citizens reporting animals in distress, partnering shelters, and dedicated volunteers. The system provides a centralized hub for managing rescue operations, tracking animals, coordinating volunteers, and facilitating adoptions.

### 🎯 Mission

To provide an efficient, transparent, and accessible platform that enables faster response times for animal rescues and increases successful adoption rates through better coordination and communication.

## ✨ Key Features

### 🏠 Landing Page

- **Hero Section** with call-to-action buttons for reporting emergencies
- **About Section** explaining Animal911's mission and impact
- **How It Works** step-by-step process visualization
- **Features Showcase** highlighting platform capabilities
- **For Shelters** section with registration information
- **For Volunteers** recruitment and onboarding details
- **Get Involved** section with multiple participation options
- **Testimonials** from users and partners
- **Responsive Design** optimized for all devices
- **Dark/Light Theme Toggle** with system-wide persistence

### 🔐 Authentication System

- **Secure Login** with role-based access (Admin/Super Admin)
- **Password Protection** with show/hide toggle
- **Shelter Registration** portal for partnering organizations
- **Session Management** with persistent authentication
- **Role-Based Permissions** for different user types

### 🏥 Shelter Partner Management

- **Online Registration** for animal shelters and rescue organizations
- **Document Upload** (permits, valid IDs) with validation
- **Verification Workflow** with admin approval system
- **Profile Management** with contact and veterinarian information
- **Status Tracking** (pending, approved, rejected)
- **Secure Document Storage** in Firebase Storage

### 📊 Admin Dashboard

- **Centralized Control Panel** for all rescue operations
- **Real-time Statistics** and analytics
- **Quick Actions** for common tasks
- **Navigation Menu** with role-based access
- **Notification System** for important updates
- **Theme Customization** (Light/Dark mode)

### 📝 Rescue Reports Management

- **Report Creation** for animals in distress
- **Status Tracking** (New, In Progress, Resolved)
- **Priority Levels** (Low, Medium, High, Critical)
- **Location Mapping** for rescue coordination
- **Photo Upload** for visual documentation
- **Volunteer Assignment** to rescue cases
- **Timeline Tracking** from report to resolution

### � Volunteer Management

- **Volunteer Registration** and onboarding
- **Availability Tracking** for rescue assignments
- **Skills and Specialization** management
- **Performance Tracking** and recognition
- **Assignment History** and statistics
- **Communication Tools** for coordination

### 🐾 Animal Records Management

- **Comprehensive Profiles** for rescued animals
- **Medical History** tracking
- **Photo Galleries** for adoption listings
- **Status Updates** (Rescued, In Care, Available for Adoption, Adopted)
- **Adoption Application** tracking
- **Health Records** and vaccination tracking

### 📋 Adoption Request Management

- **Application Processing** for potential adopters
- **Screening and Verification** workflow
- **Communication History** with applicants
- **Approval/Rejection** system with notifications
- **Post-Adoption** follow-up tracking

### � Notification System

- **Real-time Alerts** for important events
- **In-app Notifications** with action buttons
- **Email Notifications** (configurable)
- **Priority Tagging** for urgent matters
- **Notification History** and management

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with CSS variables
- **Bootstrap Icons** - Icon library

### Backend & Services

- **Firebase Authentication** - Secure user management
- **Cloud Firestore** - Real-time NoSQL database
- **Firebase Storage** - File and image storage
- **Firebase Hosting** - Web hosting (production)

### Development Tools

- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/majeranoL/admin.git
cd admin
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials (see [Firebase Setup Guide](./FIREBASE_SETUP.md))

4. **Start development server**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:5173
```

### Default Login Credentials

**Admin Account:**

- Username: `admin`
- Password: `admin123`

**Super Admin Account:**

- Username: `superadmin`
- Password: `super123`

## 📱 User Roles & Permissions

### Public Users

- View landing page
- Report animals in distress
- Register as shelter partner
- Browse available animals for adoption

### Shelter Partners (After Verification)

- Manage assigned rescue reports
- Update animal profiles
- Review adoption applications
- Coordinate with volunteers

### Admins

- Manage rescue reports
- Assign volunteers to cases
- Update animal records
- Process adoption applications
- View shelter applications

### Super Admins

- All admin permissions
- Approve/reject shelter registrations
- Manage admin accounts
- System-wide settings
- View analytics and reports

## 🎨 Theme System

Animal911 features a comprehensive theme system with:

- **Light Mode** (default) - Clean, bright interface
- **Dark Mode** - Eye-friendly dark theme
- **System-wide Sync** - Theme persists across all pages
- **Smooth Transitions** - Animated theme switching
- **LocalStorage Persistence** - Remembers user preference

## 🔒 Security Features

- Environment variables for sensitive data
- Firebase Authentication with secure sessions
- Role-based access control
- Document verification for shelter partners
- Secure file uploads with validation
- HTTPS enforcement in production

## 📚 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete Firebase configuration
- [Firebase Checklist](./FIREBASE_CHECKLIST.md) - Step-by-step setup checklist
- [.env.example](./.env.example) - Environment variables template

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- All volunteers and shelter partners who help save animal lives
- The open-source community for amazing tools and libraries
- Everyone who reports and cares about animals in distress

## 📞 Support

For support, questions, or feedback, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for animals in need**
