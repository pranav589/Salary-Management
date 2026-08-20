import { prisma } from '../lib/prisma';
import { getExchangeRatesMap } from '../lib/currency';

export async function getOverview() {
  const activeEmployees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { salary: true, currency: true },
  });

  const ratesMap = await getExchangeRatesMap();

  const salariesUsd = activeEmployees.map((emp) => {
    const rate = ratesMap[emp.currency] || 1.0;
    return emp.salary * rate;
  });

  const totalActive = salariesUsd.length;

  if (totalActive === 0) {
    return {
      totalActiveEmployees: 0,
      totalMonthlyPayrollUsd: 0,
      averageSalaryUsd: 0,
      medianSalaryUsd: 0,
    };
  }

  salariesUsd.sort((a, b) => a - b);

  const totalAnnualPayrollUsd = salariesUsd.reduce((sum, sal) => sum + sal, 0);
  const totalMonthlyPayrollUsd = parseFloat((totalAnnualPayrollUsd / 12).toFixed(2));
  const averageSalaryUsd = parseFloat((totalAnnualPayrollUsd / totalActive).toFixed(2));

  let medianSalaryUsd = 0;
  const mid = Math.floor(totalActive / 2);
  if (totalActive % 2 === 0) {
    medianSalaryUsd = (salariesUsd[mid - 1] + salariesUsd[mid]) / 2;
  } else {
    medianSalaryUsd = salariesUsd[mid];
  }
  medianSalaryUsd = parseFloat(medianSalaryUsd.toFixed(2));

  return {
    totalActiveEmployees: totalActive,
    totalMonthlyPayrollUsd,
    averageSalaryUsd,
    medianSalaryUsd,
  };
}

export async function getByCountry() {
  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { country: true, salary: true, currency: true },
  });

  const ratesMap = await getExchangeRatesMap();

  const registeredCountries = await prisma.country.findMany({ select: { code: true } });
  const groupings: Record<string, { headcount: number; totalPayrollUsd: number }> = {};
  for (const c of registeredCountries) {
    groupings[c.code] = { headcount: 0, totalPayrollUsd: 0 };
  }

  for (const emp of employees) {
    const country = emp.country;
    if (!groupings[country]) {
      groupings[country] = { headcount: 0, totalPayrollUsd: 0 };
    }

    const rate = ratesMap[emp.currency] || 1.0;
    const salaryUsd = emp.salary * rate;

    groupings[country].headcount += 1;
    groupings[country].totalPayrollUsd += salaryUsd;
  }

  const formatted = Object.entries(groupings).map(([country, data]) => ({
    country,
    headcount: data.headcount,
    totalMonthlyPayrollUsd: parseFloat((data.totalPayrollUsd / 12).toFixed(2)),
    averageSalaryUsd: data.headcount > 0 ? parseFloat((data.totalPayrollUsd / data.headcount).toFixed(2)) : 0,
  }));

  return formatted;
}

export async function getByDepartment() {
  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { department: true, salary: true, currency: true },
  });

  const ratesMap = await getExchangeRatesMap();

  const groupings: Record<string, { headcount: number; totalPayrollUsd: number }> = {};

  for (const emp of employees) {
    const dept = emp.department;
    if (!groupings[dept]) {
      groupings[dept] = { headcount: 0, totalPayrollUsd: 0 };
    }

    const rate = ratesMap[emp.currency] || 1.0;
    const salaryUsd = emp.salary * rate;

    groupings[dept].headcount += 1;
    groupings[dept].totalPayrollUsd += salaryUsd;
  }

  const formatted = Object.entries(groupings).map(([department, data]) => ({
    department,
    headcount: data.headcount,
    totalMonthlyPayrollUsd: parseFloat((data.totalPayrollUsd / 12).toFixed(2)),
    averageSalaryUsd: parseFloat((data.totalPayrollUsd / data.headcount).toFixed(2)),
  }));

  return formatted;
}

export async function getSalaryDistribution() {
  const employees = await prisma.employee.findMany({
    where: { status: 'ACTIVE' },
    select: { salary: true, currency: true },
  });

  const ratesMap = await getExchangeRatesMap();

  const salariesUsd = employees.map((emp) => {
    const rate = ratesMap[emp.currency] || 1.0;
    return emp.salary * rate;
  });

  const bands = [
    { name: '< $50k', min: 0, max: 50000, count: 0 },
    { name: '$50k - $100k', min: 50000, max: 100000, count: 0 },
    { name: '$100k - $150k', min: 100000, max: 150000, count: 0 },
    { name: '$150k - $200k', min: 150000, max: 200000, count: 0 },
    { name: '$200k - $250k', min: 200000, max: 250000, count: 0 },
    { name: '$250k+', min: 250000, max: Infinity, count: 0 },
  ];

  for (const salary of salariesUsd) {
    for (const band of bands) {
      if (salary >= band.min && salary < band.max) {
        band.count += 1;
        break;
      }
    }
  }

  return bands.map(({ name, count }) => ({ band: name, count }));
}
