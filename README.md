## LinkedIn Resume Builder

A modern, full-stack resume builder application built with Next.js, allowing users to create, edit, and download professional resumes with real-time preview.

## Features

- 🔐 **Authentication** - Secure Google OAuth authentication via NextAuth.js
- ✏️ **Real-time Editing** - Live preview as you type with debounced updates
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Multiple Themes** - Choose from Classic, Modern, Professional, and Minimal themes
- 📄 **PDF Export** - Download your resume as a high-quality PDF
- 💾 **Auto-save** - Your work is automatically saved to the database
- 🔗 **Public Sharing** - Share your resume via a public URL (`/r/username`)
- ✅ **Form Validation** - Required field validation with helpful error messages
- 📅 **Date Picker** - Easy-to-use date inputs for experience and education

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form validation
- **Zod** - Schema validation

### Backend
- **NextAuth.js** - Authentication with Google OAuth
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Database (Supabase/Neon)
- **Server Actions** - Next.js server-side operations

### PDF Generation
- **jsPDF** - PDF document creation
- **html2canvas** - HTML to canvas conversion

## Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted on Supabase/Neon)
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd repo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-32-character-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
```

4. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

5. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign In** - Click "Sign in" in the header and authenticate with Google
2. **Build Resume** - Click "Start Building Your Resume" to access the builder
3. **Fill Information** - Complete your personal info, experience, education, and skills
4. **Real-time Preview** - See your resume update live on the right side
5. **Choose Theme** - Select from different professional themes
6. **Save** - Click "Save Resume" to persist your data
7. **Download PDF** - Click "Download PDF" to export your resume
8. **Share** - Access your public resume at `/r/your-username`

## Project Structure

```
repo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── resumes/       # Resume CRUD operations
│   │   │   └── public/        # Public resume access
│   │   ├── builder/           # Resume builder page
│   │   ├── preview/           # Resume preview page
│   │   └── r/[username]/      # Public resume page
│   ├── components/            # React components
│   │   ├── AuthButtons.tsx    # Authentication UI
│   │   ├── Header.tsx         # App header
│   │   ├── Footer.tsx         # App footer
│   │   ├── ResumeForm.tsx     # Resume input form
│   │   └── ResumePreview.tsx  # Resume preview & PDF
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── auth.config.ts    # Auth configuration
│   │   └── prisma.ts         # Prisma client
│   └── types/                 # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## Database Schema

The application uses the following database schema:

- **User** - Stores user authentication data
- **Resume** - Stores resume metadata and content
- **Experience** - Work experience entries
- **Education** - Educational background
- **Skills** - User skills

See `prisma/schema.prisma` for the complete schema definition.

## Features in Detail

### Form Validation
- Required fields: Name, Email, Phone, Job Title, Company, Start Date, Degree, School, Graduation Date
- Email format validation
- Phone number format validation (international formats supported)
- Real-time error messages

### Skills Management
- Quick-add dropdowns for technical and soft skills
- Custom skill input
- Skill categories: Languages, Frameworks, Tools, Soft Skills

### PDF Export
- High-quality PDF generation
- Multi-page support
- Preserves formatting and styling
- Includes all sections: personal info, summary, experience, education, skills

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the GitHub repository.
