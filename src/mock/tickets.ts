import { Ticket } from '../interfaces/ticket';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'مشكلة في تسجيل الدخول',
    description: 'لا يمكنني تسجيل الدخول إلى حسابي منذ يومين',
    status: 'open',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user1',
  },
  {
    id: '2',
    title: 'استفسار عن المنتجات',
    description: 'أريد معرفة المزيد عن المنتجات الجديدة',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // يوم واحد مضى
    updatedAt: new Date().toISOString(),
    userId: 'user1',
    adminId: 'admin1',
  },
  {
    id: '3',
    title: 'طلب استرداد المبلغ',
    description: 'أريد استرداد المبلغ الخاص بالطلب رقم #12345',
    status: 'closed',
    priority: 'high',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // يومين مضوا
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    userId: 'user1',
    adminId: 'admin1',
  },
]; 