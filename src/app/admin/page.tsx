import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import AdminDashboard from '@/components/AdminDashboard'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  // Fetch all applicants
  const applicants = await prisma.applicant.findMany({
    include: {
      educations: true,
      achievements: true,
      references: true,
      notes: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // To avoid hydration issues with dates, serialize to JSON
  const serializedApplicants = JSON.parse(JSON.stringify(applicants))

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-green text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">BWTA Admin Dashboard</h1>
        <div className="flex items-center gap-4 text-sm">
          <span>{session.user?.email}</span>
          {/* We can use NextAuth SignOut in a client component, or just a link */}
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <AdminDashboard initialApplicants={serializedApplicants} />
      </main>
    </div>
  )
}
