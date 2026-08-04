import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Ozeonix Phase 1 Seeding...');

  // 1. Create Base Subscription Plans
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { code: 'PLAN_STARTER' },
    update: {},
    create: {
      name: 'Starter Plan',
      code: 'PLAN_STARTER',
      description: 'Ideal for small teams and startups starting with AI workflows.',
      price: 49.00,
      currency: 'USD',
      interval: 'MONTHLY',
      features: { max_users: 5, ai_agents: 2, storage_gb: 10 },
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { code: 'PLAN_ENTERPRISE' },
    update: {},
    create: {
      name: 'Enterprise Plan',
      code: 'PLAN_ENTERPRISE',
      description: 'Full capacity for large enterprises with unlimited scale and custom AI roles.',
      price: 499.00,
      currency: 'USD',
      interval: 'MONTHLY',
      features: { max_users: 100, ai_agents: 20, storage_gb: 500, priority_support: true },
      isActive: true,
    },
  });

  // 2. Create Base Roles
  const adminRole = await prisma.role.upsert({
    where: { code: 'ROLE_SUPER_ADMIN' },
    update: {},
    create: {
      name: 'Super Admin',
      code: 'ROLE_SUPER_ADMIN',
      description: 'Full administrative access across all tenant features.',
      isSystem: true,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { code: 'ROLE_MEMBER' },
    update: {},
    create: {
      name: 'Team Member',
      code: 'ROLE_MEMBER',
      description: 'Standard member role with standard permissions.',
      isSystem: true,
    },
  });

  // 3. Create Core Permissions
  const permissions = [
    { name: 'Read Users', code: 'PERM_USER_READ', module: 'USERS' },
    { name: 'Write Users', code: 'PERM_USER_WRITE', module: 'USERS' },
    { name: 'Manage Roles', code: 'PERM_ROLE_MANAGE', module: 'AUTH' },
    { name: 'View Company Settings', code: 'PERM_COMPANY_READ', module: 'PLATFORM' },
    { name: 'Manage Company Settings', code: 'PERM_COMPANY_WRITE', module: 'PLATFORM' },
  ];

  for (const perm of permissions) {
    const createdPerm = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });

    // Assign to Admin Role
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: createdPerm.id,
      },
    });
  }

  // 4. Create Default Demo Company & Admin User
  const demoCompany = await prisma.company.upsert({
    where: { slug: 'ozeonix-demo' },
    update: {},
    create: {
      name: 'Ozeonix Enterprise Corp',
      slug: 'ozeonix-demo',
      email: 'admin@ozeonix.demo',
      status: 'ACTIVE',
    },
  });

  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ozeonix.demo' },
    update: {},
    create: {
      companyId: demoCompany.id,
      tenantId: demoCompany.id,
      email: 'admin@ozeonix.demo',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // Assign Admin Role to User
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
      tenantId: demoCompany.id,
    },
  });

  // Link Subscription
  await prisma.companySubscription.create({
    data: {
      companyId: demoCompany.id,
      tenantId: demoCompany.id,
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('   Demo Company ID (Tenant ID):', demoCompany.id);
  console.log('   Demo Admin User: admin@ozeonix.demo / AdminPassword123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
