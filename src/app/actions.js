'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getNumbers(filters = {}) {
  let where = {};
  
  if (filters.searchType && filters.digits) {
    if (filters.searchType === 'startWith') {
      where.rawNumber = { startsWith: filters.digits };
    } else if (filters.searchType === 'endWith') {
      where.rawNumber = { endsWith: filters.digits };
    } else if (filters.searchType === 'anywhere') {
      where.rawNumber = { contains: filters.digits };
    } else if (filters.searchType === 'contains') {
      where.rawNumber = { contains: filters.digits };
    } else if (filters.searchType === 'notContain') {
      where.rawNumber = { not: { contains: filters.digits } };
    }
  }

  if (filters.sum) {
    const s = filters.sum.toString();
    if (s.length === 1) {
      where.sum = parseInt(s);
    } else {
      where.sumBreakdown = { startsWith: s };
    }
  }

  if (filters.minPrice) {
    where.price = { ...where.price, gte: parseInt(filters.minPrice) };
  }
  
  if (filters.maxPrice) {
    where.price = { ...where.price, lte: parseInt(filters.maxPrice) };
  }

  if (filters.operator) {
    where.operator = filters.operator;
  }

  if (filters.rtp) {
    where.type = filters.rtp;
  }

  if (filters.category && filters.category !== 'RTP') {
    where.category = { contains: filters.category };
  } else if (filters.category === 'RTP') {
    where.type = 'RTP';
  }

  let orderBy = { createdAt: 'desc' };
  if (filters.sort === 'low') {
    orderBy = { price: 'asc' };
  } else if (filters.sort === 'high') {
    orderBy = { price: 'desc' };
  }

  const numbers = await prisma.vIPNumber.findMany({
    where,
    orderBy
  });

  return numbers;
}

export async function getCategories() {
  const categories = await prisma.vIPNumber.groupBy({
    by: ['category'],
    _count: { category: true }
  });
  return categories.map(c => ({
    name: c.category,
    count: c._count.category
  }));
}

export async function getDashboardStats() {
  const total = await prisma.vIPNumber.count();
  const rtp = await prisma.vIPNumber.count({ where: { type: 'RTP' } });
  const nonRtp = await prisma.vIPNumber.count({ where: { type: 'Non-RTP' } });
  const enquiries = await prisma.enquiry.count();
  return { total, rtp, nonRtp, enquiries };
}

export async function addNumber(data) {
  return await prisma.vIPNumber.create({ data });
}

export async function deleteNumber(id) {
  return await prisma.vIPNumber.delete({ where: { id } });
}

export async function getDealers() {
  return await prisma.dealer.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getEnquiries() {
  return await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function registerDealer(data) {
  return await prisma.dealer.create({
    data: {
      name: data.name,
      businessName: data.businessName || null,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      state: data.state,
      numbersCount: data.numbersCount,
      message: data.message || null
    }
  });
}
