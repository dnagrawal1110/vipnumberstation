'use server';

import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { calcPrices } from '@/app/lib/pricing';

// ─── VIP Numbers ─────────────────────────────────────────────────────────────
export async function getNumbers(filters = {}) {
  let where = { status: { not: 'Sold' } };

  if (filters.searchType && filters.digits) {
    const d = filters.digits;
    if (filters.searchType === 'startWith')  where.rawNumber = { startsWith: d };
    else if (filters.searchType === 'endWith') where.rawNumber = { endsWith: d };
    else if (filters.searchType === 'contains') where.rawNumber = { contains: d };
    else if (filters.searchType === 'anywhere') where.rawNumber = { contains: d };
    else if (filters.searchType === 'notContain') where.rawNumber = { not: { contains: d } };
  }

  if (filters.sum) {
    const s = filters.sum.toString();
    if (s.length === 1) where.sum = parseInt(s);
    else where.sumBreakdown = { startsWith: s };
  }

  if (filters.minPrice) where.price = { ...where.price, gte: parseInt(filters.minPrice) };
  if (filters.maxPrice) where.price = { ...where.price, lte: parseInt(filters.maxPrice) };
  if (filters.operator) where.operator = filters.operator;
  if (filters.rtp)      where.type = filters.rtp;

  if (filters.category && filters.category !== 'RTP') {
    where.category = { contains: filters.category };
  } else if (filters.category === 'RTP') {
    where.type = 'RTP';
  }

  let orderBy = { createdAt: 'desc' };
  if (filters.sort === 'low')  orderBy = { price: 'asc' };
  if (filters.sort === 'high') orderBy = { price: 'desc' };

  return await prisma.vIPNumber.findMany({ where, orderBy });
}

export async function getCategories() {
  const cats = await prisma.vIPNumber.groupBy({
    by: ['category'],
    _count: { category: true },
    where: { status: { not: 'Sold' } }
  });
  return cats.map(c => ({ name: c.category, count: c._count.category }));
}

export async function getDashboardStats() {
  const total     = await prisma.vIPNumber.count({ where: { status: { not: 'Sold' } } });
  const rtp       = await prisma.vIPNumber.count({ where: { type: 'RTP', status: { not: 'Sold' } } });
  const nonRtp    = await prisma.vIPNumber.count({ where: { type: 'Non-RTP', status: { not: 'Sold' } } });
  const enquiries = await prisma.enquiry.count();
  const dealers   = await prisma.dealer.count({ where: { status: 'Active' } });
  const pending   = await prisma.dealer.count({ where: { status: 'Pending' } });
  return { total, rtp, nonRtp, enquiries, dealers, pending };
}

export async function addNumber(data) {
  const { price, mrp, discount } = calcPrices(data.dealerPrice, data.commission || 25);
  const rawNumber = data.rawNumber;
  const digits = rawNumber.split('').map(Number);
  const s1 = digits.reduce((a, b) => a + b, 0);
  const s2 = s1.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  const s3 = s2 > 9 ? s2.toString().split('').reduce((a, b) => a + parseInt(b), 0) : s2;

  return await prisma.vIPNumber.create({
    data: {
      rawNumber,
      displayFormat: data.displayFormat,
      highlight: data.highlight || null,
      dealerPrice: data.dealerPrice,
      commission: data.commission || 25,
      mrp,
      price,
      discount,
      operator: data.operator,
      type: data.type,
      rtpDate: data.type === 'Non-RTP' ? data.rtpDate : null,
      category: data.category,
      sumBreakdown: `${s1}-${s2}-${s3}`,
      sum: s3,
      dealer: data.dealer || 'Own',
      dealerRef: data.dealerRef ? parseInt(data.dealerRef) : null,
      status: 'Available',
    }
  });
}

export async function deleteNumber(id) {
  return await prisma.vIPNumber.delete({ where: { id } });
}

export async function markNumberSold(id) {
  return await prisma.vIPNumber.update({ where: { id }, data: { status: 'Sold' } });
}

export async function unlockNumber(id) {
  return await prisma.vIPNumber.update({
    where: { id },
    data: { status: 'Available', lockedAt: null, lockedBy: null }
  });
}

// ─── Enquiry / CRM ───────────────────────────────────────────────────────────
export async function createEnquiry(data) {
  let lockedUntil = null;
  if (data.numberId) {
    lockedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
    // Lock the number
    await prisma.vIPNumber.updateMany({
      where: { id: data.numberId, status: 'Available' },
      data: { status: 'Locked', lockedAt: new Date(), lockedBy: data.mobile }
    });
  }

  return await prisma.enquiry.create({
    data: {
      name: data.name || null,
      mobile: data.mobile,
      email: data.email || null,
      numberInterest: data.numberInterest || null,
      numberId: data.numberId || null,
      numberRaw: data.numberRaw || null,
      numberPrice: data.numberPrice || null,
      enquiryType: data.enquiryType || 'General',
      status: 'New',
      lockedUntil,
    }
  });
}

export async function getEnquiries(filter = {}) {
  let where = {};
  if (filter.status) where.status = filter.status;
  return await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateEnquiryStatus(id, status, notes = null) {
  const data = { status, updatedAt: new Date() };
  if (notes !== null) data.notes = notes;
  return await prisma.enquiry.update({ where: { id }, data });
}

export async function assignEnquiry(id, assignedTo) {
  return await prisma.enquiry.update({
    where: { id },
    data: { assignedTo, status: 'Contacted', updatedAt: new Date() }
  });
}

// ─── Dealers ─────────────────────────────────────────────────────────────────
export async function getDealers(status = null) {
  const where = status ? { status } : {};
  return await prisma.dealer.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function registerDealer(data) {
  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
  const dealer = await prisma.dealer.create({
    data: {
      name: data.name,
      businessName: data.businessName || null,
      mobile: data.mobile,
      email: data.email,
      passwordHash,
      city: data.city,
      pincode: data.pincode || null,
      state: data.state,
      numbersCount: data.numbersCount,
      message: data.message || null,
      status: 'Pending',
    }
  });
  return dealer;
}

export async function addDealerByAdmin(data) {
  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
  const dealer = await prisma.dealer.create({
    data: {
      name: data.name,
      businessName: data.businessName || null,
      mobile: data.mobile,
      email: data.email,
      passwordHash,
      city: data.city,
      pincode: data.pincode || null,
      state: data.state,
      numbersCount: data.numbersCount || '1-10 numbers',
      message: data.message || null,
      status: 'Active', // Admin-added dealers are immediately active
    }
  });

  // Also create User account for dealer
  if (dealer.email && data.password) {
    await prisma.user.upsert({
      where: { email: dealer.email },
      update: { passwordHash: await bcrypt.hash(data.password, 10), dealerId: dealer.id },
      create: {
        email: dealer.email,
        passwordHash: await bcrypt.hash(data.password, 10),
        name: dealer.name,
        role: 'dealer',
        dealerId: dealer.id,
      }
    });
  }

  return dealer;
}

export async function approveDealer(id) {
  const dealer = await prisma.dealer.update({
    where: { id },
    data: { status: 'Active' }
  });

  // Create user account if email+passwordHash exist and no user exists
  if (dealer.email && dealer.passwordHash) {
    await prisma.user.upsert({
      where: { email: dealer.email },
      update: { active: true, dealerId: dealer.id },
      create: {
        email: dealer.email,
        passwordHash: dealer.passwordHash,
        name: dealer.name,
        role: 'dealer',
        dealerId: dealer.id,
      }
    });
  }
  return dealer;
}

export async function rejectDealer(id) {
  return await prisma.dealer.update({ where: { id }, data: { status: 'Rejected' } });
}

// ─── Team Users ───────────────────────────────────────────────────────────────
export async function getTeamUsers() {
  return await prisma.user.findMany({
    where: { role: { in: ['team', 'dealer'] } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addTeamUser(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role || 'team',
      active: true,
    }
  });
}

export async function toggleUserActive(id, active) {
  return await prisma.user.update({ where: { id }, data: { active } });
}

// ─── Auto-unlock expired enquiries ───────────────────────────────────────────
export async function releaseExpiredLocks() {
  const now = new Date();
  // Find expired enquiries with locked numbers
  const expired = await prisma.enquiry.findMany({
    where: { lockedUntil: { lt: now }, status: { in: ['New', 'Contacted'] } }
  });

  for (const e of expired) {
    if (e.numberId) {
      await prisma.vIPNumber.updateMany({
        where: { id: e.numberId, status: 'Locked' },
        data: { status: 'Available', lockedAt: null, lockedBy: null }
      });
    }
  }
  return expired.length;
}
