import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Phase 2 Database Seeding...');

  // 1. Seed Demo Company
  const company = await prisma.company.upsert({
    where: { slug: 'ozeonix-enterprise' },
    update: {},
    create: {
      name: 'Ozeonix Enterprise Systems',
      slug: 'ozeonix-enterprise',
      email: 'contact@ozeonix.ai',
      phone: '+917483509984',
      status: 'ACTIVE',
    },
  });

  const tenantId = company.id;
  await prisma.company.update({
    where: { id: company.id },
    data: { tenantId },
  });

  // 2. Seed Admin User & Employee
  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ozeonix.ai' },
    update: {},
    create: {
      companyId: company.id,
      tenantId,
      email: 'admin@ozeonix.ai',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+917483509984',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const employee = await prisma.employee.upsert({
    where: { employeeCode: 'EMP-001' },
    update: {},
    create: {
      companyId: company.id,
      tenantId,
      userId: adminUser.id,
      employeeCode: 'EMP-001',
      department: 'Engineering',
      designation: 'Principal Architect',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // 3. Seed Sample Customer (WhatsApp Ready)
  const customer = await prisma.customer.upsert({
    where: { phone: '+917483509984' },
    update: {},
    create: {
      companyId: company.id,
      tenantId,
      name: 'Ozeonix Client',
      email: 'client@example.com',
      phone: '+917483509984',
      status: 'LEAD',
      tags: ['whatsapp', 'vip', 'inbound'],
    },
  });

  // 4. Seed Conversation & Initial Message
  const conversation = await prisma.conversation.create({
    data: {
      companyId: company.id,
      tenantId,
      customerId: customer.id,
      assignedUserId: adminUser.id,
      channel: 'WHATSAPP',
      status: 'OPEN',
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      tenantId,
      senderType: 'CUSTOMER',
      messageType: 'TEXT',
      content: 'Hello, I would like to inquire about Ozeonix AI Employees.',
      status: 'READ',
    },
  });

  // 5. Audit Log Entry
  await prisma.auditLog.create({
    data: {
      companyId: company.id,
      tenantId,
      userId: adminUser.id,
      action: 'SYSTEM_SEED',
      entity: 'Database',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Phase 2 Seeding completed successfully!');
  console.log(`   Tenant ID: ${tenantId}`);
  console.log(`   Admin User: ${adminUser.email}`);
  console.log(`   Employee Code: ${employee.employeeCode}`);
  console.log(`   Customer Phone: ${customer.phone}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
