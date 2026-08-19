/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { syncExchangeRates } from '../src/services/exchangeRateService';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seed...');

  // Seed Exchange Rates using the exchange rate service
  try {
    await syncExchangeRates();
    console.log('Exchange rates seeded successfully.');
  } catch (error: any) {
    console.error('Failed to seed exchange rates:', error.message);
  }

  // Seed Employees
  console.log('Generating 10,000 employees...');
  await prisma.employee.deleteMany({});

  const countries = [
    { name: 'United States', code: 'US', currency: 'USD', weight: 0.40, minSalary: 50000, maxSalary: 300000 },
    { name: 'India', code: 'IN', currency: 'INR', weight: 0.30, minSalary: 500000, maxSalary: 5000000 },
    { name: 'United Kingdom', code: 'UK', currency: 'GBP', weight: 0.20, minSalary: 30000, maxSalary: 180000 },
    { name: 'Germany', code: 'DE', currency: 'EUR', weight: 0.10, minSalary: 35000, maxSalary: 200000 },
  ];

  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product'];

  // Seed Countries config
  console.log('Seeding countries configuration...');
  await prisma.country.deleteMany({});
  for (const c of countries) {
    await prisma.country.create({
      data: {
        code: c.code,
        name: c.name,
        currency: c.currency,
      },
    });
  }

  // Seed Departments config
  console.log('Seeding departments configuration...');
  await prisma.department.deleteMany({});
  for (const d of departments) {
    await prisma.department.create({
      data: {
        name: d,
      },
    });
  }
  
  const rolesMap: Record<string, string[]> = {
    Engineering: ['Software Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager', 'QA Engineer'],
    Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Director of Sales'],
    Marketing: ['Marketing Specialist', 'SEO Expert', 'Marketing Manager', 'Director of Marketing'],
    HR: ['HR Specialist', 'HR Business Partner', 'HR Manager'],
    Finance: ['Accountant', 'Financial Analyst', 'Finance Manager'],
    Operations: ['Operations Coordinator', 'Operations Manager', 'Chief Operating Officer'],
    Product: ['Product Analyst', 'Product Manager', 'Director of Product'],
  };

  const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'];

  // Helper to select country based on weighted distribution
  function getRandomCountry() {
    const r = Math.random();
    let cumulativeWeight = 0;
    for (const country of countries) {
      cumulativeWeight += country.weight;
      if (r <= cumulativeWeight) {
        return country;
      }
    }
    return countries[0];
  }

  // Helper to select employment type based on distribution (80% FT, 10% PT, 10% Contractor)
  function getRandomEmploymentType() {
    const r = Math.random();
    if (r < 0.80) return 'FULL_TIME';
    if (r < 0.90) return 'PART_TIME';
    return 'CONTRACTOR';
  }

  // Helper to select status (90% Active, 10% Inactive)
  function getRandomStatus() {
    return Math.random() < 0.90 ? 'ACTIVE' : 'INACTIVE';
  }

  const batchSize = 1000;
  const totalEmployees = 10000;
  let employeesCreated = 0;

  // Track unique emails
  const generatedEmails = new Set<string>();

  for (let b = 0; b < totalEmployees / batchSize; b++) {
    const employeesBatch = [];
    
    for (let i = 0; i < batchSize; i++) {
      const idx = b * batchSize + i + 1;
      const employeeId = `EMP-${String(idx).padStart(5, '0')}`;
      
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      
      // Ensure unique email
      let email = faker.internet.email({ firstName, lastName }).toLowerCase();
      let emailAttempt = 0;
      while (generatedEmails.has(email)) {
        emailAttempt++;
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${idx}${emailAttempt}@example.com`;
      }
      generatedEmails.add(email);

      const countryInfo = getRandomCountry();
      const department = faker.helpers.arrayElement(departments);
      const role = faker.helpers.arrayElement(rolesMap[department]);
      
      // Calculate random salary within country bands
      const rawSalary = faker.number.int({ min: countryInfo.minSalary, max: countryInfo.maxSalary });
      // Round to nearest hundred for realism
      const salary = Math.round(rawSalary / 100) * 100;

      const employmentType = getRandomEmploymentType();
      const status = getRandomStatus();
      const hireDate = faker.date.past({ years: 8 });

      employeesBatch.push({
        employeeId,
        name: fullName,
        email,
        country: countryInfo.code,
        department,
        role,
        salary: parseFloat(salary.toFixed(2)),
        currency: countryInfo.currency,
        employmentType,
        status,
        hireDate,
      });
    }

    await prisma.employee.createMany({
      data: employeesBatch,
    });
    
    employeesCreated += employeesBatch.length;
    console.log(`Generated and inserted ${employeesCreated}/${totalEmployees} employees...`);
  }

  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
