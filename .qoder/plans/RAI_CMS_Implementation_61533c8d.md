# RAI Department Website - Dynamic CMS Implementation Plan

## Phase 1: Project Setup & Infrastructure (Steps 1-4)

### Step 1.1: Install Dependencies
Install required packages:
```bash
npm install mongoose cloudinary next-auth bcryptjs
npm install -D @types/bcryptjs
```

### Step 1.2: Environment Configuration
Create/update `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rai-db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000
```

### Step 1.3: Database Connection Layer
Create `lib/db.js`:
```javascript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

### Step 1.4: Cloudinary Configuration
Create `lib/cloudinary.js`:
```javascript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(file, folder = "rai") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return result;
}
```

---

## Phase 2: Database Models (Steps 5-16)

### Step 2.1: Create All Mongoose Models
Create models in `models/` directory:

**models/About.js**
```javascript
import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  collegeOverview: { type: String, required: true },
  departmentOverview: { type: String, required: true },
  vision: String,
  mission: String,
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", AboutSchema);
```

**models/Academics.js**
```javascript
import mongoose from "mongoose";

const AcademicsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["scheme_syllabus", "academic_calendar", "poco_mapping", "lab_schedule"],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedDate: { type: Date, default: Date.now },
});

export default mongoose.models.Academics || mongoose.model("Academics", AcademicsSchema);
```

**models/Faculty.js**
```javascript
import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: String,
  experience: String,
  expertise: [String],
  photo: String,
  email: String,
}, { timestamps: true });

export default mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);
```

**models/Research.js**
```javascript
import mongoose from "mongoose";

const ResearchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  guide: String,
  teamMembers: [String],
  fundedAmount: Number,
  year: Number,
  thumbnail: String,
  paperUrl: String,
  description: String,
}, { timestamps: true });

export default mongoose.models.Research || mongoose.model("Research", ResearchSchema);
```

**models/Publication.js**
```javascript
import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [String],
  journal: String,
  year: Number,
  paperUrl: String,
}, { timestamps: true });

export default mongoose.models.Publication || mongoose.model("Publication", PublicationSchema);
```

**models/Lab.js**
```javascript
import mongoose from "mongoose";

const LabSchema = new mongoose.Schema({
  labName: { type: String, required: true },
  description: String,
  equipment: [String],
  images: [String],
});

export default mongoose.models.Lab || mongoose.model("Lab", LabSchema);
```

**models/Project.js**
```javascript
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  guide: String,
  teamMembers: [String],
  domain: String,
  description: String,
  image: String,
  paperUrl: String,
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
```

**models/Achievement.js**
```javascript
import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  studentName: String,
  achievementTitle: String,
  eventName: String,
  date: Date,
  image: String,
});

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
```

**models/Placement.js**
```javascript
import mongoose from "mongoose";

const PlacementSchema = new mongoose.Schema({
  studentName: String,
  company: String,
  role: String,
  package: String,
  year: Number,
});

export default mongoose.models.Placement || mongoose.model("Placement", PlacementSchema);
```

**models/Alumni.js**
```javascript
import mongoose from "mongoose";

const AlumniSchema = new mongoose.Schema({
  name: String,
  organization: String,
  role: String,
  year: Number,
});

export default mongoose.models.Alumni || mongoose.model("Alumni", AlumniSchema);
```

**models/Gallery.js**
```javascript
import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: ["events", "competitions", "cultural", "projects", "industrial_visit", "students", "workshop", "labs", "college"],
    required: true,
  },
  thumbnail: String,
  images: [String],
  videos: [String],
  eventDate: Date,
  duration: String,
  status: {
    type: String,
    enum: ["ongoing", "completed"],
  },
  description: String,
  results: String,
});

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
```

**models/Notice.js**
```javascript
import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  documentUrl: String,
});

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);
```

**models/User.js** (for admin auth)
```javascript
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
```

---

## Phase 3: API Routes (Steps 17-25)

### Step 3.1: Create Base CRUD API Route Pattern
Create template: `app/api/faculty/route.ts`

```typescript
import { connectDB } from "@/lib/db";
import Faculty from "@/models/Faculty";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const faculty = await Faculty.create(body);
    return NextResponse.json(faculty, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create faculty" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const faculty = await Faculty.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(faculty);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update faculty" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await Faculty.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}
```

### Step 3.2: Create API Routes for All Collections
Repeat pattern for:
- `/api/research`
- `/api/publications`
- `/api/labs`
- `/api/projects`
- `/api/achievements`
- `/api/placements`
- `/api/alumni`
- `/api/gallery`
- `/api/notices`
- `/api/academics`
- `/api/about`

### Step 3.3: Image Upload API
Create `app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") || "rai";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await uploadToCloudinary(file, folder as string);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

---

## Phase 4: Authentication System (Steps 26-29)

### Step 4.1: NextAuth Configuration
Create `lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
```

### Step 4.2: Auth API Route
Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

### Step 4.3: Auth Middleware
Create middleware to protect admin routes:

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
```

### Step 4.4: Login Page
Create `app/admin/login/page.tsx` with login form.

---

## Phase 5: Admin Dashboard - Core Sections (Steps 30-35)

### Step 5.1: Admin Dashboard Layout
Create `app/admin/layout.tsx`:
- Admin navbar
- Sidebar navigation
- Protected route wrapper

### Step 5.2: Main Dashboard
Create `app/admin/dashboard/page.tsx`:
- Overview stats
- Quick actions
- Recent activity

### Step 5.3: Faculty Management
Create `app/admin/faculty/page.tsx`:
- List all faculty
- Add/Edit/Delete buttons
- Modal/form for adding/editing
- Image upload integration

### Step 5.4: Research Management
Create `app/admin/research/page.tsx`:
- Similar structure to faculty
- Multiple image upload support

### Step 5.5: Gallery Management
Create `app/admin/gallery/page.tsx`:
- Category filter
- Bulk upload capability
- Video URL support

### Step 5.6: Notices Management
Create `app/admin/notices/page.tsx`:
- Simple CRUD interface
- Document upload support

---

## Phase 6: Frontend Integration (Steps 36-42)

### Step 6.1: Update Faculty Page
Modify `app/faculty/page.tsx`:

```typescript
export const dynamic = "force-dynamic";

async function getFaculty() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/faculty`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function FacultyPage() {
  const faculty = await getFaculty();

  return (
    <div>
      {/* Render faculty dynamically */}
    </div>
  );
}
```

### Step 6.2: Update All Public Pages
Convert to dynamic fetching:
- `/research`
- `/labs`
- `/projects`
- `/gallery`
- `/notices`
- `/placements`
- `/alumni`
- `/achievements`

### Step 6.3: Create Dynamic Detail Pages
Create `[id]` routes:
- `app/faculty/[id]/page.tsx`
- `app/projects/[id]/page.tsx`
- `app/gallery/[id]/page.tsx`

---

## Phase 7: Testing & Deployment (Steps 43-46)

### Step 7.1: Local Testing
- Test all API endpoints
- Verify image uploads
- Test authentication flow
- Check admin CRUD operations

### Step 7.2: Seed Initial Data
Create seed script to populate database with initial data.

### Step 7.3: Deploy to Vercel
- Update environment variables in Vercel
- Deploy
- Verify production URLs

### Step 7.4: Post-Deployment Verification
- Test all functionality in production
- Verify Cloudinary uploads
- Check MongoDB connection

---

## Key Implementation Notes

### Image Upload Flow:
1. Admin selects image in dashboard
2. Image uploaded to `/api/upload`
3. Cloudinary returns URL
4. URL saved to MongoDB with other data

### Security Considerations:
- All admin routes protected by NextAuth
- Password hashing with bcrypt
- Input validation on all APIs
- CORS configuration if needed

### Performance Optimizations:
- Use `force-dynamic` for real-time data
- Implement proper caching strategies
- Optimize image delivery from Cloudinary

---

## Files to Create/Modify Summary

**New Files:**
- `lib/db.ts`
- `lib/cloudinary.ts`
- `lib/auth.ts`
- `middleware.ts`
- 12 model files in `models/`
- 12+ API routes in `app/api/`
- 6+ admin pages
- Login page

**Modified Files:**
- All public-facing pages to use dynamic data
- `.env.local` for new variables

---

This plan provides a complete roadmap for transforming your static website into a fully functional CMS. Each step builds on the previous one, allowing for systematic implementation and testing.