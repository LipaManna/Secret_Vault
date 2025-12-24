# Secret Vault 🔐

A secure, client-side password manager built with React that encrypts and stores your secrets locally using the Web Crypto API. All encryption and decryption happens in your browser - your master password never leaves your device.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple)

## ✨ Features

- 🔐 **Secure Encryption**: AES-GCM encryption with PBKDF2 key derivation (100,000 iterations)
- 🔑 **Master Password Protection**: Single master password encrypts all your secrets
- 👁️ **Password Visibility Toggle**: Show/hide passwords with eye icon
- 🔄 **Auto-Lock**: Automatically locks on page refresh for enhanced security
- ✏️ **Full CRUD Operations**: Create, Read, Update, and Delete secrets
- 🎲 **Password Generator**: Generate strong, compliant passwords with one click
- 📋 **Copy to Clipboard**: Quick copy functionality for credentials
- ✅ **Password Validation**: Enforces strong password requirements
- 🎨 **Modern UI**: Clean, responsive design with Bootstrap

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LipaManna/Secret_Vault.git
   cd Secret_Vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage Guide

### Getting Started

1. **Login**
   - Enter your master password (must meet strength requirements)
   - Password must be at least 8 characters with uppercase, lowercase, number, and special character

2. **Add a Secret**
   - Click "Add Secret" button
   - Fill in the form (Name, User Name, Password, Notes)
   - Use "Generate Password" to create a strong password
   - Click "Save Changes"

3. **View Secrets**
   - All secrets are displayed in a table
   - Click "View" to see details in a drawer
   - Use "Show/Hide" to toggle password visibility
   - Copy credentials to clipboard with "Copy" buttons

4. **Edit Secrets**
   - Click "View" on any secret
   - Click "Edit" button in the drawer
   - Modify the fields and click "Update Secret"

5. **Delete Secrets**
   - Click "Delete" button in the table or drawer
   - Confirm deletion

6. **Auto-Lock**
   - Application automatically locks on page refresh
   - Re-enter master password to continue

## 🏗️ Architecture

### Client-Side Encryption

The application uses **zero-knowledge architecture** where:
- All encryption/decryption happens in the browser
- Master password never leaves your device
- No server communication required
- Works completely offline

### Encryption Details

- **Algorithm**: AES-GCM (256-bit)
- **Key Derivation**: PBKDF2 with SHA-256
- **Iterations**: 100,000
- **Salt & IV**: Randomly generated for each encryption

### Storage Strategy

- **localStorage**: Stores encrypted secrets and encrypted master password hash
- **sessionStorage**: Stores plain master password (session-only, auto-clears on refresh)

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddSecret.jsx   # Add new secret modal
│   ├── DataTable.jsx    # Display and manage secrets
│   ├── EditSecret.jsx   # Edit secret modal
│   └── Layout.jsx       # Main layout wrapper
├── pages/               # Page-level components
│   ├── Dashboard.jsx   # Main dashboard page
│   └── Login.jsx        # Login page
├── routes/              # Routing configuration
│   ├── AppRoutes.jsx    # Route definitions
│   └── ProtectedRoute.jsx  # Route protection
└── services/            # Business logic
    ├── crypto.service.js              # Encryption/decryption
    ├── passwordGenerator.service.js  # Password generation
    └── validation.service.js         # Password validation
```

## 🔒 Security

### Security Features

✅ **Client-Side Encryption**: All data encrypted before storage  
✅ **Strong Key Derivation**: PBKDF2 with 100,000 iterations  
✅ **Unique Salt/IV**: Each encryption uses random salt and IV  
✅ **Auto-Lock**: Session clears on page refresh  
✅ **Password Validation**: Enforces strong password requirements  
✅ **Zero-Knowledge**: Master password never transmitted  

### Security Considerations

⚠️ **Browser Security**: Vulnerable to XSS attacks if application is compromised  
⚠️ **Browser Extensions**: Extensions could potentially access data  
⚠️ **Physical Access**: Device access compromises security  
⚠️ **No Backup**: Data loss if browser data is cleared  
⚠️ **Keyloggers**: No protection against keyloggers  

### Best Practices

1. Use a strong, unique master password
2. Keep your browser updated
3. Avoid using on shared/public computers
4. Be cautious of browser extensions
5. Regularly backup your data (if export feature is added)

## 🎯 Design Decisions

### 1. Client-Side Only

**Decision**: No backend server, everything runs in the browser.

**Rationale**: 
- Maximum privacy and control
- No server costs or maintenance
- Works offline
- User owns their data completely

### 2. Session-Based Authentication

**Decision**: Master password stored in `sessionStorage` during active session.

**Rationale**:
- Auto-lock on refresh provides security
- Better user experience (no repeated password entry)
- Trade-off between security and usability

### 3. Individual Secret Encryption

**Decision**: Each secret encrypted separately with unique salt/IV.

**Rationale**:
- Prevents pattern analysis
- Allows selective decryption
- Better security isolation

### 4. Password Requirements

**Decision**: Strict password requirements for all passwords.

**Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

**Rationale**: Ensures strong passwords across the application.

## 📋 Assumptions

1. **Modern Browser**: Requires Web Crypto API support (Chrome 37+, Firefox 34+, Safari 11+, Edge 12+)
2. **Trusted Device**: User's device is trusted and secure
3. **localStorage Available**: Browser supports localStorage
4. **No Malicious Extensions**: Browser extensions are trusted
5. **User Responsibility**: User understands security implications
6. **No Cloud Sync**: Data stored locally only
7. **Single User**: Designed for single-user scenarios

## 🛠️ Technologies

- **React 18.3.1**: UI framework
- **React Router 7.11.0**: Client-side routing
- **React Bootstrap 2.10.10**: UI component library
- **Bootstrap 5.3.8**: CSS framework
- **Vite 7.2.4**: Build tool and dev server
- **Web Crypto API**: Cryptographic operations

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🗂️ Project Structure

```
Secret_Vault/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── components/        # Reusable components
│   │   ├── AddSecret.jsx
│   │   ├── DataTable.jsx
│   │   ├── EditSecret.jsx
│   │   └── Layout.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   └── Login.jsx
│   ├── routes/            # Routing
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/         # Business logic
│   │   ├── crypto.service.js
│   │   ├── passwordGenerator.service.js
│   │   └── validation.service.js
│   ├── App.jsx            # Root component
│   ├── App.css            # Global styles
│   ├── index.css          # Base styles
│   └── main.jsx           # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## 🔄 Encryption Flow

1. **Login**
   - User enters master password
   - Password encrypted and stored in `localStorage`
   - Plain password stored in `sessionStorage` for session

2. **Save Secret**
   - Form data collected
   - Data JSON stringified
   - Encrypted with master password (random salt/IV)
   - Stored in `localStorage` as encrypted blob

3. **View Secret**
   - Encrypted data retrieved from `localStorage`
   - Decrypted using master password from `sessionStorage`
   - Displayed to user

4. **Auto-Lock**
   - On page refresh, `sessionStorage` is cleared
   - User redirected to login
   - Must re-enter master password

## 🐛 Known Limitations

- No cloud backup or sync
- No password sharing capabilities
- No password breach checking
- No two-factor authentication
- Data loss if browser data is cleared
- Vulnerable to XSS attacks

## 🚧 Future Enhancements

- [ ] Export/Import functionality
- [ ] Password strength meter
- [ ] Search/filter secrets
- [ ] Categories/Tags for secrets
- [ ] Password expiration reminders
- [ ] Two-factor authentication
- [ ] Dark mode
- [ ] Mobile responsive improvements

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue in the repository.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Bootstrap](https://getbootstrap.com/)
- Powered by [Vite](https://vitejs.dev/)

---

**⚠️ Important**: This is a client-side application. Always use strong passwords and keep your browser updated. The security of your data depends on the security of your device and browser.
```
